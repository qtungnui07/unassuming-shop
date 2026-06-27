/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType } from '../types';
import { api } from '../api';

interface FooterProps {
  setScreen: (screen: ScreenType) => void;
}

export default function Footer({ setScreen }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim()) {
      try {
        await api.post('/api/newsletter', { email });
        setSubscribed(true);
        setEmail('');
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Unable to subscribe.');
      }
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight text-white">UNASSUMING.</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We cut the gimmicks, the synthetic ingredients, and the marketing fluff. Just premium, transparently sourced ingredients cooked to order.
            </p>
            <p className="text-zinc-500 text-xs font-mono">
              © {new Date().getFullYear()} Unassuming Inc.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black tracking-widest uppercase mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => setScreen('menu')} className="hover:text-white transition-colors cursor-pointer text-left" id="footer-link-menu">
                  Our Honest Menu
                </button>
              </li>
              <li>
                <button onClick={() => setScreen('our-story')} className="hover:text-white transition-colors cursor-pointer text-left" id="footer-link-story">
                  The Pure Ingredients
                </button>
              </li>
              <li>
                <button onClick={() => setScreen('locations')} className="hover:text-white transition-colors cursor-pointer text-left" id="footer-link-locations">
                  Store Locator & Hours
                </button>
              </li>
              <li>
                <button onClick={() => setScreen('rewards')} className="hover:text-white transition-colors cursor-pointer text-left" id="footer-link-rewards">
                  Honest Rewards
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Transparency */}
          <div>
            <h4 className="text-white text-xs font-black tracking-widest uppercase mb-4">Our Integrity</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>100% Grass-Fed Wagyu</li>
              <li>Triple-Cooked Side Fries</li>
              <li>No Trans-Fats or Artificial Dyes</li>
              <li>Sustainable Compostable Wrap</li>
            </ul>
          </div>

          {/* Column 4: Honest updates */}
          <div>
            <h4 className="text-white text-xs font-black tracking-widest uppercase mb-4">No-Spam Letter</h4>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              Sign up for honest updates. No filler, no daily spam. Only menu releases or rare promotions.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2" id="footer-newsletter-form">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your genuine email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-hidden focus:border-zinc-700 font-sans"
                  id="footer-email-input"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs px-4 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  id="footer-newsletter-btn"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-amber-500 text-xs font-mono animate-pulse">
                  Subscribed! Welcome to real transparency.
                </p>
              )}
              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs font-mono">
            ALLERGY WARNING: Our fries are cooked in pure peanut oil. We share our ingredients freely.
          </p>
          <div className="flex space-x-6 text-xs text-zinc-600">
            <a href="#privacy" className="hover:text-zinc-500">Privacy Policy</a>
            <a href="#terms" className="hover:text-zinc-500">Terms of Honesty</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
