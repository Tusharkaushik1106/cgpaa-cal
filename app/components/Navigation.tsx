'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation() {
  const { data: session } = useSession();

  // Custom sign out handler
  const signOutHandler = async () => {
    // Check for unsaved CGPA in localStorage
    const unsavedCGPA = localStorage.getItem('unsavedCGPA');
    console.log('SignOut clicked. unsavedCGPA in localStorage:', unsavedCGPA);
    if (session?.user?.name && unsavedCGPA) {
      console.log('Saving unsavedCGPA for', session.user.name, 'with value', unsavedCGPA);
      const response = await fetch('/api/save-cgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: session.user.name, actualCGPA: parseFloat(unsavedCGPA) }),
      });
      const data = await response.json();
      console.log('Save CGPA API response (signOut):', data);
      localStorage.removeItem('unsavedCGPA');
      console.log('unsavedCGPA saved and removed from localStorage');
    }
    signOut();
  };

  return (
    <nav className="bg-white justify-centre space-even shadow-lg px-8 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-black tracking-tight no-underline hover:text-black active:text-black focus:text-black">
          CGPA Calculator
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/leaderboard" className="text-black text-lg font-bold no-underline hover:text-black active:text-black focus:text-black hover:opacity-80 transition">Leaderboard</Link>
          {session && (
            <>
              <span className="text-black text-base font-medium">Welcome,  {session.user?.name}</span>
              <button
                onClick={signOutHandler}
                className="bg-white hover:bg-zinc-200 text-black font-bold py-2 px-6 rounded-full text-base transition shadow border border-zinc-300"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 