import { z } from 'zod';

const customizations = z.object({
  pattyDoneness: z.enum(['Medium', 'Medium Well', 'Well Done']).optional(),
  holdIngredients: z.array(z.string().min(1).max(80)).max(20).default([]),
  extras: z.array(z.string().min(1).max(80)).max(10).default([]),
});

export const quoteSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  deliveryType: z.enum(['delivery', 'pickup']),
  postalCode: z.string().regex(/^\d{5}$/).optional(),
  applyReward: z.boolean().default(false),
  items: z.array(z.object({
    productId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(20),
    customizations,
  })).min(1).max(50),
}).superRefine((value, context) => {
  if (value.deliveryType === 'delivery' && !value.postalCode) {
    context.addIssue({ code: 'custom', path: ['postalCode'], message: 'Postal code is required for delivery' });
  }
});

export const createOrderSchema = quoteSchema.and(z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().max(240).optional(),
  paymentPreference: z.enum(['cash', 'card']),
  idempotencyKey: z.string().min(16).max(100),
})).superRefine((value, context) => {
  if (value.deliveryType === 'delivery' && !value.address) {
    context.addIssue({ code: 'custom', path: ['address'], message: 'Address is required for delivery' });
  }
});

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(200),
});
