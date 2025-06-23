'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Inter } from 'next/font/google';
import Image from 'next/image';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const validUsers = [
  { username: 'divij', guessedCGPA: 9.38 },
  { username: 'akshar', guessedCGPA: 9.21 },
  { username: 'tushar', guessedCGPA: 8.74 },
  { username: 'piyush', guessedCGPA: 8.54 },
  { username: 'purav', guessedCGPA: 8.34 },
  { username: 'sarthak', guessedCGPA: 7.74 },
  { username: 'singh', guessedCGPA: 7.63 },
  { username: 'laksh', guessedCGPA: 9.12 },
  { username: 'ahuja', guessedCGPA: 8.06 },
  { username: 'gaurav', guessedCGPA: 9.16 },
  { username: 'drip queen', guessedCGPA: 8.5 },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = validUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      setError('Invalid username. Please try again.');
      return;
    }
    try {
      await signIn('credentials', {
        username: user.username,
        redirect: true,
        callbackUrl: '/',
      });
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex rounded-2xl items-center justify-center bg-[#000000] ${inter.variable}`}>
      <div className="w-[35rem] h-[35rem] bg-[#18181b] rounded-3xl shadow-2xl flex flex-col items-center justify-center border border-zinc-800 backdrop-blur-md px-8">
        {/* Image */}
        <Image src="/gpa-to-Percentage-grade.png" alt="GPA to Percentage" width={128} height={128} className="w-32 h-auto mb-2 object-contain" />
        {/* Icon */}
        <br/>
        <div className="mb-4 text-4xl text-white/80"></div>
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight" style={{letterSpacing: '-0.02em'}}>Welcome to CGPA Calculator</h1>
        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-8">
          <br/>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full min-w-[12rem] max-w-[20rem] px-5 py-3 rounded-xl bg-[#232329] border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6ee7b7] focus:border-[#6ee7b7] text-lg text-center shadow-sm transition-all duration-200"
            placeholder="Enter your username"
            autoComplete="username"
          />
          <br/>
          {error && <p className="text-red-400 text-base mt-1">{error}</p>}
          <button
            type="submit"
            className="w-full min-w-[12rem] max-w-[20rem] py-5 rounded-full bg-white text-zinc-800 font-semibold text-xl shadow-md hover:bg-zinc-100 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-[#6ee7b7]/40 mt-4 tracking-wide"
          >
            Login
          </button>
        </form>
        <br/>
        <span>Created by</span><h3 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight" style={{letterSpacing: '-0.02em'}}>MASTER TUSHAR KAUSHIK</h3>
      </div>
    </div>
  );
} 