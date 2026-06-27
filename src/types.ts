/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'burgers' | 'sides' | 'drinks' | 'shakes';
  isBestSeller?: boolean;
  calories?: number;
  chefChoice?: boolean;
  tags?: string[];
  thumbnails?: string[];
}

export interface Customizations {
  pattyDoneness?: 'Medium' | 'Medium Well' | 'Well Done';
  holdIngredients: string[]; // List of ingredients to remove
  extras: string[]; // List of extras to add (e.g., 'Extra Cheese', 'Crispy Bacon')
}

export interface CartItem {
  cartId: string; // Unique ID for this specific cart instance
  menuItem: MenuItem;
  quantity: number;
  customizations: Customizations;
  priceAtAddition: number; // Single item price including any extras
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  hours: string;
  status: 'open' | 'coming-soon';
  statusLabel: string;
  mapImage: string;
}

export type ScreenType = 'home' | 'menu' | 'product-detail' | 'checkout' | 'order-tracking' | 'our-story' | 'locations' | 'rewards';
