import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { Prisma, type OrderStatus } from '@prisma/client';
import { config } from './config.js';
import { prisma as defaultPrisma } from './db.js';
import { sendOrderEmail, sendPasswordResetEmail, sendRewardsEmail, sendVerificationEmail } from './email.js';
import { assertDeliveryEligible, calculateTotals, PricingError, validateAndPriceLine } from './pricing.js';
import {
  adminLoginSchema, createOrderSchema, customerLoginSchema, forgotPasswordSchema,
  quoteSchema, registerSchema, resetPasswordSchema, updateProfileSchema, verifyTokenSchema,
} from './schemas.js';
import { createToken, hashToken, normalizeEmail } from './security.js';

const SESSION_COOKIE = 'unassuming_admin';
const CUSTOMER_COOKIE = 'unassuming_customer';
const CUSTOMER_SESSION_MS = 30 * 24 * 60 * 60 * 1000;
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  received: ['preparing', 'cancelled'],
  preparing: ['ready', 'out_for_delivery', 'cancelled'],
  ready: ['fulfilled', 'cancelled'],
  out_for_delivery: ['fulfilled', 'cancelled'],
  fulfilled: [],
  cancelled: [],
};

type Database = typeof defaultPrisma;

const publicOrder = (order: any) => ({
  orderId: order.displayId,
  customerName: order.customer.name,
  deliveryType: order.deliveryType,
  paymentPreference: order.paymentPreference,
  address: order.address,
  status: order.status,
  subtotalCents: order.subtotalCents,
  discountCents: order.discountCents,
  taxCents: order.taxCents,
  deliveryFeeCents: order.deliveryFeeCents,
  totalCents: order.totalCents,
  estimatedMinutes: order.estimatedMinutes,
  createdAt: order.createdAt,
  items: order.items.map((item: any) => ({
    productId: item.productId,
    name: item.productName,
    quantity: item.quantity,
    unitBaseCents: item.unitBaseCents,
    unitExtrasCents: item.unitExtrasCents,
    lineTotalCents: item.lineTotalCents,
    customizations: {
      pattyDoneness: item.pattyDoneness,
      holdIngredients: item.holdIngredients,
      extras: item.extras,
    },
  })),
  statusHistory: order.statusHistory,
});

const customerProfile = (customer: any) => ({
  email: customer.email,
  name: customer.name,
  phone: customer.phone,
  burgerProgress: customer.burgerProgress,
  rewardCredits: customer.rewardCredits,
});

async function pricedQuote(
  db: Database,
  body: ReturnType<typeof quoteSchema.parse>,
  authenticatedCustomer?: any,
) {
  assertDeliveryEligible(body.deliveryType, body.postalCode);
  const ids = [...new Set(body.items.map((item) => item.productId))];
  const products = await db.product.findMany({ where: { id: { in: ids } } });
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines = body.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new PricingError(`Unknown product "${item.productId}"`, 404);
    const line = { ...item, product };
    return { ...line, ...validateAndPriceLine(line) };
  });
  const requestedCustomer = await db.customer.findUnique({ where: { email: normalizeEmail(body.email) } });
  if (requestedCustomer?.emailVerifiedAt && requestedCustomer.id !== authenticatedCustomer?.id) {
    throw new PricingError('Sign in to use this account email', 401);
  }
  const rewards = authenticatedCustomer?.rewardCredits
    ?? (requestedCustomer?.emailVerifiedAt ? 0 : requestedCustomer?.rewardCredits ?? 0);
  const totals = calculateTotals(lines, body.deliveryType, body.applyReward, rewards);
  return {
    lines,
    ...totals,
    rewardAvailable: rewards > 0,
  };
}

