import React, { useEffect, useState } from 'react';
import { api } from '../api';

type AdminOrder = {
  orderId: string; customerName: string; status: string; totalCents: number;
  deliveryType: string; createdAt: string;
};
type AdminProduct = { id: string; name: string; priceCents: number; available: boolean };

const nextStatuses: Record<string, string[]> = {
  received: ['preparing', 'cancelled'],
  preparing: ['ready', 'out_for_delivery', 'cancelled'],
  ready: ['fulfilled', 'cancelled'],
  out_for_delivery: ['fulfilled', 'cancelled'],
};

export default function AdminView() {
  const [authenticated, setAuthenticated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    const [nextOrders, nextProducts] = await Promise.all([
      api.get<AdminOrder[]>('/api/admin/orders'),
      api.get<AdminProduct[]>('/api/admin/products'),
    ]);
    setOrders(nextOrders); setProducts(nextProducts); setAuthenticated(true);
  };
  useEffect(() => {
    api.get<{ mustChangePassword: boolean }>('/api/admin/session').then((session) => {
      setAuthenticated(true);
      setMustChangePassword(session.mustChangePassword);
      if (!session.mustChangePassword) void load();
    }).catch(() => {});
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    try {
      const session = await api.post<{ mustChangePassword: boolean }>('/api/admin/login', { email, password });
      setAuthenticated(true);
      setMustChangePassword(session.mustChangePassword);
      if (!session.mustChangePassword) await load();
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Login failed'); }
  };
  const setStatus = async (orderId: string, status: string) => {
    try { await api.patch(`/api/admin/orders/${orderId}/status`, { status }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Update failed'); }
  };
  const toggleProduct = async (product: AdminProduct) => {
    await api.patch(`/api/admin/products/${product.id}`, { available: !product.available });
    await load();
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/api/admin/change-password', { password: newPassword });
      setMustChangePassword(false);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Password change failed'); }
  };

  if (!authenticated) return <main className="min-h-screen bg-zinc-950 grid place-items-center p-4"><form onSubmit={login} className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4">
    <h1 className="text-2xl font-black">Staff sign in</h1>
    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Staff email" className="w-full border rounded-xl p-3" />
    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl p-3" />
    {error && <p className="text-red-600 text-xs">{error}</p>}
    <button className="w-full bg-zinc-950 text-white rounded-xl p-3 font-black text-xs uppercase">Sign in</button>
  </form></main>;

  if (mustChangePassword) return <main className="min-h-screen bg-zinc-950 grid place-items-center p-4"><form onSubmit={changePassword} className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4">
    <h1 className="text-2xl font-black">Choose a new password</h1>
    <p className="text-sm text-zinc-500">Your temporary bootstrap password must be replaced before accessing operations.</p>
    <input type="password" required minLength={12} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 12 characters" className="w-full border rounded-xl p-3" />
    {error && <p className="text-red-600 text-xs">{error}</p>}
    <button className="w-full bg-zinc-950 text-white rounded-xl p-3 font-black text-xs uppercase">Change password</button>
  </form></main>;

  return <main className="min-h-screen bg-zinc-100 p-5 sm:p-10">
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between"><div><p className="text-xs uppercase tracking-widest text-zinc-500">Staff operations</p><h1 className="text-3xl font-black">Unassuming Admin</h1></div><button onClick={() => api.post('/api/admin/logout').then(() => setAuthenticated(false))} className="text-xs font-bold">Sign out</button></header>
      {error && <p className="bg-red-50 text-red-700 p-3 rounded-xl">{error}</p>}
      <section className="bg-white rounded-2xl p-6 overflow-x-auto"><h2 className="font-black mb-4">Order queue</h2><table className="w-full text-sm"><thead><tr className="text-left text-zinc-400"><th className="pb-3">Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Next action</th></tr></thead><tbody>{orders.map((order) => <tr key={order.orderId} className="border-t"><td className="py-4 font-mono">{order.orderId}</td><td>{order.customerName}</td><td>{order.status.replaceAll('_', ' ')}</td><td>${(order.totalCents / 100).toFixed(2)}</td><td className="space-x-2">{(nextStatuses[order.status] ?? []).map((status) => <button key={status} onClick={() => setStatus(order.orderId, status)} className="bg-zinc-100 px-3 py-2 rounded-lg text-xs">{status.replaceAll('_', ' ')}</button>)}</td></tr>)}</tbody></table></section>
      <section className="bg-white rounded-2xl p-6"><h2 className="font-black mb-4">Menu availability</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{products.map((product) => <button key={product.id} onClick={() => toggleProduct(product)} className="border rounded-xl p-4 text-left flex justify-between"><span><strong className="block">{product.name}</strong><small>${(product.priceCents / 100).toFixed(2)}</small></span><span className={product.available ? 'text-emerald-700' : 'text-red-600'}>{product.available ? 'Available' : 'Paused'}</span></button>)}</div></section>
    </div>
  </main>;
}
