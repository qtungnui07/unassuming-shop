/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChefHat, Truck, CheckCircle2, Clock, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

interface OrderTrackingViewProps {
  orderDetails: {
    orderId: string;
    customerName: string;
    deliveryType: 'delivery' | 'pickup';
    items: any[];
    address: string;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    estimatedMinutes: number;
  };
  setScreen: (screen: ScreenType) => void;
  resetAppletState: () => void;
}

export default function OrderTrackingView({ orderDetails, setScreen, resetAppletState }: OrderTrackingViewProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3
  const [secondsRemaining, setSecondsRemaining] = useState(orderDetails.estimatedMinutes * 60);

  // Advance steps simulation
  useEffect(() => {
    const stepTimers = [
      setTimeout(() => setCurrentStep(1), 5000),   // 5s: Preparing
      setTimeout(() => setCurrentStep(2), 15000),  // 15s: Out for delivery/Ready
      setTimeout(() => setCurrentStep(3), 30000)   // 30s: Delivered/Ready in Cubby
    ];

    // Countdown clock timer
    const countdown = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(countdown);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const steps = orderDetails.deliveryType === 'delivery'
    ? [
        { label: 'Order Received', desc: 'Sourcing details validated' },
        { label: 'Preparing', desc: 'Hand-smashing grass-fed Wagyu' },
        { label: 'Out for Delivery', desc: 'Courier en route to address' },
        { label: 'Arrived Safely', desc: 'Handed off with integrity' }
      ]
    : [
        { label: 'Order Confirmed', desc: 'Kitchen prep queued' },
        { label: 'Grilling', desc: 'Cooking to Medium Well perfection' },
        { label: 'Assembling', desc: 'Buns toasted, toppings checked' },
        { label: 'Ready in Cubby', desc: 'Pick up in Cubby #4' }
      ];

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return <Receipt className="w-5 h-5" />;
      case 1: return <ChefHat className="w-5 h-5" />;
      case 2: return <Truck className="w-5 h-5" />;
      default: return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-zinc-50 py-12 min-h-screen" id="order-tracking-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-500 text-zinc-950 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-sm">
              Live Cooking Tracker
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order {orderDetails.orderId}
            </h1>
            <p className="text-zinc-400 text-xs font-mono">
              Thank you, {orderDetails.customerName}. Preparing with absolute honesty.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-2xl flex items-center gap-4 shrink-0">
            <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-black">Estimated Remaining</p>
              <p className="text-2xl font-black font-mono text-white">
                {secondsRemaining > 0 ? formatTime(secondsRemaining) : "Arrived"}
              </p>
            </div>
          </div>
        </div>

        {/* Live Map / Cubby View */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">
                Delivery / Pickup Point
              </h3>
              <p className="text-zinc-900 font-bold mt-1 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                {orderDetails.address}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-700 px-3 py-1 rounded-md">
              {orderDetails.deliveryType === 'delivery' ? 'Courier Dispatch' : 'Lobby Pick Up'}
            </span>
          </div>

          {/* Interactive Step Timeline */}
          <div className="pt-6 border-t border-zinc-50 relative">
            
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-[52px] left-8 right-8 h-1 bg-zinc-100 -z-0">
              <div
                className="h-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                const isPending = idx > currentStep;

                return (
                  <div key={idx} className="flex md:flex-col items-center md:items-center text-center gap-4 md:gap-3" id={`timeline-step-${idx}`}>
                    
                    {/* Circle Icon Indicator */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                        : isActive
                        ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-100 border-2 border-amber-500 font-black scale-105'
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                    }`}>
                      {getStepIcon(idx)}
                    </div>

                    {/* Step descriptions */}
                    <div className="text-left md:text-center">
                      <h4 className={`text-xs font-black uppercase tracking-wider ${
                        isActive ? 'text-zinc-950 font-black' : isCompleted ? 'text-zinc-700' : 'text-zinc-400'
                      }`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-normal mt-0.5 max-w-[150px] mx-auto">
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Receipt Breakdown */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-zinc-400">
            Invoice Verification Block
          </h3>
          <div className="divide-y divide-zinc-50">
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-3.5 text-xs text-zinc-700">
                <div>
                  <span className="font-bold">{item.menuItem.name}</span>
                  <span className="text-zinc-400 text-[10px] font-mono ml-2">Qty: {item.quantity}</span>
                  {item.customizations.extras.length > 0 && (
                    <span className="text-amber-600 block text-[10px]">+ {item.customizations.extras.join(', ')}</span>
                  )}
                </div>
                <span className="font-mono text-zinc-900">${(item.priceAtAddition * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 pt-4 flex justify-between items-center text-xs font-bold text-zinc-900">
            <span>Total Paid Bill</span>
            <span className="font-mono text-sm">${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              resetAppletState();
              setScreen('home');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-800 hover:text-zinc-950 cursor-pointer transition-colors"
            id="btn-return-home"
          >
            Start a New Order
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
