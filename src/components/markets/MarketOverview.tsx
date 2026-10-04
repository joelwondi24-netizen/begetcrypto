import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { CryptoAsset, CryptoCategory } from '../../types/crypto';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  Bell,
  Play,
  Layers,
  Cpu,
  Coins,
  ShieldCheck,
  Flame,
  BarChart2,
  Sliders,
} from 'lucide-react';

interface MarketOverviewProps {
  onOpenAlertForAsset: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onOpenAlertForAsset }) => {
  const { assets, setSelectedAsset, setActiveTab, formatCurrency, paperBalance } = useCrypto();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CryptoCategory>('All');
  const [sortField, setSortField] = useState<'rank' | 'price' | 'change24h' | 'volume24h' | 'marketCap'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories: { label: CryptoCategory; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Trending', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Top Gainers', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Top Losers', icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> },
    { label: 'Layer 1', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { label: 'DeFi', icon: <Coins className="w-3.5 h-3.5 text-purple-400" /> },
    { label: 'AI', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Meme', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" /> },
    { label: 'Stablecoins', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  // Filtering & Sorting
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ? true : asset.category.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'rank') return (a.rank - b.rank) * modifier;
      if (sortField === 'price') return (a.price - b.price) * modifier;
      if (sortField === 'change24h') return (a.change24h - b.change24h) * modifier;
      if (sortField === 'volume24h') return (a.volume24h - b.volume24h) * modifier;
      if (sortField === 'marketCap') return (a.marketCap - b.marketCap) * modifier;
      return 0;
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const btc = assets.find(a => a.symbol === 'BTC') || assets[0];
  const eth = assets.find(a => a.symbol === 'ETH') || assets[1];

  return (
    <div className="space-y-8 pb-16">
      
      {/* SECTION 3: HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c121e] to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Generation AI Crypto Intelligence</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Trade Smarter. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Understand Crypto Better.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              AI-powered cryptocurrency research, real-time interactive terminal charts, paper trading simulator with $100k demo funds, virtual Mastercard, and P2P exchange in one intelligent platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedAsset(btc);
                  setActiveTab('trade');
                }}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Free Paper Trading</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Try AI Analyst</span>
              </button>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-md">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Virtual Capital</span>
                <span className="text-base font-extrabold text-white font-mono">{formatCurrency(paperBalance)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Market Sentiment</span>
                <span className="text-base font-extrabold text-emerald-400 flex items-center">
                  Greed (74)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Execution Latency</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">14ms</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visualization: Live BTC & ETH Cards */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* BTC Card */}
            <div
              onClick={() => {
                setSelectedAsset(btc);
                setActiveTab('trade');
              }}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img src={btc.icon} alt={btc.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                      {btc.name} <span className="text-xs text-slate-400">({btc.symbol})</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Rank #{btc.rank}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-base font-bold text-white">{formatCurrency(btc.price)}</p>
                  <span className={`text-xs font-mono font-semibold ${btc.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {btc.change24h >= 0 ? '+' : ''}{btc.change24h}%
                  </span>
                </div>
              </div>
              
              {/* Mini Sparkline Visualization */}
              <div className="flex items-end h-8 gap-1 pt-1 opacity-80 group-hover:opacity-100 transition">
                {btc.sparkline.map((val, idx) => {
                  const min = Math.min(...btc.sparkline);
                  const max = Math.max(...btc.sparkline);
                  const pct = Math.max(((val - min) / (max - min || 1)) * 100, 15);
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-emerald-500/60 rounded-t group-hover:bg-emerald-400 transition"
                      style={{ height: `${pct}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* ETH Card */}
            <div
              onClick={() => {
                setSelectedAsset(eth);
                setActiveTab('trade');
              }}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img src={eth.icon} alt={eth.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition">
                      {eth.name} <span className="text-xs text-slate-400">({eth.symbol})</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Rank #{eth.rank}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-base font-bold text-white">{formatCurrency(eth.price)}</p>
                  <span className={`text-xs font-mono font-semibold ${eth.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {eth.change24h >= 0 ? '+' : ''}{eth.change24h}%
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Visualization */}
              <div className="flex items-end h-8 gap-1 pt-1 opacity-80 group-hover:opacity-100 transition">
                {eth.sparkline.map((val, idx) => {
                  const min = Math.min(...eth.sparkline);
                  const max = Math.max(...eth.sparkline);
                  const pct = Math.max(((val - min) / (max - min || 1)) * 100, 15);
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-cyan-500/60 rounded-t group-hover:bg-cyan-400 transition"
                      style={{ height: `${pct}%` }}
                    />
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: CRYPTO MARKET DIRECTORY & PRICE ALERT SYSTEM */}
      <section className="space-y-4">
        
        {/* Controls: Category tabs, Search & Alert Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.label
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coin or symbol (e.g. BTC)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>

        </div>

        {/* Assets Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c121d] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th
                    onClick={() => handleSort('rank')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                  >
                    #
                  </th>
                  <th className="py-3.5 px-4">Asset</th>
                  <th
                    onClick={() => handleSort('price')}
                    className="py-3.5 px-4 text-right cursor-pointer hover:text-white"
                  >
                    Price
                  </th>
                  <th
                    onClick={() => handleSort('change24h')}
                    className="py-3.5 px-4 text-right cursor-pointer hover:text-white"
                  >
                    24h Change
                  </th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">24h High / Low</th>
                  <th
                    onClick={() => handleSort('volume24h')}
                    className="py-3.5 px-4 text-right hidden md:table-cell cursor-pointer hover:text-white"
                  >
                    24h Volume
                  </th>
                  <th
                    onClick={() => handleSort('marketCap')}
                    className="py-3.5 px-4 text-right hidden lg:table-cell cursor-pointer hover:text-white"
                  >
                    Market Cap
                  </th>
                  <th className="py-3.5 px-4 text-center hidden xl:table-cell">Last 7D</th>
                  <th className="py-3.5 px-4 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No cryptocurrency matched "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map(asset => {
                    const isPositive = asset.change24h >= 0;
                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-slate-800/40 transition group"
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 font-mono text-slate-500">{asset.rank}</td>

                        {/* Name & Symbol */}
                        <td className="py-4 px-4">
                          <div
                            onClick={() => {
                              setSelectedAsset(asset);
                              setActiveTab('trade');
                            }}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <img src={asset.icon} alt={asset.name} className="w-7 h-7 rounded-full" />
                            <div>
                              <p className="font-bold text-white group-hover:text-emerald-400 transition">
                                {asset.name}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400">{asset.symbol}</span>
                            </div>
                          </div>
                        </td>

                        {/* Current Price */}
                        <td className="py-4 px-4 text-right font-mono font-bold text-white">
                          {formatCurrency(asset.price)}
                        </td>

                        {/* 24h Change */}
                        <td className="py-4 px-4 text-right font-mono">
                          <span
                            className={`inline-flex items-center font-bold px-2 py-0.5 rounded ${
                              isPositive
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {isPositive ? '+' : ''}{asset.change24h}%
                          </span>
                        </td>

                        {/* 24h High / Low */}
                        <td className="py-4 px-4 text-right font-mono text-[11px] text-slate-300 hidden sm:table-cell">
                          <div>H: {formatCurrency(asset.high24h)}</div>
                          <div className="text-slate-500">L: {formatCurrency(asset.low24h)}</div>
                        </td>

                        {/* 24h Volume */}
                        <td className="py-4 px-4 text-right font-mono text-slate-300 hidden md:table-cell">
                          {formatCurrency(asset.volume24h)}
                        </td>

                        {/* Market Cap */}
                        <td className="py-4 px-4 text-right font-mono text-slate-300 hidden lg:table-cell">
                          {formatCurrency(asset.marketCap)}
                        </td>

                        {/* Mini Sparkline */}
                        <td className="py-4 px-4 hidden xl:table-cell">
                          <div className="flex items-end h-7 w-24 mx-auto gap-0.5">
                            {asset.sparkline.map((v, i) => {
                              const min = Math.min(...asset.sparkline);
                              const max = Math.max(...asset.sparkline);
                              const heightPct = Math.max(((v - min) / (max - min || 1)) * 100, 15);
                              return (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-t ${
                                    isPositive ? 'bg-emerald-500/50' : 'bg-rose-500/50'
                                  }`}
                                  style={{ height: `${heightPct}%` }}
                                />
                              );
                            })}
                          </div>
                        </td>

                        {/* Quick Actions: Trade & Set Price Alert */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Trade Button */}
                            <button
                              onClick={() => {
                                setSelectedAsset(asset);
                                setActiveTab('trade');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                              title={`Trade ${asset.symbol} on Terminal`}
                            >
                              <span>Trade</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>

                            {/* Price Alert Button */}
                            <button
                              onClick={() => onOpenAlertForAsset(asset.symbol)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                              title={`Set target price alert for ${asset.symbol}`}
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>

                            {/* AI Analysis Quick Link */}
                            <button
                              onClick={() => {
                                setSelectedAsset(asset);
                                setActiveTab('ai');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 transition cursor-pointer"
                              title={`Analyze ${asset.symbol} with AI`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  );
};
