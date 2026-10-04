import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { OrderSide, OrderType } from '../../types/crypto';
import { CandleChart } from './CandleChart';
import { OrderBookView } from './OrderBook';
import { RecentTrades } from './RecentTrades';
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Search,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  CheckCircle,
  X,
  Sliders,
} from 'lucide-react';

export const TradingTerminal: React.FC = () => {
  const {
    assets,
    selectedAsset,
    setSelectedAsset,
    timeframe,
    setTimeframe,
    candles,
    orderBook,
    trades,
    paperBalance,
    positions,
    orders,
    tradeHistory,
    placeOrder,
    closePosition,
    cancelOrder,
    resetPaperBalance,
    formatCurrency,
    setActiveTab,
  } = useCrypto();

  // Order Ticket State
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [limitPrice, setLimitPrice] = useState<number>(selectedAsset.price);
  const [amount, setAmount] = useState<number>(selectedAsset.price > 1000 ? 0.25 : 5);
  const [leverage, setLeverage] = useState<number>(5);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [orderError, setOrderError] = useState<string>('');
  const [activeBottomTab, setActiveBottomTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const [assetSearch, setAssetSearch] = useState<string>('');

  const currentPrice = selectedAsset.price;
  const executionPrice = orderType === 'market' ? currentPrice : limitPrice;
  const orderTotal = executionPrice * amount;
  const requiredMargin = orderTotal / leverage;
  const estimatedFee = orderTotal * 0.0005;

  // Liquidation Price estimate
  const liqFactor = 0.9 / leverage;
  const estLiquidation =
    side === 'buy'
      ? Math.max(executionPrice * (1 - liqFactor), 0)
      : executionPrice * (1 + liqFactor);

  const handlePercentageClick = (pct: number) => {
    const maxMargin = paperBalance * 0.95; // leave buffer for fee
    const maxTotal = maxMargin * leverage;
    const calculatedAmount = maxTotal / (executionPrice || 1);
    const target = Number((calculatedAmount * (pct / 100)).toFixed(selectedAsset.price < 1 ? 2 : 4));
    setAmount(Math.max(target, 0.0001));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (amount <= 0) {
      setOrderError('Please enter a valid amount.');
      return;
    }

    const res = placeOrder({
      symbol: selectedAsset.symbol,
      side,
      type: orderType,
      price: executionPrice,
      amount,
      leverage,
      tp: takeProfit ? parseFloat(takeProfit) : undefined,
      sl: stopLoss ? parseFloat(stopLoss) : undefined,
    });

    if (!res.success) {
      setOrderError(res.message);
    }
  };

  const filteredCoins = assets.filter(
    a =>
      a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.symbol.toLowerCase().includes(assetSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-16">
      
      {/* Disclaimer Banner for Paper Trading */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider">
            Simulated Trading Environment
          </span>
          <span className="text-slate-400 hidden md:inline">
            — Real-time market data with $100,000 virtual USD. Risk-free paper execution.
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-slate-400">Available Margin:</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(paperBalance)}</span>
          </div>
          <button
            onClick={resetPaperBalance}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Asset Selector, Center Chart + Tabs, Right Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Asset Quick Switcher (2 cols on large) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Markets</h3>
              <span className="text-[10px] text-slate-400 font-mono">{assets.length} Pairs</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={assetSearch}
                onChange={e => setAssetSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Coins List */}
            <div className="space-y-1 overflow-y-auto no-scrollbar flex-1">
              {filteredCoins.map(coin => {
                const isSelected = coin.id === selectedAsset.id;
                const isPos = coin.change24h >= 0;
                return (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedAsset(coin);
                      setLimitPrice(coin.price);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img src={coin.icon} alt={coin.name} className="w-5 h-5 rounded-full" />
                      <div>
                        <span className="font-bold text-xs block">{coin.symbol}</span>
                        <span className="text-[10px] text-slate-400">{coin.name}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-semibold block">{formatCurrency(coin.price)}</span>
                      <span className={`text-[10px] font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}{coin.change24h}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick AI Analysis Banner */}
            <div className="pt-2 border-t border-slate-800/80 mt-2">
              <button
                onClick={() => setActiveTab('ai')}
                className="w-full py-2 px-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Insight for {selectedAsset.symbol}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Top Ticker Info + Interactive Chart + Bottom Tabbed Management (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Active Asset Info Header */}
          <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img src={selectedAsset.icon} alt={selectedAsset.name} className="w-9 h-9 rounded-full" />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-extrabold text-base text-white">{selectedAsset.symbol}/USDT</h2>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    Perpetual
                  </span>
                </div>
                <span className="text-xs text-slate-400">{selectedAsset.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Mark Price</span>
                <span className="text-base font-extrabold text-white">
                  {formatCurrency(selectedAsset.price)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">24h Change</span>
                <span className={`font-bold ${selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] text-slate-400 block uppercase">24h High</span>
                <span className="text-slate-200">{formatCurrency(selectedAsset.high24h)}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] text-slate-400 block uppercase">24h Low</span>
                <span className="text-slate-200">{formatCurrency(selectedAsset.low24h)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <CandleChart
            candles={candles}
            symbol={selectedAsset.symbol}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            currentPrice={selectedAsset.price}
          />

          {/* Bottom Tabs: Positions, Orders, Trade History */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center border-b border-slate-800 bg-slate-900/60 px-3">
              <button
                onClick={() => setActiveBottomTab('positions')}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  activeBottomTab === 'positions'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Open Positions ({positions.length})
              </button>
              <button
                onClick={() => setActiveBottomTab('orders')}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  activeBottomTab === 'orders'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Open Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveBottomTab('history')}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  activeBottomTab === 'history'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Trade History ({tradeHistory.length})
              </button>
            </div>

            <div className="p-3 overflow-x-auto min-h-[160px] text-xs">
              
              {/* POSITIONS TAB */}
              {activeBottomTab === 'positions' && (
                positions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <p>No open positions. Use the order panel on the right to open a long or short trade.</p>
                  </div>
                ) : (
                  <table className="w-full text-left font-mono">
                    <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800/80 pb-2">
                      <tr>
                        <th className="py-2">Contract</th>
                        <th className="py-2">Side</th>
                        <th className="py-2">Size</th>
                        <th className="py-2">Entry Price</th>
                        <th className="py-2">Mark Price</th>
                        <th className="py-2">Est. Liq</th>
                        <th className="py-2">Margin</th>
                        <th className="py-2">PnL (ROE)</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {positions.map(pos => {
                        const isProfit = pos.pnl >= 0;
                        return (
                          <tr key={pos.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 font-bold text-white">{pos.symbol}/USDT</td>
                            <td className="py-2.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  pos.side === 'long'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {pos.side} {pos.leverage}x
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-200">{pos.amount}</td>
                            <td className="py-2.5 text-slate-300">${pos.entryPrice.toLocaleString()}</td>
                            <td className="py-2.5 text-white font-bold">${pos.currentPrice.toLocaleString()}</td>
                            <td className="py-2.5 text-amber-400">${pos.liquidationPrice.toLocaleString()}</td>
                            <td className="py-2.5 text-slate-300">${pos.margin.toLocaleString()}</td>
                            <td className={`py-2.5 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isProfit ? '+' : ''}${pos.pnl.toLocaleString()} ({pos.pnlPercentage}%)
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => closePosition(pos.id)}
                                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold cursor-pointer transition"
                              >
                                Market Close
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )
              )}

              {/* ORDERS TAB */}
              {activeBottomTab === 'orders' && (
                orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <p>No active limit orders.</p>
                  </div>
                ) : (
                  <table className="w-full text-left font-mono">
                    <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800 pb-2">
                      <tr>
                        <th className="py-2">Time</th>
                        <th className="py-2">Pair</th>
                        <th className="py-2">Side</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Order Price</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2 text-right">Cancel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {orders.map(ord => (
                        <tr key={ord.id}>
                          <td className="py-2 text-slate-500 text-[11px]">{new Date(ord.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2 text-white font-bold">{ord.symbol}</td>
                          <td className={`py-2 uppercase font-bold ${ord.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ord.side}
                          </td>
                          <td className="py-2 uppercase text-slate-400 text-[11px]">{ord.type}</td>
                          <td className="py-2 text-white font-bold">${ord.price.toLocaleString()}</td>
                          <td className="py-2 text-slate-200">{ord.amount}</td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => cancelOrder(ord.id)}
                              className="text-rose-400 hover:text-rose-300 text-xs underline cursor-pointer"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {/* TRADE HISTORY TAB */}
              {activeBottomTab === 'history' && (
                tradeHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <p>No executed demo trades in session.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar font-mono">
                    {tradeHistory.map(th => (
                      <div key={th.id} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${th.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {th.side.toUpperCase()}
                          </span>
                          <span className="text-white">{th.amount} {th.symbol}</span>
                          <span className="text-slate-400">@ ${th.price.toLocaleString()}</span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {new Date(th.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Ticket + Mini Orderbook/Trades (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Order Placement Form */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 shadow-xl text-xs">
            
            {/* Long / Short Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-3">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1 ${
                  side === 'buy'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Buy / Long</span>
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1 ${
                  side === 'sell'
                    ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Sell / Short</span>
              </button>
            </div>

            {/* Order Type Tabs */}
            <div className="flex items-center space-x-1 border-b border-slate-800/80 pb-2 mb-3">
              {(['market', 'limit', 'stop_limit'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOrderType(t)}
                  className={`capitalize px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    orderType === t ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3">
              
              {/* Leverage Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-400">Leverage</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25">
                    {leverage}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={leverage}
                  onChange={e => setLeverage(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>1x</span>
                  <span>10x</span>
                  <span>25x</span>
                  <span>50x</span>
                </div>
              </div>

              {/* Limit Price Input if limit order */}
              {orderType !== 'market' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Order Price (USDT)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={limitPrice}
                    onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Amount ({selectedAsset.symbol})
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ≈ ${orderTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Quick Percentage Presets */}
              <div className="grid grid-cols-4 gap-1">
                {[25, 50, 75, 100].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageClick(pct)}
                    className="py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-800 transition cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Optional TP / SL */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Take Profit ($)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={takeProfit}
                    onChange={e => setTakeProfit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Stop Loss ($)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={stopLoss}
                    onChange={e => setStopLoss(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-mono text-rose-400 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Order Calculations Summary */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Margin Cost:</span>
                  <span className="text-white font-semibold">${requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Liquidation:</span>
                  <span className="text-amber-400 font-semibold">${estLiquidation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Fee (0.05%):</span>
                  <span className="text-slate-300">${estimatedFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {orderError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px]">
                  {orderError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg transition cursor-pointer ${
                  side === 'buy'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 shadow-rose-500/20'
                }`}
              >
                {side === 'buy' ? 'Open Long Position' : 'Open Short Position'}
              </button>
            </form>
          </div>

          {/* Mini Orderbook and Recent Trades */}
          <div className="grid grid-cols-1 gap-3">
            <OrderBookView orderBook={orderBook} currentPrice={selectedAsset.price} />
            <RecentTrades trades={trades} />
          </div>

        </div>

      </div>

    </div>
  );
};
