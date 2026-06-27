/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, UserRound } from 'lucide-react';
import { ScreenType, CartItem, CustomerProfile } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  cart: CartItem[];
  toggleCart: () => void;
  customer: CustomerProfile | null;
}

export default function Header({ currentScreen, setScreen, cart, toggleCart, customer }: HeaderProps) {
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-100 backdrop-blur-md/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setScreen('home')}
          className="flex flex-col items-start cursor-pointer group text-left"
          id="btn-brand-logo"
        >
          <span className="text-2xl font-black tracking-tight text-zinc-950 group-hover:text-amber-600 transition-colors duration-200">
            UNASSUMING.
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            Radically Honest Fast Food
          </span>
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setScreen('menu')}
            className={`font-medium text-sm transition-colors cursor-pointer ${
              currentScreen === 'menu' || currentScreen === 'product-detail'
                ? 'text-zinc-950 border-b-2 border-zinc-950 pb-1 pt-1'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
            id="nav-menu"
          >
            Our Menu
          </button>
          <button
            onClick={() => setScreen('our-story')}
            className={`font-medium text-sm transition-colors cursor-pointer ${
              currentScreen === 'our-story' ? 'text-zinc-950 border-b-2 border-zinc-950 pb-1 pt-1' : 'text-zinc-500 hover:text-zinc-950'
            }`}
            id="nav-our-story"
          >
            Our Story
          </button>
          <button
            onClick={() => setScreen('locations')}
            className={`font-medium text-sm transition-colors cursor-pointer ${
              currentScreen === 'locations' ? 'text-zinc-950 border-b-2 border-zinc-950 pb-1 pt-1' : 'text-zinc-500 hover:text-zinc-950'
            }`}
            id="nav-locations"
          >
            Locations
          </button>
          <button
            onClick={() => setScreen('rewards')}
            className={`font-medium text-sm transition-colors cursor-pointer ${
              currentScreen === 'rewards' ? 'text-zinc-950 border-b-2 border-zinc-950 pb-1 pt-1' : 'text-zinc-500 hover:text-zinc-950'
            }`}
            id="nav-rewards"
          >
            Honest Rewards
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setScreen(customer ? 'account' : 'auth')}
            className="p-2.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-full border border-zinc-100"
            aria-label={customer ? 'Your account' : 'Sign in'}
            title={customer ? `Account: ${customer.name}` : 'Sign in or register'}
          >
            <UserRound className="h-5.5 w-5.5" />
          </button>
          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-full transition-all cursor-pointer border border-zinc-100 flex items-center justify-center"
            aria-label="Shopping Cart"
            id="btn-cart-toggle"
          >
            <ShoppingBag className="h-5.5 w-5.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-xs font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Quick CTA */}
          <button
            onClick={() => setScreen('menu')}
            className="hidden sm:inline-flex items-center justify-center px-5 h-11 text-xs font-black tracking-widest uppercase bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
            id="btn-header-order-now"
          >
            Order Now
          </button>
        </div>
      </div>
    </header>
  );
}
