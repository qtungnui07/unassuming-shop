CREATE TYPE "CustomerTokenPurpose" AS ENUM ('verify_email', 'reset_password');

ALTER TABLE "Customer"
  ADD COLUMN "passwordHash" TEXT,
  ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "CustomerSession" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CustomerSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomerAuthToken" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "purpose" "CustomerTokenPurpose" NOT NULL,
  "customerId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CustomerAuthToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerSession_tokenHash_key" ON "CustomerSession"("tokenHash");
CREATE INDEX "CustomerSession_expiresAt_idx" ON "CustomerSession"("expiresAt");
CREATE UNIQUE INDEX "CustomerAuthToken_tokenHash_key" ON "CustomerAuthToken"("tokenHash");
CREATE INDEX "CustomerAuthToken_customerId_purpose_idx" ON "CustomerAuthToken"("customerId", "purpose");
CREATE INDEX "CustomerAuthToken_expiresAt_idx" ON "CustomerAuthToken"("expiresAt");

ALTER TABLE "CustomerSession" ADD CONSTRAINT "CustomerSession_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerAuthToken" ADD CONSTRAINT "CustomerAuthToken_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
