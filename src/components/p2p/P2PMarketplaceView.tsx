import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { P2POffer } from '../../types/crypto';
import {
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  Search,
  Filter,
  CreditCard,
  MessageSquare,
  Lock,
} from 'lucide-react';

export const P2PMarketplaceView: React.FC = () => {
  const { p2pOffers, executeP2PTrade, formatCurrency } = useCrypto();

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');
  const [selectedFiat, setSelectedFiat] = useState<string>('All');
  const [activeOffer, setActiveOffer] = useState<P2POffer | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('500');
  const [tradeStep, setTradeStep] = useState<'form' | 'escrow' | 'completed'>('form');
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins

  const filteredOffers = p2pOffers.filter(o => {
    const matchesType = o.type === tradeType;
    const matchesCrypto = o.cryptoSymbol === selectedCrypto;
    const matchesFiat = selectedFiat === 'All' ? true : o.fiatSymbol === selectedFiat;
    return matchesType && matchesCrypto && matchesFiat;
  });

  const handleStartTrade = (offer: P2POffer) => {
    setActiveOffer(offer);
    setTradeAmount(offer.minLimit.toString());
    setTradeStep('form');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeStep('escrow');
  };

  const handleReleaseEscrow = () => {
    if (!activeOffer) return;
    const cryptoAmt = parseFloat(tradeAmount) / activeOffer.price;
    executeP2PTrade(activeOffer.id, Number(cryptoAmt.toFixed(4)));
    setTradeStep('completed');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* P2P Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/30 gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ArrowLeftRight className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">P2P Express Crypto Exchange</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                0% Fee
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Buy and sell crypto directly with local payment methods: Bank Transfer, Wise, Revolut, Telebirr, and CBE Birr.
            </p>
          </div>
        </div>

        {/* Security Feature Highlights */}
        <div className="flex items-center space-x-3 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Automated Smart Escrow Protection</span>
        </div>
      </div>

      {/* Filter and Currency Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0c121d] border border-slate-800">
        
        {/* Buy / Sell Toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTradeType('buy')}
            className={`px-5 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
              tradeType === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy Crypto
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`px-5 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
              tradeType === 'sell' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sell Crypto
          </button>
        </div>

        {/* Crypto Selector */}
        <div className="flex items-center space-x-1.5">
          {(['USDT', 'BTC', 'ETH'] as const).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrypto(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                selectedCrypto === c
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Fiat Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Fiat Currency:</span>
          <select
            value={selectedFiat}
            onChange={e => setSelectedFiat(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Currencies</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="ETB">ETB (Ethiopian Birr)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {filteredOffers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c121d] border border-slate-800 text-slate-500">
            No P2P offers found for this filter combination.
          </div>
        ) : (
          filteredOffers.map(offer => (
            <div
              key={offer.id}
              className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              {/* Merchant Details */}
              <div className="flex items-center space-x-3.5">
                <img
                  src={offer.merchantAvatar}
                  alt={offer.merchantName}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-white text-sm">{offer.merchantName}</h3>
                    {offer.isVerified && (
                      <span title="Verified Merchant">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>{offer.merchantOrders} Orders</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{offer.completionRate}% Completion</span>
                  </div>
                </div>
              </div>

              {/* Price & Limits */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Unit Price</span>
                  <span className="text-base font-extrabold text-white">
                    {offer.price} {offer.fiatSymbol}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Available</span>
                  <span className="text-slate-300">
                    {offer.availableAmount.toLocaleString()} {offer.cryptoSymbol}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Order Limit</span>
                  <span className="text-slate-300">
                    {offer.minLimit.toLocaleString()} - {offer.maxLimit.toLocaleString()} {offer.fiatSymbol}
                  </span>
                </div>
              </div>

              {/* Payment Methods Badges */}
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                {offer.paymentMethods.map(pm => (
                  <span
                    key={pm}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {pm}
                  </span>
                ))}
              </div>

              {/* Trade Action Button */}
              <div>
                <button
                  onClick={() => handleStartTrade(offer)}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition cursor-pointer ${
                    tradeType === 'buy'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  {tradeType === 'buy' ? `Buy ${offer.cryptoSymbol}` : `Sell ${offer.cryptoSymbol}`}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* P2P ESCROW MODAL */}
      {activeOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {activeOffer.cryptoSymbol} with Escrow
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveOffer(null);
                  setTradeStep('form');
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {tradeStep === 'form' && (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Merchant:</span>
                    <span className="text-white font-bold">{activeOffer.merchantName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Price:</span>
                    <span className="text-emerald-400 font-bold">1 {activeOffer.cryptoSymbol} = {activeOffer.price} {activeOffer.fiatSymbol}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    I Want to Pay ({activeOffer.fiatSymbol})
                  </label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(e.target.value)}
                    min={activeOffer.minLimit}
                    max={activeOffer.maxLimit}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Limit: {activeOffer.minLimit} - {activeOffer.maxLimit} {activeOffer.fiatSymbol}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300">
                  <span className="font-bold block">You will receive:</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {(parseFloat(tradeAmount || '0') / activeOffer.price).toFixed(4)} {activeOffer.cryptoSymbol}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
                >
                  Create Escrow Order
                </button>
              </form>
            )}

            {tradeStep === 'escrow' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Payment window closing in:</span>
                  </div>
                  <span className="font-mono font-bold text-sm">14:52</span>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-slate-900 text-xs">
                  <h4 className="font-bold text-white">Merchant Bank Payment Details:</h4>
                  <p className="text-slate-300">Bank: <span className="text-white font-mono">Commercial Bank / Wise</span></p>
                  <p className="text-slate-300">Account Name: <span className="text-white font-mono">{activeOffer.merchantName}</span></p>
                  <p className="text-slate-300">Account / IBAN: <span className="text-white font-mono">BE84 2901 9482 1092</span></p>
                  <p className="text-slate-300">Reference Code: <span className="text-amber-400 font-mono">#P2P-ORD-9428</span></p>
                </div>

                <p className="text-[11px] text-slate-400">
                  The merchant's cryptocurrency is currently safely locked in Beget's escrow smart contract. Send the payment and click "I Have Transferred".
                </p>

                <button
                  onClick={handleReleaseEscrow}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
                >
                  I Have Transferred & Sent Payment
                </button>
              </div>
            )}

            {tradeStep === 'completed' && (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Escrow Released Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Crypto has been verified and deposited directly into your Beget Wallet.
                </p>
                <button
                  onClick={() => {
                    setActiveOffer(null);
                    setTradeStep('form');
                  }}
                  className="px-6 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
