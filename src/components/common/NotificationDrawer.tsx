import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  Bell,
  X,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Mail,
  Send,
  Radio,
  Clock,
  ExternalLink,
  CheckCheck,
  Megaphone,
} from 'lucide-react';
import { EmailMessage } from '../../types/crypto';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    dismissNotification,
    clearAllNotifications,
    emails,
    markEmailAsRead,
    deleteEmail,
    sendEmailMessage,
    userProfile,
    setActiveTab,
  } = useCrypto();

  const [activeTab, setActiveTabInternal] = useState<'notifications' | 'emails'>('notifications');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [notifFilter, setNotifFilter] = useState<'all' | 'broadcast' | 'alert'>('all');

  // Quick Compose Test Email State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  if (!isOpen) return null;

  const unreadEmailsCount = emails.filter(e => !e.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'broadcast') return n.type === 'broadcast';
    if (notifFilter === 'alert') return n.type === 'alert';
    return true;
  });

  const handleOpenEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    markEmailAsRead(email.id);
  };

  const handleSendComposeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;
    sendEmailMessage(userProfile.email, composeSubject, composeBody, 'announcement');
    setComposeSubject('');
    setComposeBody('');
    setShowComposeModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#0e1420] border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Alerts & Email Center</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector: In-App Alerts vs Email Messages */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60 px-4 py-2 justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveTabInternal('notifications');
                  setSelectedEmail(null);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>All User Alerts ({notifications.length})</span>
              </button>

              <button
                onClick={() => setActiveTabInternal('emails')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer relative ${
                  activeTab === 'emails'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Messages</span>
                {unreadEmailsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            </div>

            {activeTab === 'notifications' && notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 p-1 rounded hover:bg-slate-800 cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}

            {activeTab === 'emails' && (
              <button
                onClick={() => setShowComposeModal(true)}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Compose</span>
              </button>
            )}
          </div>

          {/* TAB 1: IN-APP ALERTS & BROADCASTS */}
          {activeTab === 'notifications' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar flex flex-col">
              
              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 pb-1">
                {(['all', 'broadcast', 'alert'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setNotifFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize transition cursor-pointer ${
                      notifFilter === f
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f === 'all' ? 'All Alerts' : f === 'broadcast' ? '📢 Broadcasts' : '⚡ Price Alerts'}
                  </button>
                ))}
              </div>

              {filteredNotifications.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Bell className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">No active alerts</p>
                  <p className="text-xs text-slate-500 mt-1">Broadcasts and triggered market alerts will appear here.</p>
                </div>
              ) : (
                filteredNotifications.map(notif => {
                  const isBroadcast = notif.type === 'broadcast';
                  const isAlert = notif.type === 'alert';
                  const isSuccess = notif.type === 'success';
                  const isWarning = notif.type === 'warning';

                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border transition relative group ${
                        isBroadcast
                          ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/40 shadow-lg'
                          : isAlert
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : isSuccess
                          ? 'bg-emerald-500/10 border-emerald-500/25'
                          : isWarning
                          ? 'bg-rose-500/10 border-rose-500/25'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2.5">
                          <div className="mt-0.5">
                            {isBroadcast && <Megaphone className="w-4 h-4 text-amber-400 animate-pulse" />}
                            {isAlert && <Zap className="w-4 h-4 text-amber-400" />}
                            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {isWarning && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                            {!isBroadcast && !isAlert && !isSuccess && !isWarning && (
                              <Info className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                              {isBroadcast && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Global
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">
                              {new Date(notif.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => dismissNotification(notif.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: EMAIL MESSAGES INBOX */}
          {activeTab === 'emails' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar flex flex-col">
              
              {/* Selected Email Detailed View */}
              {selectedEmail ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>← Back to Inbox</span>
                  </button>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {selectedEmail.category}
                        </span>
                        <h3 className="font-extrabold text-base text-white mt-1.5">
                          {selectedEmail.subject}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          deleteEmail(selectedEmail.id);
                          setSelectedEmail(null);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition cursor-pointer"
                        title="Delete email"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 space-y-0.5 font-mono">
                      <div>From: <span className="text-white font-sans">{selectedEmail.sender}</span></div>
                      <div>To: <span className="text-slate-300">{selectedEmail.recipientEmail}</span></div>
                      <div>Date: <span className="text-slate-300">{new Date(selectedEmail.timestamp).toLocaleString()}</span></div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#090d14] border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                      {selectedEmail.body}
                    </div>

                    {selectedEmail.actionUrl && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (selectedEmail.actionUrl === '/trade') {
                              setActiveTab('trade');
                              onClose();
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center space-x-1.5"
                        >
                          <span>{selectedEmail.actionLabel || 'View Action'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Emails List */
                emails.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Mail className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
                    <p className="text-sm font-semibold text-slate-400">No email messages</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Target price alerts, system notices, and broadcast messages will appear here.
                    </p>
                  </div>
                ) : (
                  emails.map(email => (
                    <div
                      key={email.id}
                      onClick={() => handleOpenEmail(email)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer group ${
                        !email.isRead
                          ? 'bg-slate-900 border-emerald-500/40 hover:border-emerald-500/60 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-90'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2.5">
                          <div className="mt-1">
                            {!email.isRead ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
                            ) : (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[11px] font-semibold text-slate-400 font-mono truncate max-w-[200px]">
                                {email.sender.split('<')[0]}
                              </span>
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {email.category}
                              </span>
                            </div>
                            <h4 className={`text-xs mt-0.5 ${!email.isRead ? 'font-bold text-white' : 'text-slate-300'}`}>
                              {email.subject}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                              {email.body}
                            </p>
                            <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                              {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteEmail(email.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}

          {/* Quick Compose Modal */}
          {showComposeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="bg-[#0e1420] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-white text-sm">Send Direct Email Message</h3>
                  <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSendComposeEmail} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">To:</label>
                    <input
                      type="text"
                      value={userProfile.email}
                      disabled
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subject:</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Trader Notification"
                      value={composeSubject}
                      onChange={e => setComposeSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Message Body:</label>
                    <textarea
                      rows={4}
                      placeholder="Write your email content..."
                      value={composeBody}
                      onChange={e => setComposeBody(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Send Email Message
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
