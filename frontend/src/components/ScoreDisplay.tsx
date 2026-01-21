import { Match } from '../api/client';

interface ScoreDisplayProps {
  match: Match;
  sportSlug: string;
  variant?: 'live' | 'compact';
}

export function ScoreDisplay({ match, sportSlug, variant = 'live' }: ScoreDisplayProps) {
  const s: any = match.score || {};

  // Box Cricket Format
  if (sportSlug === 'box-cricket') {
    const teamA: any = s.teamA || {};
    const teamB: any = s.teamB || {};
    
    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamA.runs || 0}/{teamA.wickets || 0} ({teamA.overs || 0}) vs {teamB.runs || 0}/{teamB.wickets || 0} ({teamB.overs || 0})</div>
          <div className="text-gray-500 text-[10px]">{s.innings || '1st'} Innings</div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 my-3.5">
        <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamA.runs || 0}/{teamA.wickets || 0}</div>
          <div className="text-xs text-gray-500">({teamA.overs || 0} overs)</div>
          <div className="text-xs font-semibold mt-1">{match.teamA}</div>
        </div>
        <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamB.runs || 0}/{teamB.wickets || 0}</div>
          <div className="text-xs text-gray-500">({teamB.overs || 0} overs)</div>
          <div className="text-xs font-semibold mt-1">{match.teamB}</div>
        </div>
        <div className="col-span-2 text-center text-xs text-gray-500 font-semibold uppercase tracking-wide">
          {s.innings || '1st'} Innings
        </div>
      </div>
    );
  }

  // Chess format (wins/draws)
  if (sportSlug === 'chess') {
    const teamAWins = typeof s.teamA === 'object' ? (s.teamA?.wins || 0) : (s.teamA || 0);
    const teamBWins = typeof s.teamB === 'object' ? (s.teamB?.wins || 0) : (s.teamB || 0);
    const draws = s.draws || 0;

    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamAWins} - {teamBWins}</div>
          <div className="text-gray-500 text-[10px]">{draws > 0 ? `${draws} Draw${draws > 1 ? 's' : ''}` : 'Wins'}</div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAWins}</div>
            <div className="text-xs text-gray-500">Wins</div>
            <div className="text-xs font-semibold mt-1">{match.teamA}</div>
          </div>
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBWins}</div>
            <div className="text-xs text-gray-500">Wins</div>
            <div className="text-xs font-semibold mt-1">{match.teamB}</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mt-2">
          {draws > 0 ? `${draws} Draw${draws > 1 ? 's' : ''}` : s.round || 'In Progress'}
        </div>
      </>
    );
  }

  // Pool format (frames)
  if (sportSlug === 'pool') {
    const teamAFrames = typeof s.teamA === 'object' ? (s.teamA?.frames || 0) : (s.teamA || 0);
    const teamBFrames = typeof s.teamB === 'object' ? (s.teamB?.frames || 0) : (s.teamB || 0);

    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamAFrames} - {teamBFrames}</div>
          <div className="text-gray-500 text-[10px]">Frames</div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAFrames}</div>
            <div className="text-xs text-gray-500">Frames</div>
            <div className="text-xs font-semibold mt-1">{match.teamA}</div>
          </div>
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBFrames}</div>
            <div className="text-xs text-gray-500">Frames</div>
            <div className="text-xs font-semibold mt-1">{match.teamB}</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mt-2">
          {s.round || 'In Progress'}
        </div>
      </>
    );
  }

  // Tug of War / Power Lifting (rounds/attempts based)
  if (['tug-of-war', 'power-lifting'].includes(sportSlug)) {
    const teamAWins = typeof s.teamA === 'object' ? (s.teamA?.wins || 0) : (s.teamA || 0);
    const teamBWins = typeof s.teamB === 'object' ? (s.teamB?.wins || 0) : (s.teamB || 0);
    const label = sportSlug === 'tug-of-war' ? 'Rounds Won' : 'Score';

    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamAWins} - {teamBWins}</div>
          <div className="text-gray-500 text-[10px]">{label}</div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAWins}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-xs font-semibold mt-1">{match.teamA}</div>
          </div>
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBWins}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-xs font-semibold mt-1">{match.teamB}</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mt-2">
          {s.round || 'In Progress'}
        </div>
      </>
    );
  }

  // Volleyball, Table Tennis, Badminton, Squash (Set-based)
  if (['volleyball', 'table-tennis', 'badminton', 'squash'].includes(sportSlug)) {
    const teamAScore = typeof s.teamA === 'object' ? (s.teamA?.score || 0) : (s.teamA || 0);
    const teamBScore = typeof s.teamB === 'object' ? (s.teamB?.score || 0) : (s.teamB || 0);

    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamAScore} - {teamBScore} (Sets)</div>
          <div className="text-gray-500 text-[10px]">Set {s.set || 1}: {s.currentSetA || 0}-{s.currentSetB || 0}</div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAScore}</div>
            <div className="text-xs text-gray-500">Sets Won</div>
            <div className="text-xs font-semibold mt-1">{match.teamA}</div>
          </div>
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBScore}</div>
            <div className="text-xs text-gray-500">Sets Won</div>
            <div className="text-xs font-semibold mt-1">{match.teamB}</div>
          </div>
        </div>
        <div className="text-center text-sm font-mono bg-white/50 rounded-lg py-2 px-3 mt-2">
          Current Set {s.set || 1}: <span className="font-bold">{s.currentSetA || 0} - {s.currentSetB || 0}</span>
        </div>
      </>
    );
  }

  // Football/Futsal
  if (['futsal', 'football'].includes(sportSlug)) {
    const teamAScore = typeof s.teamA === 'object' ? (s.teamA?.score || 0) : (s.teamA || 0);
    const teamBScore = typeof s.teamB === 'object' ? (s.teamB?.score || 0) : (s.teamB || 0);

    if (variant === 'compact') {
      return (
        <div className="text-xs">
          <div className="font-bold">{teamAScore} - {teamBScore}</div>
          <div className="text-gray-500 text-[10px]">{s.period || '1st Half'} {s.time ? `• ${s.time}` : ''}</div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 my-3.5">
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAScore}</div>
            <div className="text-xs font-semibold mt-1">{match.teamA}</div>
          </div>
          <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBScore}</div>
            <div className="text-xs font-semibold mt-1">{match.teamB}</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mt-2">
          {s.period || '1st Half'} {s.time && `• ${s.time}`}
        </div>
      </>
    );
  }

  // Default (Basketball, etc.)
  const teamAScore = typeof s.teamA === 'object' ? (s.teamA?.score || 0) : (s.teamA || 0);
  const teamBScore = typeof s.teamB === 'object' ? (s.teamB?.score || 0) : (s.teamB || 0);

  if (variant === 'compact') {
    return (
      <div className="text-xs">
        <div className="font-bold">{teamAScore} - {teamBScore}</div>
        {s.period && <div className="text-gray-500 text-[10px]">{s.period}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 my-3.5">
        <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamAScore}</div>
          <div className="text-xs font-semibold mt-1">{match.teamA}</div>
        </div>
        <div className="text-center bg-white border border-[#eef2f7] rounded-2xl py-[18px] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="text-[42px] font-extrabold max-[420px]:text-4xl">{teamBScore}</div>
          <div className="text-xs font-semibold mt-1">{match.teamB}</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mt-2">
        {s.period || '-'}
      </div>
    </>
  );
}
