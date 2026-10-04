import React from 'react';
import { OrderBook } from '../../types/crypto';

interface OrderBookProps {
  orderBook: OrderBook;
  currentPrice: number;
}

export const OrderBookView: React.FC<OrderBookProps> = ({ orderBook, currentPrice }) => {
  const maxBidTotal = Math.max(...orderBook.bids.map(b => b.total), 1);
  const maxAskTotal = Math.max(...orderBook.asks.map(a => a.total), 1);
  const isMicro = currentPrice < 1;

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col h-full text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <h4 className="font-bold text-white text-xs">Order Book</h4>
        <span className="text-[10px] font-mono text-slate-400">Spread: 0.04%</span>
      </div>

      <div className="grid grid-cols-3 text-[10px] font-mono font-semibold text-slate-400 pb-1 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Red) */}
      <div className="space-y-0.5 overflow-hidden flex-1 flex flex-col justify-end">
        {orderBook.asks.slice(-7).map((ask, idx) => {
          const depthPct = Math.min((ask.total / maxAskTotal) * 100, 100);
          return (
            <div
              key={`ask-${idx}`}
              className="relative grid grid-cols-3 text-[11px] font-mono py-0.5 px-1 hover:bg-slate-800/40 rounded transition"
            >
              <div
                className="absolute inset-y-0 right-0 bg-rose-500/10 pointer-events-none rounded"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-rose-400 font-semibold">{ask.price}</span>
              <span className="text-right text-slate-300">{ask.amount}</span>
              <span className="text-right text-slate-400">{ask.total}</span>
            </div>
          );
        })}
      </div>

      {/* Current Mid-Price Divider */}
      <div className="py-2 my-1 px-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
        <span className="text-base font-extrabold text-emerald-400">
          {isMicro ? currentPrice.toFixed(6) : currentPrice.toFixed(2)}
        </span>
        <span className="text-[10px] text-slate-400">Mark Price</span>
      </div>

      {/* Bids (Green) */}
      <div className="space-y-0.5 overflow-hidden flex-1">
        {orderBook.bids.slice(0, 7).map((bid, idx) => {
          const depthPct = Math.min((bid.total / maxBidTotal) * 100, 100);
          return (
            <div
              key={`bid-${idx}`}
              className="relative grid grid-cols-3 text-[11px] font-mono py-0.5 px-1 hover:bg-slate-800/40 rounded transition"
            >
              <div
                className="absolute inset-y-0 right-0 bg-emerald-500/10 pointer-events-none rounded"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-emerald-400 font-semibold">{bid.price}</span>
              <span className="text-right text-slate-300">{bid.amount}</span>
              <span className="text-right text-slate-400">{bid.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
