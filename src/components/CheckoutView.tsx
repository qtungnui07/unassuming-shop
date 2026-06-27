/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CreditCard, Banknote, ShoppingBag, Truck, CheckCircle, ChevronLeft, MapPin } from 'lucide-react';
import { CartItem, OrderDetails, ScreenType } from '../types';
import { api } from '../api';

interface CheckoutViewProps {
  cart: CartItem[];
  setScreen: (screen: ScreenType) => void;
  onPlaceOrder: (orderDetails: OrderDetails) => void;
  clearCart: () => void;
}

export default function CheckoutView({ cart, setScreen, onPlaceOrder, clearCart }: CheckoutViewProps) {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'cash' | 'card'>('card');
  const [applyReward, setApplyReward] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [quote, setQuote] = useState<{
    subtotalCents: number;
    discountCents: number;
    taxCents: number;
    deliveryFeeCents: number;
    totalCents: number;
    rewardAvailable: boolean;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Math
  const subtotal = cart.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0);
  const taxRate = 0.0825; // 8.25% CA Sales Tax
  const taxAmount = subtotal * taxRate;
  const deliveryFee = deliveryType === 'delivery' ? 4.00 : 0.00;
  const grandTotal = subtotal + taxAmount + deliveryFee;
  const quotedTotal = quote ? quote.totalCents / 100 : grandTotal;

  useEffect(() => {
    if (!cart.length || !email.includes('@') || (deliveryType === 'delivery' && !/^\d{5}$/.test(postalCode))) {
      setQuote(null);
      return;
    }
    const timer = window.setTimeout(() => {
      api.post<NonNullable<typeof quote>>('/api/orders/quote', {
        email, deliveryType, postalCode: deliveryType === 'delivery' ? postalCode : undefined,
        applyReward,
        items: cart.map((item) => ({
          productId: item.menuItem.id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
      }).then(setQuote).catch(() => setQuote(null));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [applyReward, cart, deliveryType, email, postalCode]);

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setErrorMsg('Delivery Address is required.');
      return;
    }
    if (deliveryType === 'delivery' && !/^\d{5}$/.test(postalCode)) {
      setErrorMsg('A valid 5-digit delivery ZIP code is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const order = await api.post<OrderDetails>('/api/orders', {
        name, email, phone, address, postalCode: deliveryType === 'delivery' ? postalCode : undefined,
        deliveryType, paymentPreference, applyReward, idempotencyKey,
        items: cart.map((item) => ({
          productId: item.menuItem.id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
      });
      onPlaceOrder(order);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-50 py-12 min-h-screen" id="checkout-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button
          onClick={() => setScreen('menu')}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 font-medium text-sm mb-8 transition-colors cursor-pointer group"
          id="btn-checkout-back"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Keep shopping
        </button>

        <h1 className="text-3xl font-black tracking-tight text-zinc-950 mb-10">Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-zinc-100 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-6">
            <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto" />
            <h2 className="text-xl font-bold text-zinc-900">Your basket is currently empty</h2>
            <p className="text-zinc-500 text-sm">
              We cannot process an order without ingredients! Add some transparently crafted items to proceed.
            </p>
            <button
              onClick={() => setScreen('menu')}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              id="btn-empty-cart-go"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Delivery & Payment Details Forms */}
            <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Delivery Option Selector */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-black uppercase tracking-wider text-zinc-400">
                  1. Service Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-100'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                    id="btn-checkout-delivery"
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-wider">Fast Delivery</span>
                    <span className="text-[10px] font-mono text-zinc-400">30-40 mins • $4.00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-100'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                    id="btn-checkout-pickup"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-wider">Lobby Pickup</span>
                    <span className="text-[10px] font-mono text-zinc-400">10-15 mins • Free</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Customer Contact info */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                <h2 className="text-lg font-black uppercase tracking-wider text-zinc-400">
                  2. Contact & Delivery
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-zinc-950 font-sans"
                        required
                        id="checkout-name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-zinc-950 font-sans"
                        required
                        id="checkout-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-zinc-950 font-sans"
                      required
                      id="checkout-phone"
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_8rem] gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Delivery Address</label>
                        <input type="text" placeholder="123 S Broadway, Los Angeles" value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-zinc-950 font-sans"
                          required id="checkout-address" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">ZIP code</label>
                        <input type="text" inputMode="numeric" maxLength={5} placeholder="90014" value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-zinc-950 font-mono"
                          required id="checkout-postal-code" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Secure Payment */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black uppercase tracking-wider text-zinc-400">3. Pay on handoff</h2>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase font-bold">No card details collected</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(['card', 'cash'] as const).map((method) => (
                    <button type="button" key={method} onClick={() => setPaymentPreference(method)}
                      className={`p-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-black uppercase ${paymentPreference === method ? 'border-amber-400 bg-amber-50' : 'border-zinc-200'}`}>
                      {method === 'card' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                      {method} at handoff
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-3 text-xs text-zinc-600">
                  <input type="checkbox" checked={applyReward} onChange={(e) => setApplyReward(e.target.checked)} />
                  Apply an available Honest Reward to an eligible burger
                </label>
              </div>

              {/* Error Warning */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/10 transition-all cursor-pointer"
                id="btn-place-order" disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing order…' : `Place My Honest Order ($${quotedTotal.toFixed(2)})`}
              </button>

            </form>

            {/* Right Column: Order Summary details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs space-y-6">
                <h3 className="text-xs font-black tracking-widest uppercase text-zinc-400">
                  Order Summary
                </h3>

                {/* Items in summary list */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-zinc-50">
                  {cart.map((item, idx) => (
                    <div key={item.cartId} className="flex items-start justify-between gap-4 pt-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-14 h-14 object-cover rounded-lg bg-zinc-50 border border-zinc-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            Qty: {item.quantity} • ${item.priceAtAddition.toFixed(2)}
                          </p>
                          
                          {/* Customization listing */}
                          {(item.customizations.extras.length > 0 || item.customizations.holdIngredients.length > 0 || item.customizations.pattyDoneness) && (
                            <div className="text-[10px] text-zinc-400 space-y-0.5 mt-1 font-sans">
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
                        </div>
                      </div>
                      <span className="text-xs font-black text-zinc-950 font-mono shrink-0">
                        ${(item.priceAtAddition * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mathematical Receipt breakdown */}
                <div className="border-t border-zinc-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>CA Sales Tax (8.25%)</span>
                    <span className="font-mono">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{deliveryType === 'delivery' ? 'Delivery Fee' : 'Lobby Pickup'}</span>
                    <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-zinc-100 pt-4 flex justify-between text-sm text-zinc-950 font-black">
                    <span>Total Bill</span>
                    <span className="font-mono text-base">${quotedTotal.toFixed(2)}</span>
                  </div>
                  {quote && quote.discountCents > 0 && (
                    <p className="text-xs text-emerald-700">Reward discount: -${(quote.discountCents / 100).toFixed(2)}</p>
                  )}
                </div>
              </div>

              {/* Sourcing guarantee badge */}
              <div className="bg-amber-50/50 border border-amber-100/80 rounded-xl p-5 text-center space-y-2">
                <CheckCircle className="w-5 h-5 text-amber-600 mx-auto" />
                <p className="text-[10px] font-mono uppercase text-amber-900 font-bold">Unassuming Sourcing Invoice</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Upon purchase, we publish the real-time percentage allocation of your dollars spent to local organic farms. Pure food, total economics.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