export function createApp(db: Database = defaultPrisma) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.publicUrl, credentials: true }));
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  const optionalCustomer = async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const token = request.cookies[CUSTOMER_COOKIE];
      if (token) {
        const session = await db.customerSession.findUnique({
          where: { tokenHash: hashToken(token) },
          include: { customer: true },
        });
        if (session && session.expiresAt > new Date() && session.customer.emailVerifiedAt) {
          (request as any).customer = session.customer;
        }
      }
      next();
    } catch (error) { next(error); }
  };
  app.use(optionalCustomer);

  const requireCustomer = (request: Request, response: Response, next: NextFunction) => {
    if (!(request as any).customer) return response.status(401).json({ error: 'Authentication required' });
    next();
  };

  const setCustomerCookie = (response: Response, token: string) => response.cookie(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CUSTOMER_SESSION_MS,
  });

  app.get('/api/health', (_request, response) => response.json({ ok: true }));

  app.post('/api/account/register', async (request, response, next) => {
    try {
      const body = registerSchema.parse(request.body);
      const email = normalizeEmail(body.email);
      const existing = await db.customer.findUnique({ where: { email } });
      if (existing?.emailVerifiedAt) {
        return response.status(202).json({ message: 'Check your email for next steps.' });
      }
      const passwordHash = await bcrypt.hash(body.password, 12);
      const customer = existing
        ? await db.customer.update({
            where: { id: existing.id },
            data: { name: body.name, phone: body.phone, passwordHash },
          })
        : await db.customer.create({
            data: { email, name: body.name, phone: body.phone, passwordHash },
          });
      await db.customerAuthToken.updateMany({
        where: { customerId: customer.id, purpose: 'verify_email', usedAt: null },
        data: { usedAt: new Date() },
      });
      const token = createToken();
      await db.customerAuthToken.create({
        data: {
          tokenHash: hashToken(token),
          purpose: 'verify_email',
          customerId: customer.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      void sendVerificationEmail(email, token).catch(console.error);
      response.status(202).json({ message: 'Check your email to verify your account.' });
    } catch (error) { next(error); }
  });

  app.post('/api/account/verify', async (request, response, next) => {
    try {
      const { token } = verifyTokenSchema.parse(request.body);
      const authToken = await db.customerAuthToken.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { customer: true },
      });
      if (!authToken || authToken.purpose !== 'verify_email' || authToken.usedAt || authToken.expiresAt <= new Date()) {
        return response.status(400).json({ error: 'Verification link is invalid or expired' });
      }
      await db.$transaction([
        db.customerAuthToken.update({ where: { id: authToken.id }, data: { usedAt: new Date() } }),
        db.customer.update({ where: { id: authToken.customerId }, data: { emailVerifiedAt: new Date() } }),
      ]);
      response.json({ message: 'Email verified. You can now sign in.' });
    } catch (error) { next(error); }
  });

  app.post('/api/account/login', async (request, response, next) => {
    try {
      const body = customerLoginSchema.parse(request.body);
      const customer = await db.customer.findUnique({ where: { email: normalizeEmail(body.email) } });
      if (!customer?.passwordHash || !customer.emailVerifiedAt || !await bcrypt.compare(body.password, customer.passwordHash)) {
        return response.status(401).json({ error: 'Invalid email or password' });
      }
      const token = createToken();
      await db.customerSession.create({
        data: {
          tokenHash: hashToken(token),
          customerId: customer.id,
          expiresAt: new Date(Date.now() + CUSTOMER_SESSION_MS),
        },
      });
      setCustomerCookie(response, token).json(customerProfile(customer));
    } catch (error) { next(error); }
  });

  app.post('/api/account/logout', async (request, response, next) => {
    try {
      const token = request.cookies[CUSTOMER_COOKIE];
      if (token) await db.customerSession.deleteMany({ where: { tokenHash: hashToken(token) } });
      response.clearCookie(CUSTOMER_COOKIE, { path: '/' }).status(204).end();
    } catch (error) { next(error); }
  });

  app.get('/api/account/session', requireCustomer, (request, response) => {
    response.json(customerProfile((request as any).customer));
  });

  app.patch('/api/account/profile', requireCustomer, async (request, response, next) => {
    try {
      const body = updateProfileSchema.parse(request.body);
      const customer = await db.customer.update({
        where: { id: (request as any).customer.id },
        data: body,
      });
      response.json(customerProfile(customer));
    } catch (error) { next(error); }
  });

  app.get('/api/account/orders', requireCustomer, async (request, response, next) => {
    try {
      const orders = await db.order.findMany({
        where: { customerId: (request as any).customer.id },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
      response.json(orders.map((order) => ({
        orderId: order.displayId,
        deliveryType: order.deliveryType,
        status: order.status,
        totalCents: order.totalCents,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          lineTotalCents: item.lineTotalCents,
        })),
      })));
    } catch (error) { next(error); }
  });

  app.post('/api/account/forgot-password', async (request, response, next) => {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);
      const customer = await db.customer.findUnique({ where: { email: normalizeEmail(email) } });
      if (customer?.emailVerifiedAt && customer.passwordHash) {
        await db.customerAuthToken.updateMany({
          where: { customerId: customer.id, purpose: 'reset_password', usedAt: null },
          data: { usedAt: new Date() },
        });
        const token = createToken();
        await db.customerAuthToken.create({
          data: {
            tokenHash: hashToken(token),
            purpose: 'reset_password',
            customerId: customer.id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        });
        void sendPasswordResetEmail(customer.email, token).catch(console.error);
      }
      response.status(202).json({ message: 'If that account exists, a reset link is on its way.' });
    } catch (error) { next(error); }
  });

  app.post('/api/account/reset-password', async (request, response, next) => {
    try {
      const body = resetPasswordSchema.parse(request.body);
      const authToken = await db.customerAuthToken.findUnique({ where: { tokenHash: hashToken(body.token) } });
      if (!authToken || authToken.purpose !== 'reset_password' || authToken.usedAt || authToken.expiresAt <= new Date()) {
        return response.status(400).json({ error: 'Reset link is invalid or expired' });
      }
      await db.$transaction([
        db.customerAuthToken.update({ where: { id: authToken.id }, data: { usedAt: new Date() } }),
        db.customer.update({
          where: { id: authToken.customerId },
          data: { passwordHash: await bcrypt.hash(body.password, 12) },
        }),
        db.customerSession.deleteMany({ where: { customerId: authToken.customerId } }),
      ]);
      response.clearCookie(CUSTOMER_COOKIE, { path: '/' }).json({ message: 'Password reset. You can now sign in.' });
    } catch (error) { next(error); }
  });

  app.get('/api/catalog', async (_request, response, next) => {
    try {
      const products = await db.product.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
      response.json(products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.priceCents / 100,
        priceCents: product.priceCents,
        image: product.image,
        category: product.category,
        available: product.available,
        isBestSeller: product.bestSeller,
        chefChoice: product.chefChoice,
        calories: product.calories,
        tags: product.tags,
        thumbnails: product.thumbnails,
      })));
    } catch (error) { next(error); }
  });

  app.get('/api/locations', async (_request, response, next) => {
    try {
      const locations = await db.location.findMany({ orderBy: { name: 'asc' } });
      response.json(locations.map((location) => ({
        ...location,
        status: location.status === 'coming_soon' ? 'coming-soon' : 'open',
      })));
    } catch (error) { next(error); }
  });

  app.get('/api/delivery/eligibility', (request, response) => {
    const postalCode = String(request.query.postalCode ?? '');
    response.json({ eligible: config.allowedPostalCodes.has(postalCode) });
  });

  app.post('/api/orders/quote', async (request, response, next) => {
    try {
      const body = quoteSchema.parse(request.body);
      if ((request as any).customer) body.email = (request as any).customer.email;
      const { lines: _lines, rewardApplied: _rewardApplied, ...quote } = await pricedQuote(db, body, (request as any).customer);
      response.json(quote);
    } catch (error) { next(error); }
  });

  app.post('/api/orders', async (request, response, next) => {
    try {
      const body = createOrderSchema.parse(request.body);
      if ((request as any).customer) body.email = (request as any).customer.email;
      const existing = await db.order.findUnique({
        where: { idempotencyKey: body.idempotencyKey },
        include: { customer: true, items: true, statusHistory: true },
      });
      if (existing) {
        if (existing.customer.email !== normalizeEmail(body.email)) {
          return response.status(409).json({ error: 'Idempotency key is already in use' });
        }
        return response.json({ ...publicOrder(existing), trackingToken: existing.trackingToken });
      }
      const authenticatedCustomer = (request as any).customer;
      const quote = await pricedQuote(db, body, authenticatedCustomer);
      const trackingToken = createToken();
      const displayId = `UNS-${randomInt(100000, 1000000)}`;
      const order = await db.$transaction(async (transaction) => {
        const customer = authenticatedCustomer
          ? await transaction.customer.findUniqueOrThrow({ where: { id: authenticatedCustomer.id } })
          : await transaction.customer.upsert({
              where: { email: normalizeEmail(body.email) },
              create: { email: normalizeEmail(body.email), name: body.name, phone: body.phone },
              update: { name: body.name, phone: body.phone },
            });
        if (quote.rewardApplied) {
          const result = await transaction.customer.updateMany({
            where: { id: customer.id, rewardCredits: { gt: 0 } },
            data: { rewardCredits: { decrement: 1 } },
          });
          if (!result.count) throw new PricingError('Reward is no longer available', 409);
        }
        return transaction.order.create({
          data: {
            displayId,
            trackingToken,
            trackingTokenHash: hashToken(trackingToken),
            idempotencyKey: body.idempotencyKey,
            customerId: customer.id,
            deliveryType: body.deliveryType,
            paymentPreference: body.paymentPreference,
            address: body.deliveryType === 'delivery' ? body.address! : 'Downtown LA pickup counter',
            postalCode: body.postalCode,
            subtotalCents: quote.subtotalCents,
            discountCents: quote.discountCents,
            taxCents: quote.taxCents,
            deliveryFeeCents: quote.deliveryFeeCents,
            totalCents: quote.totalCents,
            estimatedMinutes: body.deliveryType === 'delivery' ? 35 : 15,
            rewardApplied: quote.rewardApplied,
            items: {
              create: quote.lines.map((line) => ({
                productId: line.product.id,
                productName: line.product.name,
                quantity: line.quantity,
                unitBaseCents: line.unitBaseCents,
                unitExtrasCents: line.unitExtrasCents,
                lineTotalCents: line.lineTotalCents,
                pattyDoneness: line.customizations.pattyDoneness,
                holdIngredients: line.customizations.holdIngredients,
                extras: line.customizations.extras,
              })),
            },
            statusHistory: { create: { status: 'received' } },
          },
          include: { customer: true, items: true, statusHistory: true },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      void sendOrderEmail({ email: body.email, displayId, trackingToken }).catch(console.error);
      response.status(201).json({ ...publicOrder(order), trackingToken });
    } catch (error) { next(error); }
  });

  app.get('/api/orders/track/:token', async (request, response, next) => {
    try {
      const order = await db.order.findUnique({
        where: { trackingTokenHash: hashToken(request.params.token) },
        include: { customer: true, items: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
      });
      if (!order) return response.status(404).json({ error: 'Order not found' });
      response.json(publicOrder(order));
    } catch (error) { next(error); }
  });

  app.get('/api/rewards/:token', async (request, response, next) => {
    try {
      const customer = await db.customer.findFirst({ where: { rewardAccessHash: hashToken(request.params.token) } });
      if (!customer) return response.status(404).json({ error: 'Reward access link is invalid' });
      if (customer.emailVerifiedAt) return response.status(404).json({ error: 'Reward access link is invalid' });
      response.json({ burgerProgress: customer.burgerProgress, rewardCredits: customer.rewardCredits });
    } catch (error) { next(error); }
  });

  app.post('/api/rewards/access-link', async (request, response, next) => {
    try {
      const email = normalizeEmail(String(request.body.email ?? ''));
      const customer = await db.customer.findUnique({ where: { email } });
      if (customer && !customer.emailVerifiedAt) {
        const token = createToken();
        await db.customer.update({ where: { id: customer.id }, data: { rewardAccessHash: hashToken(token) } });
        // A dedicated template can be added later; deliberately avoid account enumeration.
        void sendRewardsEmail(email, token).catch(console.error);
      }
      response.status(202).json({ message: 'If that email has rewards, an access link is on its way.' });
    } catch (error) { next(error); }
  });

  app.post('/api/newsletter', async (request, response, next) => {
    try {
      const email = normalizeEmail(String(request.body.email ?? ''));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: 'Valid email required' });
      await db.newsletterSubscription.upsert({ where: { email }, create: { email }, update: {} });
      response.status(201).json({ subscribed: true });
    } catch (error) { next(error); }
  });

  const requireAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const token = request.cookies[SESSION_COOKIE];
      if (!token) return response.status(401).json({ error: 'Authentication required' });
      const session = await db.adminSession.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { admin: true },
      });
      if (!session || session.expiresAt <= new Date()) return response.status(401).json({ error: 'Session expired' });
      (request as any).admin = session.admin;
      if (session.admin.mustChangePassword && !['/session', '/change-password', '/logout'].some((path) => request.path.endsWith(path))) {
        return response.status(403).json({ error: 'Password change required' });
      }
      next();
    } catch (error) { next(error); }
  };

  app.post('/api/admin/login', async (request, response, next) => {
    try {
      const body = adminLoginSchema.parse(request.body);
      const admin = await db.adminUser.findUnique({ where: { email: normalizeEmail(body.email) } });
      if (!admin || !await bcrypt.compare(body.password, admin.passwordHash)) {
        return response.status(401).json({ error: 'Invalid email or password' });
      }
      const token = createToken();
      await db.adminSession.create({
        data: {
          tokenHash: hashToken(token),
          adminId: admin.id,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        },
      });
      response.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
      }).json({ email: admin.email, mustChangePassword: admin.mustChangePassword });
    } catch (error) { next(error); }
  });

  app.post('/api/admin/logout', requireAdmin, async (request, response, next) => {
    try {
      const token = request.cookies[SESSION_COOKIE];
      await db.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
      response.clearCookie(SESSION_COOKIE).status(204).end();
    } catch (error) { next(error); }
  });

  app.get('/api/admin/session', requireAdmin, (request, response) => {
    const admin = (request as any).admin;
    response.json({ email: admin.email, mustChangePassword: admin.mustChangePassword });
  });

  app.post('/api/admin/change-password', requireAdmin, async (request, response, next) => {
    try {
      const password = String(request.body.password ?? '');
      if (password.length < 12) return response.status(400).json({ error: 'Password must be at least 12 characters' });
      const admin = (request as any).admin;
      await db.adminUser.update({
        where: { id: admin.id },
        data: { passwordHash: await bcrypt.hash(password, 12), mustChangePassword: false },
      });
      response.status(204).end();
    } catch (error) { next(error); }
  });

  app.get('/api/admin/orders', requireAdmin, async (_request, response, next) => {
    try {
      const orders = await db.order.findMany({
        include: { customer: true, items: true, statusHistory: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      response.json(orders.map(publicOrder));
    } catch (error) { next(error); }
  });

  app.patch('/api/admin/orders/:id/status', requireAdmin, async (request, response, next) => {
    try {
      const nextStatus = String(request.body.status) as OrderStatus;
      const order = await db.order.findUnique({
        where: { displayId: request.params.id },
        include: { customer: true, items: { include: { product: true } } },
      });
      if (!order) return response.status(404).json({ error: 'Order not found' });
      if (!STATUS_TRANSITIONS[order.status]?.includes(nextStatus)) {
        return response.status(409).json({ error: `Cannot move ${order.status} to ${nextStatus}` });
      }
      const updated = await db.$transaction(async (transaction) => {
        const claimed = await transaction.order.updateMany({
          where: { id: order.id, status: order.status },
          data: { status: nextStatus },
        });
        if (claimed.count !== 1) throw new PricingError('Order status changed; refresh and try again', 409);
        await transaction.orderStatusHistory.create({ data: { orderId: order.id, status: nextStatus } });
        if (nextStatus === 'fulfilled' && !order.rewardsGranted) {
          const burgers = order.items
            .filter((item) => item.product.category === 'burgers')
            .reduce((sum, item) => sum + item.quantity, 0);
          const customer = await transaction.customer.findUniqueOrThrow({ where: { id: order.customerId } });
          const progress = customer.burgerProgress + burgers;
          await transaction.customer.update({
            where: { id: customer.id },
            data: {
              burgerProgress: progress % 10,
              rewardCredits: { increment: Math.floor(progress / 10) },
            },
          });
          await transaction.order.update({ where: { id: order.id }, data: { rewardsGranted: true } });
        }
        return transaction.order.findUniqueOrThrow({
          where: { id: order.id },
          include: { customer: true, items: true, statusHistory: true },
        });
      });
      void sendOrderEmail({
        email: order.customer.email,
        displayId: order.displayId,
        trackingToken: order.trackingToken,
        status: nextStatus,
      }).catch(console.error);
      response.json(publicOrder(updated));
    } catch (error) { next(error); }
  });

  app.get('/api/admin/products', requireAdmin, async (_request, response, next) => {
    try { response.json(await db.product.findMany({ orderBy: { name: 'asc' } })); } catch (error) { next(error); }
  });

  app.patch('/api/admin/products/:id', requireAdmin, async (request, response, next) => {
    try {
      const data: { available?: boolean; priceCents?: number } = {};
      if (typeof request.body.available === 'boolean') data.available = request.body.available;
      if (Number.isInteger(request.body.priceCents) && request.body.priceCents > 0) data.priceCents = request.body.priceCents;
      const product = await db.product.update({ where: { id: request.params.id }, data });
      response.json(product);
    } catch (error) { next(error); }
  });

  app.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
    if (error?.name === 'ZodError') return response.status(400).json({ error: 'Invalid request', details: error.issues });
    if (error instanceof PricingError) return response.status(error.status).json({ error: error.message });
    if (error?.code === 'P2002') return response.status(409).json({ error: 'A conflicting record already exists' });
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
