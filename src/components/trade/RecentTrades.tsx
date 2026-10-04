import React from 'react';
import { TradeTick } from '../../types/crypto';

interface RecentTradesProps {
  trades: TradeTick[];
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3 flex flex-col h-full text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <h4 className="font-bold text-white text-xs">Market Trades</h4>
        <span className="flex items-center space-x-1 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time</span>
        </span>
      </div>

      <div className="grid grid-cols-3 text-[10px] font-mono font-semibold text-slate-400 pb-1 px-1">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>

      <div className="space-y-1 overflow-y-auto no-scrollbar flex-1 max-h-48">
        {trades.slice(0, 12).map(trade => (
          <div
            key={trade.id}
            className="grid grid-cols-3 text-[11px] font-mono py-0.5 px-1 hover:bg-slate-800/30 rounded"
          >
            <span className={trade.type === 'buy' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {trade.price}
            </span>
            <span className="text-right text-slate-300">{trade.amount}</span>
            <span className="text-right text-slate-500">{new Date(trade.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
