import React, { useEffect, useState } from 'react';
import { Award, LogOut, Package } from 'lucide-react';
import { api } from '../api';
import { CustomerOrderSummary, CustomerProfile } from '../types';

interface Props {
  customer: CustomerProfile;
  onCustomerChange: (customer: CustomerProfile) => void;
  onLogout: () => void;
}

export default function AccountView({ customer, onCustomerChange, onLogout }: Props) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<CustomerOrderSummary[]>('/api/account/orders').then(setOrders).catch(() => {});
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updated = await api.patch<CustomerProfile>('/api/account/profile', { name, phone });
      onCustomerChange(updated);
      setMessage('Profile updated.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-start justify-between">
          <div><p className="text-xs font-mono uppercase tracking-widest text-amber-600">Your account</p><h1 className="text-3xl font-black mt-1">Hello, {customer.name}</h1></div>
          <button onClick={onLogout} className="flex items-center gap-2 border border-zinc-200 bg-white rounded-xl px-4 py-2 text-xs font-bold"><LogOut className="w-4 h-4" /> Sign out</button>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={save} className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
            <h2 className="font-black">Profile</h2>
            <input disabled value={customer.email} className="w-full bg-zinc-100 text-zinc-500 rounded-xl p-3 text-sm" />
            <input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />
            <button className="bg-zinc-950 text-white rounded-xl px-5 py-3 text-xs font-black uppercase">Save profile</button>
            {message && <p className="text-xs text-zinc-600">{message}</p>}
          </form>
          <section className="bg-zinc-950 text-white rounded-2xl p-6">
            <Award className="text-amber-500 mb-5" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Honest Rewards</p>
            <p className="text-4xl font-black mt-2">{customer.burgerProgress} <span className="text-lg text-zinc-500">/ 10 burgers</span></p>
            <p className="text-sm mt-5 text-zinc-300">Available free-burger credits: <strong className="text-amber-500">{customer.rewardCredits}</strong></p>
          </section>
        </div>

        <section className="bg-white border border-zinc-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5"><Package className="w-5 h-5" /><h2 className="font-black">Order history</h2></div>
          {!orders.length && <p className="text-sm text-zinc-500">No orders yet. That sounds fixable.</p>}
          <div className="divide-y divide-zinc-100">
            {orders.map((order) => <article key={order.orderId} className="py-5 first:pt-0">
              <div className="flex justify-between gap-4">
                <div><strong>{order.orderId}</strong><p className="text-xs text-zinc-500 mt-1">{new Date(order.createdAt).toLocaleString()} · {order.deliveryType}</p></div>
                <div className="text-right"><span className="text-xs uppercase font-bold text-amber-700">{order.status.replaceAll('_', ' ')}</span><p className="font-mono font-bold mt-1">${(order.totalCents / 100).toFixed(2)}</p></div>
              </div>
              <p className="text-xs text-zinc-500 mt-3">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')}</p>
            </article>)}
          </div>
        </section>
      </div>
    </div>
  );
}
