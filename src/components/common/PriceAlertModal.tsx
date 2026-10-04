import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { Bell, X, Check, Trash2, ArrowUpRight, ArrowDownRight, AlertCircle, Mail } from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSymbol?: string;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ isOpen, onClose, defaultSymbol }) => {
  const { assets, alerts, addAlert, deleteAlert, toggleAlertActive, formatCurrency, userProfile } = useCrypto();

  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultSymbol || 'BTC');
  const asset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  const [targetPrice, setTargetPrice] = useState<number>(asset.price);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [note, setNote] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleApplyPreset = (percent: number) => {
    const calc = Number((asset.price * (1 + percent / 100)).toFixed(asset.price < 1 ? 6 : 2));
    setTargetPrice(calc);
    setCondition(percent >= 0 ? 'above' : 'below');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;
    addAlert(selectedSymbol, targetPrice, condition, note || undefined, sendEmail);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Crypto Price Alert</h3>
              <p className="text-xs text-slate-400">Receive instant alerts when market thresholds trigger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Cryptocurrency */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Asset
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {assets.slice(0, 6).map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedSymbol(a.symbol);
                      setTargetPrice(a.price);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      selectedSymbol === a.symbol
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={a.icon} alt={a.name} className="w-5 h-5 rounded-full mb-1" />
                    <span>{a.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Price Display */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">Current {asset.name} Price</span>
                <span className="font-mono text-lg font-bold text-white">{formatCurrency(asset.price)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">24h Change</span>
                <span className={`font-mono text-sm font-semibold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                </span>
              </div>
            </div>

            {/* Threshold Condition */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                    condition === 'above'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Price Rises Above</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                    condition === 'below'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Price Drops Below</span>
                </button>
              </div>
            </div>

            {/* Target Price Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Target Price (USD)
                </label>
                <div className="flex items-center space-x-1">
                  {[-10, -5, +5, +10].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPreset(pct)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={e => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition"
                required
              />
            </div>

            {/* Optional Note */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Alert Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Major breakout trigger or Dip buy zone"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>

            {/* Email Notification Option */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Email Notification Alert</span>
                  <span className="text-[10px] text-slate-400">Send alert to {userProfile.email}</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={e => setSendEmail(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-bold text-sm text-slate-950 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              Activate Price Alert
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Your Active Alerts ({alerts.length})
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 no-scrollbar">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 text-center">No alerts configured yet.</p>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{a.symbol}</span>
                      <span className={`text-[11px] font-semibold ${a.condition === 'above' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {a.condition === 'above' ? '≥' : '≤'} ${a.targetPrice.toLocaleString()}
                      </span>
                      {a.note && <span className="text-[10px] text-slate-400 hidden sm:inline">({a.note})</span>}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {a.isTriggered && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Triggered
                        </span>
                      )}
                      <button
                        onClick={() => toggleAlertActive(a.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          a.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {a.active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => deleteAlert(a.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
