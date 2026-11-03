import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Bot, Send, User, Sparkles, AlertCircle, RefreshCw, Zap, ChevronRight
} from 'lucide-react';

const QUICK_CHIPS = [
  { label: "🤒 Fever & headache", text: "I have a fever and severe headache for 2 days" },
  { label: "💔 Chest pain", text: "I'm experiencing chest pain and shortness of breath" },
  { label: "🦴 Joint pain", text: "I have persistent joint pain in my knees" },
  { label: "👁️ Eye problems", text: "I have blurry vision and eye irritation" },
  { label: "🌿 Skin rash", text: "I have a skin rash spreading on my arms" },
  { label: "🧠 Anxiety", text: "I've been experiencing anxiety and trouble sleeping" },
];

// Render text with basic markdown (bold **, newlines)
const RenderText = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part.split('\n').map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
};

const AIAssistant = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm **MediBot**, your AI Health Assistant. 🏥\n\nDescribe your symptoms, ask about a health concern, or click a suggestion below to get started. I'll recommend the right specialist from our team!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Build Gemini history (all messages except first system greeting)
  const buildHistory = () =>
    messages.slice(1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

  const handleSend = async (overrideText) => {
    const msgText = (overrideText || input).trim();
    if (!msgText || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msgText }]);
    setLoading(true);

    try {
      const history = buildHistory();
      // Protected patients use /chat; if somehow not authenticated fallback to public
      const endpoint = isAuthenticated ? '/ai/chat' : '/ai/chat/public';
      const res = await api.post(endpoint, { message: msgText, history });
      const data = res.data?.data;

      const aiReply =
        data?.configured === false
          ? "⚙️ The AI assistant isn't configured yet. Please contact your administrator to add the Gemini API key."
          : (data?.response || 'I was unable to generate a response. Please try again.');

      setMessages((prev) => [...prev, { role: 'model', text: aiReply }]);
    } catch {
      toast.error('AI assistant is temporarily unavailable');
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: '⚠️ I apologize — I\'m unable to respond right now. If this is a medical **emergency**, please call your local emergency line **immediately**.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        text: "Chat reset! 👋 Describe your symptoms or ask a health question and I'll help you find the right specialist.",
      },
    ]);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const showChips = messages.length <= 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-down">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-float">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              AI Symptom Assistant
              <Sparkles className="w-4 h-4 text-blue-500 animate-spin-slow" />
            </h1>
            <p className="text-xs text-slate-500">Powered by Gemini AI · Get specialist recommendations & health guidance</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition group"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3 text-amber-900 text-xs animate-fade-in delay-100">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Medical Disclaimer:</strong> MediBot provides general health information only. It does NOT replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[540px] overflow-hidden animate-scale-in delay-200">
        {/* Messages Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/80 to-white/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-3 msg-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl max-w-lg text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <RenderText text={msg.text} />
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-end gap-3 msg-enter">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {showChips && (
          <div className="px-5 py-3 border-t border-slate-100 bg-white">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-500" /> Quick Start
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip.text)}
                  className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all animate-fade-in"
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Describe your symptoms or ask a health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-500/20 transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 animate-fade-in delay-400">
        {['Specialist Recommendation', 'Symptom Analysis', 'Health Q&A', 'Doctor Directory'].map((f, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <ChevronRight className="w-3 h-3 text-blue-500" />
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AIAssistant;
