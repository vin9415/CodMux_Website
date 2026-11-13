'use client';
import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface CourseCompletionWidgetProps {
  courseName: string;
  batchName?: string;
  completionPercentage: number;
  totalTopics: number;
  completedTopics: number;
  totalProjects: number;
  approvedProjects: number;
  attendanceRate: number;
  attendancePassed: boolean;
  certificateStatus: 'not_eligible' | 'in_progress' | 'eligible' | 'issued' | 'revoked';
  onNavigateToTab: (tab: 'timetable' | 'attendance' | 'projects' | 'syllabus' | 'certificates') => void;
  isAdminViewing?: boolean;
}

export const CourseCompletionWidget: React.FC<CourseCompletionWidgetProps> = ({
  courseName,
  batchName = 'Cohort 2026-A',
  completionPercentage,
  totalTopics,
  completedTopics,
  totalProjects,
  approvedProjects,
  attendanceRate,
  attendancePassed,
  certificateStatus,
  onNavigateToTab,
  isAdminViewing = false,
}) => {
  // SVG Circular Gauge calculations
  const size = 150;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, Math.round(completionPercentage)));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Determine stage status and color scheme: 90% threshold for certificate unlock
  const isHighCompletion = clampedPercentage >= 90;
  const isMidCompletion = clampedPercentage >= 50;

  let progressGradientId = 'circleProgressOrange';
  let badgeText = 'Foundation Phase';
  let badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';

  if (isHighCompletion) {
    progressGradientId = 'circleProgressEmerald';
    badgeText = certificateStatus === 'issued' ? 'Credential Certified' : 'Certificate Unlocked (≥90%)';
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (isMidCompletion) {
    progressGradientId = 'circleProgressOrange';
    badgeText = `${clampedPercentage}% Completed (90% to unlock)`;
    badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all">
      {/* Top Header Strip */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[#FF6B16]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-display tracking-tight text-white">
                Course Completion &amp; Mastery Dashboard
              </h2>
              {isAdminViewing && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                  Admin Inspector
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              {courseName} • <span className="text-stone-300 font-medium">{batchName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </span>
        </div>
      </div>

      {/* Main Content: Circular Progress Bar + 3-Pillar Breakdown */}
      <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Visual Circular Progress Bar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
            Overall Completion Rate
          </span>

          {/* SVG Circular Progress Graphic */}
          <div className="relative flex items-center justify-center my-1">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90 drop-shadow-xs"
            >
              <defs>
                {/* Orange Gradient */}
                <linearGradient id="circleProgressOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B16" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>

                {/* Emerald Gradient for High Completion */}
                <linearGradient id="circleProgressEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Inactive Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E7E5E4"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Active Foreground Progress Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={`url(#${progressGradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out',
                }}
              />
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
                {clampedPercentage}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-0.5">
                Curriculum
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 mt-3 max-w-[220px]">
            {clampedPercentage >= 90
              ? '≥90% course completion achieved! Official certificate unlocked.'
              : `${Math.max(0, 90 - clampedPercentage)}% remaining to reach 90% and unlock official certificate.`}
          </p>

          <button
            type="button"
            onClick={() => onNavigateToTab('certificates')}
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B16] hover:text-orange-700 hover:underline cursor-pointer"
          >
            <span>Inspect Certificate Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Dynamic Milestones Breakdown Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Core Competency Breakdown
            </h3>
            <span className="text-xs text-stone-400">
              Interactive Live Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Metric 1: Syllabus Topics Checkpoints */}
            <div
              onClick={() => onNavigateToTab('syllabus')}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-orange-300 transition-all cursor-pointer group"
              title="Click to check syllabus topics"
            >
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B16] flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-[#FF6B16] transition-colors">
                  Syllabus
                </span>
              </div>

              <div className="text-lg font-extrabold text-stone-900 font-display">
                {completedTopics}{' '}
                <span className="text-xs text-stone-400 font-normal">/ {totalTopics} Topics</span>
              </div>

              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-[#FF6B16] h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500">
                <span>Checkpoints</span>
                <span className="font-semibold text-stone-800">
                  {totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Metric 2: Capstone Project Submissions */}
            <div
              onClick={() => onNavigateToTab('projects')}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-orange-300 transition-all cursor-pointer group"
              title="Click to submit or view projects"
            >
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileCode className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-blue-600 transition-colors">
                  Projects
                </span>
              </div>

              <div className="text-lg font-extrabold text-stone-900 font-display">
                {approvedProjects}{' '}
                <span className="text-xs text-stone-400 font-normal">/ {totalProjects} Approved</span>
              </div>

              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalProjects > 0 ? (approvedProjects / totalProjects) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500">
                <span>Evaluated</span>
                <span className="font-semibold text-stone-800">
                  {totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Metric 3: Live Class Attendance */}
            <div
              onClick={() => onNavigateToTab('attendance')}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-orange-300 transition-all cursor-pointer group"
              title="Click to view attendance records"
            >
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    attendancePassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-emerald-600 transition-colors">
                  Attendance
                </span>
              </div>

              <div className="text-lg font-extrabold text-stone-900 font-display">
                {attendanceRate}%{' '}
                <span className="text-xs text-stone-400 font-normal">
                  ({attendancePassed ? 'Target Met' : 'Needs Attn'})
                </span>
              </div>

              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    attendancePassed ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, attendanceRate)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500">
                <span>Threshold: 80%</span>
                <span className={`font-semibold ${attendancePassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {attendancePassed ? 'Passed ✓' : 'Below 80%'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Fast Action Row */}
          <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Zap className="w-4 h-4 text-[#FF6B16] shrink-0" />
              <span>
                <strong>Next Step:</strong>{' '}
                {completedTopics < totalTopics
                  ? 'Complete and check off remaining syllabus competencies to increase your progress.'
                  : approvedProjects < totalProjects
                  ? 'Submit your pending capstone project links for mentor grading.'
                  : 'All milestones satisfied! Claim or verify your certificate below.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab(completedTopics < totalTopics ? 'syllabus' : 'certificates')}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF6B16] hover:bg-orange-600 text-white font-bold transition-colors cursor-pointer shrink-0 text-center"
            >
              {completedTopics < totalTopics ? 'Go to Syllabus →' : 'View Certificate →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
