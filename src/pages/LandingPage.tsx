import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_70%)]" />

      <div className="animate-fade-in flex flex-col items-center px-6 text-center">
        <svg className="w-28 h-28 sm:w-36 sm:h-36 mb-6 drop-shadow-[0_0_40px_rgba(255,215,0,0.3)]" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>
          </defs>
          <path d="M60 4C35 4 20 20 20 40c0 10 4 19 10 26l-6 12c-4 8-2 18 6 22l12 6c6 3 14 3 18 6l4 6h-8c-4 0-8 4-8 8h40c0-4-4-8-8-8h-8l4-6c4-3 12-3 18-6l12-6c8-4 10-14 6-22l-6-12c6-7 10-16 10-26 0-20-15-36-40-36z" fill="url(#cupGrad)" />
          <rect x="30" y="44" width="60" height="2" rx="1" fill="#B8860B" opacity="0.4" />
          <rect x="36" y="52" width="48" height="2" rx="1" fill="#B8860B" opacity="0.3" />
          <rect x="42" y="60" width="36" height="2" rx="1" fill="#B8860B" opacity="0.2" />
        </svg>

        <div className="animate-slide-up">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            Mundial 2022
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-light mb-6">
            Qatar <span className="inline-block animate-bounce-slow">⚽</span>
          </p>
          <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            Gestioná los resultados, seguí las posiciones de cada grupo,
            explorá el fixture y viví la emoción de la fase eliminatoria
            del Mundial de Fútbol.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-10 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-full text-base shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Ingresar al torneo
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 1s ease-out 0.3s both; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
