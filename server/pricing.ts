import type { Product } from '@prisma/client';
import { config } from './config.js';

export const EXTRA_PRICES: Record<string, Record<string, number>> = {
  burgers: {
    'Extra Wagyu Patty': 350,
    'Extra Cheddar Cheese': 100,
    'Applewood Crispy Bacon': 200,
    'Fried Organic Egg': 150,
  },
  fries: {
    'Add White Truffle Oil': 150,
    'Extra Shaved Parmesan': 100,
  },
};

export interface PriceLine {
  product: Product;
  quantity: number;
  customizations: {
    pattyDoneness?: string;
    holdIngredients: string[];
    extras: string[];
  };
}

export class PricingError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function validateAndPriceLine(line: PriceLine) {
  if (!line.product.available) throw new PricingError(`${line.product.name} is unavailable`, 409);
  const isBurger = line.product.category === 'burgers';
  const isFries = line.product.category === 'sides' && line.product.id.includes('fries');
  if (!isBurger && line.customizations.pattyDoneness) {
    throw new PricingError(`Doneness is not valid for ${line.product.name}`);
  }
  const prices = isBurger ? EXTRA_PRICES.burgers : isFries ? EXTRA_PRICES.fries : {};
  let extrasCents = 0;
  for (const extra of line.customizations.extras) {
    const price = prices[extra];
    if (price === undefined) throw new PricingError(`Invalid extra "${extra}" for ${line.product.name}`);
    extrasCents += price;
  }
  return {
    unitBaseCents: line.product.priceCents,
    unitExtrasCents: extrasCents,
    lineTotalCents: (line.product.priceCents + extrasCents) * line.quantity,
  };
}

export function calculateTotals(
  lines: Array<PriceLine & ReturnType<typeof validateAndPriceLine>>,
  deliveryType: 'delivery' | 'pickup',
  applyReward: boolean,
  rewardCredits: number,
) {
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const eligibleBases = lines
    .filter((line) => line.product.category === 'burgers')
    .flatMap((line) => Array.from({ length: line.quantity }, () => line.unitBaseCents));
  const discountCents = applyReward && rewardCredits > 0 && eligibleBases.length
    ? Math.max(...eligibleBases)
    : 0;
  const taxableCents = subtotalCents - discountCents;
  const taxCents = Math.round(taxableCents * config.taxBasisPoints / 10_000);
  const deliveryFeeCents = deliveryType === 'delivery' ? config.deliveryFeeCents : 0;
  return {
    subtotalCents,
    discountCents,
    taxCents,
    deliveryFeeCents,
    totalCents: taxableCents + taxCents + deliveryFeeCents,
    rewardApplied: discountCents > 0,
  };
}

export function assertDeliveryEligible(deliveryType: string, postalCode?: string) {
  if (deliveryType === 'delivery' && (!postalCode || !config.allowedPostalCodes.has(postalCode))) {
    throw new PricingError('That postal code is outside our current delivery area', 422);
  }
}
