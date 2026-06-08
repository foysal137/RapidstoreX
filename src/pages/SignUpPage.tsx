import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Calendar, Phone, Sparkles, CheckCircle2, LayoutGrid } from 'lucide-react';
import { registerUser, getCurrentUser } from '../data';
import { TopBar } from '../components/Shared';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (getCurrentUser()) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verification check for each required field
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Valid email address is required.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (!dob) {
      setError('Date of Birth is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    const result = registerUser(name, email, password, username, dob, phone);
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

      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-sm bg-white dark:bg-slate-950 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 overflow-hidden relative my-6">
          {/* Top border brand color gradient banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          {success ? (
            <div className="text-center py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-gray-950 tracking-tight">Account Created!</h3>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1.5">ACCOUNT COMPLETED SUCCESSFULLY</p>
              <p className="text-xs text-gray-400 font-semibold mt-2">Redirecting to user dashboard...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {/* Header section */}
              <div className="mb-5">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 border border-blue-105 shadow-inner">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h2 className="text-[21px] font-black text-gray-950 tracking-tight uppercase leading-none">
                  Register
                </h2>
                <p className="text-xs text-gray-400 font-semibold mt-2.5 leading-relaxed">
                  Provide accurate information to keep your developer license active.
                </p>
              </div>

              {/* Error Box */}
              {error && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-900 text-xs font-bold rounded-2xl border border-rose-100 text-center animate-in shake duration-150 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full name input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Full Name *</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Username input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Username *</label>
                  <div className="relative flex items-center">
                    <LayoutGrid className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="e.g. john_doe"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email Address input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Email *</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="email"
                      placeholder="e.g. key@studio.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Password *</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="password"
                      placeholder="Minimum 4 characters"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Birth Date input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Date of Birth *</label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="date"
                      required
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Phone Number input */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Phone Number *</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel"
                      placeholder="e.g. +88017XXXXXXXX"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* submit */}
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </form>

              {/* Redirect link button to login */}
              <div className="mt-6 pt-4 border-t border-gray-150 text-center">
                <p className="text-xs font-semibold text-gray-500">
                  Already have an account?
                </p>
                <Link 
                  to="/login"
                  className="text-xs text-blue-600 hover:text-blue-700 font-black uppercase tracking-wider mt-1.5 inline-block hover:underline"
                >
                  Log In Instead
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
