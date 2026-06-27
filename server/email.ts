import { Resend } from 'resend';
import { config } from './config.js';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

export async function sendOrderEmail(input: {
  email: string;
  displayId: string;
  trackingToken: string;
  status?: string;
}) {
  if (!resend) {
    console.info(`[email disabled] ${input.displayId} -> ${input.email}`);
    return;
  }
  const trackingUrl = `${config.publicUrl}/?order=${encodeURIComponent(input.trackingToken)}`;
  await resend.emails.send({
    from: config.emailFrom,
    to: input.email,
    subject: input.status
      ? `Order ${input.displayId}: ${input.status.replaceAll('_', ' ')}`
      : `Order ${input.displayId} confirmed`,
    html: `<p>Your order <strong>${input.displayId}</strong> is ${input.status?.replaceAll('_', ' ') ?? 'confirmed'}.</p><p><a href="${trackingUrl}">Track your order</a></p>`,
  });
}

export async function sendRewardsEmail(email: string, token: string) {
  if (!resend) {
    console.info(`[email disabled] reward access -> ${email}`);
    return;
  }
  const url = `${config.publicUrl}/?rewards=${encodeURIComponent(token)}`;
  await resend.emails.send({
    from: config.emailFrom,
    to: email,
    subject: 'Your Honest Rewards ledger',
    html: `<p><a href="${url}">View your private Honest Rewards ledger</a>.</p>`,
  });
}

async function sendAccountLink(email: string, subject: string, query: string, token: string, label: string) {
  const url = `${config.publicUrl}/?${query}=${encodeURIComponent(token)}`;
  if (!resend) {
    console.info(`[email disabled] ${label} -> ${email}: ${url}`);
    return;
  }
  await resend.emails.send({
    from: config.emailFrom,
    to: email,
    subject,
    html: `<p><a href="${url}">${label}</a>.</p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

export const sendVerificationEmail = (email: string, token: string) =>
  sendAccountLink(email, 'Verify your Unassuming account', 'verify', token, 'Verify your account');

export const sendPasswordResetEmail = (email: string, token: string) =>
  sendAccountLink(email, 'Reset your Unassuming password', 'reset', token, 'Reset your password');
