import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { assets, setSelectedAsset, setActiveTab, formatCurrency } = useCrypto();

  return (
    <div className="bg-[#0e131d] border-b border-slate-800/80 overflow-hidden py-1.5 px-3 select-none text-xs">
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[10px] pl-1 shrink-0">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Ticker</span>
        </div>
        <div className="flex items-center space-x-6 shrink-0">
          {assets.map(asset => {
            const isPositive = asset.change24h >= 0;
            return (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setActiveTab('trade');
                }}
                className="flex items-center space-x-2 py-0.5 px-2 rounded hover:bg-slate-800/60 transition group cursor-pointer"
              >
                <img src={asset.icon} alt={asset.name} className="w-3.5 h-3.5 rounded-full" />
                <span className="font-semibold text-slate-300 group-hover:text-white transition">
                  {asset.symbol}
                </span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(asset.price)}
                </span>
                <span
                  className={`flex items-center text-[11px] font-mono font-medium ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {isPositive ? '+' : ''}
                  {asset.change24h}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
