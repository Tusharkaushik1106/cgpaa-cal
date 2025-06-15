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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                CGPA Calculator
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Calculator
              </Link>
              <Link
                href="/leaderboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Leaderboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {session.user?.name}</span>
                <button
                  onClick={signOutHandler}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 