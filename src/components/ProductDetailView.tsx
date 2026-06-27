/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Minus, Shield, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { MenuItem, ScreenType, Customizations, CartItem } from '../types';

interface ProductDetailViewProps {
  product: MenuItem;
  setScreen: (screen: ScreenType) => void;
  onAddToCart: (item: MenuItem, quantity: number, customizations: Customizations) => void;
  quickAddUpsell: (itemId: string) => void;
  menuItems: MenuItem[];
}

export default function ProductDetailView({ product, setScreen, onAddToCart, quickAddUpsell, menuItems }: ProductDetailViewProps) {
  // Main Image state
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [pattyDoneness, setPattyDoneness] = useState<'Medium' | 'Medium Well' | 'Well Done'>('Medium Well');
  const [holdIngredients, setHoldIngredients] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [addedConfirm, setAddedConfirm] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
    setPattyDoneness('Medium Well');
    setHoldIngredients([]);
    setExtras([]);
    setAddedConfirm(false);
  }, [product]);

  const isBurger = product.category === 'burgers';

  // Available default toppings to hold (based on burger/item description)
  const defaultToppings = isBurger
    ? ['Aged Cheddar', 'Pickles', 'Tomatoes', 'House Sauce', 'Red Onions']
    : product.id.includes('fries') ? ['Sea Salt', 'Herbs'] : [];

  // Upgrades with price modifications
  const availableExtras = isBurger
    ? [
        { name: 'Extra Wagyu Patty', price: 3.50 },
        { name: 'Extra Cheddar Cheese', price: 1.00 },
        { name: 'Applewood Crispy Bacon', price: 2.00 },
        { name: 'Fried Organic Egg', price: 1.50 }
      ]
    : product.category === 'sides' && product.id.includes('fries')
    ? [
        { name: 'Add White Truffle Oil', price: 1.50 },
        { name: 'Extra Shaved Parmesan', price: 1.00 }
      ]
    : [];

  // Toggle Hold ingredients
  const handleToggleHold = (ingredient: string) => {
    setHoldIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Toggle Premium Extras
  const handleToggleExtra = (extraName: string) => {
    setExtras(prev =>
      prev.includes(extraName)
        ? prev.filter(e => e !== extraName)
        : [...prev, extraName]
    );
  };

  // Dynamic Price calculation
  const getSingleItemPrice = () => {
    let price = product.price;
    extras.forEach(extraName => {
      const extraObj = availableExtras.find(e => e.name === extraName);
      if (extraObj) {
        price += extraObj.price;
      }
    });
    return price;
  };

  const totalPrice = getSingleItemPrice() * quantity;

  // Handle Add To Cart action
  const handleAddClick = () => {
    const customizations: Customizations = {
      pattyDoneness: isBurger ? pattyDoneness : undefined,
      holdIngredients,
      extras
    };
    onAddToCart(product, quantity, customizations);
    setAddedConfirm(true);
    setTimeout(() => {
      setAddedConfirm(false);
    }, 2000);
  };

  // Frequently bought items
  const upsellItems = menuItems.filter(item => 
    (product.category === 'burgers' && (item.category === 'sides' || item.category === 'drinks')) ||
    (product.category !== 'burgers' && item.category === 'burgers')
  ).slice(0, 3);

  return (
    <div className="bg-zinc-50 py-12" id="product-detail-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => setScreen('menu')}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 font-medium text-sm mb-8 transition-colors cursor-pointer group"
          id="btn-back-to-menu"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to menu
        </button>

        {/* Product Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visual Showcase (Images) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col items-center justify-center relative aspect-square overflow-hidden group">
              <img
                src={activeImage}
                alt={product.name}
                className="max-w-full max-h-[400px] object-contain drop-shadow-xl transition-all duration-300 group-hover:scale-102"
                referrerPolicy="no-referrer"
                id="detail-main-image"
              />
              
              {/* Chef quality tag */}
              {product.chefChoice && (
                <span className="absolute top-6 left-6 bg-amber-500 text-zinc-950 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium Recipe
                </span>
              )}
            </div>

            {/* Thumbnail Gallery (Clickable!) */}
            {product.thumbnails && product.thumbnails.length > 0 && (
              <div className="grid grid-cols-5 gap-3" id="thumbnail-gallery">
                {/* Default Main */}
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`aspect-square rounded-xl bg-white border overflow-hidden p-1.5 cursor-pointer hover:border-amber-500 transition-all ${
                    activeImage === product.image ? 'border-2 border-amber-500 ring-2 ring-amber-100' : 'border-zinc-200'
                  }`}
                >
                  <img src={product.image} alt="Main shot" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </button>

                {/* Additional views */}
                {product.thumbnails.map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumbUrl)}
                    className={`aspect-square rounded-xl bg-white border overflow-hidden p-1.5 cursor-pointer hover:border-amber-500 transition-all ${
                      activeImage === thumbUrl ? 'border-2 border-amber-500 ring-2 ring-amber-100' : 'border-zinc-200'
                    }`}
                    id={`thumb-btn-${idx}`}
                  >
                    <img src={thumbUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-zinc-100 border border-zinc-200 text-zinc-600 font-mono text-[10px] rounded-md px-2.5 py-1 uppercase tracking-wider">
                  Category: {product.category}
                </span>
                {product.calories && (
                  <span className="bg-amber-50 border border-amber-100 text-amber-800 font-mono text-[10px] rounded-md px-2.5 py-1 uppercase tracking-wider">
                    {product.calories} Calories
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">
                {product.name}
              </h1>
              
              <p className="text-zinc-600 leading-relaxed font-sans text-sm">
                {product.description}
              </p>
            </div>

            {/* Config options */}
            <div className="space-y-6 pt-6 border-t border-zinc-100">
              
              {/* Option 1: Patty Doneness (Only for burgers) */}
              {isBurger && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-widest uppercase text-zinc-400">
                    Patty Doneness
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Medium', 'Medium Well', 'Well Done'] as const).map((done) => (
                      <button
                        key={done}
                        onClick={() => setPattyDoneness(done)}
                        className={`py-3 text-xs font-black uppercase tracking-wider border rounded-xl transition-all cursor-pointer ${
                          pattyDoneness === done
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                            : 'bg-white text-zinc-500 hover:text-zinc-950 border-zinc-200'
                        }`}
                        id={`btn-doneness-${done.replace(' ', '-')}`}
                      >
                        {done}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    *Our default recommendation is Medium Well for the perfect melt.
                  </p>
                </div>
              )}

              {/* Option 2: Ingredients to Hold */}
              {defaultToppings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-widest uppercase text-zinc-400">
                    Hold Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {defaultToppings.map((topping) => {
                      const isHeld = holdIngredients.includes(topping);
                      return (
                        <button
                          key={topping}
                          onClick={() => handleToggleHold(topping)}
                          className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                            isHeld
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-white text-zinc-700 hover:text-zinc-950 border-zinc-200 hover:border-zinc-300'
                          }`}
                          id={`btn-hold-${topping.replace(' ', '-')}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isHeld ? 'bg-red-500' : 'bg-zinc-300'}`} />
                          {isHeld ? `Hold ${topping}` : topping}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Option 3: Premium Upgrades (Extras) */}
              {availableExtras.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-widest uppercase text-zinc-400">
                    Premium Extras
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableExtras.map((extra) => {
                      const isSelected = extras.includes(extra.name);
                      return (
                        <button
                          key={extra.name}
                          onClick={() => handleToggleExtra(extra.name)}
                          className={`p-4 text-left border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50/55 text-amber-900 border-amber-300 ring-1 ring-amber-100'
                              : 'bg-white text-zinc-700 hover:text-zinc-950 border-zinc-200 hover:border-zinc-300'
                          }`}
                          id={`btn-extra-${extra.name.replace(' ', '-')}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span className="text-xs font-bold">{extra.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-zinc-500">
                            +${extra.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Quantity and Order CTAs */}
            <div className="bg-white border border-zinc-100 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-zinc-400">Your custom price</p>
                  <p className="text-3xl font-black text-zinc-950" id="detail-total-price">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 px-2 h-13 w-fit shrink-0">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                    id="btn-qty-minus"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-bold text-zinc-900 text-sm select-none" id="detail-qty-val">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                    id="btn-qty-plus"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to order CTA */}
              <button
                onClick={handleAddClick}
                disabled={addedConfirm}
                className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  addedConfirm
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-zinc-950/10'
                }`}
                id="btn-add-to-cart"
              >
                {addedConfirm ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-pulse" />
                    Added to order!
                  </>
                ) : (
                  'Add to my order'
                )}
              </button>
            </div>

            {/* Sourcing transparency block */}
            <div className="bg-zinc-100 border border-zinc-200 p-4 rounded-xl flex items-start gap-3">
              <Shield className="text-zinc-500 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-mono uppercase text-zinc-500 font-bold">100% Honest Guarantee</p>
                <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                  All components of this item are verifiable. No synthetic binders, no MSG, no artificial dyes. Feel free to verify sourcing.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Frequently Bought With */}
        {upsellItems.length > 0 && (
          <section className="mt-20 pt-12 border-t border-zinc-100">
            <h2 className="text-lg font-black uppercase tracking-wider text-zinc-400 mb-6">
              Frequently Bought With
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {upsellItems.map((upsell) => (
                <div key={upsell.id} className="bg-white border border-zinc-100 rounded-xl p-4 flex items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={upsell.image} alt={upsell.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-50" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{upsell.name}</h4>
                      <p className="text-xs font-black text-zinc-950 mt-1">${upsell.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => quickAddUpsell(upsell.id)}
                    className="p-2 border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer text-xs font-bold transition-all"
                    id={`btn-upsell-add-${upsell.id}`}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
