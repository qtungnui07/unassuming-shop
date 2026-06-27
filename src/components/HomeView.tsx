/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  CheckCircle,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { ScreenType, MenuItem } from '../types';

interface HomeViewProps {
  setScreen: (screen: ScreenType) => void;
  selectProduct: (id: string) => void;
  menuItems: MenuItem[];
}

export default function HomeView({ setScreen, selectProduct, menuItems }: HomeViewProps) {
  const signatureBurger = menuItems.find(item => item.id === 'signature-unassuming');
  const thePurest = menuItems.find(item => item.id === 'the-purest');
  const fries = menuItems.find(item => item.id === 'triple-cut-fries');

  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBkixfSxDtdZdgp27xFH8Z2SyWNczMzYi7UccyEB59vjTXH_4bQtxaEMj-R77CroYCBFkqkleoyEFkLS1PCx1MadwabiczWEi38XODdInQ2cyexYsYobJp_dOiQ33WmK0eyvX1wx428fsxAWfssUgkYrufILf76wupf7e34zNY8Nqhaevsw-XKM-hpKwN6NclJimv_6Rl4aHlz5iCFezzMidja1Cj5ausBiu4tmLGDL5iGCKqm8Ccl5G8saNQErgcQxRNjl1Yd0CzDv';
  const heroTicker = ['SMASHED FRESH', 'CLEAN BEEF', 'HONEST BUNS', 'MELTED CHEDDAR'];

  return (
    <div className="w-full bg-zinc-50" id="home-view-container">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.28),_rgba(255,248,235,0.96)_36%,_rgba(245,245,244,1)_72%)] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.3),transparent_42%,rgba(24,24,27,0.06)_100%)]" />
        <div className="pointer-events-none absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-[-8%] h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="relative z-20 space-y-8 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-white/80 px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-900 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Un-Gimmick Burger Joint</span>
              </div>
              <h1 className="max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.05em] text-zinc-950 sm:text-6xl lg:text-7xl">
                Burger hero
                <br />
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-zinc-950 bg-clip-text text-transparent">
                  with motion attitude.
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-zinc-600">
                Phan opening gio co the mang cam giac nhu mot shot quang cao: burger noi o tien canh,
                typography chuyen dong o background, con burger duoc xu ly nhu mot overlay hero lon
                de tong the van dam chat quang cao ma load nhanh hon.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Hero Depth</h4>
                    <p className="text-xs text-zinc-500">Layered shadows and floating stage</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Jitter Energy</h4>
                    <p className="text-xs text-zinc-500">Big animated type behind the burger</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur">
                  <Star className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Premium Focus</h4>
                    <p className="text-xs text-zinc-500">A single product takes over the fold</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Still Practical</h4>
                    <p className="text-xs text-zinc-500">Image-based hero with lighter performance cost</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setScreen('menu')}
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-md shadow-zinc-950/10 transition-all duration-200 hover:bg-zinc-800"
                  id="hero-order-now-btn"
                >
                  Order Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setScreen('our-story')}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-zinc-950 shadow-xs transition-all hover:bg-zinc-100"
                  id="hero-our-story-btn"
                >
                  Our Honest Ingredients
                </button>
              </div>
            </div>

            <div className="relative z-10 flex justify-center lg:col-span-7">
              <div className="hero-stage relative flex min-h-[520px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-[radial-gradient(circle_at_center,_rgba(255,251,235,0.95),_rgba(255,237,213,0.84)_38%,_rgba(39,39,42,0.08)_100%)] px-4 py-10 shadow-[0_40px_120px_rgba(24,24,27,0.18)] sm:px-8">
                <div className="pointer-events-none absolute inset-x-8 top-7 hidden gap-6 text-[11px] font-mono uppercase tracking-[0.35em] text-zinc-500/80 sm:flex">
                  <span>Home Opening</span>
                  <span>Motion-first</span>
                  <span>Hero Section</span>
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <div className="hero-grid absolute inset-[8%] rounded-[2rem] border border-white/40 opacity-60" />
                  <div className="hero-orbit hero-orbit-one" />
                  <div className="hero-orbit hero-orbit-two" />
                  <div className="hero-glow absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/35 blur-3xl" />
                </div>

                <div className="hero-ticker-wrap absolute inset-x-[-14%] top-1/2 z-0 -translate-y-1/2 overflow-hidden">
                  <div className="hero-ticker hero-ticker-front">
                    {[...heroTicker, ...heroTicker].map((label, index) => (
                      <span key={`front-${label}-${index}`} className="hero-word">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="hero-ticker hero-ticker-back">
                    {[...heroTicker, ...heroTicker].map((label, index) => (
                      <span key={`back-${label}-${index}`} className="hero-word hero-word-outline">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hero-card absolute left-4 top-6 z-20 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur sm:left-8">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">Now Showing</p>
                  <p className="mt-2 max-w-[10rem] text-sm font-black uppercase leading-tight text-zinc-950">
                    Floating burger overlay in the spotlight
                  </p>
                </div>

                <div className="hero-floor absolute bottom-10 left-1/2 z-0 h-20 w-[76%] -translate-x-1/2 rounded-[999px] bg-zinc-950/20 blur-2xl" />
                <div className="hero-model relative z-10 w-full max-w-xl">
                  <div className="hero-model-shell relative rounded-[2rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.08))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm">
                    <div className="absolute -right-4 top-14 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 shadow-lg backdrop-blur sm:-right-8">
                      hero overlay
                    </div>
                    <div className="absolute -left-2 bottom-12 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur sm:-left-6">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Visual Layer</p>
                      <p className="mt-1 text-sm font-black text-zinc-900">Product cutout + glow + shadow</p>
                    </div>

                    <div className="hero-overlay-wrap">
                      <img
                        src={heroImage}
                        alt="Unassuming Double Cheeseburger"
                        className="hero-burger-overlay"
                        referrerPolicy="no-referrer"
                        id="hero-burger-image"
                      />
                    </div>
                  </div>
                </div>

                <div className="hero-card absolute bottom-6 right-4 z-20 rounded-2xl border border-white/70 bg-zinc-950 px-5 py-4 text-white shadow-xl sm:right-8">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-400">Hero Recipe</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-amber-400">Bold motion type + premium burger overlay</p>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(255,248,235,0.92))]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <p className="mb-1 text-xs font-mono uppercase tracking-widest text-amber-500">Our Absolute Pledge</p>
              <h2 className="text-2xl font-black tracking-tight text-white">We Post All Sourcing Invoices</h2>
            </div>
            <p className="max-w-xl text-sm text-zinc-400">
              We think it is crazy that burgers are a mystery. Every month, we scan and publish our farm beef receipts, bun flour milling logs, and cheese aging reports. Real food has nothing to hide.
            </p>
            <button
              onClick={() => setScreen('our-story')}
              className="whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-zinc-800"
              id="btn-view-receipts"
            >
              Verify Sourcing
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">Our Core Masterpieces</h2>
          <p className="text-sm leading-relaxed text-zinc-500">
            We perfected three foundational pillars of the classic fast-food experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {signatureBurger && (
            <div className="group flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-xs transition-all hover:shadow-md">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-50">
                  <img
                    src={signatureBurger.image}
                    alt={signatureBurger.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase text-zinc-950">
                    Chef&apos;s Choice
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{signatureBurger.name}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">{signatureBurger.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-6">
                <span className="text-lg font-black text-zinc-950">${signatureBurger.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(signatureBurger.id)}
                  className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800"
                  id={`btn-spotlight-${signatureBurger.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}

          {thePurest && (
            <div className="group flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-xs transition-all hover:shadow-md">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-50">
                  <img
                    src={thePurest.image}
                    alt={thePurest.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-zinc-950 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                    Pure Beef
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{thePurest.name}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">{thePurest.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-6">
                <span className="text-lg font-black text-zinc-950">${thePurest.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(thePurest.id)}
                  className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800"
                  id={`btn-spotlight-${thePurest.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}

          {fries && (
            <div className="group flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-xs transition-all hover:shadow-md">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-50">
                  <img
                    src={fries.image}
                    alt={fries.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-zinc-100 px-2.5 py-1 text-[10px] font-black uppercase text-zinc-800">
                    Triple Cooked
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950">{fries.name}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">{fries.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-6">
                <span className="text-lg font-black text-zinc-950">${fries.price.toFixed(2)}</span>
                <button
                  onClick={() => selectProduct(fries.id)}
                  className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800"
                  id={`btn-spotlight-${fries.id}`}
                >
                  Configure
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-12 text-center">
          <button
            onClick={() => setScreen('menu')}
            className="group inline-flex cursor-pointer items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-900 transition-colors hover:text-amber-600"
            id="btn-explore-full-menu"
          >
            Explore Our Full Honest Menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <section className="border-b border-t border-amber-100 bg-amber-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-8 text-white shadow-xl sm:p-12">
            <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-zinc-900 blur-3xl" />

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-950">
                  <HeartPulse className="h-3.5 w-3.5" />
                  <span>Unassuming Loyalty</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  No points algorithms.
                  <br />
                  Just simple, free burgers.
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
                  Most rewards programs require a degree in astrophysics to calculate points. Ours is simple: order 10 burgers, get 1 free. No tiers, no gamified tricks. Just genuine reciprocal gratitude.
                </p>
                <div className="flex gap-6 pt-2">
                  <div>
                    <h4 className="text-2xl font-black text-amber-500">10%</h4>
                    <p className="text-xs font-mono uppercase text-zinc-500">Direct Value Back</p>
                  </div>
                  <div className="border-l border-zinc-800 pl-6">
                    <h4 className="text-2xl font-black text-amber-500">10</h4>
                    <p className="text-xs font-mono uppercase text-zinc-500">Burgers to Free Meal</p>
                  </div>
                  <div className="border-l border-zinc-800 pl-6">
                    <h4 className="text-2xl font-black text-amber-500">Zero</h4>
                    <p className="text-xs font-mono uppercase text-zinc-500">Expiring Points</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:col-span-4 lg:justify-end">
                <button
                  onClick={() => setScreen('rewards')}
                  className="cursor-pointer rounded-xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-zinc-950 shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-400"
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
