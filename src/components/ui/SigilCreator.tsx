import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SigilCreatorProps {
  onSigilSave?: (sigil: string) => void;
  className?: string;
}

const RUNE_SYMBOLS = ['⟐', '⟡', '⟢', '⟣', '⟤', '⟥', '⟦', '⟧', '◉', '◎', '⬢', '⬡', '⬟', '⬠'];

const SigilCreator: React.FC<SigilCreatorProps> = ({ onSigilSave, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [selectedRunes, setSelectedRunes] = useState<string[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all paths
    paths.forEach(path => {
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
    
    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
    
    // Draw runes
    selectedRunes.forEach((rune, index) => {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '20px monospace';
      ctx.fillText(rune, 20 + (index * 30), 30);
    });
    
  }, [paths, currentPath, selectedRunes]);
  
  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };
  
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath(prev => [...prev, { x, y }]);
  };
  
  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 1) {
      setPaths(prev => [...prev, currentPath]);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };
  
  const addRune = (rune: string) => {
    if (selectedRunes.length < 8) {
      setSelectedRunes(prev => [...prev, rune]);
    }
  };
  
  const clearSigil = () => {
    setPaths([]);
    setCurrentPath([]);
    setSelectedRunes([]);
  };
  
  const saveSigil = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const sigilData = {
      paths,
      runes: selectedRunes,
      timestamp: Date.now(),
      image: dataUrl
    };
    
    // Save to localStorage
    const savedSigils = JSON.parse(localStorage.getItem('echocron_sigils') || '[]');
    savedSigils.push(sigilData);
    localStorage.setItem('echocron_sigils', JSON.stringify(savedSigils));
    
    onSigilSave?.(dataUrl);
    
    // Show success message
    alert('Sigil saved to your mystical collection!');
  };
  
  return (
    <div className={`bg-black/50 border border-purple-400/30 rounded-lg p-4 ${className}`}>
      <h3 className="text-purple-400 font-bold text-lg mb-4">⟐ Interactive Sigil Creator ⟐</h3>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-gray-600/50 rounded bg-black cursor-crosshair mb-4 block mx-auto"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      {/* Rune Selection */}
      <div className="mb-4">
        <h4 className="text-yellow-400 text-sm font-medium mb-2">Sacred Runes:</h4>
        <div className="grid grid-cols-7 gap-2">
          {RUNE_SYMBOLS.map(rune => (
            <motion.button
              key={rune}
              onClick={() => addRune(rune)}
              className="w-8 h-8 bg-gray-800/50 border border-gray-600/30 rounded text-yellow-400 hover:bg-gray-700/50 hover:border-yellow-400/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {rune}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Selected Runes Display */}
      {selectedRunes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-yellow-400 text-sm font-medium mb-2">Your Sigil Runes:</h4>
          <div className="text-yellow-400 text-lg tracking-wider">
            {selectedRunes.join(' ')}
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex gap-2">
        <motion.button
          onClick={clearSigil}
          className="px-4 py-2 bg-red-600/20 border border-red-400/30 text-red-400 rounded hover:bg-red-600/30 transition-all text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear
        </motion.button>
        <motion.button
          onClick={saveSigil}
          className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 text-purple-400 rounded hover:bg-purple-600/30 transition-all text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={paths.length === 0 && selectedRunes.length === 0}
        >
          Save Sigil
        </motion.button>
      </div>
      
      <p className="text-gray-400 text-xs mt-2">
        Draw mystical patterns and combine with sacred runes to create your personal sigil.
      </p>
    </div>
  );
};

export default SigilCreator;
