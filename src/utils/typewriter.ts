import { useState, useEffect, useCallback } from 'react';

export interface TypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  pauseOnComplete?: number;
}

export interface TypewriterResult {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
  progress: number;
  restart: () => void;
  pause: () => void;
  resume: () => void;
}

/**
 * Advanced typewriter hook with mystical timing control
 * Perfect for CronoXai terminal and lore reveals
 */
export const useTypewriter = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  loop = false,
  onComplete,
  pauseOnComplete = 0
}: TypewriterOptions): TypewriterResult => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const restart = useCallback(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(false);
    setIsComplete(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsTyping(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    if (currentIndex < text.length) {
      setIsTyping(true);
    }
  }, [currentIndex, text.length]);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  // Main typewriter effect
  useEffect(() => {
    if (!text || isPaused) return;

    const startTyping = () => {
      setIsTyping(true);
      
      const typeInterval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex <= text.length) {
            setDisplayText(text.slice(0, nextIndex));
            
            if (nextIndex === text.length) {
              setIsTyping(false);
              setIsComplete(true);
              
              if (onComplete) {
                setTimeout(onComplete, 100);
              }
              
              if (pauseOnComplete > 0) {
                setTimeout(() => {
                  if (loop) {
                    restart();
                  }
                }, pauseOnComplete);
              } else if (loop) {
                setTimeout(restart, 1000);
              }
              
              clearInterval(typeInterval);
            }
            
            return nextIndex;
          }
          
          clearInterval(typeInterval);
          return prevIndex;
        });
      }, speed);

      return () => clearInterval(typeInterval);
    };

    if (delay > 0) {
      const delayTimeout = setTimeout(startTyping, delay);
      return () => clearTimeout(delayTimeout);
    } else {
      return startTyping();
    }
  }, [text, speed, delay, loop, onComplete, pauseOnComplete, isPaused, restart]);

  const progress = text.length > 0 ? (currentIndex / text.length) * 100 : 0;
  const finalDisplayText = cursor ? displayText + (showCursor ? '|' : ' ') : displayText;

  return {
    displayText: finalDisplayText,
    isTyping,
    isComplete,
    progress,
    restart,
    pause,
    resume
  };
};

/**
 * Sequential typewriter for multiple text blocks
 * Perfect for lore milestones and prophecy reveals
 */
export interface SequentialTypewriterOptions {
  texts: string[];
  speed?: number;
  delayBetween?: number;
  cursor?: boolean;
  onStepComplete?: (index: number) => void;
  onAllComplete?: () => void;
}

export const useSequentialTypewriter = ({
  texts,
  speed = 50,
  delayBetween = 1000,
  cursor = true,
  onStepComplete,
  onAllComplete
}: SequentialTypewriterOptions) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [allTexts, setAllTexts] = useState<string[]>([]);
  const [isAllComplete, setIsAllComplete] = useState(false);

  const currentTypewriter = useTypewriter({
    text: texts[currentTextIndex] || '',
    speed,
    cursor: currentTextIndex === texts.length - 1 ? cursor : false,
    onComplete: () => {
      if (onStepComplete) {
        onStepComplete(currentTextIndex);
      }
      
      setAllTexts(prev => [...prev, texts[currentTextIndex]]);
      
      if (currentTextIndex < texts.length - 1) {
        setTimeout(() => {
          setCurrentTextIndex(prev => prev + 1);
        }, delayBetween);
      } else {
        setIsAllComplete(true);
        if (onAllComplete) {
          onAllComplete();
        }
      }
    }
  });

  const restart = useCallback(() => {
    setCurrentTextIndex(0);
    setAllTexts([]);
    setIsAllComplete(false);
    currentTypewriter.restart();
  }, [currentTypewriter]);

  return {
    ...currentTypewriter,
    currentStep: currentTextIndex,
    totalSteps: texts.length,
    allTexts,
    isAllComplete,
    restart
  };
};

/**
 * Mystical typewriter with rune integration
 * Adds cosmic symbols and mystical pauses
 */
