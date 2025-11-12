import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decoración circular roja en la esquina */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 w-full max-w-4xl">
        {/* Título */}
        <h1 className="text-6xl md:text-7xl font-black text-red-600 text-center mb-16 tracking-wider"
            style={{ fontFamily: "'Press Start 2P', 'Courier New', monospace", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          MINI JUEGOS
        </h1>
        
        {/* Botones */}
        <div className="flex flex-col gap-6">
          <Link 
            href="/simon" 
            className="w-full bg-[#e8dcc8] hover:bg-[#d4c8b4] text-red-600 text-3xl md:text-4xl font-black text-center py-8 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ fontFamily: "'Press Start 2P', 'Courier New', monospace" }}
          >
            SIMON
          </Link>
          
          <Link 
            href="/puzzle" 
            className="w-full bg-[#e8dcc8] hover:bg-[#d4c8b4] text-red-600 text-3xl md:text-4xl font-black text-center py-8 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ fontFamily: "'Press Start 2P', 'Courier New', monospace" }}
          >
            PUZZLE
          </Link>
        </div>
      </div>
    </div>
  );
}