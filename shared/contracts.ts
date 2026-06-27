export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'fulfilled'
  | 'cancelled';

export interface OrderLineInput {
  productId: string;
  quantity: number;
  customizations: {
    pattyDoneness?: 'Medium' | 'Medium Well' | 'Well Done';
    holdIngredients: string[];
    extras: string[];
  };
}

export interface QuoteRequest {
  email: string;
  deliveryType: 'delivery' | 'pickup';
  postalCode?: string;
  applyReward?: boolean;
  items: OrderLineInput[];
}

export interface QuoteResponse {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  rewardAvailable: boolean;
}

export interface CreateOrderRequest extends QuoteRequest {
  name: string;
  phone: string;
  address?: string;
  paymentPreference: 'cash' | 'card';
  idempotencyKey: string;
}

export interface CustomerProfile {
  email: string;
  name: string;
  phone: string;
  burgerProgress: number;
  rewardCredits: number;
}

export interface CustomerOrderSummary {
  orderId: string;
  deliveryType: 'delivery' | 'pickup';
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number; lineTotalCents: number }>;
}
