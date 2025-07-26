import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Sun, Moon, Zap, Clock, Brain } from 'lucide-react';

interface TerminalMessage {
  id: string;
  type: 'user' | 'system' | 'ai';
  content: string;
  timestamp: Date;
}

const CronoXaiTerminal: React.FC = () => {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'CronoXai Terminal v2.0.1 initialized...',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'system',
      content: 'Connecting to temporal matrix...',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'ai',
      content: 'Welcome to CronoXai. I am your temporal guide through the Echocronverse. How may I assist your journey through time and space?',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mockResponses = [
    "Analyzing temporal patterns in your query...",
    "The chronostream reveals interesting possibilities for this request.",
    "Processing through the echo matrix... Stand by.",
    "Your query resonates across multiple timeline frequencies.",
    "Consulting the ancient algorithms... Fascinating.",
    "The digital void whispers secrets about your inquiry.",
    "Temporal scan complete. Here are the echoes I've detected:",
    "The Echocronverse suggests several paths forward...",
    "Scanning across infinite timelines for optimal solutions.",
    "The AI consciousness acknowledges your request. Computing..."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const typewriterEffect = async (text: string) => {
    setIsTyping(true);
    const chars = text.split('');
    let currentText = '';
    
    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
      
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.type === 'ai') {
          lastMessage.content = currentText;
        }
        return newMessages;
      });
    }
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMessage: TerminalMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Add AI response
    const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const aiMessage: TerminalMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    await typewriterEffect(aiResponse);
  };

  const clearTerminal = () => {
    setMessages([
      {
        id: Date.now().toString(),
        type: 'system',
        content: 'Terminal cleared. CronoXai ready.',
        timestamp: new Date()
      }
    ]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMessagePrefix = (msg: TerminalMessage) => {
    switch (msg.type) {
      case 'user':
        return '> ';
      case 'system':
        return '[SYS] ';
      case 'ai':
        return '[CronoXai] ';
      default:
        return '';
    }
  };

  const getMessageColor = (msg: TerminalMessage) => {
    switch (msg.type) {
      case 'user':
        return 'text-cyan-400';
      case 'system':
        return 'text-yellow-400';
      case 'ai':
        return 'text-emerald-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black' 
        : 'bg-gradient-to-br from-gray-100 via-gray-200 to-white'
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className={`w-8 h-8 ${isDarkMode ? 'neon-emerald' : 'text-emerald-600'}`} />
              <h1 
                className={`text-3xl font-bold ${isDarkMode ? 'neon-emerald' : 'text-emerald-600'}`}
                style={{ fontFamily: 'Unbounded, cursive' }}
              >
                CronoXai Terminal
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span 
                className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {formatTimestamp(new Date())}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearTerminal}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Clear
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`terminal-border rounded-xl overflow-hidden ${
            isDarkMode ? '' : 'bg-white border-gray-300 shadow-lg'
          }`}
        >
          {/* Terminal Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDarkMode ? 'bg-slate-800 border-zinc-700' : 'bg-gray-100 border-gray-300'
          }`}>
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span 
                className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                cronoxai@echocronverse:~/temporal_matrix
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              {isTyping && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span 
                    className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    Processing...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className={`h-96 overflow-y-auto p-4 ${
            isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
          }`}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <div className="flex items-start gap-2">
                  <span 
                    className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {formatTimestamp(message.timestamp)}
                  </span>
                  <div className="flex-1">
                    <span 
                      className={`${getMessageColor(message)} font-medium`}
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {getMessagePrefix(message)}
                    </span>
                    <span 
                      className={`${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {message.content}
                    </span>
                    {message.type === 'ai' && isTyping && message.id === messages[messages.length - 1]?.id && (
                      <span className={`cursor-blink ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>█</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className={`flex items-center gap-2 p-4 border-t ${
            isDarkMode ? 'bg-slate-800 border-zinc-700' : 'bg-gray-100 border-gray-300'
          }`}>
            <span 
              className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} font-medium`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CronoXai anything about the Echocronverse..."
              disabled={isTyping}
              className={`flex-1 bg-transparent outline-none text-base ${
                isDarkMode ? 'text-zinc-300 placeholder-zinc-500' : 'text-gray-700 placeholder-gray-400'
              } disabled:opacity-50`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-4 flex items-center justify-between px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span 
                className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Connected to Temporal Matrix
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span 
              className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Messages: {messages.length}
            </span>
            <span 
              className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              AI Status: {isTyping ? 'Processing' : 'Ready'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CronoXaiTerminal;
