import React from 'react';
import { useCrypto, MainNavTab } from '../../context/CryptoContext';
import { TrendingUp, BarChart3, Bot, Wallet, SlidersHorizontal, Gift } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useCrypto();

  const mobileItems: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'markets', label: 'Markets', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'trade', label: 'Trade', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'ai', label: 'AI Analyst', icon: <Bot className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'rewards', label: 'Rewards', icon: <Gift className="w-5 h-5" /> },
    { id: 'admin', label: 'Admin', icon: <SlidersHorizontal className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d14]/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-6 h-14">
        {mobileItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'ai' && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                )}
                {item.id === 'admin' && userProfile.role === 'super_admin' && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
