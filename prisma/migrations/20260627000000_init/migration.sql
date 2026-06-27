CREATE TYPE "ProductCategory" AS ENUM ('burgers', 'sides', 'drinks', 'shakes');
CREATE TYPE "LocationStatus" AS ENUM ('open', 'coming_soon');
CREATE TYPE "DeliveryType" AS ENUM ('delivery', 'pickup');
CREATE TYPE "PaymentPreference" AS ENUM ('cash', 'card');
CREATE TYPE "OrderStatus" AS ENUM ('received', 'preparing', 'ready', 'out_for_delivery', 'fulfilled', 'cancelled');

CREATE TABLE "Product" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL, "image" TEXT NOT NULL, "category" "ProductCategory" NOT NULL,
  "available" BOOLEAN NOT NULL DEFAULT true, "bestSeller" BOOLEAN NOT NULL DEFAULT false,
  "chefChoice" BOOLEAN NOT NULL DEFAULT false, "calories" INTEGER, "tags" TEXT[], "thumbnails" TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Location" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "address" TEXT NOT NULL, "hours" TEXT NOT NULL,
  "status" "LocationStatus" NOT NULL, "statusLabel" TEXT NOT NULL, "mapImage" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Customer" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "phone" TEXT NOT NULL,
  "burgerProgress" INTEGER NOT NULL DEFAULT 0, "rewardCredits" INTEGER NOT NULL DEFAULT 0,
  "rewardAccessHash" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Order" (
  "id" TEXT NOT NULL, "displayId" TEXT NOT NULL, "trackingToken" TEXT NOT NULL,
  "trackingTokenHash" TEXT NOT NULL, "idempotencyKey" TEXT NOT NULL, "customerId" TEXT NOT NULL,
  "deliveryType" "DeliveryType" NOT NULL, "paymentPreference" "PaymentPreference" NOT NULL,
  "address" TEXT NOT NULL, "postalCode" TEXT, "status" "OrderStatus" NOT NULL DEFAULT 'received',
  "subtotalCents" INTEGER NOT NULL, "discountCents" INTEGER NOT NULL DEFAULT 0,
  "taxCents" INTEGER NOT NULL, "deliveryFeeCents" INTEGER NOT NULL, "totalCents" INTEGER NOT NULL,
  "estimatedMinutes" INTEGER NOT NULL, "rewardApplied" BOOLEAN NOT NULL DEFAULT false,
  "rewardsGranted" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "productId" TEXT NOT NULL, "productName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL, "unitBaseCents" INTEGER NOT NULL, "unitExtrasCents" INTEGER NOT NULL,
  "lineTotalCents" INTEGER NOT NULL, "pattyDoneness" TEXT, "holdIngredients" TEXT[], "extras" TEXT[],
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "OrderStatusHistory" (
  "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "status" "OrderStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "NewsletterSubscription" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
  "mustChangePassword" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdminSession" (
  "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "adminId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Order_displayId_key" ON "Order"("displayId");
CREATE UNIQUE INDEX "Order_trackingToken_key" ON "Order"("trackingToken");
CREATE UNIQUE INDEX "Order_trackingTokenHash_key" ON "Order"("trackingTokenHash");
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
