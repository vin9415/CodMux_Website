'use client';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOCUS_AREAS, FAQ_ITEMS } from '../data/initialData';
import {
  ArrowRight,
  Code,
  Layers,
  Terminal,
  Cpu,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  ShieldCheck,
  Calculator,
  BookOpen,
  Languages,
  Gamepad2,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  Clock,
  School,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigateTo, openEarlyAccessModal } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [homeTrackTab, setHomeTrackTab] = useState<'junior' | 'career' | 'general'>('junior');
  const [homeLearnerAge, setHomeLearnerAge] = useState<number | null>(null);
  const [homeAgeInput, setHomeAgeInput] = useState<string>('');
  const [homeAgeFilterMode, setHomeAgeFilterMode] = useState<'relatable_all' | 'exact'>('relatable_all');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleHomeAgeInput = (val: string) => {
    setHomeAgeInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0 && num < 100) {
      setHomeLearnerAge(num);
    } else if (val.trim() === '') {
      setHomeLearnerAge(null);
    }
  };

  const handleSelectHomeAge = (age: number) => {
    setHomeLearnerAge(age);
    setHomeAgeInput(age.toString());
  };

  const handleClearHomeAge = () => {
    setHomeLearnerAge(null);
    setHomeAgeInput('');
  };

  const steps = [
    { number: '01', title: 'Learn', desc: 'Follow structured, practical roadmaps designed for deep conceptual comprehension.' },
    { number: '02', title: 'Practice', desc: 'Solve hands-on exercises, debugging tasks, and practical challenges.' },
    { number: '03', title: 'Build', desc: 'Develop real portfolio capstones that demonstrate applied engineering competence.' },
    { number: '04', title: 'Improve', desc: 'Receive constructive feedback on your code architecture and best practices.' },
    { number: '05', title: 'Prepare', desc: 'Rehearse technical mock interviews, DSA patterns, and resume formulation.' },
    { number: '06', title: 'Apply', desc: 'Explore suitable job opportunities and interview with structured confidence.' },
  ];

  return (
    <div className="w-full flex flex-col bg-[#FAF8F5]">
     
{/* SECTION 1: HERO */}
<section className="relative overflow-hidden bg-gradient-to-br from-[#FFFCF7] via-[#FFF8EF] to-[#F8F4ED] border-b border-stone-200">

  {/* Decorative Background */}
  <div className="absolute w-[500px] h-[500px] rounded-full border border-orange-200/60 top-10 right-[-100px] pointer-events-none" />
  <div className="absolute w-[380px] h-[380px] rounded-full border border-orange-200/50 top-24 right-[-40px] pointer-events-none" />
  <div className="absolute w-[250px] h-[250px] rounded-full border border-orange-200/40 top-40 right-8 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-10">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-4 items-center">

      {/* LEFT CONTENT */}
      <div className="space-y-6 relative z-20">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-[#D9570B] text-xs font-bold">
          <School className="w-3.5 h-3.5 text-[#FF6B16]" />
          Learn. Build. Grow with CoDMux.
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#254C49] tracking-tight leading-[1.12] font-display">
          Your Next Big Thing Starts Here
          <span className="text-[#FF6B16]"> With CoDMux.</span>
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
          From young learners exploring coding, mathematics and communication to graduates mastering Full-Stack Development, Data Analytics and AI — discover learning that prepares you for tomorrow.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 pt-2">

          <button
            onClick={() => openEarlyAccessModal()}
            className="px-7 py-4 text-sm font-bold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
          >
            Book Free Demo
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('domains')}
            className="px-7 py-4 text-sm font-bold text-stone-800 bg-white border border-stone-300 hover:border-[#FF6B16] rounded-xl transition-all cursor-pointer"
          >
            Explore Courses
          </button>

        </div>

        {/* HIGHLIGHTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-7 border-t border-stone-200">

          {[
            ['Project Based', 'Real-world projects'],
            ['Expert Mentors', 'Personal guidance'],
            ['Live Learning', 'Interactive sessions'],
            ['Career Ready', 'Practical skills'],
          ].map(([title, desc]) => (
            <div key={title}>
              <div className="text-sm font-bold text-stone-900">{title}</div>
              <div className="text-xs text-stone-500 mt-1">{desc}</div>
            </div>
          ))}

        </div>
      </div>

      {/* RIGHT CHARACTER SECTION */}
      <div className="relative min-h-[430px] sm:min-h-[520px] flex items-center justify-center">

        {/* Glowing Circle */}
        <div className="absolute w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] rounded-full bg-orange-100/70 blur-2xl" />

        <div className="absolute w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full border border-orange-200" />

        {/* BOY CHARACTER IMAGE */}
        <div className="relative z-10 w-full max-w-[430px] flex justify-center">
          <img
            src="/images/sticker.png"
            alt="CoDMux boy mascot"
            className="w-full max-h-[490px] object-contain drop-shadow-xl"
          />
        </div>

        {/* FLOATING COURSE CARDS */}

        <div className="absolute top-[5%] left-0 sm:left-[-2%] z-20 bg-white rounded-2xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3 animate-bounce [animation-duration:4s]">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Code className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-blue-700">Coding</span>
        </div>

        <div className="absolute top-[8%] right-0 sm:right-[-2%] z-20 bg-white rounded-2xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3 animate-bounce [animation-duration:5s]">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-purple-700">AI & Data</span>
        </div>

        <div className="absolute top-[40%] left-[-2%] sm:left-[-5%] z-20 bg-white rounded-2xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3 animate-bounce [animation-duration:4.5s]">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-amber-700">Vedic Maths</span>
        </div>

        <div className="absolute top-[42%] right-[-2%] sm:right-[-5%] z-20 bg-white rounded-2xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3 animate-bounce [animation-duration:5.5s]">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-emerald-700">English</span>
        </div>

        <div className="absolute bottom-[8%] left-[5%] sm:left-[2%] z-20 bg-white rounded-2xl shadow-lg border border-stone-200 px-4 py-3 flex items-center gap-3 animate-bounce [animation-duration:4.8s]">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-rose-700">Career Prep</span>
        </div>

        {/* SPARKLES */}
        <Sparkles className="absolute top-[20%] left-[30%] w-7 h-7 text-amber-400 z-20" />
        <Sparkles className="absolute bottom-[18%] right-[22%] w-6 h-6 text-orange-400 z-20" />

      </div>

    </div>
  </div>
</section>



     
      
      {/* SECTION 1.5: CODEMUX ONE-ON-ONE MENTORSHIP BANNER */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white overflow-hidden">

        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#241006] via-[#48200B] to-[#8B390D] border border-orange-900/30 shadow-[0_15px_45px_rgba(65,25,5,0.20)]">

            {/* Background glow */}
            <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-9 lg:p-10">

              {/* TOP CONTENT */}
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">

                
                {/* MAIN CONTENT */}
                <div className="flex-1 text-center lg:text-left">

                  

                  <p className="mt-4 text-sm sm:text-base lg:text-lg text-orange-50/90 leading-relaxed max-w-3xl">

                    Every student deserves individual attention.
                    Get dedicated one-on-one live sessions,
                    personalized guidance and hands-on training
                    from highly qualified mentors with 10+ years
                    of experience in teaching and technology.

                  </p>

                  {/* BENEFITS */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-3 mt-5">

                    {[
                      "Live 1:1 Sessions",
                      "Personalized Guidance",
                      "Hands-on Projects",
                      "Career Support"
                    ].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-100 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                        {item}
                      </span>
                    ))}

                  </div>

                  {/* CTA */}
                 

                </div>
              </div>

              {/* FULL-WIDTH BRIDGE ILLUSTRATION */}
              <div className="relative mt-7 sm:mt-9 -mx-3 sm:-mx-5">

                <img
                  src="/images/sticker6.webp"
                  alt="CodeMux mentor supporting students as they cross their learning journey bridge"
                  className="block w-full h-auto max-h-[360px] object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
                />
                <button
  type="button"
  aria-label="Start Your 1:1 Learning Journey"
  onClick={() => openEarlyAccessModal()}
  className="absolute right-[2%] bottom-[9%] w-[24%] h-[19%] rounded-full cursor-pointer z-20"
 />

              </div>

              {/* BOTTOM BRAND MESSAGE */}
              <div className="relative flex justify-center mt-4 pt-4 border-t border-orange-300/20">

                <p className="text-center text-xs sm:text-sm font-semibold tracking-wide text-orange-100">
                  YOUR GOALS. YOUR PACE. YOUR PERSONAL MENTOR.
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>


      
      {/* SECTION 2: FOCUS AREAS */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-white via-[#FFFCF8] to-[#FFF7ED] border-b border-orange-100 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B16]">
              <span className="w-8 h-px bg-orange-300" />
              Core Training Tracks
              <span className="w-8 h-px bg-orange-300" />
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-display tracking-tight">
              Programs Built for{" "}
              <span className="text-[#FF6B16]">Every Learning Stage</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Explore structured curriculums designed for young learners
              building academic mastery and graduates preparing for tech careers.
            </p>
          </div>

          {/* Mascot + Age Selector Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-10">

            {/* LEFT: CoDMux Girl Mascot */}
            <div className="lg:col-span-4 relative flex flex-col items-center justify-center">

              {/* Speech Bubble */}
              <div className="relative z-20 mb-2 lg:absolute lg:top-5 lg:right-0 lg:mb-0">
                <div className="bg-white border border-orange-200 rounded-2xl px-5 py-3 shadow-md relative">
                  <p className="text-sm sm:text-base font-bold text-stone-800 text-center">
                    Choose the right
                    <span className="block text-[#FF6B16]">
                      track for you!
                    </span>
                  </p>
                  <div className="hidden lg:block absolute -bottom-2 left-8 w-4 h-4 bg-white border-r border-b border-orange-200 rotate-45" />
                </div>
              </div>

              {/* Mascot Image */}
              <div className="relative w-full max-w-[300px] lg:max-w-none">
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-52 h-52 bg-orange-200/40 rounded-full blur-2xl" />

                <img
                  src="/images/sticker2.webp"
                  alt="CoDMux girl mascot helping learners choose their courses"
                  className="relative z-10 w-full h-auto max-h-[430px] object-contain object-center drop-shadow-xl"
                />
              </div>

              <div className="relative z-10 -mt-2 text-center">
                <span className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Your CoDMux Learning Guide
                </span>
              </div>
            </div>

            {/* RIGHT: Interactive Age Selector */}
            <div className="lg:col-span-8">
              <div className="relative bg-white/95 border border-orange-200 rounded-3xl p-5 sm:p-7 shadow-lg shadow-orange-100/50">

                {/* Panel Heading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#FF6B16]" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#FF6B16]">
                        Find Relatable Tracks
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                        What is the learner's age?
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-[#FF6B16] focus-within:ring-2 focus-within:ring-orange-100">
                    <span className="text-xs text-stone-500 font-medium">
                      Age:
                    </span>
                    <input
                      type="number"
                      min="5"
                      max="80"
                      value={homeAgeInput}
                      onChange={(e) => handleHomeAgeInput(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-20 bg-transparent text-sm font-bold text-stone-900 focus:outline-none"
                    />
                    {homeLearnerAge !== null && (
                      <button
                        type="button"
                        onClick={handleClearHomeAge}
                        className="text-xs text-stone-500 hover:text-[#FF6B16] cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Age Selection */}
                <div className="border-t border-stone-100 pt-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-medium text-stone-500 mr-1">
                      Quick pick:
                    </span>

                    {[7, 10, 13, 16, 18, 21].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => handleSelectHomeAge(age)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer ${
                          homeLearnerAge === age
                            ? 'bg-[#FF6B16] text-white border-[#FF6B16] shadow-md shadow-orange-200 scale-105'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                      >
                        {age} yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Age Result */}
                {homeLearnerAge !== null && (
                  <div className="mt-5 p-4 rounded-2xl bg-orange-50 border border-orange-200">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-xs text-stone-600">
                          Recommended learning stage for
                        </span>
                        <h4 className="font-bold text-stone-900">
                          Age {homeLearnerAge}
                          <span className="text-[#FF6B16]">
                            {homeLearnerAge < 18
                              ? " — Junior Foundation & Enrichment"
                              : " — University, Tech & Career"}
                          </span>
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setHomeAgeFilterMode('relatable_all')}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            homeAgeFilterMode === 'relatable_all'
                              ? 'bg-stone-900 text-white'
                              : 'bg-white text-stone-700 border border-stone-200 hover:border-orange-300'
                          }`}
                        >
                          Show All Relatable (
                          {FOCUS_AREAS.filter((a) =>
                            homeLearnerAge < 18
                              ? a.ageGroup === 'junior' || a.ageGroup === 'general'
                              : a.ageGroup === 'career' || a.ageGroup === 'general'
                          ).length}
                          )
                        </button>

                        <button
                          type="button"
                          onClick={() => setHomeAgeFilterMode('exact')}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            homeAgeFilterMode === 'exact'
                              ? 'bg-[#FF6B16] text-white'
                              : 'bg-white text-stone-700 border border-stone-200 hover:border-orange-300'
                          }`}
                        >
                          Exact Age Fit (
                          {FOCUS_AREAS.filter(
                            (a) =>
                              homeLearnerAge >= a.minAge &&
                              homeLearnerAge <= a.maxAge
                          ).length}
                          )
                        </button>

                        <button
                          type="button"
                          onClick={handleClearHomeAge}
                          className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-[#FF6B16] cursor-pointer"
                        >
                          Reset Age
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning Track Tabs */}
                {homeLearnerAge === null && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                    <button
                      type="button"
                      onClick={() => setHomeTrackTab('junior')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        homeTrackTab === 'junior'
                          ? 'bg-orange-50 border-[#FF6B16] shadow-md shadow-orange-100'
                          : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#FF6B16]" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-stone-900">
                          School & Junior
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Foundation
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHomeTrackTab('career')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        homeTrackTab === 'career'
                          ? 'bg-orange-50 border-[#FF6B16] shadow-md shadow-orange-100'
                          : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-stone-900">
                          University & Tech
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Careers
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHomeTrackTab('general')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        homeTrackTab === 'general'
                          ? 'bg-orange-50 border-[#FF6B16] shadow-md shadow-orange-100'
                          : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-stone-900">
                          Universal
                        </span>
                        <span className="text-[11px] text-stone-500">
                          All learners
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum and Learning Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs text-stone-600">
            <span className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 text-[#FF6B16] font-semibold">
              <Globe className="w-4 h-4" />
              For Indian & International Students (US, UK, UAE, Singapore, Canada)
            </span>

            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 text-stone-700">
              <Award className="w-4 h-4 text-amber-600" />
              CBSE, ICSE, Cambridge IGCSE, IB & US Common Core Aligned
            </span>

            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 text-stone-700">
              <Clock className="w-4 h-4 text-blue-600" />
              Global Time-Zone Friendly Batches (IST, EST, PST, GMT, GST)
            </span>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(homeLearnerAge !== null
              ? FOCUS_AREAS.filter((a) => {
                  if (homeAgeFilterMode === 'exact') {
                    return (
                      homeLearnerAge >= a.minAge &&
                      homeLearnerAge <= a.maxAge
                    );
                  }

                  return homeLearnerAge < 18
                    ? a.ageGroup === 'junior' || a.ageGroup === 'general'
                    : a.ageGroup === 'career' || a.ageGroup === 'general';
                })
              : FOCUS_AREAS.filter((a) => a.ageGroup === homeTrackTab)
            ).map((area) => (
              <div
                key={area.id}
                className="relative p-6 rounded-2xl bg-white border border-stone-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                      {area.id === 'vedic-maths' && <Calculator className="w-6 h-6 text-[#FF6B16]" />}
                      {area.id === 'english-junior' && <BookOpen className="w-6 h-6 text-amber-700" />}
                      {area.id === 'hindi-junior' && <Languages className="w-6 h-6 text-[#FF6B16]" />}
                      {area.id === 'junior-coding' && <Gamepad2 className="w-6 h-6 text-emerald-700" />}
                      {area.id === 'robotics-junior' && <Cpu className="w-6 h-6 text-blue-600" />}
                      {area.id === 'olympiad-math' && <Award className="w-6 h-6 text-amber-600" />}
                      {area.id === 'ai-junior' && <Sparkles className="w-6 h-6 text-purple-600" />}
                      {area.id === 'webdev' && <Code className="w-6 h-6 text-[#FF6B16]" />}
                      {area.id === 'ai-engineering' && <Terminal className="w-6 h-6 text-purple-700" />}
                      {area.id === 'data' && <Layers className="w-6 h-6 text-amber-700" />}
                      {area.id === 'placement' && <Briefcase className="w-6 h-6 text-emerald-700" />}
                      {area.id === 'cybersecurity' && <ShieldCheck className="w-6 h-6 text-rose-600" />}
                      {area.id === 'digital-ethics' && <Globe className="w-6 h-6 text-teal-600" />}
                    </div>

                    <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-600">
                      {area.domainTag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 font-display mb-2 group-hover:text-[#FF6B16] transition-colors leading-snug">
                    {area.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                    {area.description}
                  </p>

                  {area.globalCurriculum && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-100 text-[10px] text-stone-600 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#FF6B16] shrink-0" />
                      <span className="truncate">{area.globalCurriculum}</span>
                    </div>
                  )}

                  <div className="text-xs space-y-1.5 pt-3 border-t border-stone-100 text-stone-600">
                    <div className="font-bold text-stone-900 text-[11px]">
                      Core Highlights
                    </div>
                    {area.topics.slice(0, 2).map((topic, idx) => (
                      <div key={idx} className="line-clamp-1 text-[11px]">
                        <span className="text-[#FF6B16] mr-1">✓</span>
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openEarlyAccessModal(area.title)}
                  className="mt-5 w-full py-3 text-xs font-bold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Programme
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Explore All Programmes */}
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => navigateTo('domains')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-[#FF6B16] bg-white hover:bg-orange-50 border border-orange-200 hover:border-orange-400 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Explore Full Syllabuses for All {FOCUS_AREAS.length} Tracks
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 bg-[#FAF8F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B16]">
              Structured Learning
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
              From Learning to Career Preparation
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              A 6-step practical pathway designed to transition you from theoretical concepts to portfolio readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-orange-300 transition-colors group"
              >
                <div className="text-3xl font-extrabold text-stone-300 font-mono mb-3 group-hover:text-[#FF6B16] transition-colors">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-stone-900 font-display mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B16]">
              Core Differentiators
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
              More Than Just Watching Tutorials
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We focus on active coding proficiency, project execution, and constructive feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-[#FF6B16] mb-3">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Hands-On Learning</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Write code, build interfaces, and solve challenges directly rather than memorizing syntax.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Structured Roadmaps</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Progressive tracks that build confidence from core fundamentals to advanced patterns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-[#FF6B16] mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Practical Assignments</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Project-based evaluation where assignments mirror realistic software development requirements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1.5">Mentor Guidance</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Constructive feedback to help identify edge cases, clean architecture, and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CAREER & PLACEMENTS */}
      <section className="py-20 bg-[#FAF8F5] border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B16]">
            Career Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
            Prepare for the Opportunities Ahead
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            CoDMux supports students through technical interview preparation, resume reviews, mock interviews, practical projects, and career guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            <div className="p-5 rounded-xl bg-white border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 mb-1">Resume Building</h4>
              <p className="text-xs text-stone-600">
                Format engineering resumes highlighting practical projects and measurable technical contributions.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 mb-1">Aptitude &amp; DSA Practice</h4>
              <p className="text-xs text-stone-600">
                Targeted practice on high-yield problem-solving patterns frequently evaluated in technical screens.
              </p>
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 leading-relaxed text-left">
            <strong className="text-orange-900">Placement Assistance Policy:</strong> Job opportunities depend on student eligibility, skills, employer requirements, and market availability. Placement assistance does not guarantee employment.
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('placements')}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Explore Career Support Details →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B16]">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-stone-600">
              Honest, transparent answers about CoDMux, our focus areas, and batch releases.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#FAF8F5] border border-stone-200 shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-stone-900">
                      {item.question}
                    </span>
                    <span className="p-1 rounded bg-white text-[#FF6B16] shrink-0 border border-stone-200">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FAF8F5] border-b border-stone-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 font-display tracking-tight">
            Your Tech Journey Starts Here.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Register for early access to receive batch schedules, curriculum announcements, and priority notifications from CoDMux.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openEarlyAccessModal()}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              Book Free Demo <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-6 py-3.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:border-stone-400 rounded-xl transition-all cursor-pointer"
            >
              Contact Advisory Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
