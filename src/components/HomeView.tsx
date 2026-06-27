/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { ScreenType, MenuItem } from '../types';

interface HomeViewProps {
  setScreen: (screen: ScreenType) => void;
  selectProduct: (id: string) => void;
  menuItems: MenuItem[];
}

export default function HomeView({ setScreen, selectProduct, menuItems }: HomeViewProps) {
  // Extract premium items for spotlight
  const signatureBurger = menuItems.find(item => item.id === 'signature-unassuming');
  const thePurest = menuItems.find(item => item.id === 'the-purest');
  const fries = menuItems.find(item => item.id === 'triple-cut-fries');

  const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBkixfSxDtdZdgp27xFH8Z2SyWNczMzYi7UccyEB59vjTXH_4bQtxaEMj-R77CroYCBFkqkleoyEFkLS1PCx1MadwabiczWEi38XODdInQ2cyexYsYobJp_dOiQ33WmK0eyvX1wx428fsxAWfssUgkYrufILf76wupf7e34zNY8Nqhaevsw-XKM-hpKwN6NclJimv_6Rl4aHlz5iCFezzMidja1Cj5ausBiu4tmLGDL5iGCKqm8Ccl5G8saNQErgcQxRNjl1Yd0CzDv";

  return (
    <div className="w-full bg-zinc-50" id="home-view-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-amber-50/70 border-b border-zinc-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-amber-900 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Un-Gimmick Burger Joint</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
                Radically <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">Honest</span> Fast Food.
              </h1>
              <p className="text-lg text-zinc-600 font-sans max-w-lg leading-relaxed">
                We aren’t trying to change your life. We are just trying to make a really, really good double cheeseburger. No synthetic additives, no marketing buzzwords. Just premium beef and transparent integrity.
              </p>

              {/* Integrity Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Grass-Fed Wagyu</h4>
                    <p className="text-xs text-zinc-500">Pure, hand-smashed beef blend</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Organic Cheeses</h4>
                    <p className="text-xs text-zinc-500">Real aged cheddar, never processed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Zero High-Fructose</h4>
                    <p className="text-xs text-zinc-500">No corn syrup in our sodas or buns</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">No Artificial Dyes</h4>
                    <p className="text-xs text-zinc-500">Pristine spices, hand-cut pickles</p>
                  </div>
                </div>
              </div>

              {/* CTA Group */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setScreen('menu')}
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-black tracking-widest uppercase bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-zinc-950/10 group gap-2"
                  id="hero-order-now-btn"
                >
                  Order Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setScreen('our-story')}
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-black tracking-widest uppercase bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl transition-all border border-zinc-200 cursor-pointer shadow-xs"
                  id="hero-our-story-btn"
                >
                  Our Honest Ingredients
                </button>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square bg-gradient-to-br from-amber-100 to-amber-200/50 rounded-full p-6 sm:p-12 shadow-inner">
                {/* Burger Hero Graphic */}
                <img
                  src={heroImage}
                  alt="Unassuming Double Cheeseburger"
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  id="hero-burger-image"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-2 -left-2 bg-white border border-zinc-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-zinc-400">Ingredient Audit</p>
                    <p className="text-sm font-black text-zinc-900">100% Transparent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-zinc-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-1">Our Absolute Pledge</p>
              <h2 className="text-2xl font-black tracking-tight text-white">We Post All Sourcing Invoices</h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-xl">
              We think it is crazy that burgers are a mystery. Every month, we scan and publish our farm beef receipts, bun flour milling logs, and cheese aging reports. Real food has nothing to hide.
            </p>
            <button
              onClick={() => setScreen('our-story')}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer whitespace-nowrap"
              id="btn-view-receipts"
            >
              Verify Sourcing
            </button>
          </div>
        </div>
      </section>

      {/* Featured Bento Spotlights */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Our Core Masterpieces
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            We perfected three foundational pillars of the classic fast-food experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Spotlight 1: Signature Unassuming Burger */}
          {signatureBurger && (
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl bg-zinc-50 overflow-hidden">
                  <img
                    src={signatureBurger.image}
                    alt={signatureBurger.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-sm">
                    Chef's Choice
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{signatureBurger.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                  {signatureBurger.description}
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-50 mt-6 flex items-center justify-between">
                <span className="text-lg font-black text-zinc-950">${signatureBurger.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(signatureBurger.id)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  id={`btn-spotlight-${signatureBurger.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}

          {/* Spotlight 2: The Purest */}
          {thePurest && (
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl bg-zinc-50 overflow-hidden">
                  <img
                    src={thePurest.image}
                    alt={thePurest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-sm">
                    Pure Beef
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{thePurest.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                  {thePurest.description}
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-50 mt-6 flex items-center justify-between">
                <span className="text-lg font-black text-zinc-950">${thePurest.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(thePurest.id)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  id={`btn-spotlight-${thePurest.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}

          {/* Spotlight 3: Triple-Cut Fries */}
          {fries && (
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl bg-zinc-50 overflow-hidden">
                  <img
                    src={fries.image}
                    alt={fries.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-100 text-zinc-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-sm">
                    Triple Cooked
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{fries.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                  {fries.description}
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-50 mt-6 flex items-center justify-between">
                <span className="text-lg font-black text-zinc-950">${fries.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(fries.id)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  id={`btn-spotlight-${fries.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-12">
          <button
            onClick={() => setScreen('menu')}
            className="inline-flex items-center gap-2 text-zinc-900 font-black text-sm uppercase tracking-wider hover:text-amber-600 transition-colors cursor-pointer group"
            id="btn-explore-full-menu"
          >
            Explore Our Full Honest Menu
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Rewards callout */}
      <section className="bg-amber-50 border-t border-b border-amber-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-900 rounded-full blur-3xl -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-zinc-950 text-[10px] font-mono tracking-wider uppercase rounded-full">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Unassuming Loyalty</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  No points algorithms.<br />Just simple, free burgers.
                </h2>
                <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
                  Most rewards programs require a degree in astrophysics to calculate points. Ours is simple: order 10 burgers, get 1 free. No tiers, no gamified tricks. Just genuine reciprocal gratitude.
                </p>
                <div className="flex gap-6 pt-2">
                  <div>
                    <h4 className="text-2xl font-black text-amber-500">10%</h4>
                    <p className="text-xs text-zinc-500 font-mono uppercase">Direct Value Back</p>
                  </div>
                  <div className="border-l border-zinc-800 pl-6">
                    <h4 className="text-2xl font-black text-amber-500">10</h4>
                    <p className="text-xs text-zinc-500 font-mono uppercase">Burgers to Free Meal</p>
                  </div>
                  <div className="border-l border-zinc-800 pl-6">
                    <h4 className="text-2xl font-black text-amber-500">Zero</h4>
                    <p className="text-xs text-zinc-500 font-mono uppercase">Expiring Points</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <button
                  onClick={() => setScreen('rewards')}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                  id="btn-rewards-card-join"
                >
                  Join Rewards
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
