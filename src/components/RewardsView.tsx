/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Check, CheckCircle2, Ticket, Sparkles, Mail } from 'lucide-react';

export default function RewardsView() {
  const [stamps, setStamps] = useState(7); // default 7 stamps earned
  const [email, setEmail] = useState('');
  const [linked, setLinked] = useState(false);
  const [claimedCode, setClaimedCode] = useState('');

  const handleLinkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setLinked(true);
    }
  };

  const handleAddStamp = () => {
    if (stamps < 10) {
      setStamps(prev => prev + 1);
    }
  };

  const handleClaimReward = () => {
    const randomCode = 'FREE-UNAS-' + Math.floor(100000 + Math.random() * 900000);
    setClaimedCode(randomCode);
    setStamps(0); // reset
  };

  return (
    <div className="bg-zinc-50 py-12 sm:py-16 min-h-screen" id="rewards-view-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-amber-600 font-mono text-xs uppercase tracking-widest font-black">Honest Loyalty</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Eat Burgers. Get Burgers.</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            We don’t make you calculate points multipliers or check-in on social media. Buy 10 burgers, the 11th is completely on the house. That's real reciprocity.
          </p>
        </div>

        {/* Stamp Card Frame */}
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-amber-500 font-bold tracking-widest">Unassuming Membership Card</p>
              <h2 className="text-2xl font-black tracking-tight">
                {linked ? `${email}'s Ledger` : 'The Honest Stamp Card'}
              </h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shrink-0">
              <Award className="text-amber-500 w-5 h-5" />
              <div>
                <p className="text-[9px] font-mono uppercase text-zinc-500">Stamps Earned</p>
                <p className="text-sm font-black font-mono text-white">{stamps} / 10</p>
              </div>
            </div>
          </div>

          {/* Interactive Stamp Grid */}
          <div className="space-y-6 relative z-10">
            <p className="text-zinc-400 text-xs">
              Each circle below represents a customized burger ordered and savored. Reach 10 to claim your free reward voucher.
            </p>

            {/* Stamp Slots Grid */}
            <div className="grid grid-cols-5 gap-3 sm:gap-4" id="rewards-stamps-grid">
              {Array.from({ length: 10 }).map((_, idx) => {
                const isStamped = idx < stamps;
                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border ${
                      isStamped
                        ? 'bg-amber-500 border-amber-500 text-zinc-950 scale-103 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-600'
                    }`}
                    id={`stamp-slot-${idx}`}
                  >
                    {isStamped ? (
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                        <span className="text-[8px] font-mono font-bold uppercase tracking-widest hidden sm:inline">Saved</span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono font-black text-zinc-700">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 relative z-10">
            {stamps < 10 ? (
              <>
                <p className="text-xs text-zinc-400 font-mono">
                  Need {10 - stamps} more stamps to claim a free double cheeseburger.
                </p>
                <button
                  onClick={handleAddStamp}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider text-amber-500 cursor-pointer transition-colors"
                  id="btn-simulate-stamp"
                >
                  Buy Simulated Burger (+1 Stamp)
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl animate-pulse">
                <div className="space-y-1">
                  <h3 className="text-amber-500 font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Congratulations!
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Your stamp card is fully loaded! Tap below to unlock your free burger voucher code.
                  </p>
                </div>
                <button
                  onClick={handleClaimReward}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-md"
                  id="btn-claim-voucher"
                >
                  Claim My Burger
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Claimed Code Banner */}
        {claimedCode && (
          <div className="bg-emerald-50 border-2 border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-emerald-800 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                Voucher Unlocked!
              </h3>
              <p className="text-zinc-600 text-xs">
                Copy this code and mention it at checkout or insert it in delivery details for a 100% discount.
              </p>
            </div>
            <div className="bg-white border border-emerald-200 px-6 py-3 rounded-xl font-mono font-black text-sm text-emerald-700 select-all tracking-wider shadow-inner">
              {claimedCode}
            </div>
          </div>
        )}

        {/* Sign In & Sync Membership */}
        {!linked ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-zinc-900">Synchronize Membership</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Connect your email address to save your stamps across different browsers. We will never send you unsolicited promotional emails or sell your contact data.
              </p>
            </div>

            <form onSubmit={handleLinkEmail} className="flex flex-col sm:flex-row gap-3" id="rewards-link-form">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Your genuine email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-hidden focus:border-zinc-950 font-sans"
                  id="rewards-email-input"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shrink-0"
                id="rewards-link-btn"
              >
                Sync Stamps
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-zinc-900 font-bold">Ledger successfully synchronized</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Your stamp balances are actively tied to <span className="font-mono text-zinc-800 font-bold">{email}</span>. Thank you for eating honest.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
