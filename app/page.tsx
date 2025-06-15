"use client";

import { Dancing_Script } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
});

interface SubjectInput {
  marks: number | '';
  credits: number | '';
}

export default function Home() {
  const [numSubjects, setNumSubjects] = useState<number>(8);
  const [subjects, setSubjects] = useState<SubjectInput[]>(Array.from({ length: numSubjects }, () => ({ marks: '', credits: '' })));
  const [cgpa, setCgpa] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [adminClearing, setAdminClearing] = useState(false);
  const [adminCleared, setAdminCleared] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const getGradePoint = (marks: number): number => {
    if (marks >= 90) return 10;
    if (marks >= 75) return 9;
    if (marks >= 65) return 8;
    if (marks >= 55) return 7;
    if (marks >= 50) return 6;
    if (marks >= 45) return 5;
    if (marks >= 40) return 4;
    return 0;
  };

  const calculateCGPA = () => {
    let totalCreditPoints = 0;
    let totalCredits = 0;

    for (const subject of subjects) {
      if (subject.marks !== '' && subject.credits !== '') {
        const gradePoint = getGradePoint(subject.marks);
        totalCreditPoints += gradePoint * subject.credits;
        totalCredits += subject.credits;
      }
    }

    if (totalCredits === 0) {
      setCgpa('N/A');
      setDivision('N/A');
      return;
    }

    const calculatedCgpa = (totalCreditPoints / totalCredits).toFixed(2);
    setCgpa(calculatedCgpa);
    setDivision(getDivision(parseFloat(calculatedCgpa)));
    if (session?.user?.name) {
      localStorage.setItem('unsavedCGPA', calculatedCgpa);
      console.log('Set unsavedCGPA in localStorage:', calculatedCgpa);
      saveCGPA(calculatedCgpa);
    }
  };

  const getDivision = (cgpaValue: number): string => {
    if (cgpaValue === 10) return 'Exemplary Performance';
    if (cgpaValue >= 6.5) return 'First Division';
    if (cgpaValue >= 5.0) return 'Second Division';
    if (cgpaValue >= 4.0) return 'Third Division';
    return 'Fail'; // Or appropriate message for CGPA < 4.0
  };

  const handleNumSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumSubjects = parseInt(e.target.value);
    setNumSubjects(newNumSubjects);
    setSubjects(Array.from({ length: newNumSubjects }, (_, i) => subjects[i] || { marks: '', credits: '' }));
  };

  const handleSubjectChange = (index: number, field: keyof SubjectInput, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: parseFloat(value) || '' };
    setSubjects(newSubjects);
  };

  const saveCGPA = async (cgpaValue: string) => {
    if (!session?.user?.name || !cgpaValue) return;
    setSaving(true);
    setSaved(false);
    console.log('Saving CGPA for', session.user.name, 'with value', cgpaValue);
    const response = await fetch('/api/save-cgpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session.user.name, actualCGPA: parseFloat(cgpaValue) }),
    });
    const data = await response.json();
    console.log('Save CGPA API response:', data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    localStorage.removeItem('unsavedCGPA');
    console.log('CGPA saved and unsavedCGPA removed from localStorage');
  };

  const clearCGPA = async () => {
    if (!session?.user?.name) return;
    setClearing(true);
    setCleared(false);
    await fetch('/api/clear-cgpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session.user.name }),
    });
    setClearing(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
    // Optionally, refresh the page or leaderboard
  };

  const clearAllCGPA = async () => {
    setAdminClearing(true);
    setAdminError('');
    const response = await fetch('/api/clear-all-cgpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session?.user?.name, password: adminPassword }),
    });
    const data = await response.json();
    setAdminClearing(false);
    if (data.success) {
      setAdminCleared(true);
      setTimeout(() => setAdminCleared(false), 2000);
      setAdminPassword('');
    } else {
      setAdminError(data.error || 'Failed to clear all CGPA');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center p-8 bg-gradient-to-br from-white to-[#f0f0e0] text-black ${dancingScript.className} antialiased relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-[10%] w-24 h-24 bg-[#d4d4aa] rounded-full opacity-10 animate-float-1 z-0"></div>
      <div className="absolute bottom-1/4 right-[15%] w-32 h-32 bg-[#a09a8a] rounded-lg opacity-10 animate-float-2 rotate-12 z-0"></div>
      <div className="absolute top-[15%] right-[5%] w-16 h-16 bg-[#f5f5dc] rounded-full opacity-15 animate-float-3 z-0"></div>
      <div className="absolute bottom-[5%] left-[20%] w-20 h-20 bg-[#ececec] rounded-xl opacity-10 animate-float-4 -rotate-90 z-0"></div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 text-center md:text-left z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#333] tracking-wider leading-tight drop-shadow-lg animate-fade-in-down">
          <span className="text-[#a09a8a]">CGPA</span> CALCULATOR
        </h1>
        <p className="text-xl md:text-2xl text-[#555] mt-6 leading-relaxed animate-fade-in-up">
          Calculate your Cumulative Grade Point Average with ease. Fast, Visual, and Accurate Results.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 z-10">
        <div className="bg-[--color-dark-beige] p-10 md:p-14 rounded-3xl shadow-2xl-custom w-full max-w-xl border border-[--color-accent] transform transition-all duration-500 hover:scale-[1.005] animate-fade-in-right relative">
          <h2 className="text-3xl font-bold text-[--color-dark-gray] mb-8 text-center">IPU CGPA CALCULATOR</h2>

          <div className="mb-8 text-center">
            <label htmlFor="num-subjects" className="block text-lg font-medium text-[--color-medium-gray] mb-4">
              Choose number of subjects: <strong className="text-[--color-dark-gray] text-2xl">{numSubjects}</strong>
            </label>
            <input
              type="range"
              id="num-subjects"
              min="1"
              max="15"
              value={numSubjects}
              onChange={handleNumSubjectsChange}
              className="w-3/4 h-3 bg-[--color-accent] rounded-lg appearance-none cursor-pointer accent-[--color-dark-accent] shadow-inner transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="overflow-x-auto mb-8 border border-[--color-dark-beige] rounded-lg shadow-lg-custom bg-[--color-white] animate-fade-in">
            <table className="min-w-full bg-transparent table-fixed border-collapse" style={{ borderSpacing: 0 }}>
              <thead>
                <tr className="bg-[--color-light-gray] text-[--color-dark-gray] uppercase text-base leading-normal border-b border-[--color-dark-beige]">
                  <th className="py-4 px-6 text-left border-0">Subject</th>
                  <th className="py-4 px-6 text-center border-0">Marks</th>
                  <th className="py-4 px-6 text-center border-0">Credits</th>
                </tr>
              </thead>
              <tbody className="text-[--color-medium-gray] text-base font-light">
                {subjects.map((subject, index) => (
                  <tr key={index} className={`
                    ${index % 2 === 0 ? 'bg-[--color-white]' : 'bg-[#fdfde8]'}
                    border-b border-[--color-light-gray]
                    hover:bg-[--color-light-gray]
                    transition-colors duration-200
                  `}>
                    <td className="py-3 px-6 text-left font-medium text-[--color-dark-gray] w-24 border-0">{index + 1}</td>
                    <td className="py-3 px-6 text-center border-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={subject.marks}
                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                        className="w-32 p-3 border border-[--color-light-gray] rounded-md focus:outline-none focus:ring-3 focus:ring-[--color-accent] bg-[--color-white] text-[--color-black] text-center text-lg transition-all duration-200 shadow-sm"
                        placeholder="0-100"
                      />
                    </td>
                    <td className="py-3 px-6 text-center border-0">
                      <input
                        type="number"
                        min="0"
                        value={subject.credits}
                        onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                        className="w-32 p-3 border border-[--color-light-gray] rounded-md focus:outline-none focus:ring-3 focus:ring-[--color-accent] bg-[--color-white] text-[--color-black] text-center text-lg transition-all duration-200 shadow-sm"
                        placeholder="Credits"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={calculateCGPA}
              className="bg-[--color-accent] hover:bg-[--color-dark-accent] text-white font-bold py-5 px-16 rounded-full shadow-lg-custom transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-5 focus:ring-[--color-dark-beige] text-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Calculate CGPA</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[--color-accent] to-[--color-dark-accent] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[--color-accent] to-[--color-dark-accent] rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </button>
          </div>

          <div className="w-full flex justify-center mb-4 z-20 gap-4 flex-wrap">
            <button
              onClick={() => { if (!saving) router.push('/leaderboard'); }}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg-custom text-lg transition-all duration-300 mr-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={saving}
            >
              Go to Leaderboard
            </button>
            {session?.user?.name && (
              <button
                onClick={clearCGPA}
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg-custom text-lg transition-all duration-300 ${clearing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={clearing}
              >
                {clearing ? 'Clearing...' : 'Clear My CGPA'}
              </button>
            )}
            {session?.user?.name === 'tushar' && (
              <div className="flex flex-col items-center gap-2">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Admin password"
                  className="border px-4 py-2 rounded text-lg"
                  disabled={adminClearing}
                />
                <button
                  onClick={clearAllCGPA}
                  className={`bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg-custom text-lg transition-all duration-300 ${adminClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={adminClearing || !adminPassword}
                >
                  {adminClearing ? 'Clearing All...' : 'Clear All CGPA (Admin)'}
                </button>
                {adminError && <div className="text-red-600 text-sm font-bold">{adminError}</div>}
                {adminCleared && <div className="text-green-600 text-sm font-bold">All CGPA Cleared!</div>}
              </div>
            )}
          </div>

          {cgpa !== null && (
            <div className="text-center text-2xl mt-6 font-semibold text-[--color-dark-gray] bg-[--color-light-gray] p-8 rounded-xl shadow-lg-custom border border-[--color-dark-beige] w-full max-w-md mx-auto animate-fade-in-up">
              <p className="mb-3">Your CGPA: <strong className="text-[--color-accent] text-3xl font-extrabold">{cgpa}</strong></p>
              <p>Division: <strong className="text-[--color-accent] text-3xl font-extrabold">{division}</strong></p>
              {saving && <p className="mt-4 text-blue-600 text-lg">Saving...</p>}
              {saved && <p className="mt-4 text-green-600 text-lg">Saved!</p>}
            </div>
          )}
          {cleared && (
            <div className="text-center text-green-600 text-lg font-bold mt-2">CGPA Cleared!</div>
          )}
        </div>
      </div>

      <footer className="w-full text-center py-6 mt-auto text-base font-bold text-[--color-dark-gray] z-10">
        <p>Created by MASTER TUSHAR KAUSHIK SENIOR ARCHITECT</p>
      </footer>
    </div>
  );
}
