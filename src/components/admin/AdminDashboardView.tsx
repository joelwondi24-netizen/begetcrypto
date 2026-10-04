import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  SlidersHorizontal,
  Coins,
  ShieldCheck,
  Users,
  BarChart3,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  Activity,
  Lock,
  Mail,
  Megaphone,
  Send,
  Radio,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    adminTreasury,
    mintUsdt,
    userProfile,
    updateUserKyc,
    setUserRole,
    formatCurrency,
    broadcastNotificationToAllUsers,
    broadcastEmailToAllUsers,
    sendEmailMessage,
  } = useCrypto();

  // USDT Generator Form State
  const [mintAmount, setMintAmount] = useState<string>('50000');
  const [mintDestination, setMintDestination] = useState<'admin_vault' | 'user_wallet' | 'liquidity_pool'>('user_wallet');
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [copiedTx, setCopiedTx] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Broadcast & Email Message Form State
  const [broadcastTitle, setBroadcastTitle] = useState('Market Volatility Alert: High Volume Observed');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Spot Bitcoin ETF net inflows topped $1.42B over the past 24 hours. Volatility is elevated across all Layer 1 pairs. Please monitor open positions and adjust stop-loss risk parameters in the Trading Terminal.'
  );
  const [broadcastChannel, setBroadcastChannel] = useState<'both' | 'notification' | 'email'>('both');
  const [broadcastCategory, setBroadcastCategory] = useState<'alert' | 'announcement' | 'security' | 'treasury'>('alert');
  const [targetAudience, setTargetAudience] = useState<'all' | 'verified' | 'custom'>('all');
  const [customEmail, setCustomEmail] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'bcast-h1',
      title: 'Platform Maintenance & Node Upgrade Completed',
      channel: 'Both (In-App + Email)',
      recipients: 'All Users (14,285)',
      time: '2 hours ago',
      status: 'Delivered',
    },
    {
      id: 'bcast-h2',
      title: 'USDT Liquidity Faucet Refilled for Traders',
      channel: 'In-App Notification',
      recipients: 'All Users (14,285)',
      time: 'Yesterday',
      status: 'Delivered',
    },
  ]);

  // Feature Flags State
  const [flags, setFlags] = useState({
    enablePaperTrading: true,
    enableRealTrading: false,
    enableAiAnalyst: true,
    enableP2pMarket: true,
    enableVirtualCard: true,
    enableWithdrawals: true,
  });

  // Mock Managed Users for KYC Review
  const [managedUsers, setManagedUsers] = useState([
    { id: 'u1', name: 'Joel Wondi', email: 'joelwondi24@gmail.com', role: 'super_admin', kyc: 'verified', country: 'United States' },
    { id: 'u2', name: 'Abebe Bikila', email: 'abebe.b@example.com', role: 'user', kyc: 'pending', country: 'Ethiopia' },
    { id: 'u3', name: 'Elena Rostova', email: 'elena.r@fintech.io', role: 'analyst', kyc: 'verified', country: 'Germany' },
    { id: 'u4', name: 'Marcus Sterling', email: 'marcus.s@cryptohedge.com', role: 'user', kyc: 'unverified', country: 'United Kingdom' },
  ]);

  const handleMintUsdtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(mintAmount);
    if (amt <= 0) return;

    setIsMinting(true);
    setTimeout(() => {
      const result = mintUsdt(amt, mintDestination);
      setLastTxHash(result.txHash);
      setIsMinting(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handleToggleKyc = (userId: string, newStatus: 'verified' | 'rejected') => {
    setManagedUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, kyc: newStatus } : u))
    );
    if (userId === 'u1') {
      updateUserKyc(newStatus);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsBroadcasting(true);

    setTimeout(() => {
      if (targetAudience === 'custom') {
        const recipient = customEmail.trim() || userProfile.email;
        sendEmailMessage(recipient, broadcastTitle, broadcastMessage, broadcastCategory);
        setBroadcastSuccess(`Direct email message delivered to ${recipient}!`);
      } else {
        if (broadcastChannel === 'both') {
          broadcastNotificationToAllUsers(broadcastTitle, broadcastMessage, 'broadcast', true);
        } else if (broadcastChannel === 'notification') {
          broadcastNotificationToAllUsers(broadcastTitle, broadcastMessage, 'broadcast', false);
        } else {
          broadcastEmailToAllUsers(broadcastTitle, broadcastMessage, broadcastCategory);
        }
        setBroadcastSuccess(
          `Broadcast successfully dispatched to ${targetAudience === 'all' ? 'All Users (14,285)' : 'Verified Traders'}!`
        );
      }

      setBroadcastHistory(prev => [
        {
          id: `bcast-${Date.now()}`,
          title: broadcastTitle,
          channel:
            broadcastChannel === 'both'
              ? 'Both (In-App + Email)'
              : broadcastChannel === 'notification'
              ? 'In-App Notification'
              : 'Email Message',
          recipients:
            targetAudience === 'custom'
              ? customEmail || userProfile.email
              : targetAudience === 'all'
              ? 'All Users (14,285)'
              : 'Verified Traders',
          time: 'Just now',
          status: 'Delivered',
        },
        ...prev.slice(0, 9),
      ]);

      setIsBroadcasting(false);
      setTimeout(() => setBroadcastSuccess(''), 6000);
    }, 500);
  };

  const applyPreset = (preset: { title: string; message: string; category: typeof broadcastCategory }) => {
    setBroadcastTitle(preset.title);
    setBroadcastMessage(preset.message);
    setBroadcastCategory(preset.category);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/40 gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <SlidersHorizontal className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Admin Command & Treasury Console</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Super Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              All User Alert Broadcasts, Email Message Dispatcher, USDT Treasury Generator, and KYC Audits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-semibold text-emerald-400">Node v2.4 Live (Broadcast Active)</span>
        </div>
      </div>

      {/* SECTION 1: ALL USER NOTIFICATION & EMAIL BROADCAST CENTER */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-amber-500/40 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 shadow-md">
              <Megaphone className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base sm:text-lg">
                All User Alert & Email Broadcast Dispatcher
              </h2>
              <p className="text-xs text-slate-400">
                Send push notification messages and email alerts directly to all registered users or custom recipients.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Channel Gateway</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dispatch Form (7 cols) */}
          <form onSubmit={handleSendBroadcast} className="lg:col-span-7 space-y-4">
            
            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Quick Message Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      title: '⚡ Market Volatility Alert: High Bitcoin Inflow',
                      message:
                        'Spot Bitcoin ETF net inflows topped $1.42B over the past 24 hours. Altcoin volatility is spiking across Layer 1 tokens. Review positions and adjust stop-loss orders in the terminal.',
                      category: 'alert',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
                >
                  ⚡ High Volatility Alert
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      title: '🔒 Security Advisory: Two-Factor Verification Check',
                      message:
                        'To safeguard your simulated and custodial funds, please verify your 2FA Authenticator settings and review your active session devices in the Security Center.',
                      category: 'security',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer"
                >
                  🔒 2FA Security Notice
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      title: '💰 USDT Treasury Faucet Airdrop Credited',
                      message:
                        'Admin treasury has injected additional paper USDT liquidity into all active trading accounts. Enjoy zero-slippage demo testing across all pairs!',
                      category: 'treasury',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
                >
                  💰 USDT Airdrop Notice
                </button>
              </div>
            </div>

            {/* Channels & Target Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Delivery Channel:
                </label>
                <select
                  value={broadcastChannel}
                  onChange={e => setBroadcastChannel(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="both">Multi-Channel (In-App Alert + Email Message)</option>
                  <option value="notification">In-App Notification Alert Only</option>
                  <option value="email">Email Message Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Recipient Audience:
                </label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">📢 All Users (14,285 registered)</option>
                  <option value="verified">✅ Verified KYC Traders Only</option>
                  <option value="custom">✉️ Specific User Email</option>
                </select>
              </div>
            </div>

            {targetAudience === 'custom' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Recipient Email Address:
                </label>
                <input
                  type="email"
                  placeholder="e.g. joelwondi24@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none transition"
                  required
                />
              </div>
            )}

            {/* Subject / Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notification Title / Email Subject:
              </label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none transition"
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notification Message & Email Body:
              </label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none transition leading-relaxed"
                required
              />
            </div>

            {/* Success Feedback Banner */}
            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            {/* Submit Broadcast Button */}
            <button
              type="submit"
              disabled={isBroadcasting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className={`w-4 h-4 ${isBroadcasting ? 'animate-spin' : ''}`} />
              <span>
                {isBroadcasting
                  ? 'Transmitting Broadcast Alert...'
                  : broadcastChannel === 'both'
                  ? 'Send All User Alert + Email Message'
                  : broadcastChannel === 'notification'
                  ? 'Broadcast In-App Alert to All Users'
                  : 'Dispatch Email Message to Users'}
              </span>
            </button>
          </form>

          {/* Broadcast History & Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Recent Broadcasts & Email Logs</span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </h4>

              <div className="space-y-2.5">
                {broadcastHistory.map(b => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-[#090d14] border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs truncate max-w-[200px]">{b.title}</h5>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Channel: {b.channel}</span>
                      <span>{b.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Target: <span className="text-slate-300 font-mono">{b.recipients}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Broadcast Engine Safeguards</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All broadcast alert notifications and emails are queued with rate limiting to prevent spam and ensure 100% inbox deliverability across client web applets.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: USDT GENERATOR & TREASURY FAUCET (Requested Feature) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Generator Form (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c121d] border border-amber-500/30 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">USDT Generator & Wallet Relocation</h3>
                <p className="text-xs text-slate-400">
                  Generate synthetic USDT liquidity and move directly to User Wallet or Admin Vault.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ERC20 / TRC20 Faucet
            </span>
          </div>

          <form onSubmit={handleMintUsdtSubmit} className="space-y-4">
            
            {/* Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Amount to Mint (USDT)
                </label>
                <div className="flex space-x-1">
                  {['10000', '50000', '100000', '500000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMintAmount(val)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      +{parseInt(val).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                value={mintAmount}
                onChange={e => setMintAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-white focus:outline-none transition"
                required
              />
            </div>

            {/* Destination Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Allocation Destination
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMintDestination('user_wallet')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    mintDestination === 'user_wallet'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">Move to User Wallet</span>
                  <span className="text-[10px] text-slate-400">Instantly funds active user</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMintDestination('admin_vault')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    mintDestination === 'admin_vault'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">Admin Vault</span>
                  <span className="text-[10px] text-slate-400">Cold reserve storage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMintDestination('liquidity_pool')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    mintDestination === 'liquidity_pool'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">Liquidity Pool</span>
                  <span className="text-[10px] text-slate-400">P2P and Order Book</span>
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isMinting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Zap className={`w-4 h-4 ${isMinting ? 'animate-spin' : ''}`} />
              <span>{isMinting ? 'Minting On-Chain Tokens...' : `Generate & Transfer ${parseFloat(mintAmount || '0').toLocaleString()} USDT`}</span>
            </button>
          </form>

          {/* Mint Result Tx Hash */}
          {lastTxHash && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simulated Mint Broadcast Confirmed:</span>
              </span>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate pr-2">{lastTxHash}</span>
                <button
                  onClick={() => handleCopy(lastTxHash)}
                  className="p-1 hover:text-white transition cursor-pointer"
                  title="Copy TxHash"
                >
                  {copiedTx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Treasury Stats Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Treasury Reserve Balances
            </h4>
            
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Admin Reserve Vault</span>
              <p className="text-2xl font-extrabold text-amber-400 font-mono">
                {adminTreasury.vaultBalanceUsdt.toLocaleString()} USDT
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Secured by Multi-Sig Protocol</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Platform Liquidity Pool</span>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono">
                {adminTreasury.liquidityPoolUsdt.toLocaleString()} USDT
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Active in P2P & Paper Engine</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Total Cumulative Minted</span>
              <p className="text-xl font-bold text-white font-mono">
                {adminTreasury.totalMintedUsdt.toLocaleString()} USDT
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: USER MANAGEMENT & KYC APPROVALS */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c121d] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm">User Identity & KYC Compliance Review</h3>
            <p className="text-xs text-slate-400">Audit user profiles and approve or reject KYC verification status.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{managedUsers.length} Registered Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">KYC Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {managedUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-sans font-bold text-white">{u.name}</td>
                  <td className="py-3 px-3 text-slate-300">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{u.country}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                        u.kyc === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : u.kyc === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.kyc}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleToggleKyc(u.id, 'verified')}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleToggleKyc(u.id, 'rejected')}
                        className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: FEATURE FLAGS TOGGLE */}
      <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm">System Feature Flags & Safety Gates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'enablePaperTrading', label: 'Paper / Demo Simulator', active: flags.enablePaperTrading },
            { key: 'enableAiAnalyst', label: 'Gemini AI Analyst Engine', active: flags.enableAiAnalyst },
            { key: 'enableP2pMarket', label: 'P2P Escrow Marketplace', active: flags.enableP2pMarket },
            { key: 'enableVirtualCard', label: 'Virtual Mastercard Integration', active: flags.enableVirtualCard },
            { key: 'enableWithdrawals', label: 'Simulated Wallet Withdrawals', active: flags.enableWithdrawals },
            { key: 'enableRealTrading', label: 'Regulated Live Exchange Gateway', active: flags.enableRealTrading, isRisk: true },
          ].map(item => (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{item.label}</span>
                {item.isRisk && (
                  <span className="text-[10px] text-amber-400">Requires Broker-Dealer License</span>
                )}
              </div>
              <button
                onClick={() => {
                  setFlags(prev => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }));
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  flags[item.key as keyof typeof flags] ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    flags[item.key as keyof typeof flags] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
