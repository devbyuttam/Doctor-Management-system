import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Bot, Send, X, Minimize2, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';

const QUICK_QUESTIONS = [
  "What doctor should I see for a fever?",
  "I have chest pain, is it serious?",
  "How do I book an appointment?",
  "I need a general physician",
];

const AIChatWidget = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi! I'm **MediBot**, your AI health assistant. Ask me about symptoms, doctors, or appointments!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open, minimized]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimized]);

  // Build Gemini history from messages
  const buildHistory = () =>
    messages.slice(1).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const endpoint = isAuthenticated ? '/ai/chat' : '/ai/chat/public';
      const history = buildHistory();
      const res = await api.post(endpoint, { message: msgText, history });
      const data = res.data?.data;

      const aiText = data?.configured === false
        ? data.response
        : (data?.response || 'I am having trouble responding right now. Please try again.');

      setMessages((prev) => [...prev, { role: 'model', text: aiText }]);

      // Show unread badge if widget is minimized or closed
      if (!open || minimized) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '⚠️ Unable to connect to AI service. Please check your connection or try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setHasUnread(false);
  };

  const handleReset = () => {
    setMessages([
      { role: 'model', text: "👋 Hi! I'm **MediBot**, your AI health assistant. Ask me about symptoms, doctors, or appointments!" },
    ]);
  };

  // Render text with basic markdown (bold **)
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</span>
      ));
    });
  };

  return (
    <>
      {/* Floating Bubble Button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow group"
          title="AI Health Assistant"
        >
          <MessageCircle className="w-7 h-7" />
          {hasUnread && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-bounce" />
          )}
        </button>
      )}

      {/* Chat Popup */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-slide-up ${
            minimized ? 'h-[60px]' : 'h-[480px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">MediBot</p>
                <p className="text-[10px] text-blue-200 leading-none mt-0.5">AI Health Assistant</p>
              </div>
              <span className="ml-1 flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                Online
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                title="Reset chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMinimized((v) => !v)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                title="Minimize"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setOpen(false); setMinimized(false); }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 msg-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[240px] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {renderText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex items-end gap-2 msg-enter">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Questions (only shown when just 1 message = initial) */}
              {messages.length === 1 && (
                <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-white border-t border-slate-100">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition animate-fade-in"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 flex-shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a health question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
