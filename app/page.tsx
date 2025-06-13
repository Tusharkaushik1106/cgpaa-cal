"use client";

import { Dancing_Script } from 'next/font/google';
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

          {cgpa !== null && (
            <div className="text-center text-2xl mt-6 font-semibold text-[--color-dark-gray] bg-[--color-light-gray] p-8 rounded-xl shadow-lg-custom border border-[--color-dark-beige] w-full max-w-md mx-auto animate-fade-in-up">
              <p className="mb-3">Your CGPA: <strong className="text-[--color-accent] text-3xl font-extrabold">{cgpa}</strong></p>
              <p>Division: <strong className="text-[--color-accent] text-3xl font-extrabold">{division}</strong></p>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full text-center py-6 mt-auto text-base font-bold text-[--color-dark-gray] z-10">
        <p>Created by MASTER TUSHAR KAUSHIK SENIOR ARCHITECT</p>
      </footer>
    </div>
  );
}
