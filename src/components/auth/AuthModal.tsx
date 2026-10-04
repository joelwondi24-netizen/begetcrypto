import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Globe,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    userProfile,
  } = useCrypto();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickDemoFill = () => {
    setEmail('trader@beget.com');
    setPassword('DemoTrader2026!');
    setName('Alex Vance');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        loginUser(email, name || undefined);
        setIsSubmitting(false);
        setIsAuthModalOpen(false);
      }, 500);
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required credentials.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please agree to the Terms of Service.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        registerUser(name, email, country);
        setIsSubmitting(false);
        setIsAuthModalOpen(false);
      }, 500);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email above to receive a reset link.');
      return;
    }
    setForgotPasswordSent(true);
    setTimeout(() => setForgotPasswordSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1420] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm">
              B
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {authModalMode === 'login' ? 'Sign In to Beget' : 'Create Free Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {authModalMode === 'login'
                  ? 'Access live trading, AI insights & your demo wallet'
                  : 'Start with $100,000 USD virtual demo margin'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switch Mode Tab */}
        <div className="p-2 bg-slate-900/60 border-b border-slate-800 grid grid-cols-2 gap-1 relative z-10">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In / Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 relative z-10 space-y-4">
          
          {/* Quick Demo Credentials shortcut */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <span className="text-slate-400">Quick Test Credentials:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
            >
              Fill Demo Trader
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Full Name for Registration */}
            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Satoshi Nakamoto"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                  required
                />
              </div>
            </div>

            {/* Country Selector for Registration */}
            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Country / Region
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition"
                  >
                    <option value="United States">United States</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Kenya">Kenya</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password for Register */}
            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    required
                  />
                </div>
              </div>
            )}

            {/* Experience Level for Registration */}
            {authModalMode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Trading Experience
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold capitalize text-center transition cursor-pointer ${
                        experienceLevel === lvl
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            {authModalMode === 'register' && (
              <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
                />
                <span>I agree to Beget Paper Trading Terms & Disclaimers</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Forgot password confirmation message */}
            {forgotPasswordSent && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Password reset instructions dispatched to your email!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center space-x-1.5 mt-2"
            >
              <Zap className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : authModalMode === 'login'
                  ? 'Sign In to Account'
                  : 'Complete Registration ($100k Bonus)'}
              </span>
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginUser('google.user@gmail.com', 'Google Trader');
                setIsAuthModalOpen(false);
              }}
              className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginUser('apple.user@icloud.com', 'Apple Trader');
                setIsAuthModalOpen(false);
              }}
              className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <span>Apple ID</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
