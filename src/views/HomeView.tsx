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
          <Sparkles className="w-4 h-4" />
          Learn. Build. Grow with CoDMux.
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#254C49] tracking-tight leading-[1.12] font-display">
          Your Next Big Thing Starts Here
          <span className="text-[#FF6B16]">With CoDMux.</span>
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
            Get Early Access
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

      {/* SECTION 2: FOCUS AREAS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B16]">
              Core Training Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
              Programs Built for Every Learning Stage
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Explore structured curriculums designed for young learners building academic mastery and graduates preparing for tech careers.
            </p>

            {/* Interactive Age Selector: Ask Age First */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-orange-200 shadow-xs max-w-xl mx-auto text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#FF6B16] uppercase tracking-wider block">
                    Find Relatable Tracks
                  </span>
                  <span className="text-xs font-semibold text-stone-800">
                    What is the learner's age?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 focus-within:border-[#FF6B16] shadow-2xs">
                    <span className="text-xs text-stone-500 mr-1.5 font-medium">Age:</span>
                    <input
                      type="number"
                      min="5"
                      max="80"
                      value={homeAgeInput}
                      onChange={(e) => handleHomeAgeInput(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-16 text-xs font-bold text-stone-900 focus:outline-none"
                    />
                  </div>
                  {homeLearnerAge !== null && (
                    <button
                      type="button"
                      onClick={handleClearHomeAge}
                      className="text-[11px] text-stone-500 hover:text-stone-800 underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Age Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-200/70">
                <span className="text-[11px] text-stone-500 mr-1">Quick pick:</span>
                {[7, 10, 13, 16, 18, 21].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => handleSelectHomeAge(age)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      homeLearnerAge === age
                        ? 'bg-[#FF6B16] text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    {age} yrs
                  </button>
                ))}
              </div>

              {/* Dynamic Notification or Tab Fallback */}
              {homeLearnerAge !== null ? (
                <div className="text-xs text-stone-700 bg-orange-100/70 border border-orange-200 px-3.5 py-2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span>
                      Relatable tracks for <strong>Age {homeLearnerAge}</strong>:{' '}
                      <span className="font-bold text-[#FF6B16]">
                        {homeLearnerAge < 18 ? '🌟 Junior Foundation & Enrichment Academy' : '💼 University, Tech & Career Tracks'}
                      </span>
                      {' '}+ Universal Skills
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setHomeAgeFilterMode('relatable_all')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        homeAgeFilterMode === 'relatable_all'
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200'
                      }`}
                    >
                      Show All Relatable ({
                        FOCUS_AREAS.filter((a) => (homeLearnerAge < 18 ? a.ageGroup === 'junior' || a.ageGroup === 'general' : a.ageGroup === 'career' || a.ageGroup === 'general')).length
                      })
                    </button>
                    <button
                      type="button"
                      onClick={() => setHomeAgeFilterMode('exact')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        homeAgeFilterMode === 'exact'
                          ? 'bg-[#FF6B16] text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200'
                      }`}
                    >
                      Exact Age Fit ({
                        FOCUS_AREAS.filter((a) => homeLearnerAge >= a.minAge && homeLearnerAge <= a.maxAge).length
                      })
                    </button>
                    <button
                      type="button"
                      onClick={handleClearHomeAge}
                      className="text-stone-500 hover:text-stone-800 underline text-[11px] cursor-pointer ml-1"
                    >
                      Reset Age
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setHomeTrackTab('junior')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      homeTrackTab === 'junior'
                        ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#FF6B16]" />
                    School &amp; Junior Foundation
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeTrackTab('career')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      homeTrackTab === 'career'
                        ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#FF6B16]" />
                    University &amp; Tech Careers
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeTrackTab('general')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      homeTrackTab === 'general'
                        ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#FF6B16]" />
                    Universal Tracks
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* International & Indian Curriculum Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 text-[#FF6B16] font-semibold">
              <Globe className="w-3.5 h-3.5" /> For Indian &amp; International Students (US, UK, UAE, Singapore, Canada)
            </span>
            <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 text-stone-700">
              <Award className="w-3.5 h-3.5 text-amber-600" /> CBSE, ICSE, Cambridge IGCSE, IB &amp; US Common Core Aligned
            </span>
            <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 text-stone-700">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Global Time-Zone Friendly Batches (IST, EST, PST, GMT, GST)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(homeLearnerAge !== null
              ? FOCUS_AREAS.filter((a) => {
                  if (homeAgeFilterMode === 'exact') {
                    return homeLearnerAge >= a.minAge && homeLearnerAge <= a.maxAge;
                  }
                  // 'relatable_all': strictly junior+general for under 18, career+general for 18+
                  if (homeLearnerAge < 18) {
                    return a.ageGroup === 'junior' || a.ageGroup === 'general';
                  } else {
                    return a.ageGroup === 'career' || a.ageGroup === 'general';
                  }
                })
              : FOCUS_AREAS.filter((a) => a.ageGroup === homeTrackTab)
            ).map((area) => (
              <div
                key={area.id}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-[#FF6B16]">
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
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700">
                      {area.domainTag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-1.5 group-hover:text-[#FF6B16] transition-colors leading-snug">
                    {area.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-3">
                    {area.description}
                  </p>

                  {area.globalCurriculum && (
                    <div className="mb-3 px-2 py-1 rounded-md bg-white border border-stone-200 text-[10px] text-stone-600 flex items-center gap-1 truncate">
                      <Globe className="w-3 h-3 text-[#FF6B16] shrink-0" />
                      <span className="truncate">{area.globalCurriculum}</span>
                    </div>
                  )}

                  <div className="text-xs space-y-1 pt-2 border-t border-stone-200/80 text-stone-700">
                    <div className="font-semibold text-stone-900 text-[11px]">Core Highlights:</div>
                    {area.topics.slice(0, 2).map((t, idx) => (
                      <div key={idx} className="line-clamp-1 text-[11px]">· {t}</div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openEarlyAccessModal(area.title)}
                  className="mt-5 w-full py-2.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-xl hover:border-[#FF6B16] hover:text-[#FF6B16] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Join Waitlist <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo('domains')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-[#FF6B16] hover:text-orange-700 bg-orange-50/70 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all cursor-pointer"
            >
              Explore Full Syllabuses for All {FOCUS_AREAS.length} Tracks <ArrowRight className="w-4 h-4" />
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
              Get Early Access <ArrowRight className="w-4 h-4" />
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
