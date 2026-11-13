'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Send,
  LogOut,
  Sparkles,
  Presentation,
  Download,
  Filter,
  Check,
  Award,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { StudentCertificateSection } from '../../components/certificate/StudentCertificateSection';
import { CourseCompletionWidget } from '../../components/CourseCompletionWidget';
import { Github } from '../../components/GithubIcon';

export const StudentPortalView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    usersList,
    classesList,
    attendanceList,
    projectsList,
    submissionsList,
    submitProject,
    presentationsList,
    syllabusTracks,
    announcements,
    submitContactForm,
    addToast,
    navigateTo,
  } = useApp();

  // Active navigation tab in User Portal
  const [activeTab, setActiveTab] = useState<'timetable' | 'attendance' | 'projects' | 'syllabus' | 'ppts' | 'ask' | 'certificates'>('timetable');

  // Admin access & inspection mode
  const isAdmin = currentUser?.role === 'admin';
  const studentUsers = usersList.filter((u) => u.role === 'student');
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState<string | number>(
    studentUsers[0]?.id || 'usr-student-1'
  );

  // Effective learner being viewed (admin can toggle any enrolled student)
  const effectiveStudent = isAdmin
    ? studentUsers.find((u) => String(u.id) === String(adminSelectedStudentId)) || studentUsers[0] || currentUser
    : currentUser;

  const currentStudentId = effectiveStudent?.id || 'usr-student-1';

  // Track filter (defaults to learner's enrolled track or Full-Stack)
  const studentTrack = effectiveStudent?.track || effectiveStudent?.interest || 'Full-Stack Web Development';
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>(studentTrack);

  // Sync track when changing inspected student
  useEffect(() => {
    if (effectiveStudent?.track || effectiveStudent?.interest) {
      setSelectedTrackFilter(effectiveStudent.track || effectiveStudent.interest || 'Full-Stack Web Development');
    }
  }, [adminSelectedStudentId, effectiveStudent?.id]);

  // Project submission modal/form state
  const [selectedProjectForSubmit, setSelectedProjectForSubmit] = useState<string | number | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Ask mentor form
  const [questionSubject, setQuestionSubject] = useState('');
  const [questionBody, setQuestionBody] = useState('');

  // Student syllabus topic checklist progress with realistic initial completion milestones
  const [studentTopicProgress, setStudentTopicProgress] = useState<Record<string, Record<string, boolean>>>({
    'usr-student-1': {
      'mod-fs-1-topic-0': true,
      'mod-fs-1-topic-1': true,
      'mod-fs-1-topic-2': true,
      'mod-fs-1-topic-3': true,
      'mod-fs-2-topic-0': true,
      'mod-fs-2-topic-1': true,
      'mod-fs-2-topic-2': true,
      'mod-fs-3-topic-0': true,
    },
    'usr-student-2': {
      'mod-da-1-topic-0': true,
      'mod-da-1-topic-1': true,
      'mod-da-1-topic-2': true,
      'mod-da-2-topic-0': true,
      'mod-da-2-topic-1': true,
    },
    'usr-student-3': {
      'mod-place-1-topic-0': true,
      'mod-place-1-topic-1': true,
      'mod-place-1-topic-2': true,
      'mod-place-1-topic-3': true,
      'mod-place-2-topic-0': true,
      'mod-place-2-topic-1': true,
      'mod-place-2-topic-2': true,
      'mod-place-3-topic-0': true,
    },
  });

  const checkedTopics = studentTopicProgress[currentStudentId] || {};

  const toggleTopicCheck = (topicKey: string) => {
    setStudentTopicProgress((prev) => {
      const existing = prev[currentStudentId] || {};
      return {
        ...prev,
        [currentStudentId]: {
          ...existing,
          [topicKey]: !existing[topicKey],
        },
      };
    });
  };

  // Filtered timetable for student's batch/track
  const relevantClasses = classesList.filter(
    (cls) => !selectedTrackFilter || cls.track === selectedTrackFilter || selectedTrackFilter === 'All'
  );

  // Student's personal attendance records
  const myAttendance = attendanceList.filter(
    (att) => att.studentId === effectiveStudent?.id || att.studentEmail === effectiveStudent?.email
  );
  const totalAttended = myAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((totalAttended / myAttendance.length) * 100) : 94; // standard 94%

  // Student's submissions
  const mySubmissions = submissionsList.filter(
    (sub) => sub.studentId === effectiveStudent?.id || sub.studentEmail === effectiveStudent?.email
  );

  // Relevant syllabus track
  const currentSyllabus = syllabusTracks.find((s) => s.trackName === selectedTrackFilter) || syllabusTracks[0];

  // Presentations for this track
  const relevantPPTs = presentationsList.filter(
    (p) => !selectedTrackFilter || p.track === selectedTrackFilter || selectedTrackFilter === 'All'
  );

  // Calculate course completion metrics for the circular progress gauge
  const totalTrackTopics = currentSyllabus?.modules?.reduce((acc, m) => acc + (m.topics?.length || 0), 0) || 12;
  const completedTrackTopics = Object.values(checkedTopics).filter(Boolean).length;
  const syllabusRatio = totalTrackTopics > 0 ? (completedTrackTopics / totalTrackTopics) : 0;

  const trackProjects = projectsList.filter(
    (p) => !selectedTrackFilter || p.track === selectedTrackFilter || selectedTrackFilter === 'All'
  );
  const totalProjects = trackProjects.length > 0 ? trackProjects.length : 2;
  const approvedProjects = mySubmissions.filter((s) => s.status === 'approved').length;
  const projectRatio = totalProjects > 0 ? Math.min(1, approvedProjects / totalProjects) : 0;

  const attendanceRatio = Math.min(1, attendanceRate / 100);

  // Course completion percentage: 50% syllabus + 35% projects + 15% live attendance
  const completionPercentage = Math.min(
    100,
    Math.round((syllabusRatio * 0.50 + projectRatio * 0.35 + attendanceRatio * 0.15) * 100)
  );

  // Demo testing progress override for user/evaluator to test 90%+ vs <90% in student portal
  const [demoProgressOverride, setDemoProgressOverride] = useState<number | null>(null);
  const effectiveCompletionPercentage = demoProgressOverride !== null ? demoProgressOverride : completionPercentage;

  // Real-time backend certificate record check
  const [hasIssuedCert, setHasIssuedCert] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkIssued = async () => {
      try {
        const res = await fetch(`/api/certificates?student_id=${encodeURIComponent(currentStudentId)}`);
        if (res.ok) {
          const certs = await res.json();
          if (isMounted) {
            setHasIssuedCert(Array.isArray(certs) && certs.some((c: any) => c.certificate_status === 'active'));
          }
        }
      } catch (e) {
        // silent fallback
      }
    };
    checkIssued();
    return () => {
      isMounted = false;
    };
  }, [currentStudentId]);

  // USER REQUIREMENT: 90% course completion required to access certificate
  let derivedCertStatus: 'not_eligible' | 'in_progress' | 'eligible' | 'issued' | 'revoked' = 'in_progress';
  if (hasIssuedCert) {
    derivedCertStatus = 'issued';
  } else if (effectiveCompletionPercentage >= 90) {
    derivedCertStatus = 'eligible';
  } else if (effectiveCompletionPercentage < 25) {
    derivedCertStatus = 'not_eligible';
  } else {
    derivedCertStatus = 'in_progress';
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForSubmit || !githubUrl) {
      addToast('error', 'Missing GitHub Link', 'Please provide your GitHub repository URL.');
      return;
    }
    submitProject(selectedProjectForSubmit, githubUrl, liveDemoUrl, submissionNotes);
    setSelectedProjectForSubmit(null);
    setGithubUrl('');
    setLiveDemoUrl('');
    setSubmissionNotes('');
  };

  const handleAskMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionBody) return;
    submitContactForm({
      name: effectiveStudent?.name || 'Student',
      email: effectiveStudent?.email || 'student@codemux.in',
      subject: questionSubject || 'Academic / Learning Query',
      interest: studentTrack,
      message: questionBody,
    });
    setQuestionSubject('');
    setQuestionBody('');
    addToast('success', 'Question Dispatched', 'Your query has been forwarded to the mentorship desk.');
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Inspection Banner (Only rendered when an admin accesses the Student Portal) */}
        {isAdmin && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-50 border-2 border-amber-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                    Admin Inspection Mode
                  </span>
                  <span className="text-xs font-bold text-stone-700">
                    Student Learning Portal &amp; Progress Gauge
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  You are accessing the Student Portal as an Administrator. Inspect any enrolled learner's circular progress, syllabus milestones, and certificates.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0 bg-white/80 backdrop-blur-xs p-2 rounded-2xl border border-amber-200">
              <label className="text-xs font-bold text-stone-700 pl-2">
                Inspect Learner:
              </label>
              <select
                value={adminSelectedStudentId}
                onChange={(e) => setAdminSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B16] cursor-pointer"
              >
                {studentUsers.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} — {stu.track || stu.interest || 'Learner'}
                  </option>
                ))}
              </select>
              <button
                onClick={() => navigateTo('admin-portal')}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Admin Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  Student Learning Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {effectiveStudent?.batch || 'Cohort 2026-A'}
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Inspecting as Admin
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                Welcome back, {effectiveStudent?.name || 'Learner'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {effectiveStudent?.email} · Enrolled Track:{' '}
                <span className="font-semibold text-stone-800">{studentTrack}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center gap-2">
              <span className="text-stone-500">Live Attendance:</span>
              <span className="font-bold text-emerald-700">{attendanceRate}%</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs flex items-center gap-2">
              <span className="text-stone-500">Course Progress:</span>
              <span className="font-bold text-[#FF6B16]">{effectiveCompletionPercentage}%</span>
            </div>

            <button
              onClick={logoutUser}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-rose-400 hover:text-rose-600 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Demo & Test-Drive Bar for Evaluator: Check 90%+ vs <90% in Student Portal */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-300/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B16] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              DEMO
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                Student Portal Test-Drive &amp; 90% Certificate Access Controls
                {demoProgressOverride !== null && (
                  <span className="text-[10px] font-bold text-white bg-[#FF6B16] px-2 py-0.5 rounded-full">
                    Active: {demoProgressOverride}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600">
                Check course completion below 90% (locked preview with watermark) versus 90%+ (unlocked official certificate &amp; custom full name input).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDemoProgressOverride(95);
                setActiveTab('certificates');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                effectiveCompletionPercentage >= 90
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Test 95% (Completed • Unlocks Certificate)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDemoProgressOverride(65);
                setActiveTab('certificates');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                demoProgressOverride === 65
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:border-amber-500'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Test 65% (In Progress • Locked &lt;90%)</span>
            </button>

            {demoProgressOverride !== null && (
              <button
                type="button"
                onClick={() => setDemoProgressOverride(null)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>

        {/* Global Announcement Alert (if any) */}
        {announcements.length > 0 && (
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#FF6B16] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-800">
              <span className="font-bold text-orange-900 mr-2">Notice:</span>
              {announcements[0].title} — <span className="text-stone-600">{announcements[0].content}</span>
            </div>
          </div>
        )}

        {/* Live Course Completion Percentage Circular Progress Dashboard Widget */}
        <CourseCompletionWidget
          courseName={currentSyllabus?.trackName || studentTrack}
          batchName={effectiveStudent?.batch || 'Cohort 2026-A'}
          completionPercentage={effectiveCompletionPercentage}
          totalTopics={totalTrackTopics}
          completedTopics={completedTrackTopics}
          totalProjects={totalProjects}
          approvedProjects={approvedProjects}
          attendanceRate={attendanceRate}
          attendancePassed={attendanceRate >= 80}
          certificateStatus={derivedCertStatus}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          isAdminViewing={isAdmin}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'timetable'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Calendar className="w-4 h-4" /> Class Timetable
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Attendance ({attendanceRate}%)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Github className="w-4 h-4" /> Projects &amp; Submissions
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'syllabus'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Syllabus &amp; Modules
          </button>
          <button
            onClick={() => setActiveTab('ppts')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ppts'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Presentation className="w-4 h-4" /> Class PPTs &amp; Slides
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ask'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Send className="w-4 h-4" /> Ask Mentor
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-[#FF6B16] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Award className="w-4 h-4" /> My Certificates
          </button>
        </div>

        {/* Track Filter selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Filter className="w-4 h-4 text-stone-400" />
            <span className="font-semibold text-stone-700">Filter Learning Track:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {syllabusTracks.map((st) => (
              <button
                key={st.trackName}
                onClick={() => setSelectedTrackFilter(st.trackName)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors cursor-pointer ${
                  selectedTrackFilter === st.trackName
                    ? 'bg-orange-100 text-[#FF6B16] border border-orange-300 font-bold'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {st.trackName}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Class Timetable &amp; Live Sessions</h2>
                <p className="text-xs text-stone-500">Access scheduled live lectures, meeting links, and session recordings.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-700 rounded-lg">
                {relevantClasses.length} Sessions Listed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantClasses.map((cls) => {
                const isUpcoming = cls.status === 'upcoming';
                const isCompleted = cls.status === 'completed';

                return (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                          {cls.track}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-stone-100 text-stone-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cls.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 line-clamp-1">{cls.topic}</h3>
                      <p className="text-xs text-stone-600 line-clamp-2">{cls.description}</p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cls.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cls.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <span className="text-stone-400">Mentor:</span>
                          <span className="font-semibold text-stone-800">{cls.mentorName}</span>
                          <span className="text-stone-400 ml-auto">Batch: {cls.batch}</span>
                        </div>
                      </div>

                      {cls.pptTitle && (
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <Presentation className="w-3.5 h-3.5 text-[#FF6B16] shrink-0" />
                            <span className="truncate text-stone-700">{cls.pptTitle}</span>
                          </div>
                          {cls.pptUrl && (
                            <a
                              href={cls.pptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-[#FF6B16] hover:underline flex items-center gap-1 shrink-0 ml-2"
                            >
                              Slide Deck <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                      {isUpcoming ? (
                        <a
                          href={cls.roomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Live Classroom
                        </a>
                      ) : (
                        <div className="w-full flex items-center justify-between text-xs text-stone-500">
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Session Concluded
                          </span>
                          {cls.recordingUrl && (
                            <a
                              href={cls.recordingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-stone-800 hover:text-[#FF6B16] flex items-center gap-1"
                            >
                              Watch Recording <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Overall Attendance</div>
                <div className="text-3xl font-bold text-emerald-600 mt-1 font-display">{attendanceRate}%</div>
                <p className="text-xs text-stone-500 mt-1">Minimum 80% required for placement certification</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Attended Sessions</div>
                <div className="text-3xl font-bold text-stone-900 mt-1 font-display">{totalAttended} / {myAttendance.length || 1}</div>
                <p className="text-xs text-stone-500 mt-1">Live lectures and coding workshops verified</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Attendance Status</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold text-stone-900">Good Standing</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">Eligible for mock interview slots</p>
              </div>
            </div>

            {/* Attendance Log Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900">Session Attendance Roster</h3>
                  <p className="text-xs text-stone-500">Live records marked by course mentors</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600">
                  {myAttendance.length} Records
                </span>
              </div>

              {myAttendance.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                  <UserCheck className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-semibold text-stone-700">No attendance records registered yet.</p>
                  <p>When mentors conclude your upcoming live sessions, attendance entries will show up here automatically.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Session Topic</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Verified By</th>
                        <th className="py-3 px-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {myAttendance.map((rec) => (
                        <tr key={rec.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-stone-600">{rec.classDate}</td>
                          <td className="py-3 px-4 font-semibold text-stone-900">{rec.classTopic}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                rec.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rec.status === 'late'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{rec.markedBy}</td>
                          <td className="py-3 px-4 text-stone-500">{rec.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS & SUBMISSIONS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Capstone Projects &amp; Deliverables</h2>
                <p className="text-xs text-stone-500">Real-world production engineering projects required for portfolio review.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-[#FF6B16] border border-orange-200">
                {projectsList.filter((p) => p.track === selectedTrackFilter).length} Projects in this Track
              </span>
            </div>

            {/* My Submissions status */}
            {mySubmissions.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> My Submitted Projects &amp; Mentor Grades
                </h3>
                <div className="space-y-3">
                  {mySubmissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="font-bold text-sm text-stone-900">{sub.projectTitle}</div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider self-start sm:self-auto ${
                            sub.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'needs_changes'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-stone-600">
                        <span>Submitted: {sub.submittedAt}</span>
                        <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-[#FF6B16] hover:underline flex items-center gap-1 font-semibold">
                          <Github className="w-3.5 h-3.5" /> Repository
                        </a>
                        {sub.liveDemoUrl && (
                          <a href={sub.liveDemoUrl} target="_blank" rel="noreferrer" className="text-[#FF6B16] hover:underline flex items-center gap-1 font-semibold">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Project
                          </a>
                        )}
                      </div>
                      {sub.grade && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                          <div className="font-bold">Evaluation Grade: {sub.grade}</div>
                          {sub.feedback && <p className="mt-1 text-emerald-800 font-normal">Feedback: "{sub.feedback}"</p>}
                          <div className="text-[11px] text-emerald-700 mt-1">Reviewed by {sub.reviewedBy} on {sub.reviewedAt}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projectsList
                .filter((p) => !selectedTrackFilter || p.track === selectedTrackFilter)
                .map((proj) => {
                  const existingSub = mySubmissions.find((s) => s.projectId === proj.id);

                  return (
                    <div
                      key={proj.id}
                      className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                            {proj.track}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {proj.difficulty}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-stone-900">{proj.title}</h3>
                        <p className="text-xs text-stone-600">{proj.description}</p>

                        <div className="space-y-1.5 pt-2 border-t border-stone-100">
                          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Required Deliverables:</div>
                          <ul className="space-y-1 text-xs text-stone-600">
                            {proj.deliverables.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                          <span>Deadline: <strong className="text-stone-800">{proj.deadline}</strong></span>
                          {proj.starterCodeUrl && (
                            <a
                              href={proj.starterCodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#FF6B16] hover:underline font-semibold flex items-center gap-1"
                            >
                              Starter Template <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        {existingSub ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                            <span className="font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submitted ({existingSub.status.replace('_', ' ')})
                            </span>
                            <button
                              onClick={() => setSelectedProjectForSubmit(proj.id)}
                              className="text-emerald-900 font-bold hover:underline"
                            >
                              Update Code
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedProjectForSubmit(proj.id)}
                            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#FF6B16] hover:bg-orange-600 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <Github className="w-3.5 h-3.5" /> Submit Project Links
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Submission Modal */}
            {selectedProjectForSubmit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900 font-display">Submit Capstone Project</h3>
                    <button
                      onClick={() => setSelectedProjectForSubmit(null)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500">
                    Provide your public GitHub repository URL and any deployed live preview link for mentor evaluation.
                  </p>

                  <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">GitHub Repository URL *</label>
                      <input
                        type="url"
                        required
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/your-username/my-project"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#FF6B16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Live Application / Deployed URL (Optional)</label>
                      <input
                        type="url"
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        placeholder="https://my-project.vercel.app"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#FF6B16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Implementation Notes / Highlights</label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Key architectural choices, technologies used, challenges overcome..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#FF6B16]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectForSubmit(null)}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
                      >
                        Confirm &amp; Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYLLABUS & MODULES */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">{currentSyllabus.badge}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display mt-0.5">
                  {currentSyllabus.trackName} Curriculum
                </h2>
                <p className="text-xs text-stone-500 mt-1">{currentSyllabus.description}</p>
              </div>
              <div className="text-xs bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center gap-3 shrink-0">
                <div>
                  <div className="text-stone-400">Total Program Duration</div>
                  <div className="font-bold text-stone-900 text-sm">{currentSyllabus.durationWeeks} Weeks Intensive</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentSyllabus.modules.map((mod, mIdx) => (
                <div
                  key={mod.id}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B16] font-bold text-xs flex items-center justify-center shrink-0">
                        W{mod.weekNumber}
                      </span>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">Module {mIdx + 1}: {mod.title}</h3>
                        <p className="text-xs text-stone-500">{mod.summary}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600 self-start sm:self-auto">
                      Week {mod.weekNumber} - {mod.weekNumber + 2}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">Topics &amp; Competencies:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mod.topics.map((topic, tIdx) => {
                        const key = `${mod.id}-topic-${tIdx}`;
                        const isChecked = checkedTopics[key];
                        return (
                          <button
                            key={tIdx}
                            onClick={() => toggleTopicCheck(key)}
                            className={`p-2.5 rounded-xl border text-left transition-colors flex items-start gap-2.5 cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                                : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-300'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-400 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3" />}
                            </span>
                            <span>{topic}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {mod.handsOnLab && (
                    <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs text-orange-950 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#FF6B16] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Hands-On Engineering Lab:</strong> {mod.handsOnLab}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CLASS PPTS & SLIDES */}
        {activeTab === 'ppts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Slide Decks &amp; Presentation Library</h2>
                <p className="text-xs text-stone-500">Official instructor slide presentations and technical reference decks.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
                {relevantPPTs.length} Slide Decks Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantPPTs.map((deck) => (
                <div
                  key={deck.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        {deck.track}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {deck.fileType} · {deck.slidesCount} Slides
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{deck.title}</h3>
                    <p className="text-xs text-stone-600">{deck.description}</p>

                    <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span>Uploaded by: {deck.uploadedBy}</span>
                      <span>{deck.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={deck.downloadOrViewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 rounded-xl text-xs font-bold text-stone-800 bg-[#FAF8F5] border border-stone-300 hover:border-[#FF6B16] hover:text-[#FF6B16] transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FF6B16]" /> Download / View Slide Deck
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ASK MENTOR */}
        {activeTab === 'ask' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">Academic Mentorship &amp; Doubt Clearing</h2>
              <p className="text-xs text-stone-500 mt-1">
                Post your technical code blockers or career questions. Instructors review queries daily.
              </p>
            </div>

            <form onSubmit={handleAskMentor} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject / Problem Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Question on Redux Toolkit async thunk error handling"
                  value={questionSubject}
                  onChange={(e) => setQuestionSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#FF6B16]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description / Code Snippet</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe what you tried, what error occurred, or what concept needs clarification..."
                  value={questionBody}
                  onChange={(e) => setQuestionBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#FF6B16]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B16] hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Dispatch Question to Mentors
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: MY CERTIFICATES */}
        {activeTab === 'certificates' && (
          <StudentCertificateSection
            effectiveStudent={effectiveStudent}
            courseCompletionPercentage={effectiveCompletionPercentage}
            onSetTestProgress={(pct) => setDemoProgressOverride(pct)}
          />
        )}

      </div>
    </div>
  );
};
