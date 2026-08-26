import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown, 
  RotateCcw, 
  Search, 
  Briefcase, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  GripHorizontal,
  Move
} from 'lucide-react';
import { TalentVaryaEmblem } from './TalentVaryaEmblem';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../services/supabaseClient';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actions?: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
}

export const ChatbotWidget: React.FC = () => {
  const { 
    setCurrentPage, 
    setIsAuthModalOpen, 
    setIsEmployerRegisterModalOpen, 
    setIsPostJobModalOpen,
    setIsBannerManagerModalOpen,
    userRole,
    jobs 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [hasUnread, setHasUnread] = useState(true);

  // Position state for Drag and Drop
  // Default position: bottom-right (offset from viewport edges)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number; hasMoved: boolean }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    hasMoved: false
  });
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom-right upon mount
  useEffect(() => {
    const updateInitialPosition = () => {
      const padding = 24;
      const initialX = Math.max(16, window.innerWidth - 200 - padding);
      const initialY = Math.max(16, window.innerHeight - 80 - padding);
      
      setPosition(prev => {
        if (prev === null) {
          return { x: initialX, y: initialY };
        }
        // Ensure within window bounds on resize
        return {
          x: Math.min(prev.x, window.innerWidth - 100),
          y: Math.min(prev.y, window.innerHeight - 80)
        };
      });
    };

    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const currentX = position ? position.x : (window.innerWidth - 220);
    const currentY = position ? position.y : (window.innerHeight - 100);

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: currentX,
      initialPosY: currentY,
      hasMoved: false
    };

    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragStartRef.current.hasMoved = true;
      }

      const widgetWidth = isOpen ? 380 : 180;
      const widgetHeight = isOpen ? 520 : 60;

      const minX = 12;
      const maxX = Math.max(12, window.innerWidth - widgetWidth - 12);
      const minY = 12;
      const maxY = Math.max(12, window.innerHeight - widgetHeight - 12);

      const newX = Math.min(Math.max(dragStartRef.current.initialPosX + deltaX, minX), maxX);
      const newY = Math.min(Math.max(dragStartRef.current.initialPosY + deltaY, minY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isOpen]);

  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: language === 'HI'
        ? 'नमस्ते! मैं Talentvarya का AI असिस्टेंट हूँ। आप नौकरी खोजने, जॉब पोस्ट करने, या हमारे प्लेटफॉर्म के बारे में कुछ भी पूछ सकते हैं!'
        : 'Hello! I am your Talentvarya AI Assistant. How can I help you today with verified jobs, hiring talent, or employer benefits?',
      time: 'Just now',
      actions: [
        {
          label: language === 'HI' ? '🔍 नौकरियाँ देखें' : '🔍 Browse 100% Verified Jobs',
          action: () => {
            setCurrentPage('jobs');
            setIsOpen(false);
          },
          primary: true
        },
        {
          label: language === 'HI' ? '💼 जॉब पोस्ट करें (फ्री)' : '💼 Post a Job (Founding Offer)',
          action: () => {
            setIsPostJobModalOpen(true);
            setIsOpen(false);
          }
        },
        {
          label: language === 'HI' ? '💰 फीस व प्लान्स' : '💰 Pricing & Fees',
          action: () => {
            setCurrentPage('pricing');
            setIsOpen(false);
          }
        }
      ]
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Update initial message when language toggles if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: language === 'HI'
            ? 'नमस्ते! मैं Talentvarya का AI असिस्टेंट हूँ। आप नौकरी खोजने, जॉब पोस्ट करने, या हमारे प्लेटफॉर्म के बारे में कुछ भी पूछ सकते हैं!'
            : 'Hello! I am your Talentvarya AI Assistant. How can I help you today with verified jobs, hiring talent, or employer benefits?',
          time: 'Just now',
          actions: [
            {
              label: language === 'HI' ? '🔍 नौकरियाँ देखें' : '🔍 Browse 100% Verified Jobs',
              action: () => {
                setCurrentPage('jobs');
                setIsOpen(false);
              },
              primary: true
            },
            {
              label: language === 'HI' ? '💼 जॉब पोस्ट करें (फ्री)' : '💼 Post a Job (Founding Offer)',
              action: () => {
                setIsPostJobModalOpen(true);
                setIsOpen(false);
              }
            },
            {
              label: language === 'HI' ? '💰 फीस व प्लान्स' : '💰 Pricing & Fees',
              action: () => {
                setCurrentPage('pricing');
                setIsOpen(false);
              }
            }
          ]
        }
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Knowledge-based AI response generator
  const getAIResponse = (userQuery: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Job search / finding jobs
    if (q.includes('job') || q.includes('naukri') || q.includes('search') || q.includes('khooje') || q.includes('vacancy') || q.includes('openings') || q.includes('apply')) {
      return {
        text: language === 'HI'
          ? `हमारे पास इस समय ${jobs.length}+ से अधिक एक्टिव व 100% वेरिफाइड नौकरियाँ उपलब्ध हैं। सभी नौकरियाँ पूरी तरह फ्री हैं और कंपनियों की सीधी हायरिंग हैं।`
          : `We currently have ${jobs.length}+ active, 100% verified corporate openings across Tech, Sales, Marketing, and Operations. Candidate applications are completely free!`,
        actions: [
          {
            label: language === 'HI' ? 'नौकरियां खोजें' : 'Browse All Openings',
            action: () => {
              setCurrentPage('jobs');
              setIsOpen(false);
            },
            primary: true
          }
        ]
      };
    }

    // 2. Pricing, charges, fees, candidate charges
    if (q.includes('free') || q.includes('fee') || q.includes('charge') || q.includes('paisa') || q.includes('cost') || q.includes('rupay') || q.includes('price')) {
      return {
        text: language === 'HI'
          ? '🎯 **कैंडिडेट्स के लिए**: रोज़ 5 जॉब एप्लिकेशन फ्री हैं। इसके बाद अतिरिक्त एप्लिकेशन पर पेमेंट की शर्त दिखाई जाएगी।\n\n🏢 **एम्प्लॉयर्स के लिए**: रजिस्ट्रेशन से 14 दिन तक 3 जॉब पोस्ट और 12 यूनिक रिज्यूमे व्यू फ्री हैं। उसके बाद ₹49/माह, ₹399/6 महीने या ₹499/12 महीने का प्लान चुना जा सकता है।'
          : '🎯 **For Candidates**: 5 job applications are free each day. After that, a payment condition is shown for extra applications.\n\n🏢 **For Employers**: Registration includes 14 days, 3 job posts and 12 unique resume views. Then choose ₹49/month, ₹399/6 months or ₹499/12 months.',
        actions: [
          {
            label: language === 'HI' ? 'प्राइसिंग प्लान्स देखें' : 'View Full Pricing Table',
            action: () => {
              setCurrentPage('pricing');
              setIsOpen(false);
            },
            primary: true
          }
        ]
      };
    }

    // 3. Employer hiring / post a job / recruit
    if (q.includes('hire') || q.includes('employer') || q.includes('post') || q.includes('recruiter') || q.includes('company') || q.includes('candidate dhundo')) {
      return {
        text: language === 'HI'
          ? '🏢 क्या आप अपनी कंपनी के लिए हायरिंग करना चाहते हैं? Talentvarya पर प्री-वेरिफाइड प्रोफेशनल्स मिलते हैं। आप तुरंत अपनी पहली जॉब पोस्ट कर सकते हैं या एम्प्लॉयर डैशबोर्ड में रजिस्टर कर सकते हैं।'
          : '🏢 Looking to hire top talent? Talentvarya provides pre-screened candidates with ATS tracking and zero upfront placement risk.',
        actions: [
          {
            label: language === 'HI' ? '+ जॉब पोस्ट करें' : '+ Post a New Job',
            action: () => {
              setIsPostJobModalOpen(true);
              setIsOpen(false);
            },
            primary: true
          },
          {
            label: language === 'HI' ? 'एम्प्लॉयर रजिस्ट्रेशन' : 'Register Company',
            action: () => {
              setIsEmployerRegisterModalOpen(true);
              setIsOpen(false);
            }
          }
        ]
      };
    }

    // 4. Banners, Advertising, Promotion
    if (q.includes('banner') || q.includes('ad') || q.includes('sponsor') || q.includes('promote') || q.includes('logo')) {
      return {
        text: userRole === 'admin'
          ? (language === 'HI' ? '🌟 बैनर बनाना और एडिट करना केवल Admin Centre से उपलब्ध है।' : '🌟 Banner creation and editing are available only in the protected Admin Centre.')
          : (language === 'HI' ? '🌟 बैनर लगाने के लिए TalentVarya Admin को अनुरोध भेजें। केवल Admin ही बैनर बना या एडिट कर सकता है।' : '🌟 Send a banner request to TalentVarya Admin. Only an authorised Admin can create or edit banners.'),
        actions: [
          {
            label: userRole === 'admin' ? (language === 'HI' ? 'बैनर मैनेजर खोलें' : 'Open Banner Manager') : (language === 'HI' ? 'हेल्प सेंटर खोलें' : 'Open Help Centre'),
            action: () => {
              if (userRole === 'admin') setIsBannerManagerModalOpen(true);
              else setCurrentPage('help-center');
              setIsOpen(false);
            },
            primary: true
          }
        ]
      };
    }

    // 5. Verification / Scam prevention / Trust
    if (q.includes('verify') || q.includes('scam') || q.includes('fake') || q.includes('trust') || q.includes('safe') || q.includes('suraksha')) {
      return {
        text: language === 'HI'
          ? '🛡️ **सुरक्षा शील्ड**: Talentvarya पर हर कंपनी की MCA/GSTIN व कॉर्पोरेट ईमेल डोमेन की मैन्युअल जांच होती है। किसी भी फर्जीवाड़े को रोकने के लिए AI आधारित ऑडिट सिस्टम सक्रिय है।'
          : '🛡️ **Talentvarya Safety Shield**: Every employer on our platform is verified through MCA/CIN credentials, GSTIN audits, and corporate domain authentication.',
        actions: [
          {
            label: language === 'HI' ? 'सपोर्ट सेंटर' : 'Safety & Help Center',
            action: () => {
              setCurrentPage('help-center');
              setIsOpen(false);
            },
            primary: true
          }
        ]
      };
    }

    // Default friendly response
    return {
      text: language === 'HI'
        ? 'धन्यवाद! क्या आप विशिष्ट नौकरी ढूंढ रहे हैं, कंपनी की हायरिंग शुरू करना चाहते हैं, या हमारी टीम से संपर्क करना चाहते हैं?'
        : 'Thank you for reaching out! Would you like to explore verified jobs, post a job vacancy for your company, or learn about our zero-fee founding employer benefits?',
      actions: [
        {
          label: language === 'HI' ? 'नौकरियां देखें' : 'Explore Jobs',
          action: () => {
            setCurrentPage('jobs');
            setIsOpen(false);
          },
          primary: true
        },
        {
          label: language === 'HI' ? 'सहायता केंद्र' : 'Help Center',
          action: () => {
            setCurrentPage('help-center');
            setIsOpen(false);
          }
        }
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('talentvarya-ai-assistant', {
        body: { question: text.trim() }
      });

      if (error) throw error;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data?.answer || (language === 'HI'
          ? 'माफ़ कीजिए, इस प्रश्न का उत्तर अभी उपलब्ध नहीं है।'
          : 'Sorry, I do not have an answer for that yet.'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('TalentVarya AI Assistant error:', error);
      const botMsg: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: language === 'HI'
          ? 'AI असिस्टेंट अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद दोबारा कोशिश करें।'
          : 'The AI Assistant is temporarily unavailable. Please try again shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages(initialMessages);
  };

  const quickQuestions = language === 'HI' ? [
    'नौकरियां कैसे खोजें?',
    'क्या यह उम्मीदवारों के लिए फ्री है?',
    'जॉब कैसे पोस्ट करें?',
    'बैनर विज्ञापन कैसे लगाएं?'
  ] : [
    'How to find verified jobs?',
    'Is it 100% free for candidates?',
    'How to post a job vacancy?',
    'Sponsor front-page banner'
  ];

  const handleTriggerClick = () => {
    // Only toggle open/close if the user didn't drag it
    if (!dragStartRef.current.hasMoved) {
      setIsOpen(!isOpen);
    }
  };

  const containerStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }
    : {
        position: 'fixed',
        bottom: '24px',
        right: '24px'
      };

  return (
    <div 
      ref={widgetContainerRef}
      style={containerStyle}
      className="z-50 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Chat Window */}
      {isOpen && (
        <div 
          id="talentvarya-chatbot-window"
          className="mb-3 w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 ring-1 ring-black/5"
        >
          {/* Header & Drag Handle */}
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`bg-gradient-to-r from-[#041e42] to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            title="Drag to move chat window anywhere"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Drag Grip Indicator */}
              <div className="p-1 rounded-md text-slate-400 hover:text-white bg-white/5 border border-white/10" title="Drag window">
                <Move className="w-3.5 h-3.5" />
              </div>

              <div className="relative p-1 rounded-xl bg-white/10 ring-1 ring-white/20 shrink-0">
                <TalentVaryaEmblem className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight">
                  <span>Talentvarya AI</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-300">
                  {language === 'HI' ? '24/7 सहायता बॉट • खींच कर कहीं भी रखें' : 'Career & Hiring Guide • Draggable'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(l => l === 'EN' ? 'HI' : 'EN')}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-bold text-slate-200 transition-colors border border-white/10 cursor-pointer"
                title="Change language"
              >
                {language === 'EN' ? 'हिंदी' : 'EN'}
              </button>

              {/* Reset Chat */}
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close / Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Announcement Pill */}
          <div className="bg-emerald-50 px-3.5 py-1.5 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>5 free applications/day • Verified recruiters</span>
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5 border border-emerald-200">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isBot ? 'text-left' : 'text-right'}`}>
                    <div 
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-tl-none' 
                          : 'bg-emerald-600 text-white shadow-xs rounded-tr-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Action buttons if bot provided any */}
                    {isBot && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={act.action}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                              act.primary
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">
                      {msg.time}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1 px-2">
                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-[11px] text-slate-600 transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              id="talentvarya-chatbot-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'HI' ? 'सवाल लिखें और Enter दबाएं...' : 'Type a question and press Enter...'}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <button
              id="talentvarya-chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button with Drag & Drop */}
      <div 
        className="flex items-center gap-1"
      >
        <button
          id="talentvarya-chatbot-trigger-btn"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={handleTriggerClick}
          className={`group relative flex items-center gap-2.5 px-4 py-3 bg-[#041e42] hover:bg-[#062857] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 border border-white/20 focus:outline-none select-none ${
            isDragging ? 'cursor-grabbing scale-105 ring-2 ring-emerald-400' : 'cursor-grab hover:scale-105'
          }`}
          title="Click to open or Drag to reposition anywhere"
        >
          {/* Subtle glowing ring */}
          <span className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-xs opacity-40 group-hover:opacity-80 transition duration-300 pointer-events-none" />

          {/* Drag Handle Grip Icon */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <GripHorizontal className="w-3.5 h-3.5" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="p-0.5 rounded-full bg-white/95 text-slate-900 shadow-xs">
              <TalentVaryaEmblem className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#041e42] animate-pulse" />
          </div>

          <div className="relative flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>AI Assistant</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </span>
            <span className="text-[10px] text-emerald-300 font-medium leading-none">
              {isDragging ? 'Dragging...' : 'Drag / Ask'}
            </span>
          </div>

          {hasUnread && !isOpen && !isDragging && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
