import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Receipt } from 'lucide-react';
import { api } from '../api';
import { OrderDetails, ScreenType } from '../types';

interface Props {
  orderDetails: OrderDetails;
  setScreen: (screen: ScreenType) => void;
  resetAppletState: () => void;
}

const statusLabels: Record<string, string> = {
  received: 'Order received',
  preparing: 'Preparing',
  ready: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

export default function OrderTrackingView({ orderDetails, setScreen, resetAppletState }: Props) {
  const [order, setOrder] = useState(orderDetails);
  const [refreshError, setRefreshError] = useState('');

  useEffect(() => {
    if (!orderDetails.trackingToken) return;
    const refresh = () => api.get<OrderDetails>(
      `/api/orders/track/${encodeURIComponent(orderDetails.trackingToken)}`,
    ).then((next) => {
      setOrder({ ...next, trackingToken: orderDetails.trackingToken });
      setRefreshError('');
    }).catch(() => setRefreshError('Live status is temporarily unavailable.'));
    refresh();
    const timer = window.setInterval(refresh, 10_000);
    return () => window.clearInterval(timer);
  }, [orderDetails.trackingToken]);

  const startAnother = () => {
    resetAppletState();
    window.history.replaceState({}, '', '/');
    setScreen('menu');
  };

  return (
    <div className="bg-zinc-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-700">Order {order.orderId}</p>
            <h1 className="text-3xl font-black mt-2">Thanks, {order.customerName}.</h1>
            <p className="text-zinc-500 mt-2">We’ll keep this page current as your order moves.</p>
          </div>
          <div className="bg-zinc-950 text-white rounded-2xl px-6 py-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">Current status</p>
            <p className="font-black mt-1">{statusLabels[order.status] ?? order.status}</p>
          </div>
        </header>

        {refreshError && <p className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs">{refreshError}</p>}

        <section className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8 grid sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <div><p className="text-[10px] uppercase font-bold text-zinc-400">Handoff</p><p className="text-sm mt-1">{order.address}</p></div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div><p className="text-[10px] uppercase font-bold text-zinc-400">Estimate</p><p className="text-sm mt-1">About {order.estimatedMinutes} minutes</p></div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
            <div><p className="text-[10px] uppercase font-bold text-zinc-400">Payment</p><p className="text-sm mt-1">{order.paymentPreference} on handoff</p></div>
          </div>
        </section>

        <section className="bg-white border border-zinc-100 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5"><Receipt className="w-5 h-5" /><h2 className="font-black">Order receipt</h2></div>
          <div className="divide-y divide-zinc-100">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="py-3 flex justify-between text-sm">
                <span>{item.quantity} × {item.name}</span>
                <span className="font-mono">${(item.lineTotalCents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-200 pt-4 mt-3 flex justify-between font-black">
            <span>Total</span><span>${(order.totalCents / 100).toFixed(2)}</span>
          </div>
          {order.discountCents > 0 && <p className="text-emerald-700 text-xs mt-2">Honest Reward saved ${(order.discountCents / 100).toFixed(2)}.</p>}
        </section>

        <button onClick={startAnother} className="px-6 py-3 bg-zinc-950 text-white rounded-xl text-xs font-black uppercase tracking-wider">
          Start another order
        </button>
      </div>
    </div>
  );
}
