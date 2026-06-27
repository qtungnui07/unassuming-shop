/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ShieldAlert, Sparkles, FileText, CheckCircle } from 'lucide-react';

export default function OurStoryView() {
  const [activeLedger, setActiveLedger] = useState<'beef' | 'cheese' | 'flour'>('beef');

  const ledgers = {
    beef: {
      title: 'Grass-Fed Wagyu Sourcing Invoice',
      meta: 'Sourced from Cascade Valley Ranch, Oregon • Lot #W842-A',
      rawText: `=======================================================
CASCADE VALLEY ORGANIC BEEF CO. - INVOICE #941824
-------------------------------------------------------
DATE: June 22, 2026
CLIENT: Unassuming Inc. (842 S Broadway, LA)
DELIVERY METHOD: Direct Refrigerated Transit
-------------------------------------------------------
LINE ITEMS:
1. 400 lbs - Prime Wagyu Beef Blend (Chuck/Brisket 80/20)
   - Certified Grass-Fed, Grass-Finished
   - No Antibiotics / No Added Growth Hormones
   - Lot Reference ID: #W842-A
   - Price: $6.20 / lb ........................ $2,480.00

2. Cold Chain Transportation Log:
   - Departure Temp: 34.2°F (06/22 04:00 AM)
   - Arrival Temp: 35.0°F (06/22 10:15 AM)
   - Logger: Verified IoT Chain Guard #188

-------------------------------------------------------
TOTAL PAYMENT CHARGED:                         $2,480.00
STATUS: Paid in Full
=======================================================`
    },
    cheese: {
      title: 'Sharp Cheddar Production Log',
      meta: 'Sourced from Tillamook Valley Creameries • Batch #CH-8821',
      rawText: `=======================================================
TILLAMOOK VALLEY CREAMERIES - BATCH REPORT #CH-8821
-------------------------------------------------------
DATE RECORDED: April 14, 2025 (Aged 14 Months)
DELIVERED TO: Unassuming Inc. (842 S Broadway, LA)
-------------------------------------------------------
PRODUCT VERIFICATION:
- Product: Extra Sharp White Cheddar (Organic)
- Pure Pasture Milk, Cultures, Salt, Natural Rennet
- ZERO Yellow Annatto Dye Added (100% White Cheese)
- ZERO Cellulose Powder or Anti-Caking Emulsifiers

QUANTITY DELIVERED:
- 150 lbs block cheese .......................... $975.00

LABORATORY MICROBIOLOGY ANALYSIS:
- Moisture Content: 36.4% (Pass)
- Pathogen Screen: Negative (Pass)
- Certified Organic Seal: USDA-OR-0824

-------------------------------------------------------
AUTHORIZED BY: Dairy Master H. Vance
STATUS: Dispatched & Verified
=======================================================`
    },
    flour: {
      title: 'Stone-Ground Unbleached Flour Log',
      meta: 'Sourced from Red Cedar Milling Co., WA • Lot #FL-401',
      rawText: `=======================================================
RED CEDAR MILLING CO. - FLOUR SHIPMENT LOG #FL-401
-------------------------------------------------------
DATE MILLED: June 18, 2026
MILLED FOR: Unassuming Buns Bakery (Partner of Unassuming)
-------------------------------------------------------
INGREDIENTS VERIFICATION:
- 100% Organic Hard Red Winter Wheat
- Stone-Ground, Unbleached, Unbromated
- ZERO Chemical Bleaching Agents (No Benzoyl Peroxide)
- ZERO Synthetic Enrichment Additives

SHIPMENT WEIGHT:
- 500 lbs - Grade A Artisan Flour ............... $625.00

MALTED BARLEY FLOUR CONTENT:
- 0.2% (Natural enzyme booster)

-------------------------------------------------------
MILL MANAGER SIGN-OFF: G. Brooks
STATUS: Delivered Fresh
=======================================================`
    }
  };

  return (
    <div className="bg-zinc-50 py-16 sm:py-20 min-h-screen" id="our-story-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-amber-600 font-mono text-xs uppercase tracking-widest font-black">Our Manifesto</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950">We Don’t Do Gimmicks.</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Fast food has spent decades hiding behind clever marketing, food dyes, and chemical binders. We built Unassuming because we wanted a return to foundational cooking.
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Our Radical Commitments</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black">1</div>
              <h3 className="font-bold text-zinc-900">Absolute Ingredient Disclosure</h3>
              <p className="text-zinc-500 leading-relaxed">
                If an ingredient sounds like a science experiment, we do not use it. Our patties are purely grass-fed beef and sea salt. Our buns contain flour, yeast, water, butter, and real honey.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black">2</div>
              <h3 className="font-bold text-zinc-900">Real Financial Transparency</h3>
              <p className="text-zinc-500 leading-relaxed">
                We think you should know exactly what you are paying for. Below is our active supply chain ledger. We scan and publish our raw receipts so you can verify our organic claims yourself.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black">3</div>
              <h3 className="font-bold text-zinc-900">No Premium Marketing Upsell</h3>
              <p className="text-zinc-500 leading-relaxed">
                We don’t create artificial loyalty tiers or premium gold memberships. We serve high-quality food to everyone, period.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black">4</div>
              <h3 className="font-bold text-zinc-900">Zero High-Fructose Syrups</h3>
              <p className="text-zinc-500 leading-relaxed">
                We partner with independent beverage craft makers who sweeten using real organic cane sugar or natural fruit juices. No corn syrup allowed in our lobbies.
              </p>
            </div>
          </div>
        </div>

        {/* Sourcing Invoice Explorer */}
        <div className="bg-zinc-950 text-zinc-100 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="bg-amber-500 text-zinc-950 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-sm">
              Supply Chain Ledger
            </span>
            <h2 className="text-2xl font-black text-white">Interactive Sourcing Ledgers</h2>
            <p className="text-zinc-400 text-xs font-sans">
              Click the tabs below to inspect our actual supplier invoices and lab reports. Verified organic, verified pasture-raised.
            </p>
          </div>

          {/* Ledger Selector Tabs */}
          <div className="flex gap-2 flex-wrap border-b border-zinc-800 pb-4">
            <button
              onClick={() => setActiveLedger('beef')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider cursor-pointer transition-colors ${
                activeLedger === 'beef' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
              id="ledger-tab-beef"
            >
              Wagyu Beef Invoice
            </button>
            <button
              onClick={() => setActiveLedger('cheese')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider cursor-pointer transition-colors ${
                activeLedger === 'cheese' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
              id="ledger-tab-cheese"
            >
              Cheddar Cheese Log
            </button>
            <button
              onClick={() => setActiveLedger('flour')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider cursor-pointer transition-colors ${
                activeLedger === 'flour' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
              id="ledger-tab-flour"
            >
              Milled Flour Log
            </button>
          </div>

          {/* Ledger Terminal Output */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Viewing: {ledgers[activeLedger].title}</span>
            </div>
            
            <p className="text-[11px] text-zinc-400 font-mono">
              {ledgers[activeLedger].meta}
            </p>

            <pre className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-xl overflow-x-auto text-[10px] sm:text-xs text-amber-400 font-mono leading-relaxed max-h-[350px] overflow-y-auto shadow-inner" id="ledger-raw-pre">
              {ledgers[activeLedger].rawText}
            </pre>
          </div>

          <div className="bg-zinc-900/65 p-4 rounded-xl flex items-center gap-3 border border-zinc-800">
            <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
            <span className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              We update these audits monthly. All receipts are fully cross-referenced against USDA organic certification lists.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
