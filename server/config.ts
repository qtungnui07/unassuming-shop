import 'dotenv/config';

const integer = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
};

export const config = {
  port: integer(process.env.PORT, 8080),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  publicUrl: process.env.PUBLIC_URL ?? 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET ?? 'development-only-change-me',
  taxBasisPoints: integer(process.env.TAX_BASIS_POINTS, 825),
  deliveryFeeCents: integer(process.env.DELIVERY_FEE_CENTS, 400),
  allowedPostalCodes: new Set(
    (process.env.ALLOWED_DELIVERY_ZIPS ?? '90012,90013,90014,90015,90017,90021')
      .split(',')
      .map((zip) => zip.trim())
      .filter(Boolean),
  ),
  adminEmail: (process.env.ADMIN_EMAIL ?? 'admin@unassuming.local').toLowerCase(),
  adminPassword: process.env.ADMIN_TEMP_PASSWORD ?? 'change-this-password',
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? 'Unassuming Orders <orders@example.com>',
};

if (config.nodeEnv === 'production' && config.sessionSecret === 'development-only-change-me') {
  throw new Error('SESSION_SECRET must be configured in production');
}
