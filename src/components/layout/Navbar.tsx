import React, { useState } from 'react';
import { useCrypto, MainNavTab } from '../../context/CryptoContext';
import {
  TrendingUp,
  BarChart3,
  Bot,
  Wallet,
  ArrowLeftRight,
  Gift,
  BookOpen,
  ShieldAlert,
  Bell,
  Mail,
  SlidersHorizontal,
  ChevronDown,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  onOpenAlertModal: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAlertModal, onOpenNotifications }) => {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    formatCurrency,
    paperBalance,
    resetPaperBalance,
    userProfile,
    setUserRole,
    notifications,
    emails,
    setIsAuthModalOpen,
    setAuthModalMode,
    logoutUser,
  } = useCrypto();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const unreadAlertsCount = notifications.filter(n => n.type === 'alert' || n.type === 'broadcast').length;
  const unreadEmailsCount = emails.filter(e => !e.isRead).length;

  const navItems: { id: MainNavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'markets', label: 'Markets', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'trade', label: 'Trade', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Analyst', icon: <Bot className="w-4 h-4" />, badge: 'AI' },
    { id: 'wallet', label: 'Wallet & Card', icon: <Wallet className="w-4 h-4" /> },
    { id: 'p2p', label: 'P2P Express', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards', icon: <Gift className="w-4 h-4" />, badge: `${userProfile.streakDays}d` },
    { id: 'education', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <SlidersHorizontal className="w-4 h-4" />, badge: 'Vault' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d14]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab('markets')}
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <span className="font-extrabold text-white text-lg tracking-tighter">B</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition">
                  BEGET
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Terminal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                AI Crypto Trading Platform
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer relative ${
                    isActive
                      ? 'bg-slate-800/80 text-white font-semibold shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.id === 'ai'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                          : item.id === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Paper Trading Mode Badge & Quick Reset */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 pr-2 space-x-2">
            <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider">PAPER SIMULATOR</span>
            </div>
            <div className="font-mono text-xs font-semibold text-slate-200">
              {formatCurrency(paperBalance)}
            </div>
            <button
              onClick={resetPaperBalance}
              title="Reset Virtual Demo Balance to $100,000"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Price Alert Trigger */}
          <button
            onClick={onOpenAlertModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition cursor-pointer"
            title="Create Target Price Alert"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Alert</span>
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
                {(['USD', 'EUR', 'GBP', 'ETB'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      currency === c ? 'text-emerald-400 font-bold bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    <span>{c}</span>
                    {c === 'USD' && <span className="text-[10px] text-slate-500">$ (US Dollar)</span>}
                    {c === 'EUR' && <span className="text-[10px] text-slate-500">€ (Euro)</span>}
                    {c === 'GBP' && <span className="text-[10px] text-slate-500">£ (Pound)</span>}
                    {c === 'ETB' && <span className="text-[10px] text-slate-500">Br (Birr)</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            title="Notification Center & Broadcasts"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {/* Email Messages Center */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            title="Email Messages Inbox"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            {unreadEmailsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
                {unreadEmailsCount}
              </span>
            )}
          </button>

          {/* User Auth: Login / Register OR Profile Menu */}
          {!userProfile.isAuthenticated ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition cursor-pointer"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full border border-emerald-400/50 object-cover"
                />
                <div className="hidden xl:block text-left text-xs leading-none">
                  <p className="font-semibold text-white">{userProfile.name}</p>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    {userProfile.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div>
                      <p className="font-bold text-sm text-white">{userProfile.name}</p>
                      <p className="text-xs text-slate-400">{userProfile.email}</p>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>KYC {userProfile.kycStatus}</span>
                        </span>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1 rounded">
                          Lvl {userProfile.level} ({userProfile.xp} XP)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Switcher (For testing Admin vs Trader workflows) */}
                  <div className="py-2.5 border-b border-slate-800">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Switch Test Role:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['super_admin', 'user', 'analyst', 'support'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            setUserRole(role);
                            setProfileDropdownOpen(false);
                          }}
                          className={`px-2 py-1 rounded text-xs font-semibold capitalize text-center transition cursor-pointer ${
                            userProfile.role === role
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('wallet');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Wallet & Virtual Card</span>
                      <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-xs font-medium text-amber-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>USDT Treasury & Admin</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Switch Account</span>
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-500/10 text-xs font-medium text-rose-400 flex items-center justify-between cursor-pointer"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
