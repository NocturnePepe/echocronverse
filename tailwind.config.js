/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'unbounded': ['Unbounded', 'cursive'],
        'orbitron': ['Orbitron', 'monospace'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cosmic: {
          purple: '#8b5cf6',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
          red: '#ef4444',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'echo-pulse': 'echo-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'typewriter': 'typewriter 4s steps(40) 1s both',
        'cosmic-pulse': 'cosmic-pulse 2s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 1s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { 
            textShadow: '0 0 5px #60a5fa, 0 0 10px #60a5fa, 0 0 15px #60a5fa',
            transform: 'scale(1)',
          },
          '100%': { 
            textShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6, 0 0 40px #3b82f6',
            transform: 'scale(1.02)',
          }
        },
        'echo-pulse': {
          '0%, 100%': { 
            opacity: '0.7',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.05)',
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'typewriter': {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        'cosmic-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
          }
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        'ember': '0 0 15px rgba(251, 146, 60, 0.4)',
        'cosmic': '0 0 20px rgba(139, 92, 246, 0.4)',
        'wallet': '0 0 20px rgba(139, 92, 246, 0.4)',
        'swap': '0 0 15px rgba(239, 68, 68, 0.4)',
        'terminal': '0 0 10px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
