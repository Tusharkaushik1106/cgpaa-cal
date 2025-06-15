'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = validUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return;
    }

    try {
      const result = await signIn('credentials', {
        username: user.username,
        redirect: false,
      });

      if (result?.error) {
        // handle error if needed
      } else {
        router.push('/');
      }
    } catch (error) {
      // handle error if needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">CGPA Calculator Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 