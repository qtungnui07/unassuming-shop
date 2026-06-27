import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, LogIn, UserPlus } from 'lucide-react';
import { api } from '../api';
import { CustomerProfile, ScreenType } from '../types';

interface Props {
  onAuthenticated: (customer: CustomerProfile) => void;
  setScreen: (screen: ScreenType) => void;
}

type Mode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';

export default function AuthView({ onAuthenticated, setScreen }: Props) {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get('reset');
  const verifyToken = params.get('verify');
  const [mode, setMode] = useState<Mode>(verifyToken ? 'verify' : resetToken ? 'reset' : 'login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!verifyToken) return;
    setBusy(true);
    api.post<{ message: string }>('/api/account/verify', { token: verifyToken })
      .then((result) => setMessage(result.message))
      .catch((cause) => setError(cause.message))
      .finally(() => setBusy(false));
  }, [verifyToken]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if ((mode === 'register' || mode === 'reset') && form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        const customer = await api.post<CustomerProfile>('/api/account/login', {
          email: form.email, password: form.password,
        });
        onAuthenticated(customer);
        setScreen('account');
      } else if (mode === 'register') {
        const result = await api.post<{ message: string }>('/api/account/register', form);
        setMessage(result.message);
      } else if (mode === 'forgot') {
        const result = await api.post<{ message: string }>('/api/account/forgot-password', { email: form.email });
        setMessage(result.message);
      } else if (mode === 'reset' && resetToken) {
        const result = await api.post<{ message: string }>('/api/account/reset-password', {
          token: resetToken, password: form.password,
        });
        setMessage(result.message);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to complete that request.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-[70vh] bg-zinc-50 py-16 px-4">
      <div className="max-w-md mx-auto bg-white border border-zinc-100 shadow-sm rounded-3xl p-8">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center mx-auto mb-4">
            {mode === 'register' ? <UserPlus /> : mode === 'verify' ? <CheckCircle2 /> : <KeyRound />}
          </div>
          <h1 className="text-2xl font-black">
            {mode === 'login' && 'Welcome back'}
            {mode === 'register' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
            {mode === 'reset' && 'Choose a new password'}
            {mode === 'verify' && 'Email verification'}
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            {mode === 'register' ? 'Your past orders and Honest Rewards will come with you.' : 'One account, one very honest burger ledger.'}
          </p>
        </div>

        {mode !== 'verify' && <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && <>
            <input required minLength={2} placeholder="Full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />
            <input required placeholder="Phone number" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />
          </>}
          {(mode === 'login' || mode === 'register' || mode === 'forgot') &&
            <input required type="email" placeholder="Email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />}
          {(mode === 'login' || mode === 'register' || mode === 'reset') && <>
            <input required type="password" minLength={mode === 'login' ? 1 : 12} placeholder="Password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />
            {(mode === 'register' || mode === 'reset') &&
              <input required type="password" minLength={12} placeholder="Confirm password"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full border border-zinc-200 rounded-xl p-3 text-sm" />}
          </>}
          <button disabled={busy} className="w-full py-3.5 bg-zinc-950 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50">
            {busy ? 'Working…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Register' : mode === 'forgot' ? 'Send reset link' : 'Reset password'}
          </button>
        </form>}

        {message && <p className="mt-5 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{message}</p>}
        {error && <p className="mt-5 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
        {mode === 'verify' && !busy && <button onClick={() => switchMode('login')} className="w-full mt-5 py-3 bg-zinc-950 text-white rounded-xl text-xs font-black uppercase">Go to sign in</button>}

        <div className="mt-6 text-center text-xs text-zinc-500 space-x-4">
          {mode === 'login' && <>
            <button onClick={() => switchMode('register')} className="hover:text-zinc-950">Create account</button>
            <button onClick={() => switchMode('forgot')} className="hover:text-zinc-950">Forgot password?</button>
          </>}
          {(mode === 'register' || mode === 'forgot' || mode === 'reset') &&
            <button onClick={() => switchMode('login')} className="inline-flex items-center gap-1 hover:text-zinc-950"><LogIn className="w-3 h-3" /> Back to sign in</button>}
        </div>
      </div>
    </div>
  );
}
