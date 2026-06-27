import { describe, expect, it } from 'vitest';
import type { Product } from '@prisma/client';
import { assertDeliveryEligible, calculateTotals, PricingError, validateAndPriceLine } from './pricing.js';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'honest-burger',
  name: 'Honest Burger',
  description: '',
  priceCents: 1250,
  image: '',
  category: 'burgers',
  available: true,
  bestSeller: false,
  chefChoice: false,
  calories: null,
  tags: [],
  thumbnails: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('server-owned pricing', () => {
  it('prices known extras and quantities in integer cents', () => {
    const input = {
      product: product(),
      quantity: 2,
      customizations: { pattyDoneness: 'Medium Well', holdIngredients: [], extras: ['Extra Wagyu Patty'] },
    };
    expect(validateAndPriceLine(input)).toEqual({
      unitBaseCents: 1250,
      unitExtrasCents: 350,
      lineTotalCents: 3200,
    });
  });

  it('rejects unknown extras and unavailable products', () => {
    expect(() => validateAndPriceLine({
      product: product(), quantity: 1,
      customizations: { holdIngredients: [], extras: ['Mystery topping'] },
    })).toThrow(PricingError);
    expect(() => validateAndPriceLine({
      product: product({ available: false }), quantity: 1,
      customizations: { holdIngredients: [], extras: [] },
    })).toThrow(/unavailable/);
  });

  it('applies one base-burger reward and rounds tax', () => {
    const base = {
      product: product(), quantity: 1,
      customizations: { holdIngredients: [], extras: [] },
      unitBaseCents: 1250, unitExtrasCents: 0, lineTotalCents: 1250,
    };
    expect(calculateTotals([base], 'delivery', true, 1)).toEqual({
      subtotalCents: 1250,
      discountCents: 1250,
      taxCents: 0,
      deliveryFeeCents: 400,
      totalCents: 400,
      rewardApplied: true,
    });
  });

  it('enforces configured delivery ZIPs but permits pickup', () => {
    expect(() => assertDeliveryEligible('delivery', '00000')).toThrow(/outside/);
    expect(() => assertDeliveryEligible('pickup')).not.toThrow();
  });
});
