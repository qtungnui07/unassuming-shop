/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Flame, ChevronRight, Award, SlidersHorizontal } from 'lucide-react';
import { MenuItem, ScreenType } from '../types';

interface MenuViewProps {
  menuItems: MenuItem[];
  setScreen: (screen: ScreenType) => void;
  selectProduct: (id: string) => void;
  quickAddToCart: (item: MenuItem) => void;
}

export default function MenuView({ menuItems, setScreen, selectProduct, quickAddToCart }: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'burgers' | 'sides' | 'drinks' | 'shakes'>('all');

  const categories = [
    { id: 'all', name: 'Full Menu', description: 'Everything we prepare, with absolute honesty' },
    { id: 'burgers', name: 'Burgers', description: 'Pasture-raised, hand-smashed 100% Wagyu patties' },
    { id: 'sides', name: 'Sides', description: 'Triple-cooked hand-cut potato fries & panko rings' },
    { id: 'drinks', name: 'Drinks', description: 'House-made, organic cane-sweetened refreshing elixirs' },
    { id: 'shakes', name: 'Shakes', description: 'Decadent real dairy custard, cold-whipped and rich' }
  ] as const;

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-zinc-50 py-12 sm:py-16 min-h-screen" id="menu-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Menu Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <p className="text-amber-600 font-mono text-xs uppercase tracking-widest font-black">No Fillers • No Secrets</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950">Our Radically Honest Menu</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Click any item to view its complete ingredient transparency report, configure patty doneness, or swap toppings.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                  : 'bg-white text-zinc-500 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300'
              }`}
              id={`menu-cat-tab-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category Meta Header */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase text-zinc-400">Current Category</p>
            <h2 className="text-2xl font-black text-zinc-900">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {categories.find(c => c.id === selectedCategory)?.description}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
            <Flame className="text-amber-600 w-5 h-5" />
            <span className="text-xs text-amber-900 font-medium leading-tight">
              All patties are 100% grass-fed. Buns are baked fresh daily with organic flour.
            </span>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              id={`menu-item-card-${item.id}`}
            >
              <div>
                {/* Image and badges */}
                <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    id={`menu-item-img-${item.id}`}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {item.isBestSeller && (
                      <span className="bg-amber-500 text-zinc-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
                        Best Seller
                      </span>
                    )}
                    {item.chefChoice && (
                      <span className="bg-zinc-950 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
                        Chef's Selection
                      </span>
                    )}
                  </div>
                  {item.calories && (
                    <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-mono text-zinc-600 px-2 py-0.5 rounded-md">
                      {item.calories} kCal
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-black text-zinc-950">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  {/* Item tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-zinc-50 text-zinc-500 border border-zinc-100 text-[10px] font-mono rounded-md px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="p-6 pt-0 border-t border-zinc-50 mt-4 flex gap-2">
                <button
                  onClick={() => selectProduct(item.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  id={`btn-configure-${item.id}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Customize
                </button>
                <button
                  onClick={() => quickAddToCart(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  id={`btn-quick-add-${item.id}`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Quick Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
