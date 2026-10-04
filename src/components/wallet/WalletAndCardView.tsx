import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  Wallet,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Copy,
  Check,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  ExternalLink,
  Sliders,
  DollarSign,
  Zap,
} from 'lucide-react';

export const WalletAndCardView: React.FC = () => {
  const {
    wallets,
    walletTransactions,
    depositToWallet,
    withdrawFromWallet,
    virtualCard,
    cardTransactions,
    topUpCard,
    toggleFreezeCard,
    updateCardLimits,
    formatCurrency,
  } = useCrypto();

  const [activeSubTab, setActiveSubTab] = useState<'wallets' | 'card'>('wallets');
  
  // Deposit Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedDepositSymbol, setSelectedDepositSymbol] = useState('USDT');
  const [depositAmount, setDepositAmount] = useState('1000');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Withdraw Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawSymbol, setWithdrawSymbol] = useState('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('TRC20');
  const [withdrawError, setWithdrawError] = useState('');

  // Card Top-up State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('250');
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Total wallet value in USD
  const totalWalletValue = wallets.reduce((acc, w) => acc + w.valueUsd, 0);

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (amt > 0) {
      depositToWallet(selectedDepositSymbol, amt);
      setDepositModalOpen(false);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError('Please enter a valid amount.');
      return;
    }
    if (!withdrawAddress.trim()) {
      setWithdrawError('Please enter destination wallet address.');
      return;
    }

    const res = withdrawFromWallet(withdrawSymbol, amt, withdrawAddress, withdrawNetwork);
    if (!res.success) {
      setWithdrawError(res.message);
    } else {
      setWithdrawModalOpen(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    }
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (amt > 0) {
      const res = topUpCard(amt);
      if (res.success) {
        setTopUpModalOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-[#0c121d] border border-slate-800 gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Wallet className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Assets & Virtual Mastercard</h1>
            <p className="text-xs text-slate-400">
              Manage multi-chain cryptocurrency wallets, deposit/withdraw sandbox funds, and spend via Virtual Mastercard.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('wallets')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'wallets'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Crypto Wallets</span>
          </button>
          <button
            onClick={() => setActiveSubTab('card')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'card'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Virtual Mastercard</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CRYPTO WALLETS */}
      {activeSubTab === 'wallets' && (
        <div className="space-y-6">
          
          {/* Portfolio Balance Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1624] border border-slate-800 shadow-xl space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Total Wallet Net Worth
              </span>
              <p className="text-3xl font-extrabold text-white font-mono">
                {formatCurrency(totalWalletValue)}
              </p>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Receive / Deposit</span>
                </button>
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Send / Withdraw</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Virtual Mastercard Balance
              </span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                {formatCurrency(virtualCard.balance)}
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Tier: <span className="text-white font-bold">{virtualCard.tier}</span> (Status: {virtualCard.isFrozen ? 'Frozen' : 'Active'})
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Security & Multisig
              </span>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-sm pt-1">
                <ShieldCheck className="w-5 h-5" />
                <span>Simulated Cold Storage Protected</span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                2FA & Biometric authorizations verified on hardware level.
              </p>
            </div>
          </div>

          {/* Wallets Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c121d] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Crypto Asset Balances</h3>
              <span className="text-xs font-mono text-slate-400">{wallets.length} Assets Supported</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4 text-right">Total Balance</th>
                    <th className="py-3 px-4 text-right">Available</th>
                    <th className="py-3 px-4 text-right">Value (USD)</th>
                    <th className="py-3 px-4">Deposit Address</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {wallets.map(w => (
                    <tr key={w.symbol} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center space-x-3">
                          <img src={w.icon} alt={w.name} className="w-7 h-7 rounded-full" />
                          <div>
                            <span className="font-bold text-white block">{w.symbol}</span>
                            <span className="text-[10px] text-slate-400">{w.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {w.balance.toLocaleString()} {w.symbol}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {w.available.toLocaleString()} {w.symbol}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        {formatCurrency(w.valueUsd)}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <span className="font-mono text-[11px] truncate max-w-[140px]">{w.address}</span>
                          <button
                            onClick={() => handleCopyAddress(w.address)}
                            className="p-1 hover:text-white transition cursor-pointer"
                            title="Copy Address"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedDepositSymbol(w.symbol);
                              setDepositModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => {
                              setWithdrawSymbol(w.symbol);
                              setWithdrawModalOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wallet Transaction Ledger */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c121d] p-4 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-3">On-Chain Activity Ledger</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar font-mono text-xs">
              {walletTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center space-x-3 font-sans">
                    <div
                      className={`p-2 rounded-xl ${
                        tx.type === 'deposit' || tx.type === 'admin_mint'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'admin_mint' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs capitalize">
                        {tx.type.replace('_', ' ')}: {tx.amount.toLocaleString()} {tx.symbol}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Tx: {tx.txHash.slice(0, 16)}...
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-white block">
                      ${tx.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      {new Date(tx.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: VIRTUAL MASTERCARD */}
      {activeSubTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive 3D Beget Mastercard (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* The Virtual Card */}
            <div
              className={`relative overflow-hidden rounded-3xl p-7 text-white shadow-2xl transition duration-300 border ${
                virtualCard.isFrozen
                  ? 'bg-slate-800 border-slate-700 opacity-60'
                  : 'bg-gradient-to-tr from-slate-950 via-[#121824] to-slate-900 border-amber-500/30 shadow-amber-500/10'
              }`}
              style={{ minHeight: '260px' }}
            >
              {/* Card Hologram Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-extrabold text-slate-950 text-sm">
                    B
                  </div>
                  <span className="font-extrabold text-lg tracking-wider text-white">BEGET BLACK</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {virtualCard.tier}
                  </span>
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* EMV Chip and Contactless Icon */}
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-300 to-amber-500 border border-amber-200/50 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-700/40 rounded-sm" />
                </div>
                <span className="text-slate-400 text-xs">)))</span>
              </div>

              {/* Card Number */}
              <div className="relative z-10 mb-6">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-100">
                  {showCardDetails ? virtualCard.cardNumber : '•••• •••• •••• 6631'}
                </span>
              </div>

              {/* Bottom Card Row: Cardholder, Expiry, CVV & Mastercard Circles */}
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Cardholder
                  </span>
                  <span className="font-bold text-sm tracking-wide text-white">{virtualCard.cardHolder}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Expires
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {showCardDetails ? `${virtualCard.expiryMonth}/${virtualCard.expiryYear}` : '••/••'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                    CVV
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {showCardDetails ? virtualCard.cvv : '•••'}
                  </span>
                </div>
                
                {/* Mastercard Overlapping Circles */}
                <div className="flex items-center -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/90 shadow-md" />
                  <div className="w-8 h-8 rounded-full bg-amber-400/90 shadow-md" />
                </div>
              </div>
            </div>

            {/* Quick Card Controls */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShowCardDetails(!showCardDetails)}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                {showCardDetails ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                <span>{showCardDetails ? 'Hide Details' : 'Show Details'}</span>
              </button>

              <button
                onClick={toggleFreezeCard}
                className={`flex items-center justify-center space-x-1.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  virtualCard.isFrozen
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                {virtualCard.isFrozen ? <Unlock className="w-4 h-4 text-rose-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
                <span>{virtualCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
              </button>

              <button
                onClick={() => setTopUpModalOpen(true)}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Fund Card</span>
              </button>
            </div>

            {/* Card Spending Limits */}
            <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">Card Security & Spending Limits</h4>
              
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Monthly Spending:</span>
                  <span className="text-white font-bold">${virtualCard.spentThisMonth.toLocaleString()} / ${virtualCard.monthlyLimit.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.min((virtualCard.spentThisMonth / virtualCard.monthlyLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-white">Online E-Commerce Payments</p>
                  <span className="text-[10px] text-slate-400">Amazon, Apple, Google Pay</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  Enabled
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Card Transactions (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">Recent Card Merchant Purchases</h3>
                <span className="text-xs font-mono text-slate-400">Direct USD settlement</span>
              </div>

              <div className="space-y-3">
                {cardTransactions.map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                        {tx.merchant.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{tx.merchant}</h4>
                        <span className="text-[10px] text-slate-400">{tx.category} • {new Date(tx.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-bold text-rose-400 text-xs block">
                        -${tx.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-sans">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* DEPOSIT MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Receive / Deposit Crypto</h3>
              <button onClick={() => setDepositModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Asset</label>
                <select
                  value={selectedDepositSymbol}
                  onChange={e => setSelectedDepositSymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  {wallets.map(w => (
                    <option key={w.symbol} value={w.symbol}>
                      {w.name} ({w.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* QR Code Simulation */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-slate-950 mx-auto max-w-[180px] shadow-lg">
                <QrCode className="w-32 h-32" />
                <span className="text-[10px] font-mono mt-1 font-bold text-slate-700">BEGET DEPOSIT QR</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Deposit Address</label>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="truncate pr-2">
                    {wallets.find(w => w.symbol === selectedDepositSymbol)?.address}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyAddress(wallets.find(w => w.symbol === selectedDepositSymbol)?.address || '')
                    }
                    className="p-1 hover:text-emerald-400 cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Simulate Credit Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Confirm Simulated Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Send / Withdraw Crypto</h3>
              <button onClick={() => setWithdrawModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Asset</label>
                <select
                  value={withdrawSymbol}
                  onChange={e => setWithdrawSymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  {wallets.map(w => (
                    <option key={w.symbol} value={w.symbol}>
                      {w.name} ({w.symbol}) - Bal: {w.available}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Destination Address</label>
                <input
                  type="text"
                  placeholder="Paste external wallet address..."
                  value={withdrawAddress}
                  onChange={e => setWithdrawAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Network</label>
                  <select
                    value={withdrawNetwork}
                    onChange={e => setWithdrawNetwork(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="TRC20">TRC20 (Tron)</option>
                    <option value="ERC20">ERC20 (Ethereum)</option>
                    <option value="Arbitrum">Arbitrum One</option>
                    <option value="Solana">Solana Network</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                    required
                  />
                </div>
              </div>

              {withdrawError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {withdrawError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Broadcast Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOP-UP CARD MODAL */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Fund Virtual Mastercard</h3>
              <button onClick={() => setTopUpModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-3">
              <p className="text-xs text-slate-300">
                Instantly transfer funds from your Tether (USDT) wallet to your Beget Virtual Mastercard at 1:1 USD parity.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Amount to Fund ($ USD)</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-sm font-mono text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[100, 250, 500, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val.toString())}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    ${val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Confirm Card Top-Up
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
