import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  ShieldAlert,
  Lock,
  Key,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

export const AdminLoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminSession, loginAdmin, logoutAdmin, userProfile } = useCrypto();

  const [adminEmail, setAdminEmail] = useState('admin@beget.com');
  const [securityKey, setSecurityKey] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // If already authenticated as admin, render children with top Security Session Bar!
  if (adminSession.isAuthenticated) {
    return (
      <div className="space-y-4">
        {/* Active Security Session Banner */}
        <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-amber-300 uppercase tracking-wider">
              Admin Session Active
            </span>
            <span className="text-slate-400 hidden sm:inline font-mono">
              ({adminSession.adminEmail} • Session Token: {adminSession.sessionToken})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin Console</span>
            </button>
          </div>
        </div>

        {children}
      </div>
    );
  }

  // Not authenticated: Display High-Security Admin Login Gate
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      const res = loginAdmin(adminEmail, securityKey, twoFactorToken);
      if (!res.success) {
        setErrorMsg(res.message);
      }
      setIsVerifying(false);
    }, 600);
  };

  const handleQuickDemoAdminFill = () => {
    setAdminEmail('admin@beget.com');
    setSecurityKey('MasterAdminKey2026!');
    setTwoFactorToken('842910');
  };

  return (
    <div className="min-h-[560px] flex items-center justify-center p-4">
      <div className="bg-[#0c121d] border border-amber-500/40 rounded-3xl w-full max-w-lg p-7 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Amber Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
            <Lock className="w-7 h-7 text-slate-950 font-black" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Restricted Admin Clearance
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Super Administrator authorization required to access Treasury Minting, Global User Broadcasts, and KYC controls.
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs relative z-10">
          <span className="text-slate-400">Testing credentials:</span>
          <button
            type="button"
            onClick={handleQuickDemoAdminFill}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Auto-fill Admin Passkey
          </button>
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLoginSubmit} className="space-y-4 relative z-10">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Admin Email / ID
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Master Security Key / Password
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Enter admin passkey..."
                value={securityKey}
                onChange={e => setSecurityKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-3.5 pr-9 py-2 text-xs font-mono text-white focus:outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              2FA Authenticator Token (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 6-digit TOTP code"
              value={twoFactorToken}
              onChange={e => setTwoFactorToken(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none transition"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <Zap className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Cryptographic Credentials...' : 'Authenticate & Unlock Admin Console'}</span>
          </button>
        </form>

        {/* Security Info */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono relative z-10">
          SHA-256 Encrypted Session • Audit Log Tracking Active
        </div>

      </div>
    </div>
  );
};
