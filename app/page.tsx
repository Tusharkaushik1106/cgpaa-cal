"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Layout from './components/Layout';

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
  const [clearing, setClearing] = useState(false);
  const [adminClearing, setAdminClearing] = useState(false);
  const [adminCleared, setAdminCleared] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-section', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
      gsap.from('.glass-card', { opacity: 0, y: 60, duration: 1, delay: 0.3, ease: 'power3.out' });
      gsap.from('.table-row', { opacity: 0, y: 20, duration: 0.6, stagger: 0.05, delay: 0.7, ease: 'power2.out' });
    }, formRef);
    return () => ctx.revert();
  }, [numSubjects]);

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
      saveCGPA(calculatedCgpa);
    }
  };

  const getDivision = (cgpaValue: number): string => {
    if (cgpaValue === 10) return 'Exemplary Performance';
    if (cgpaValue >= 6.5) return 'First Division';
    if (cgpaValue >= 5.0) return 'Second Division';
    if (cgpaValue >= 4.0) return 'Third Division';
    return 'Fail';
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
    await fetch('/api/save-cgpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session.user.name, actualCGPA: parseFloat(cgpaValue) }),
    });
    setSaving(false);
    localStorage.removeItem('unsavedCGPA');
  };

  const clearCGPA = async () => {
    if (!session?.user?.name) return;
    setClearing(true);
    await fetch('/api/clear-cgpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session.user.name }),
    });
    setClearing(false);
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
    <Layout>
      <div ref={formRef} className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Hero Section */}
        <div className="hero-section text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-white">
            <span className="text-stroke">CGPA</span> CALCULATOR
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            WELCOME TO TUSHAR&apos;S ARENA OF CGPA CALCULATION.
          </p>
        </div>
        {/* Glass Card */}
        <div className="glass-card bg-black/60 glass shadow-2xl rounded-2xl p-8 w-full max-w-3xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">IPU CGPA CALCULATOR</h2>
          <div className="mb-8 text-center">
            <label htmlFor="num-subjects" className="block text-lg font-medium text-gray-300 mb-2">
              Number of subjects: <span className="font-bold text-white">{numSubjects}</span>
            </label>
            <input
              type="range"
              id="num-subjects"
              min="1"
              max="15"
              value={numSubjects}
              onChange={handleNumSubjectsChange}
              className="w-2/3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
          <div className="overflow-x-auto mb-8 rounded-xl">
            <table className="min-w-full bg-transparent table-fixed border-collapse">
              <thead>
                <tr className="bg-black/40 text-white uppercase text-base border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-center">Marks</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                </tr>
              </thead>
              <tbody className="text-white/90 text-base">
                {subjects.map((subject, index) => (
                  <tr key={index} className="table-row border-b border-gray-800 hover:bg-white/5 transition-colors duration-200">
                    <td className="py-2 px-4 text-left font-semibold">{index + 1}</td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={subject.marks}
                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                        className="w-24 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 bg-black/40 text-white text-center text-lg transition-all duration-200"
                        placeholder="0-100"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={subject.credits}
                        onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                        className="w-24 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 bg-black/40 text-white text-center text-lg transition-all duration-200"
                        placeholder="Credits"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
            <button
              onClick={calculateCGPA}
              className="magnetic-button button-fill py-3 px-8 rounded-xl bg-white text-black font-bold text-lg shadow-lg transition-all duration-300 hover:bg-black hover:text-white border-2 border-white hover:border-white/60"
              type="button"
            >
              Calculate CGPA
            </button>
            <button
              onClick={() => { if (!saving) router.push('/leaderboard'); }}
              className="magnetic-button button-fill py-3 px-8 rounded-xl bg-black text-white font-bold text-lg shadow-lg border-2 border-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={saving}
            >
              Go to Leaderboard
            </button>
            {session?.user?.name && (
              <button
                onClick={clearCGPA}
                className="magnetic-button button-fill py-3 px-8 rounded-xl bg-black text-white font-bold text-lg shadow-lg border-2 border-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={clearing}
              >
                Clear My CGPA
              </button>
            )}
          </div>
          {cgpa && (
            <div className="text-center mt-6">
              <div className="inline-block bg-black/70 rounded-xl px-8 py-4 shadow-lg border border-white/10">
                <span className="text-2xl font-bold text-white">CGPA: {cgpa}</span>
                {division && <span className="ml-4 text-lg text-gray-300">({division})</span>}
              </div>
            </div>
          )}
          {session?.user?.isAdmin && (
            <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                className="w-48 p-2 rounded-lg border border-gray-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={clearAllCGPA}
                className="magnetic-button button-fill py-3 px-8 rounded-xl bg-black text-white font-bold text-lg shadow-lg border-2 border-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={adminClearing}
              >
                Clear All CGPA (Admin)
              </button>
              {adminError && <span className="text-red-400 ml-2">{adminError}</span>}
              {adminCleared && <span className="text-green-400 ml-2">All CGPA cleared!</span>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
