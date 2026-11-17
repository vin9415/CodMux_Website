
'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOCUS_AREAS, TechnologyFocusArea } from '../data/initialData';

import {
  Code,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Calculator,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Search,
  RotateCcw,
  Globe,
  Briefcase,
  Layers,
} from 'lucide-react';

export const FocusAreasView: React.FC = () => {
  const { openEarlyAccessModal } = useApp();

  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [ageInputVal, setAgeInputVal] = useState('');
  const [ageFilterMode, setAgeFilterMode] =
    useState<'relatable_all' | 'exact'>('relatable_all');

  const [categoryFilter, setCategoryFilter] =
    useState<'all' | 'junior' | 'career' | 'general'>('all');

  // Course icons
  const getIcon = (id: string) => {
    switch (id) {
      case 'frontend-web-development':
        return <Code className="w-6 h-6 text-[#FF6B16]" />;

      case 'python-complete':
      case 'python-level-1':
      case 'python-level-2':
        return <Terminal className="w-6 h-6 text-purple-700" />;

      case 'scratchjr':
      case 'scratch-programming':
        return <Gamepad2 className="w-6 h-6 text-emerald-700" />;

      case 'english-language':
        return <BookOpen className="w-6 h-6 text-blue-700" />;

      case 'mathematics':
        return <Calculator className="w-6 h-6 text-amber-700" />;

      default:
        return <Layers className="w-6 h-6 text-[#FF6B16]" />;
    }
  };

  const handleSelectAge = (age: number) => {
    setSelectedAge(age);
    setAgeInputVal(age.toString());
    setAgeFilterMode('relatable_all');
  };

  const handleInputChange = (value: string) => {
    setAgeInputVal(value);

    const age = parseInt(value, 10);

    if (!isNaN(age) && age > 0 && age < 100) {
      setSelectedAge(age);
      setAgeFilterMode('relatable_all');
    } else if (value.trim() === '') {
      setSelectedAge(null);
    }
  };

  const handleClearAge = () => {
    setSelectedAge(null);
    setAgeInputVal('');
    setCategoryFilter('all');
  };

  // Course filtering
  const filteredAreas = FOCUS_AREAS.filter(
    (area: TechnologyFocusArea) => {
      if (selectedAge !== null) {
        if (ageFilterMode === 'exact') {
          return (
            selectedAge >= area.minAge &&
            selectedAge <= area.maxAge
          );
        }

        if (selectedAge < 18) {
          return (
            area.ageGroup === 'junior' ||
            area.ageGroup === 'general'
          );
        }

        return (
          area.ageGroup === 'career' ||
          area.ageGroup === 'general'
        );
      }

      if (categoryFilter === 'all') return true;

      return area.ageGroup === categoryFilter;
    }
  );

  const quickAges = [7, 10, 13, 16, 18, 21];

  const activeAgeRelatableCount =
    selectedAge !== null
      ? FOCUS_AREAS.filter((area) =>
          selectedAge < 18
            ? area.ageGroup === 'junior' ||
              area.ageGroup === 'general'
            : area.ageGroup === 'career' ||
              area.ageGroup === 'general'
        ).length
      : FOCUS_AREAS.length;

  const activeAgeExactCount =
    selectedAge !== null
      ? FOCUS_AREAS.filter(
          (area) =>
            selectedAge >= area.minAge &&
            selectedAge <= area.maxAge
        ).length
      : FOCUS_AREAS.length;

  return (
    <div className="w-full py-12 sm:py-16 bg-[#FAF8F5] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* PAGE HEADER */}
        <div className="max-w-3xl space-y-3">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200 text-[#FF6B16] text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            Our Official Course Catalogue
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-display">
            Explore Our Courses
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Explore our learning programmes in frontend web development,
            Python programming, Scratch coding, English language and
            mathematics. Discover course topics, technologies,
            learning outcomes and practical activities.
          </p>

          <div className="text-sm font-semibold text-[#FF6B16]">
            {FOCUS_AREAS.length} Courses Available
          </div>
        </div>

        {/* AGE FINDER */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-orange-200 shadow-md space-y-5">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B16] uppercase tracking-wider mb-1">
                <Search className="w-3.5 h-3.5" />
                Course Finder
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                Find courses suitable for your age
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                Enter an age to filter courses by their listed age range.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <div className="flex items-center bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 focus-within:border-[#FF6B16]">
                <span className="text-xs font-semibold text-stone-500 mr-2 whitespace-nowrap">
                  Age:
                </span>

                <input
                  type="number"
                  min="1"
                  max="99"
                  value={ageInputVal}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter age"
                  className="w-24 bg-transparent text-sm font-bold text-stone-900 focus:outline-none"
                  aria-label="Enter learner age"
                />
              </div>

              {selectedAge !== null && (
                <button
                  onClick={handleClearAge}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1"
                  type="button"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* QUICK AGE SELECTION */}
          <div className="flex flex-wrap items-center gap-2">

            <span className="text-xs font-semibold text-stone-600 mr-1">
              Quick Select:
            </span>

            {quickAges.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => handleSelectAge(age)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAge === age
                    ? 'bg-[#FF6B16] text-white'
                    : 'bg-[#FAF8F5] hover:bg-orange-50 border border-stone-200 text-stone-700'
                }`}
              >
                {age} yrs
              </button>
            ))}

            {selectedAge !== null && (
              <div className="flex flex-wrap items-center gap-2 ml-auto">

                <button
                  type="button"
                  onClick={() => setAgeFilterMode('relatable_all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    ageFilterMode === 'relatable_all'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 bg-stone-100'
                  }`}
                >
                  Related Courses ({activeAgeRelatableCount})
                </button>

                <button
                  type="button"
                  onClick={() => setAgeFilterMode('exact')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    ageFilterMode === 'exact'
                      ? 'bg-[#FF6B16] text-white'
                      : 'text-stone-700 bg-stone-100'
                  }`}
                >
                  Exact Age Match ({activeAgeExactCount})
                </button>
              </div>
            )}

          </div>

          {/* CATEGORY FILTER */}
          {selectedAge === null && (
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">

              <span className="text-xs text-stone-500 mr-1">
                Browse by category:
              </span>

              {[
                { id: 'all', label: 'All Courses' },
                { id: 'junior', label: 'Young Learners' },
                { id: 'career', label: 'Career Courses' },
                { id: 'general', label: 'All-Age Courses' },
              ].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setCategoryFilter(
                      category.id as typeof categoryFilter
                    )
                  }
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === category.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}

            </div>
          )}

          {selectedAge !== null && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-stone-700">
              Showing <strong>{filteredAreas.length} courses</strong> for
              age <strong>{selectedAge}</strong>.
              <button
                type="button"
                onClick={handleClearAge}
                className="ml-3 underline font-semibold"
              >
                View all courses
              </button>
            </div>
          )}

        </div>

        {/* COURSE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {filteredAreas.map((area: TechnologyFocusArea) => (

            <div
              key={area.id}
              className="rounded-2xl bg-white border border-stone-200 shadow-xs p-6 sm:p-8 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group"
            >

              <div className="space-y-5">

                {/* CATEGORY */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">

                  <span className="text-[#FF6B16] font-semibold">
                    {area.category}
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">

                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 text-[11px] font-medium border border-orange-200">
                      {area.domainTag}
                    </span>

                    {area.badge && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                        {area.badge}
                      </span>
                    )}

                  </div>
                </div>

                {/* ICON AND TITLE */}
                <div className="flex items-center gap-3.5">

                  <div className="w-12 h-12 rounded-xl bg-orange-100/60 border border-orange-200 flex items-center justify-center shrink-0">
                    {getIcon(area.id)}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display group-hover:text-[#FF6B16] transition-colors leading-tight">
                      {area.title}
                    </h3>

                    <div className="text-[11px] text-stone-500 font-medium mt-1">
                      {area.ageGroup === 'junior'
                        ? 'Young Learner Programme'
                        : area.ageGroup === 'career'
                        ? 'Career & Professional Programme'
                        : 'General Learning Programme'}
                    </div>
                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {area.description}
                </p>

                {/* COURSE DETAILS */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-4 text-xs text-stone-700">

                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">
                      Course Level
                    </h4>
                    <p>{area.level || 'Refer to the course curriculum.'}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">
                      Suitable For
                    </h4>
                    <p>{area.suitableFor || 'Learners interested in this subject.'}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 mb-2">
                      Course Topics
                    </h4>

                    <div className="space-y-2">
                      {area.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B16] shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {area.technologies && (
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">
                        Technologies & Tools
                      </h4>
                      <p>{area.technologies}</p>
                    </div>
                  )}

                  {area.learningOutcomes && area.learningOutcomes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-stone-900 mb-2">
                        Learning Outcomes
                      </h4>

                      <ul className="list-disc pl-5 space-y-1">
                        {area.learningOutcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {area.practicalWork && (
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">
                        Practical Projects & Activities
                      </h4>
                      <p>{area.practicalWork}</p>
                    </div>
                  )}

                  {area.publishingNote && (
                    <div className="pt-3 border-t border-stone-200">
                      <h4 className="font-bold text-stone-900 mb-1">
                        Additional Information
                      </h4>
                      <p>{area.publishingNote}</p>
                    </div>
                  )}

                </div>

              </div>

              {/* REGISTRATION BUTTON */}
              <div className="pt-6 mt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

                <div className="text-xs text-stone-500">
                  Interested in this course?
                </div>

                <button
                  type="button"
                  onClick={() => openEarlyAccessModal(area.title)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  Register Your Interest
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* EMPTY STATE */}
        {filteredAreas.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-stone-400" />

            <h3 className="text-lg font-bold text-stone-900">
              No matching courses found
            </h3>

            <p className="text-sm text-stone-500 mt-2">
              Try another age or view all available courses.
            </p>

            <button
              type="button"
              onClick={handleClearAge}
              className="mt-4 px-5 py-2.5 bg-[#FF6B16] text-white rounded-xl text-sm font-semibold"
            >
              View All Courses
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FocusAreasView;
