import React, { useState, useEffect } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { AIAnalysisReport } from '../../types/crypto';
import { analyzeCryptoWithAI, askCryptoAIAssistant, scanMarketOpportunities, ScannerSignal } from '../../services/aiService';
import {
  Sparkles,
  Bot,
  Send,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  Layers,
  Activity,
  Compass,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
  timestamp: number;
}

export const AIAnalystView: React.FC = () => {
  const { assets, selectedAsset, setSelectedAsset, setActiveTab, formatCurrency, paperBalance, positions } = useCrypto();

  const [activeTab, setActiveTabInternal] = useState<'deep_dive' | 'assistant' | 'scanner'>('deep_dive');
  const [analysisReport, setAnalysisReport] = useState<AIAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scannerSignals, setScannerSignals] = useState<ScannerSignal[]>([]);

  // Chat Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your **Beget AI Market Assistant**. I analyze live crypto order books, technical indicators, and macroeconomic sentiment to give you data-driven market insights.\n\nAsk me anything about Bitcoin, technical chart patterns, RSI, risk management, or your demo portfolio!`,
      sources: ['Beget Real-time Order Engine', 'Global Spot Feeds'],
      timestamp: Date.now(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Run deep analysis when selected asset changes
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const report = await analyzeCryptoWithAI(selectedAsset);
      setAnalysisReport(report);
    } catch {
      // handled
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    setScannerSignals(scanMarketOpportunities(assets));
  }, [selectedAsset.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsAiResponding(true);

    try {
      const reply = await askCryptoAIAssistant(q, selectedAsset);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.text,
        sources: reply.sources,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered an issue processing that query. Please try again or rephrase your question.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiResponding(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top AI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-900/30 gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Crypto Intelligence Engine</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live algorithmic synthesis, chart pattern detection, and risk scoring across all supported pairs.
            </p>
          </div>
        </div>

        {/* Tab Controls: Deep Dive vs Assistant vs Scanner */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTabInternal('deep_dive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'deep_dive'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Asset Audit
          </button>
          <button
            onClick={() => setActiveTabInternal('assistant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'assistant'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTabInternal('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Market Scanner
          </button>
        </div>
      </div>

      {/* VIEW 1: ASSET AUDIT & DEEP DIVE */}
      {activeTab === 'deep_dive' && (
        <div className="space-y-6">
          
          {/* Asset Selector Row */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Select Pair:
            </span>
            {assets.slice(0, 10).map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedAsset(a)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                  selectedAsset.id === a.id
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <img src={a.icon} alt={a.name} className="w-4 h-4 rounded-full" />
                <span>{a.symbol}</span>
              </button>
            ))}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Refresh AI Analysis"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>

          {/* Report Display */}
          {isAnalyzing ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c121d] border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-sm font-semibold text-white">Synthesizing live telemetry for {selectedAsset.name}...</p>
              <p className="text-xs text-slate-400">Evaluating 24h order flow, Fibonacci pivot levels, and momentum oscillators.</p>
            </div>
          ) : analysisReport ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Summary & Indicators (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Executive Summary Card */}
                <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <img src={selectedAsset.icon} alt={selectedAsset.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <h3 className="font-extrabold text-white text-base">
                          {selectedAsset.name} ({selectedAsset.symbol}) Audit
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          Mark: {formatCurrency(selectedAsset.price)} | 24h: {selectedAsset.change24h}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {analysisReport.trend}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {analysisReport.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 font-medium">
                    <span className="font-bold block mb-0.5">Tactical Takeaway:</span>
                    {analysisReport.keyTakeaway}
                  </div>
                </div>

                {/* Bullish Catalysts & Bearish Risks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Bullish Factors */}
                  <div className="p-4 rounded-2xl bg-[#0c121d] border border-emerald-900/30 space-y-2.5">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4" />
                      <span>Bullish Catalysts</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {analysisReport.bullishCatalysts.map((cat, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bearish Risks */}
                  <div className="p-4 rounded-2xl bg-[#0c121d] border border-rose-900/30 space-y-2.5">
                    <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4" />
                      <span>Risk Factors</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {analysisReport.bearishRisks.map((risk, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Technical Indicators Breakdown */}
                <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Algorithmic Technical Indicators
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">RSI (14)</span>
                      <span className="text-sm font-bold text-amber-400">{analysisReport.technicalIndicators.rsi14}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {analysisReport.technicalIndicators.rsiCondition}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">EMA Trend</span>
                      <span className="text-sm font-bold text-cyan-400">Bullish</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        Above 20 EMA
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">MACD (12, 26, 9)</span>
                      <span className="text-sm font-bold text-emerald-400">Positive</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        Hist. Expanding
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">Bollinger</span>
                      <span className="text-sm font-bold text-purple-400">Active</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        Mid-Band Test
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Sentiment Meter & Key Levels (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Sentiment Meter */}
                <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Market Sentiment Meter
                    </h4>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {analysisReport.sentimentScore} / 100
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${analysisReport.sentimentScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Extreme Fear</span>
                    <span>Neutral (50)</span>
                    <span>Extreme Greed</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Composite score derived from 24-hour volume changes, spot depth stability, and order book skew.
                  </p>
                </div>

                {/* Support & Resistance Levels */}
                <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Pivot Price Levels
                  </h4>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <span>Major Resistance (R2):</span>
                      <span className="font-bold">${analysisReport.resistanceLevels[1]?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-300">
                      <span>Local Resistance (R1):</span>
                      <span className="font-bold">${analysisReport.resistanceLevels[0]?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold">
                      <span>Current Price:</span>
                      <span>{formatCurrency(selectedAsset.price)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-300">
                      <span>Immediate Support (S1):</span>
                      <span className="font-bold">${analysisReport.supportLevels[0]?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span>Key Floor Support (S2):</span>
                      <span className="font-bold">${analysisReport.supportLevels[1]?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action: Open Trade Terminal for this asset */}
                <button
                  onClick={() => setActiveTab('trade')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Trade {selectedAsset.symbol} on Terminal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Compliance Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-500 leading-normal">
                  {analysisReport.disclaimer}
                </div>

              </div>

            </div>
          ) : null}

        </div>
      )}

      {/* VIEW 2: INTERACTIVE AI CHAT ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Chat Container (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[600px] rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map(msg => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAi
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-emerald-500 text-slate-950 font-bold'
                      }`}
                    >
                      {isAi ? <Bot className="w-4 h-4" /> : 'You'}
                    </div>

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                          : 'bg-emerald-600 text-white font-medium'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {msg.sources && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center space-x-2">
                          <span className="font-semibold text-purple-400">Sources:</span>
                          <span>{msg.sources.join(' • ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isAiResponding && (
                <div className="flex items-center space-x-2 text-xs text-purple-400 py-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Beget AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask anything about crypto, RSI, Bitcoin, or portfolio risk..."
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isAiResponding}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Right: Quick Prompts & Demo Portfolio Context (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Suggested Questions
              </h4>
              <div className="space-y-1.5">
                {[
                  'Explain RSI like I am a beginner trader',
                  'Why is Bitcoin moving today?',
                  'How should I manage risk in paper trading?',
                  'Explain hammer and engulfing candlestick patterns',
                  'Compare Bitcoin vs Ethereum fundamentals',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-800/40 text-xs text-slate-300 transition cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Portfolio Scan */}
            <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Connected Demo Portfolio
              </h4>
              <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Demo Equity:</span>
                  <span className="text-white font-bold">{formatCurrency(paperBalance)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Positions:</span>
                  <span className="text-emerald-400 font-bold">{positions.length}</span>
                </div>
              </div>
              <button
                onClick={() =>
                  handleSendMessage('Analyze my current paper trading positions and suggest risk management rules.')
                }
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold transition cursor-pointer"
              >
                Scan Portfolio Risk
              </button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: AI MARKET SCANNER */}
      {activeTab === 'scanner' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Algorithmic Market Scanner</h3>
              <p className="text-xs text-slate-400">Surfacing momentum breakouts, oversold bounces, and unusual volume depth.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {scannerSignals.length} Active Signals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scannerSignals.map((sig, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 hover:border-purple-500/40 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-base">{sig.symbol}</span>
                    <span className="text-xs text-slate-400">{sig.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sig.type === 'Strong Momentum'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : sig.type === 'Unusual Volume'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {sig.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{sig.reason}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className={`font-mono font-bold ${sig.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sig.change24h >= 0 ? '+' : ''}{sig.change24h}% (24h)
                  </span>
                  <button
                    onClick={() => {
                      const target = assets.find(a => a.symbol === sig.symbol);
                      if (target) {
                        setSelectedAsset(target);
                        setActiveTab('trade');
                      }
                    }}
                    className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    <span>Open Chart</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
