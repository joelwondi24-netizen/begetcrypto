import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  BookOpen,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const EducationCenterView: React.FC = () => {
  const { setActiveTab } = useCrypto();
  const [selectedArticle, setSelectedArticle] = useState<number | null>(0);

  const modules = [
    {
      id: 1,
      title: 'Crypto Fundamentals: Bitcoin & Blockchain Architecture',
      category: 'Beginner',
      readTime: '4 min',
      content: `### What is Bitcoin?
Bitcoin (BTC) was created in 2008 by an anonymous programmer or group using the pseudonym Satoshi Nakamoto. It introduced the world’s first decentralized, cryptographically secured digital cash system.

### How Blockchain Works:
A blockchain is a decentralized distributed ledger made up of blocks linked by cryptographic hashes:
1. **Transactions are broadcast:** When Alice sends BTC to Bob, the transaction is announced to peer-to-peer nodes.
2. **Proof-of-Work Mining:** Miners aggregate transactions into candidate blocks and solve mathematical hash puzzles.
3. **Immutability:** Once verified, a block cannot be altered without rewriting all subsequent blocks, providing tamper-evident security.`,
    },
    {
      id: 2,
      title: 'Technical Analysis Masterclass: Candlesticks & Oscillators',
      category: 'Intermediate',
      readTime: '6 min',
      content: `### Mastering the Candlestick
Every Japanese candlestick reveals the psychological tug-of-war between bulls (buyers) and bears (sellers) across four key prices: Open, High, Low, and Close.

### The Role of Moving Averages (EMA 20 & SMA 50):
* When price is trading **above** the 20 EMA, short-term buyers control momentum.
* A **Golden Cross** occurs when a short-term moving average (e.g. 50-day) crosses above a long-term moving average (e.g. 200-day), signaling potential macro upside.
* A **Death Cross** indicates the opposite: potential prolonged downtrend.`,
    },
    {
      id: 3,
      title: 'Essential Security: Identifying Phishing & Protecting Private Keys',
      category: 'Security',
      readTime: '5 min',
      content: `### The Golden Rules of Crypto Security
1. **Never Share Your Seed Phrase:** Legitimate exchanges, wallets, and support staff will NEVER ask for your 12- or 24-word recovery phrase or private keys.
2. **Beware of Fake Giveaways:** Anyone claiming "Send 1 BTC and get 2 BTC back" is running a fraudulent scheme. Cryptocurrency transactions are irreversible.
3. **Enable Hardware 2FA:** Prefer hardware security keys (YubiKey) or Authenticator apps over SMS-based two-factor authentication to prevent SIM-swap attacks.`,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Beget Trading Academy</h1>
            <p className="text-xs text-slate-400">
              Master blockchain fundamentals, algorithmic indicators, and anti-scam defense.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('rewards')}
          className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Earn Quiz XP</span>
        </button>
      </div>

      {/* Main Grid: Articles List & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setSelectedArticle(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                selectedArticle === idx
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg'
                  : 'bg-[#0c121d] border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {m.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{m.readTime}</span>
              </div>
              <h3 className="font-bold text-sm text-white leading-snug">{m.title}</h3>
            </button>
          ))}

          {/* Scam Protection Alert Box */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2 mt-4">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>Anti-Scam Warning</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never send funds to anyone promising guaranteed daily returns. Beget paper trading is strictly simulated and does not solicit financial investments.
            </p>
          </div>
        </div>

        {/* Reader Display (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-4">
          {selectedArticle !== null && (
            <>
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {modules[selectedArticle].category} Module
                  </span>
                  <h2 className="text-lg font-extrabold text-white mt-0.5">
                    {modules[selectedArticle].title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('trade')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                >
                  Practice in Demo
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed space-y-2">
                {modules[selectedArticle].content}
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
