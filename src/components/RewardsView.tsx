import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Mail } from 'lucide-react';
import { api } from '../api';

export default function RewardsView() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<{ burgerProgress: number; rewardCredits: number } | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('rewards');
    if (token) api.get<typeof progress>(`/api/rewards/${encodeURIComponent(token)}`)
      .then(setProgress).catch((cause) => setError(cause.message));
  }, []);

  const requestAccess = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const result = await api.post<{ message: string }>('/api/rewards/access-link', { email });
      setMessage(result.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to request access.');
    }
  };

  const stamps = progress?.burgerProgress ?? 0;
  return (
    <div className="bg-zinc-50 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        <header className="text-center max-w-2xl mx-auto">
          <p className="text-amber-600 font-mono text-xs uppercase tracking-widest font-black">Honest Loyalty</p>
          <h1 className="text-4xl font-black mt-3">Eat Burgers. Get Burgers.</h1>
          <p className="text-zinc-500 text-sm mt-4">Every ten fulfilled burgers earns one automatic checkout credit. Extras remain transparently priced.</p>
        </header>
        <section className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 space-y-7">
          <div className="flex items-center justify-between">
            <div><p className="text-[10px] uppercase text-amber-500 tracking-widest">Honest Stamp Card</p><h2 className="text-2xl font-black mt-1">Your burger ledger</h2></div>
            <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl"><Award className="text-amber-500" /><strong>{stamps} / 10</strong></div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className={`aspect-square rounded-2xl grid place-items-center border ${index < stamps ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-800 text-zinc-700'}`}>
                {index < stamps ? <CheckCircle2 /> : index + 1}
              </div>
            ))}
          </div>
          {progress && <p className="text-sm text-zinc-300">Available free-burger credits: <strong className="text-amber-500">{progress.rewardCredits}</strong></p>}
        </section>
        {!progress && <form onSubmit={requestAccess} className="bg-white border border-zinc-100 rounded-2xl p-8 space-y-4">
          <h3 className="font-black text-lg">View your rewards</h3>
          <p className="text-zinc-500 text-sm">Enter the same email used at checkout. We’ll send a private access link if it has an order history.</p>
          <div className="flex gap-3">
            <div className="relative flex-1"><Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-zinc-200 rounded-xl pl-10 p-3 text-sm" placeholder="you@example.com" /></div>
            <button className="bg-zinc-950 text-white px-6 rounded-xl text-xs font-black uppercase">Email link</button>
          </div>
          {message && <p className="text-emerald-700 text-xs">{message}</p>}
          {error && <p className="text-red-600 text-xs">{error}</p>}
        </form>}
      </div>
    </div>
  );
}
