import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { loginUser, getCurrentUser } from '../data';
import { TopBar } from '../components/Shared';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to profile immediately
  React.useEffect(() => {
    if (getCurrentUser()) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const result = loginUser(email, password);
    if (typeof result === 'string') {
      setError(result);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white dark:bg-slate-950 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 overflow-hidden relative">
          {/* Top color brand accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          {success ? (
            <div className="text-center py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-gray-950 tracking-tight">Login Successful!</h3>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1.5">SUCCESSFULLY AUTHENTICATED</p>
              <p className="text-xs text-gray-400 font-semibold mt-2">Redirecting, please wait...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {/* Header */}
              <div className="mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3.5 border border-blue-100 shadow-inner">
                  <LogIn className="w-5 h-5" />
                </div>
                <h2 className="text-[22px] font-black text-gray-950 tracking-tight uppercase leading-none">
                  Log In
                </h2>
                <p className="text-xs text-gray-400 font-semibold mt-2.5 leading-relaxed">
                  Log in using your registered email and password.
                </p>
              </div>

              {/* Error Segment */}
              {error && (
                <div className="mb-4 p-3.5 bg-rose-50 text-rose-900 text-xs font-bold rounded-2xl border border-rose-100 text-center animate-in shake duration-150 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 ml-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="email"
                      placeholder="e.g. developer@market.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 ml-1">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
                >
                  Log In
                </button>
              </form>

              {/* Redirect option switcher footer */}
              <div className="mt-6 pt-5 border-t border-gray-150 text-center">
                <p className="text-xs font-semibold text-gray-500">
                  Don't have an account?
                </p>
                <Link 
                  to="/signup"
                  className="text-xs text-blue-600 hover:text-blue-700 font-black uppercase tracking-wider mt-1.5 inline-block hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
