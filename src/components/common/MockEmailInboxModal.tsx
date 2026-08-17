import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Send, 
  Search, 
  ShieldCheck, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MockEmail } from '../../types';

export const MockEmailInboxModal: React.FC = () => {
  const { 
    isEmailModalOpen, 
    setIsEmailModalOpen, 
    mockEmails, 
    selectedEmail, 
    setSelectedEmail, 
    markEmailAsRead, 
    deleteEmail,
    setCurrentPage,
    showToast
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'interview' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isEmailModalOpen) return null;

  const filteredEmails = mockEmails.filter(email => {
    const matchesFilter = filterType === 'all' || email.statusType === filterType;
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = mockEmails.filter(e => !e.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[90vh] max-h-[820px] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Mock Email Notification Service
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full">
                  LIVE DISPATCHER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulated email inbox alerting candidates on interview invitations and status updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {unreadCount} Unread Alert{unreadCount > 1 ? 's' : ''}
              </span>
            )}
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sub Bar: Search & Filter Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Alerts ({mockEmails.length})
            </button>
            <button
              onClick={() => setFilterType('interview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                filterType === 'interview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Interview Invites</span>
            </button>
            <button
              onClick={() => setFilterType('rejected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                filterType === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Status Updates</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Main Content Area: Split Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Email List */}
          <div className="w-full md:w-5/12 border-r border-slate-200 overflow-y-auto bg-white divide-y divide-slate-100">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No email notifications found</p>
                <p className="text-[11px] text-slate-400">
                  When an employer changes candidate application status to Interview or Rejected, emails will appear here.
                </p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isInterview = email.statusType === 'interview';

                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      markEmailAsRead(email.id);
                    }}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : ''
                    } ${!email.read ? 'bg-slate-50/50' : ''}`}
                  >
                    {/* Status icon / dot */}
                    <div className="mt-0.5 shrink-0">
                      {isInterview ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {email.company}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                          {email.sentAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isInterview 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isInterview ? 'Interview Shortlist' : 'Status Update'}
                        </span>
                        {!email.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {email.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {email.preview}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Full Email Reader */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 flex flex-col justify-between">
            {selectedEmail ? (
              <div className="space-y-6">
                
                {/* Email Metadata Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  
                  {/* Top Subject & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedEmail.statusType === 'interview'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {selectedEmail.statusType === 'interview' ? '📅 Interview Invitation' : '✉️ Application Status Update'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {selectedEmail.id.substring(0, 12)}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {selectedEmail.subject}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          deleteEmail(selectedEmail.id);
                          showToast('Email Deleted', 'Email removed from your mock inbox.', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sender / Recipient Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">From:</span>
                      <span className="font-semibold text-slate-800">{selectedEmail.senderName}</span>
                      <span className="text-slate-500 block text-[11px] font-mono">&lt;{selectedEmail.sender}&gt;</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">To:</span>
                      <span className="font-semibold text-slate-800">{selectedEmail.recipientName}</span>
                      <span className="text-slate-500 block text-[11px] font-mono">&lt;{selectedEmail.recipientEmail}&gt;</span>
                    </div>
                  </div>

                  {/* Formatted Body Content */}
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed space-y-3 pt-2 font-sans"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml || selectedEmail.preview }}
                  />

                  {/* Contextual Action Callout (Interview vs Rejection) */}
                  {selectedEmail.statusType === 'interview' && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Next Candidate Steps
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded">
                          Action Required
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <a
                          href={selectedEmail.interviewDetails?.meetingLink || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 text-center transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Meeting</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                        </a>
                        <button
                          onClick={() => {
                            showToast('Calendar Sync', `Scheduled: ${selectedEmail.interviewDetails?.round} added to your calendar reminder.`, 'success');
                          }}
                          className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-emerald-300 font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 text-center transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Add to Calendar (.ics)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedEmail.statusType === 'rejected' && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Priority Talent Network Guarantee</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Your profile remains 100% active and highlighted for other verified Indian recruiters matching your skills ({selectedEmail.jobTitle}).
                      </p>
                      <button
                        onClick={() => {
                          setIsEmailModalOpen(false);
                          setCurrentPage('jobs');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2"
                      >
                        <span>Browse Other Verified Roles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Mail className="w-12 h-12 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Select an email to view full alert details</p>
                <p className="text-xs text-slate-400">Mock notifications triggered automatically on candidate status transitions.</p>
              </div>
            )}

            {/* Email Dispatch Info Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Simulated SMTP Relay Service (TalentVarya Notification Gateway)
              </span>
              <span>All alerts are securely recorded in candidate session state</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
