/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onCheckoutClick: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckoutClick }: CartDrawerProps) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-backdrop">
      {/* Semi-transparent Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Core Panel */}
        <div className="w-screen max-w-md bg-white flex flex-col justify-between shadow-2xl relative" id="cart-drawer-panel">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-black text-zinc-950 uppercase tracking-wider">
                My Honest Order ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
              id="btn-cart-close"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="bg-zinc-50 p-4 rounded-full text-zinc-300">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <h3 className="font-bold text-zinc-900">Your basket is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  We prepare food with radical transparency. Choose from our pasture-raised menu to begin!
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  id="btn-drawer-browse"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="py-5 flex items-start gap-4" id={`cart-item-row-${item.cartId}`}>
                  {/* Thumbnail Image */}
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 object-cover rounded-xl bg-zinc-50 border border-zinc-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Core Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-black text-zinc-950 leading-snug">
                        {item.menuItem.name}
                      </h4>
                      <span className="text-xs font-black text-zinc-950 font-mono">
                        ${(item.priceAtAddition * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Customizations listing */}
                    {(item.customizations.extras.length > 0 || item.customizations.holdIngredients.length > 0 || item.customizations.pattyDoneness) && (
                      <div className="text-[10px] text-zinc-400 font-mono space-y-0.5 leading-relaxed">
                        {item.customizations.pattyDoneness && (
                          <p>• Doneness: {item.customizations.pattyDoneness}</p>
                        )}
                        {item.customizations.holdIngredients.map(h => (
                          <p key={h} className="text-red-500">• Hold: {h}</p>
                        ))}
                        {item.customizations.extras.map(e => (
                          <p key={e} className="text-amber-600">• Add: {e}</p>
                        ))}
                      </div>
                    )}

                    {/* Quantity controls and remove button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 px-1">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="p-1 text-zinc-400 hover:text-zinc-950 cursor-pointer"
                          id={`btn-drawer-minus-${item.cartId}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-zinc-800 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="p-1 text-zinc-400 hover:text-zinc-950 cursor-pointer"
                          id={`btn-drawer-plus-${item.cartId}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-zinc-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                        title="Remove item"
                        id={`btn-drawer-remove-${item.cartId}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer and Mathematical Summary */}
          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-zinc-100 bg-zinc-50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-950">Subtotal</span>
                <span className="font-black font-mono text-zinc-950 text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono text-center">
                *Taxes & delivery fees calculated at secure checkout.
              </p>
              
              <button
                onClick={onCheckoutClick}
                className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-zinc-950/10 group"
                id="btn-drawer-checkout"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
