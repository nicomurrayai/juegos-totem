'use client';

import { useState } from 'react';

interface Button {
  id: number;
  emoji: string;
  color: string;
  activeColor: string;
}

export default function SimonGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showingSequence, setShowingSequence] = useState<boolean>(false);

  const buttons: Button[] = [
    { id: 0, emoji: '🦩', color: 'bg-[#5fb894]', activeColor: 'bg-[#7dd4b0]' },
    { id: 1, emoji: '🏃', color: 'bg-[#c67c7c]', activeColor: 'bg-[#e09898]' },
    { id: 2, emoji: '🦘', color: 'bg-[#d4b05e]', activeColor: 'bg-[#e8c878]' },
    { id: 3, emoji: '🍄', color: 'bg-[#7b9bc4]', activeColor: 'bg-[#95b3dc]' },
  ];

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    addToSequence([]);
  };

  const addToSequence = (currentSequence: number[]) => {
    const newSequence = [...currentSequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    setShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      setActiveButton(seq[i]);
      await new Promise<void>(resolve => setTimeout(resolve, 600));
      setActiveButton(null);
    }
    setShowingSequence(false);
  };

  const handleButtonClick = (buttonId: number) => {
    if (!isPlaying || showingSequence || gameOver) return;

    const newPlayerSequence = [...playerSequence, buttonId];
    setPlayerSequence(newPlayerSequence);

    // Animación visual
    setActiveButton(buttonId);
    setTimeout(() => setActiveButton(null), 300);

    // Verificar si el jugador se equivocó
    if (buttonId !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Verificar si completó la secuencia
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        addToSequence(sequence);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gray-300 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          PUNTAJE
        </h1>
        <div className="text-8xl font-black text-red-600" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {score}
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="w-[500px] h-[500px] rounded-full bg-[#3a4a5a] p-4 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 w-full h-full">
            {buttons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                disabled={!isPlaying || showingSequence || gameOver}
                className={`
                  ${activeButton === button.id ? button.activeColor : button.color}
                  rounded-full flex items-center justify-center text-9xl
                  transition-all duration-200 transform
                  ${!showingSequence && isPlaying && !gameOver ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                  ${activeButton === button.id ? 'scale-95 brightness-125' : ''}
                  disabled:opacity-70
                  ${button.id === 0 ? 'rounded-tl-full' : ''}
                  ${button.id === 1 ? 'rounded-tr-full' : ''}
                  ${button.id === 2 ? 'rounded-bl-full' : ''}
                  ${button.id === 3 ? 'rounded-br-full' : ''}
                `}
              >
                <span className="drop-shadow-lg">{button.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12 text-center">
        {!isPlaying && !gameOver && (
          <button
            onClick={startGame}
            className="bg-red-600 hover:bg-red-700 text-white text-2xl font-black px-12 py-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            INICIAR
          </button>
        )}

        {gameOver && (
          <div className="space-y-4">
            <p className="text-3xl font-black text-red-600 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              GAME OVER
            </p>
            <button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-700 text-white text-2xl font-black px-12 py-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              REINTENTAR
            </button>
          </div>
        )}

        {showingSequence && (
          <p className="text-xl font-bold text-gray-400 mt-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            OBSERVA...
          </p>
        )}
      </div>
    </div>
  );
}