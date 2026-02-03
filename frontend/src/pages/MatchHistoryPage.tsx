import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScoreDisplay } from "../components/ScoreDisplay";
import { api, Sport, Match } from "../api/client";

const SPORT_ICONS: Record<string, string> = {
  'box-cricket': '🏏',
  'boxcricket': '🏏',
  'futsal': '⚽',
  'basketball': '🏀',
  'volleyball': '🏐',
  'table-tennis': '🏓',
  'tabletennis': '🏓',
  'power-lifting': '🏋️',
  'powerlifting': '🏋️',
  'pool': '🎱',
  'badminton': '🏸',
  'squash': '🎾',
  'tug-of-war': '🪢',
  'tugofwar': '🪢',
  'chess': '♟️'
};

export default function MatchHistoryPage() {
  const navigate = useNavigate();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      loadCompletedMatches(selectedSport);
    }
  }, [selectedSport]);

  async function loadSports() {
    try {
      const { items } = await api.getSports();
      setSports(items);
      if (items.length > 0 && !selectedSport) {
        setSelectedSport(items[0].slug);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load sports:', err);
      setError('Failed to load sports');
      setLoading(false);
    }
  }

  async function loadCompletedMatches(sportSlug: string) {
    try {
      setError(null);
      const { items } = await api.getMatches({ 
        sport_slug: sportSlug,
        status: 'COMPLETED',
        limit: 100
      });

      setCompletedMatches(items);
    } catch (err) {
      console.error('Failed to load match history:', err);
      setError('Failed to load match history');
    }
  }

  const currentSport = sports.find(s => s.slug === selectedSport);

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/Background.png')] bg-center bg-cover bg-no-repeat bg-fixed bg-white font-[system-ui,sans-serif]">
        <div className="max-w-[920px] mx-auto">
          <header className="pt-5 px-20 pb-2">
            <img src="/ghs_carnival_logo.png" alt="GHS Carnival" className="max-w-[280px] block" />
          </header>
          <div className="p-4 text-center text-gray-500">Loading match history...</div>
        </div>
      </div>
    );
  }

  if (error || sports.length === 0) {
    return (
      <div className="min-h-screen bg-[url('/Background.png')] bg-center bg-cover bg-no-repeat bg-fixed bg-white font-[system-ui,sans-serif]">
        <div className="max-w-[920px] mx-auto">
          <header className="pt-5 px-20 pb-2">
            <img src="/ghs_carnival_logo.png" alt="GHS Carnival" className="max-w-[280px] block" />
          </header>
          <div className="p-4 text-center">
            <p className="text-red-500 mb-4">{error || 'No sports available yet'}</p>
            <p className="text-sm text-gray-500">Please check back later or contact the admin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/Background.png')] bg-center bg-cover bg-no-repeat bg-fixed bg-white font-[system-ui,sans-serif]">
      <div className="max-w-[920px] mx-auto">
        <header className="pt-5 px-20 pb-2 flex items-center justify-between">
          <img src="/ghs_carnival_logo.png" alt="GHS Carnival" className="max-w-[280px] block" />
          <button
            onClick={() => navigate('/live-scores')}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Live Scores
          </button>
        </header>

        <div className="px-4 mt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Match History</h1>
          <p className="text-sm text-gray-500 mb-4">View all completed matches by sport</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3 px-4 mt-1 max-[420px]:grid-cols-3 max-[420px]:gap-2 min-[1280px]:grid-cols-[repeat(6,minmax(110px,1fr))] min-[1280px]:gap-[14px]">
          {sports.map((s) => (
            <button
              key={s.slug}
              className={`flex flex-col items-center gap-1.5 bg-white rounded-[14px] py-3 px-2 text-xs font-semibold cursor-pointer border transition-[0.2s_ease] shadow-[0_1px_2px_rgba(0,0,0,0.04)] max-[420px]:py-2.5 max-[420px]:px-1.5 max-[420px]:rounded-xl ${
                selectedSport === s.slug 
                  ? 'bg-gradient-to-br from-rose-50 via-orange-50/50 to-orange-50 border-rose-200 shadow-[0_0_0_3px_rgba(254,205,211,0.55)]' 
                  : 'border-gray-200'
              }`}
              onClick={() => setSelectedSport(s.slug)}
              aria-pressed={selectedSport === s.slug}
            >
              <span className="text-lg">{SPORT_ICONS[s.slug] || '🏆'}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        <main className="p-4 min-[900px]:max-w-[720px] min-[900px]:mx-auto min-[1280px]:max-w-[840px]">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mt-[22px] mb-2.5">
            {currentSport?.name.toUpperCase()} - COMPLETED MATCHES
          </h2>

          {completedMatches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-lg text-gray-600 mb-2">No completed matches yet</p>
              <p className="text-sm text-gray-400">Check back after matches are finished</p>
            </div>
          ) : (
            <section className="space-y-3">
              {completedMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white rounded-[18px] p-4 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base text-gray-800">
                          {match.teamA} <span className="text-orange-500 font-normal">vs</span> {match.teamB}
                        </h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold uppercase">
                          Completed
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {match.startTime && (
                          <>
                            <span>📅 {new Date(match.startTime).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                            <span>•</span>
                            <span>🕐 {new Date(match.startTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </>
                        )}
                        {match.venue && (
                          <>
                            <span>•</span>
                            <span>📍 {match.venue}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-xl p-3 border border-gray-100">
                    <ScoreDisplay match={match} sportSlug={selectedSport || ''} variant="completed" />
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