export interface MysticalTypewriterOptions extends TypewriterOptions {
  runeSymbols?: string[];
  mysticalPauses?: number[];
  glowEffect?: boolean;
}

export const useMysticalTypewriter = ({
  runeSymbols = ['⟐', '⟡', '⟢', '⟣'],
  mysticalPauses = [],
  glowEffect = true,
  ...options
}: MysticalTypewriterOptions) => {
  const [currentRune, setCurrentRune] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.3);

  const baseTypewriter = useTypewriter(options);

  // Cycle through runes during typing
  useEffect(() => {
    if (!baseTypewriter.isTyping) return;

    const runeInterval = setInterval(() => {
      setCurrentRune(prev => (prev + 1) % runeSymbols.length);
    }, 200);

    return () => clearInterval(runeInterval);
  }, [baseTypewriter.isTyping, runeSymbols.length]);

  // Glow effect during typing
  useEffect(() => {
    if (!glowEffect) return;

    if (baseTypewriter.isTyping) {
      const glowInterval = setInterval(() => {
        setGlowIntensity(0.3 + Math.random() * 0.4);
      }, 100);

      return () => clearInterval(glowInterval);
    } else {
      setGlowIntensity(0.3);
    }
  }, [baseTypewriter.isTyping, glowEffect]);

  return {
    ...baseTypewriter,
    currentRune: runeSymbols[currentRune],
    glowIntensity,
    mysticalStyle: {
      textShadow: glowEffect ? `0 0 ${glowIntensity * 20}px rgba(139, 92, 246, ${glowIntensity})` : undefined,
      filter: baseTypewriter.isTyping ? `brightness(${1 + glowIntensity * 0.3})` : undefined
    }
  };
};

/**
 * Terminal-style typewriter with command processing
 * Perfect for CronoXai terminal integration
 */
export interface TerminalTypewriterOptions {
  commands: string[];
  prompt?: string;
  speed?: number;
  onCommandComplete?: (command: string, index: number) => void;
}

export const useTerminalTypewriter = ({
  commands,
  prompt = '> ',
  speed = 30,
  onCommandComplete
}: TerminalTypewriterOptions) => {
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);

  const currentTypewriter = useTypewriter({
    text: commands[currentCommandIndex] || '',
    speed,
    cursor: true,
    onComplete: () => {
      const currentCommand = commands[currentCommandIndex];
      setOutputLines(prev => [...prev, prompt + currentCommand]);
      
      if (onCommandComplete) {
        onCommandComplete(currentCommand, currentCommandIndex);
      }
      
      if (currentCommandIndex < commands.length - 1) {
        setTimeout(() => {
          setCurrentCommandIndex(prev => prev + 1);
        }, 500);
      }
    }
  });

  const addOutput = useCallback((output: string) => {
    setOutputLines(prev => [...prev, output]);
  }, []);

  const clear = useCallback(() => {
    setOutputLines([]);
    setCurrentCommandIndex(0);
    currentTypewriter.restart();
  }, [currentTypewriter]);

  return {
    currentLine: currentCommandIndex < commands.length ? prompt + currentTypewriter.displayText : '',
    outputLines,
    isProcessingCommands: currentCommandIndex < commands.length,
    currentCommandIndex,
    addOutput,
    clear,
    ...currentTypewriter
  };
};

/**
 * Text reveal utility functions
 */
export const createStaggeredReveal = (text: string, staggerDelay: number = 50) => {
  return text.split('').map((char, index) => ({
    char,
    delay: index * staggerDelay
  }));
};

export const createWordReveal = (text: string, wordDelay: number = 200) => {
  return text.split(' ').map((word, index) => ({
    word,
    delay: index * wordDelay
  }));
};

export const createLineReveal = (text: string, lineDelay: number = 1000) => {
  return text.split('\n').map((line, index) => ({
    line,
    delay: index * lineDelay
  }));
};

export default {
  useTypewriter,
  useSequentialTypewriter,
  useMysticalTypewriter,
  useTerminalTypewriter,
  createStaggeredReveal,
  createWordReveal,
  createLineReveal
};