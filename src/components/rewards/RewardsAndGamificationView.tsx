import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { INITIAL_LEADERBOARD } from '../../data/cryptoList';
import {
  Gift,
  Flame,
  Trophy,
  Award,
  CheckCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  Sparkles,
  Star,
} from 'lucide-react';

export const RewardsAndGamificationView: React.FC = () => {
  const { userProfile, claimDailyStreak, addXp } = useCrypto();

  const [activeTab, setActiveTab] = useState<'streak' | 'quests' | 'quiz' | 'leaderboard'>('streak');
  
  // Interactive Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: 'What is the maximum hard-capped supply of Bitcoin (BTC)?',
      options: ['100 Million', '21 Million', 'Unlimited', '45 Billion'],
      correct: 1,
      explanation: 'Bitcoin has a programmed mathematical supply limit of 21,000,000 BTC, making it deflationary in nature.',
    },
    {
      question: 'In technical analysis, what does an RSI reading above 70 typically indicate?',
      options: ['Asset is Oversold', 'Asset is Overbought', 'Zero Volume', 'Bearish Divergence only'],
      correct: 1,
      explanation: 'An RSI above 70 indicates that the asset has experienced intense buying momentum and may be in overbought territory.',
    },
    {
      question: 'What is the primary purpose of a Stop-Loss (SL) order?',
      options: ['Guarantee 100% profit', 'Automatically cap maximum downside loss', 'Double trade leverage', 'Avoid all trading fees'],
      correct: 1,
      explanation: 'A stop-loss order automatically triggers a market sale when the price falls to a predetermined price, limiting total drawdown.',
    },
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    if (optionIdx === quizQuestions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      addXp(300, 'Completed Beget Crypto Proficiency Quiz');
    }
  };

  const quests = [
    { title: 'Check In Daily Streak', xp: 100, completed: true, icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { title: 'Open First Demo Position', xp: 250, completed: true, icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { title: 'Set a Target Price Alert', xp: 150, completed: true, icon: <Star className="w-4 h-4 text-purple-400" /> },
    { title: 'Run an AI Asset Audit', xp: 200, completed: false, icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/30 gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Gift className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Trader Rewards & Achievements</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Level {userProfile.level} ({userProfile.xp} XP)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Maintain your daily check-in streak, complete simulated trading missions, and earn exclusive badges.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('streak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'streak' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Streak
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'quests' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quests
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crypto Quiz
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY STREAK */}
      {activeTab === 'streak' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>{userProfile.streakDays}-Day Check-in Streak!</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Check in every day to claim bonus virtual XP and unlock VIP simulator perks.
                </p>
              </div>
              <button
                onClick={claimDailyStreak}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                Claim Today's XP
              </button>
            </div>

            {/* Streak 7-Day Visualizer */}
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map(day => {
                const isReached = day <= userProfile.streakDays % 7 || userProfile.streakDays >= 7;
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      isReached
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block mb-1">Day {day}</span>
                    <Flame className={`w-5 h-5 ${isReached ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    <span className="text-[10px] font-mono mt-1 font-semibold">+{day * 100} XP</span>
                  </div>
                );
              })}
            </div>

            {/* Unlocked Badges */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Your Honor Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.badges.map(b => (
                  <span
                    key={b}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center space-x-1.5 shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-sm">Gamification Progress</h4>
            <div className="p-4 rounded-xl bg-slate-900 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Current Level:</span>
                <span className="text-white font-bold">Level {userProfile.level}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total XP Earned:</span>
                <span className="text-amber-400 font-bold">{userProfile.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Next Rank at:</span>
                <span className="text-slate-300">{(userProfile.level * 1000).toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE QUESTS */}
      {activeTab === 'quests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">{q.icon}</div>
                <div>
                  <h4 className="font-bold text-white text-sm">{q.title}</h4>
                  <span className="text-xs text-amber-400 font-mono font-semibold">+{q.xp} XP</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  q.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {q.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CRYPTO QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl space-y-6">
          {!quizFinished ? (
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-3">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="text-amber-400 font-bold">+300 XP on finish</span>
              </div>

              <h3 className="text-base font-bold text-white mb-4">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-2.5">
                {quizQuestions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      selectedOption === idx
                        ? idx === quizQuestions[currentQuestion].correct
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {selectedOption !== null && (
                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-0.5">Explanation:</span>
                  {quizQuestions[currentQuestion].explanation}
                </div>
              )}

              {selectedOption !== null && (
                <div className="mt-4 text-right">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-14 h-14 text-amber-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">Quiz Completed!</h3>
              <p className="text-xs text-slate-300">
                You scored {quizScore} / {quizQuestions.length}. We added +300 XP to your profile!
              </p>
              <button
                onClick={() => {
                  setQuizFinished(false);
                  setCurrentQuestion(0);
                  setSelectedOption(null);
                  setQuizScore(0);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0c121d] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Global Paper Trading Rankings</h3>
            <span className="text-xs font-mono text-slate-400">Updated hourly based on ROI %</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Trader</th>
                <th className="py-3 px-4 text-right">Total PnL</th>
                <th className="py-3 px-4 text-right">ROI %</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4">Honor Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {INITIAL_LEADERBOARD.map(u => (
                <tr key={u.rank} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-amber-400">#{u.rank}</td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center space-x-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                    +${u.pnlTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                    +{u.roiPercentage}%
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">{u.winRate}%</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {u.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
