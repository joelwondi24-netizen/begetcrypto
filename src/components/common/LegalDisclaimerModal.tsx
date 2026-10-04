import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Regulatory & Trading Disclosures</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <span className="font-bold block mb-1">GENERAL RISK WARNING:</span>
            Cryptocurrency markets are extremely volatile. Asset valuations fluctuate dramatically based on market sentiment, technological developments, regulatory actions, and global liquidity conditions.
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">1. Paper Trading & Simulated Environment</h4>
            <p>
              All trading activity on Beget defaults to a simulated paper-trading environment funded with virtual demo currency. Paper trading balances, orders, and execution do not represent actual digital asset ownership, real-world monetary value, or live exchange settlement.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">2. AI Analyst & Research Tools</h4>
            <p>
              The Beget AI Analyst synthesizes real-time metrics, order book telemetry, and public news feeds. AI outputs represent analytical observations and educational interpretations. They do not constitute financial, investment, or legal advice. Beget makes no guarantees of trading profitability.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">3. Virtual Mastercard & P2P Express</h4>
            <p>
              In sandbox mode, virtual card numbers and P2P order flows serve as an interactive design demonstration. Live card issuance and fiat settlement require licensed merchant partnerships and jurisdictional compliance.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">4. AML / KYC Compliance Architecture</h4>
            <p>
              Any prospective real-money integrations adhere to strict Anti-Money Laundering (AML) and Know Your Customer (KYC) screening protocols. Suspicious transactions are audited in accordance with international financial guidelines.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
};
