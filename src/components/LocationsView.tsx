/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { LOCATIONS } from '../data';
import { LocationData } from '../types';

export default function LocationsView() {
  const [activeLocation, setActiveLocation] = useState<LocationData>(LOCATIONS[0]);

  return (
    <div className="bg-zinc-50 py-12 sm:py-16 min-h-screen" id="locations-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-amber-600 font-mono text-xs uppercase tracking-widest font-black">Find Us</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Where We Flip</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Come visit our kitchen. We practice open-kitchen architecture: you can stand right at the counter and watch us smash your wagyu patties.
          </p>
        </div>

        {/* Master Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Stores Sidebar list */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
              Select Location
            </h3>

            <div className="space-y-3" id="locations-sidebar-list">
              {LOCATIONS.map((loc) => {
                const isActive = activeLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isActive
                        ? 'bg-white border-amber-400 ring-2 ring-amber-100 shadow-sm'
                        : 'bg-white border-zinc-100 hover:border-zinc-300'
                    }`}
                    id={`locations-btn-${loc.id}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                          loc.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {loc.statusLabel}
                        </span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                      </div>
                      
                      <h4 className="text-lg font-black text-zinc-900">{loc.name}</h4>
                      <p className="text-xs text-zinc-500 flex items-center gap-1.5 leading-normal">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {loc.address}
                      </p>
                    </div>

                    <div className="border-t border-zinc-50 pt-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {loc.hours}
                      </span>
                      {loc.status === 'open' && (
                        <span className="text-amber-600 font-bold hover:underline inline-flex items-center gap-0.5">
                          Order Here
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Responsive Interactive Map Frame */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-zinc-100 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Map Canvas Frame */}
            <div className="relative aspect-video rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200 shadow-inner group">
              <img
                src={activeLocation.mapImage}
                alt={`Map background pointing to ${activeLocation.name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
                id="location-map-canvas"
              />
              
              {/* Overlay Marker */}
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <div className="bg-zinc-950 text-white px-4 py-2.5 rounded-xl border border-zinc-800 shadow-2xl flex items-center gap-2 animate-bounce">
                  <MapPin className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black uppercase tracking-wider">{activeLocation.name}</span>
                </div>
              </div>
            </div>

            {/* Selected Location Details */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-50 pb-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-900">{activeLocation.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{activeLocation.address}</p>
                </div>
                {activeLocation.status === 'open' && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 h-11 border border-zinc-200 hover:border-zinc-900 text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:bg-zinc-50 cursor-pointer"
                    id="btn-get-directions"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions
                  </a>
                )}
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-600">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Lobby & Kitchen Hours</p>
                  <p className="text-xs leading-relaxed">
                    Mon - Thu: 11:00 AM - 10:00 PM<br />
                    Fri - Sun: 11:00 AM - Midnight
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Contact Hotline</p>
                  <p className="text-xs leading-relaxed flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    +1 (213) 555-0199
                  </p>
                </div>
              </div>

              {/* Sourcing/Delivery guarantee block */}
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck className="text-amber-600 w-5 h-5 shrink-0" />
                <span className="text-xs text-amber-950 font-medium">
                  We prepare everything from scratch at this location. No microwave, no freezer. Real raw ingredients delivered fresh every morning.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
