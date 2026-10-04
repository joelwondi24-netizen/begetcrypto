import React, { useState } from 'react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { Navbar } from './components/layout/Navbar';
import { TickerTape } from './components/layout/TickerTape';
import { MobileNav } from './components/layout/MobileNav';
import { MarketOverview } from './components/markets/MarketOverview';
import { TradingTerminal } from './components/trade/TradingTerminal';
import { AIAnalystView } from './components/ai/AIAnalystView';
import { WalletAndCardView } from './components/wallet/WalletAndCardView';
import { P2PMarketplaceView } from './components/p2p/P2PMarketplaceView';
import { RewardsAndGamificationView } from './components/rewards/RewardsAndGamificationView';
import { EducationCenterView } from './components/education/EducationCenterView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { AuthModal } from './components/auth/AuthModal';
import { PriceAlertModal } from './components/common/PriceAlertModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LegalDisclaimerModal } from './components/common/LegalDisclaimerModal';
import { ShieldAlert, Terminal, Sparkles, ExternalLink, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCrypto();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertDefaultSymbol, setAlertDefaultSymbol] = useState<string>('BTC');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const handleOpenAlertForAsset = (symbol: string) => {
    setAlertDefaultSymbol(symbol);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Top Navbar */}
      <Navbar
        onOpenAlertModal={() => handleOpenAlertForAsset('BTC')}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Marquee Ticker Tape */}
      <TickerTape />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-6 pt-5 pb-20 lg:pb-12">
        {activeTab === 'markets' && (
          <MarketOverview onOpenAlertForAsset={handleOpenAlertForAsset} />
        )}
        {activeTab === 'trade' && <TradingTerminal />}
        {activeTab === 'ai' && <AIAnalystView />}
        {(activeTab === 'wallet' || activeTab === 'card') && <WalletAndCardView />}
        {activeTab === 'p2p' && <P2PMarketplaceView />}
        {activeTab === 'rewards' && <RewardsAndGamificationView />}
        {activeTab === 'education' && <EducationCenterView />}
        {activeTab === 'admin' && (
          <AdminLoginGate>
            <AdminDashboardView />
          </AdminLoginGate>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#090d15] border-t border-slate-800/80 py-8 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              B
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">BEGET TRADING PLATFORM</span>
              <p className="text-[11px] text-slate-500">
                AI-Powered Crypto Research, Paper Simulator, & Virtual Mastercard
              </p>
            </div>
          </div>

          {/* Quick Legal Disclosures */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Risk Disclosure & Simulator Terms
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('education')}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Security Center & Anti-Scam Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              USDT Treasury & Admin Console
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Systems Normal (14ms)</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <AuthModal />

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultSymbol={alertDefaultSymbol}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      <LegalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <CryptoProvider>
      <AppContent />
    </CryptoProvider>
  );
}
