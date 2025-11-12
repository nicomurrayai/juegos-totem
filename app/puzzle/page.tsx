'use client';

import { useState, useEffect, useRef } from 'react';

interface Tile {
  id: number;
  position: number;
  imagePosition: number;
}

export default function PuzzleGame() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [draggedTile, setDraggedTile] = useState<Tile | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Imagen de puzzle - puedes cambiar esta URL
  const puzzleImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop';

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  const initializePuzzle = () => {
    const initialTiles: Tile[] = [];
    for (let i = 0; i < 9; i++) {
      if (i !== 8) {
        initialTiles.push({
          id: i,
          position: i,
          imagePosition: i
        });
      }
    }
    setTiles(initialTiles);
  };

  const shufflePuzzle = () => {
    const shuffled = [...tiles];
    for (let i = 0; i < 100; i++) {
      const emptyPos = getEmptyPosition(shuffled);
      const movable = getMovableTiles(emptyPos, shuffled);
      if (movable.length > 0) {
        const randomTile = movable[Math.floor(Math.random() * movable.length)];
        const tileIndex = shuffled.findIndex(t => t.position === randomTile);
        shuffled[tileIndex] = { ...shuffled[tileIndex], position: emptyPos };
      }
    }
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsSolved(false);
  };

  const getEmptyPosition = (currentTiles: Tile[]): number => {
    const occupied = currentTiles.map(t => t.position);
    for (let i = 0; i < 9; i++) {
      if (!occupied.includes(i)) return i;
    }
    return 8;
  };

  const getMovableTiles = (emptyPos: number, currentTiles: Tile[]): number[] => {
    const movable: number[] = [];
    const row = Math.floor(emptyPos / 3);
    const col = emptyPos % 3;

    // Arriba
    if (row > 0) movable.push(emptyPos - 3);
    // Abajo
    if (row < 2) movable.push(emptyPos + 3);
    // Izquierda
    if (col > 0) movable.push(emptyPos - 1);
    // Derecha
    if (col < 2) movable.push(emptyPos + 1);

    return movable.filter(pos => 
      currentTiles.some(t => t.position === pos)
    );
  };

  const moveTile = (tile: Tile) => {
    if (!isPlaying || isSolved) return false;

    const emptyPos = getEmptyPosition(tiles);
    const movable = getMovableTiles(emptyPos, tiles);

    if (movable.includes(tile.position)) {
      const newTiles = tiles.map(t =>
        t.id === tile.id
          ? { ...t, position: emptyPos }
          : t
      );
      setTiles(newTiles);
      setMoves(moves + 1);

      // Verificar si está resuelto
      const solved = newTiles.every(t => t.position === t.imagePosition);
      if (solved) {
        setIsSolved(true);
        setIsPlaying(false);
      }
      return true;
    }
    return false;
  };

  const handleTileClick = (tile: Tile) => {
    moveTile(tile);
  };

  // Mouse drag handlers
  const handleMouseDown = (tile: Tile, e: React.MouseEvent) => {
    if (!isPlaying || isSolved) return;
    setDraggedTile(tile);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedTile || !dragStartPos.current) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const emptyPos = getEmptyPosition(tiles);
      const tileRow = Math.floor(draggedTile.position / 3);
      const tileCol = draggedTile.position % 3;
      const emptyRow = Math.floor(emptyPos / 3);
      const emptyCol = emptyPos % 3;

      let shouldMove = false;

      if (tileRow === emptyRow) {
        if (deltaX > threshold && emptyCol > tileCol) shouldMove = true;
        if (deltaX < -threshold && emptyCol < tileCol) shouldMove = true;
      }
      if (tileCol === emptyCol) {
        if (deltaY > threshold && emptyRow > tileRow) shouldMove = true;
        if (deltaY < -threshold && emptyRow < tileRow) shouldMove = true;
      }

      if (shouldMove) {
        moveTile(draggedTile);
        setDraggedTile(null);
        dragStartPos.current = null;
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedTile(null);
    dragStartPos.current = null;
  };

  // Touch handlers
  const handleTouchStart = (tile: Tile, e: React.TouchEvent) => {
    if (!isPlaying || isSolved) return;
    const touch = e.touches[0];
    setDraggedTile(tile);
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedTile || !dragStartPos.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartPos.current.x;
    const deltaY = touch.clientY - dragStartPos.current.y;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const emptyPos = getEmptyPosition(tiles);
      const tileRow = Math.floor(draggedTile.position / 3);
      const tileCol = draggedTile.position % 3;
      const emptyRow = Math.floor(emptyPos / 3);
      const emptyCol = emptyPos % 3;

      let shouldMove = false;

      if (tileRow === emptyRow) {
        if (deltaX > threshold && emptyCol > tileCol) shouldMove = true;
        if (deltaX < -threshold && emptyCol < tileCol) shouldMove = true;
      }
      if (tileCol === emptyCol) {
        if (deltaY > threshold && emptyRow > tileRow) shouldMove = true;
        if (deltaY < -threshold && emptyRow < tileRow) shouldMove = true;
      }

      if (shouldMove) {
        moveTile(draggedTile);
        setDraggedTile(null);
        dragStartPos.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggedTile(null);
    dragStartPos.current = null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="flex justify-between w-full max-w-[600px] mb-8">
        <div className="text-center">
          <h2 className="text-xl font-black text-red-600 mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            MOVIMIENTOS
          </h2>
          <div className="text-6xl font-black text-red-600" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {moves}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-green-500 mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            TIEMPO
          </h2>
          <div className="text-6xl font-black text-green-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Puzzle Board */}
      <div className="relative">
        <div 
          className="w-[600px] h-[600px] bg-[#3a4a5a] rounded-3xl p-4 shadow-2xl"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full grid grid-cols-3 gap-2">
            {tiles.map((tile) => {
              const row = Math.floor(tile.position / 3);
              const col = tile.position % 3;
              const imgRow = Math.floor(tile.imagePosition / 3);
              const imgCol = tile.imagePosition % 3;

              return (
                <div
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  onMouseDown={(e) => handleMouseDown(tile, e)}
                  onTouchStart={(e) => handleTouchStart(tile, e)}
                  className={`
                    relative overflow-hidden rounded-xl
                    transition-all duration-200
                    ${isPlaying && !isSolved ? 'hover:brightness-110 hover:scale-105 cursor-move active:cursor-grabbing' : 'cursor-default'}
                    ${draggedTile?.id === tile.id ? 'scale-105 brightness-110' : ''}
                    shadow-lg select-none touch-none
                  `}
                  style={{
                    gridColumn: col + 1,
                    gridRow: row + 1,
                  }}
                >
                  <div
                    className="w-full h-full bg-cover bg-no-repeat pointer-events-none"
                    style={{
                      backgroundImage: `url(${puzzleImage})`,
                      backgroundPosition: `${-imgCol * 192}px ${-imgRow * 192}px`,
                      backgroundSize: '576px 576px',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12 text-center">
        {!isPlaying && !isSolved && (
          <button
            onClick={shufflePuzzle}
            className="bg-red-600 hover:bg-red-700 text-white text-2xl font-black px-12 py-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            INICIAR
          </button>
        )}

        {isSolved && (
          <div className="space-y-4">
            <p className="text-3xl font-black text-green-500 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              ¡COMPLETADO!
            </p>
            <p className="text-xl text-gray-400 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {moves} movimientos en {formatTime(time)}
            </p>
            <button
              onClick={shufflePuzzle}
              className="bg-red-600 hover:bg-red-700 text-white text-2xl font-black px-12 py-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              JUGAR DE NUEVO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}