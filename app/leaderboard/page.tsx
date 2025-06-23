'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
  username: string;
  guessedCGPA: number;
  actualCGPA: number | null;
  difference: number | null;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleSort = () => {
    setLeaderboard(prev =>
      [...prev].sort((a, b) => {
        if (b.actualCGPA === null && a.actualCGPA === null) return 0;
        if (b.actualCGPA === null) return -1;
        if (a.actualCGPA === null) return 1;
        return (b.actualCGPA as number) - (a.actualCGPA as number);
      })
    );
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-white text-center mb-10 tracking-tight">CGPA Leaderboard</h1>
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSort}
            className="bg-gradient-to-r from-[#6ee7b7] to-[#3b82f6] text-[#18181b] font-bold py-2 px-8 rounded-full shadow-lg text-lg transition-all duration-300 hover:from-[#3b82f6] hover:to-[#6ee7b7] focus:outline-none focus:ring-2 focus:ring-[#6ee7b7]/40"
          >
            Sort by Actual CGPA
          </button>
        </div>
        <div className="bg-[#18181b]/80 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden backdrop-blur-md">
          <table className="min-w-full">
            <thead className="bg-[#232329]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Guessed CGPA</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Actual CGPA</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Difference</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={entry.username} className={
                  `transition-colors duration-200 ${idx % 2 === 0 ? 'bg-[#232329]/60' : 'bg-[#18181b]/60'} hover:bg-[#6ee7b7]/10`
                }>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white">{entry.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-4 py-1 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] font-bold text-base">
                      {entry.guessedCGPA.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.actualCGPA !== null ? (
                      <span className="inline-block px-4 py-1 rounded-full bg-[#6ee7b7]/20 text-[#6ee7b7] font-bold text-base">
                        {entry.actualCGPA.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-zinc-500">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.difference !== null ? (
                      <span className="inline-block px-4 py-1 rounded-full bg-[#f59e42]/20 text-[#f59e42] font-bold text-base">
                        {entry.difference.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-zinc-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 