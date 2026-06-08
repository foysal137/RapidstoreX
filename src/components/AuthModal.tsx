import React, { useState } from 'react';
import { X, User, Mail, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { registerUser, loginUser, UserSession } from '../data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<UserSession | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (isSignUp) {
      // Perform Signup
      const result = registerUser(name, email);
      if (typeof result === 'string') {
        setError(result);
      } else {
        setSuccess(result);
        setName('');
        setEmail('');
        setTimeout(() => {
          if (onSuccess) onSuccess(result);
          onClose();
          setSuccess(null);
        }, 1500);
      }
    } else {
      // Perform Signin
      const result = loginUser(email);
      if (typeof result === 'string') {
        setError(result);
      } else {
        setSuccess(result);
        setEmail('');
        setTimeout(() => {
          if (onSuccess) onSuccess(result);
          onClose();
          setSuccess(null);
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Colorful top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-950 hover:bg-slate-50 dark:bg-slate-900 rounded-full transition-colors active:scale-90"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {success ? (
          <div className="text-center py-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">SUCCESSFULLY AUTHENTICATED</h3>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1.5">Welcome back, {success.name}!</p>
            <p className="text-xs text-gray-400 font-semibold mt-2">Adjusting distribution profile...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3.5 border border-blue-100 shadow-inner">
                {isSignUp ? <Sparkles className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              </div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight uppercase leading-none">
                {isSignUp ? "Create Developer Account" : "Sign In to Catalog"}
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {isSignUp ? "Connect, build, and submit apps step-by-step." : "Access dashboard and sideload secure app updates."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-900 text-xs font-bold rounded-2xl border border-red-100 text-center animate-in shake duration-150">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1.5 ml-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:bg-slate-950 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>
              )}

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

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
              >
                {isSignUp ? "Sign Up & Start" : "Log In Securely"}
              </button>
            </form>

            {/* Switch Tabs Option Footer */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800 text-center">
              <p className="text-xs font-semibold text-gray-500">
                {isSignUp ? "Already have an account?" : "Don't have a developer account yet?"}
              </p>
              <button 
                onClick={() => {
                  setError('');
                  setIsSignUp(!isSignUp);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-black uppercase tracking-wider mt-1 hover:underline"
              >
                {isSignUp ? "Log In Instead" : "Create Account Now"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
