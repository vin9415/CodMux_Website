'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Lock,
  ChevronRight,
  ShieldCheck,
  Check,
  Layers,
  GraduationCap,
  UserCheck,
  User,
} from 'lucide-react';
import { CertificateMasterRenderer } from './CertificateMasterRenderer';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import { CertificateRecord, CertificateEligibility, AuthUser } from '../../types';

export interface CourseTrackInfo {
  id: string;
  name: string;
  code: string;
  duration: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  startDate: string;
  completionDate: string;
}

export const AVAILABLE_COURSES: CourseTrackInfo[] = [
  {
    id: 'webdev',
    name: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
    code: 'MERN',
    duration: '60 Days',
    instructorId: 'usr-mentor-1',
    instructorName: 'Priya Sharma',
    instructorTitle: 'Staff Full-Stack Architect',
    startDate: '2026-02-15',
    completionDate: '2026-04-15',
  },
  {
    id: 'python',
    name: 'Python Programming & AI Essentials',
    code: 'PYTHON',
    duration: '60 Days',
    instructorId: 'usr-mentor-6',
    instructorName: 'Rajesh Nair',
    instructorTitle: 'Principal AI & Python Mentor',
    startDate: '2026-02-15',
    completionDate: '2026-04-15',
  },
  {
    id: 'data',
    name: 'Data Analytics & Global Business Intelligence (Power BI & Tableau)',
    code: 'DATA',
    duration: '60 Days',
    instructorId: 'usr-mentor-2',
    instructorName: 'Kunal Deshmukh',
    instructorTitle: 'Lead Analytics Consultant',
    startDate: '2026-02-18',
    completionDate: '2026-04-18',
  },
  {
    id: 'placement',
    name: 'Global Tech Career, LeetCode DSA & Remote Interview Mastery',
    code: 'DSA',
    duration: '60 Days',
    instructorId: 'usr-mentor-3',
    instructorName: 'Ananya Roy',
    instructorTitle: 'FAANG Algorithm Coach',
    startDate: '2026-02-25',
    completionDate: '2026-04-25',
  },
  {
    id: 'vedic-maths',
    name: 'Vedic Maths & Speed Mental Arithmetic',
    code: 'VEDIC',
    duration: '45 Days',
    instructorId: 'usr-mentor-4',
    instructorName: 'Rajesh Shastri',
    instructorTitle: 'National Vedic Mathematics Scholar',
    startDate: '2026-02-05',
    completionDate: '2026-03-22',
  },
  {
    id: 'english-junior',
    name: 'Global English: Public Speaking, Debate & Model UN (MUN)',
    code: 'ENG',
    duration: '45 Days',
    instructorId: 'usr-mentor-5',
    instructorName: 'Suniti Sen',
    instructorTitle: 'Cambridge English & Debate Lead',
    startDate: '2026-02-08',
    completionDate: '2026-03-25',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Ethical Defense Fundamentals',
    code: 'CYBER',
    duration: '60 Days',
    instructorId: 'usr-mentor-7',
    instructorName: 'Sameer Khan',
    instructorTitle: 'Certified Ethical Defense Lead',
    startDate: '2026-02-20',
    completionDate: '2026-04-20',
  },
  {
    id: 'junior-coding',
    name: 'Young Coders: MIT Scratch, Game Design & Creative Python',
    code: 'PYTHON',
    duration: '45 Days',
    instructorId: 'usr-mentor-8',
    instructorName: 'Aarav Mehta',
    instructorTitle: 'Senior STEM & Robotics Mentor',
    startDate: '2026-02-10',
    completionDate: '2026-03-27',
  },
];

export interface StudentCertificateSectionProps {
  effectiveStudent?: AuthUser | null;
  courseCompletionPercentage?: number;
  onSetTestProgress?: (pct: number | null) => void;
}

export const StudentCertificateSection: React.FC<StudentCertificateSectionProps> = ({
  effectiveStudent,
  courseCompletionPercentage,
  onSetTestProgress,
}) => {
  const { currentUser, attendanceList, submissionsList, navigateTo, addToast } = useApp();

  const [studentCertificates, setStudentCertificates] = useState<CertificateRecord[]>([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateRecord | null>(null);
  const [draftForModal, setDraftForModal] = useState<{
    studentName: string;
    courseName: string;
    duration?: string;
    startDate?: string;
    completionDate?: string;
    instructorName?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPreviewMode, setIsModalPreviewMode] = useState(false);

  // Active student context (either selected student under admin inspection or logged-in student)
  const activeStudent = effectiveStudent || currentUser;
  const studentTrack = activeStudent?.track || activeStudent?.interest || 'Full-Stack Web & Cloud Engineering (React, Node & AWS)';
  const studentId = activeStudent?.id || 'usr-student-1';
  const studentName = activeStudent?.name || 'Vinit Sharma';

  // Dedicated editable legal full name for certificate
  const [customFullName, setCustomFullName] = useState<string>(activeStudent?.name || 'Vinit Sharma');

  useEffect(() => {
    if (activeStudent?.name) {
      setCustomFullName(activeStudent.name);
    }
  }, [activeStudent?.name]);

  const effectiveStudentName = customFullName.trim() || studentName;

  // Determine initial course based on student's enrolled track
  const findInitialCourse = (): string => {
    const trackLower = studentTrack.toLowerCase();
    const match = AVAILABLE_COURSES.find(
      (c) =>
        c.name.toLowerCase().includes(trackLower) ||
        trackLower.includes(c.id.toLowerCase()) ||
        trackLower.includes(c.code.toLowerCase())
    );
    return match ? match.id : 'webdev';
  };

  const [selectedCourseId, setSelectedCourseId] = useState<string>(findInitialCourse());

  // Synchronize when active student changes
  useEffect(() => {
    setSelectedCourseId(findInitialCourse());
  }, [activeStudent?.id, activeStudent?.track]);

  // Selected course details
  const activeCourse =
    AVAILABLE_COURSES.find((c) => c.id === selectedCourseId) || AVAILABLE_COURSES[0];

  // Fetch student certificates from backend
  const fetchCertificates = async () => {
    try {
      setIsLoadingCerts(true);
      const res = await fetch(`/api/certificates?student_id=${encodeURIComponent(studentId)}`);
      if (res.ok) {
        const data = await res.json();
        setStudentCertificates(data);
      }
    } catch (err) {
      console.error('Error loading student certificates:', err);
    } finally {
      setIsLoadingCerts(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [studentId]);

  // Compute metrics for the active student
  const myAttendance = attendanceList.filter(
    (att) => att.studentId === studentId || att.studentEmail === activeStudent?.email
  );
  const totalAttended = myAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((totalAttended / myAttendance.length) * 100) : 94;
  const attendancePassed = attendanceRate >= 80;

  const myApprovedProjects = submissionsList.filter(
    (s) => (s.studentId === studentId || s.studentEmail === activeStudent?.email) && s.status === 'approved'
  );
  const projectsPassed = myApprovedProjects.length >= 1;

  // USER REQUIREMENT: When student completes 90% of course, they can access the certificate
  const effectivePercentage = courseCompletionPercentage ?? (attendancePassed && projectsPassed ? 92 : 65);
  const is90PercentCompleted = effectivePercentage >= 90;

  // Check if official certificate is already issued for the selected course
  const issuedCert = studentCertificates.find((c) => {
    if (c.student_id !== studentId) return false;
    const certCourse = c.course_name_snapshot.toLowerCase();
    const activeCourseName = activeCourse.name.toLowerCase();
    const activeCourseId = activeCourse.id.toLowerCase();
    return (
      c.course_id === activeCourse.id ||
      certCourse === activeCourseName ||
      certCourse.includes(activeCourseId) ||
      activeCourseName.includes(certCourse) ||
      certCourse.includes(activeCourseName.slice(0, 15))
    );
  });

  let currentStatus: CertificateEligibility['status'] = 'in_progress';
  if (issuedCert) {
    currentStatus = issuedCert.certificate_status === 'revoked' ? 'revoked' : 'issued';
  } else if (is90PercentCompleted) {
    currentStatus = 'eligible';
  } else if (effectivePercentage < 30) {
    currentStatus = 'not_eligible';
  } else {
    currentStatus = 'in_progress';
  }

  // Open Preview Modal (either Draft Preview or Official Issued)
  const handleOpenPreview = (cert?: CertificateRecord) => {
    if (cert) {
      setSelectedCertForModal(cert);
      setDraftForModal(null);
      setIsModalPreviewMode(false);
    } else {
      setSelectedCertForModal(null);
      setDraftForModal({
        studentName: effectiveStudentName,
        courseName: activeCourse.name,
        duration: activeCourse.duration,
        startDate: activeCourse.startDate,
        completionDate: activeCourse.completionDate,
        instructorName: activeCourse.instructorName,
      });
      setIsModalPreviewMode(true);
    }
    setIsModalOpen(true);
  };

  // Automated self-claim trigger when student is eligible for the selected course
  const handleClaimEligibleCertificate = async () => {
    if (currentStatus !== 'eligible') return;

    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          student_name: effectiveStudentName,
          student_email: currentUser?.email,
          course_id: activeCourse.id,
          course_name: activeCourse.name,
          instructor_id: activeCourse.instructorId,
          instructor_name: activeCourse.instructorName,
          duration: activeCourse.duration,
          start_date: activeCourse.startDate,
          completion_date: activeCourse.completionDate,
          issued_by: 'Automated Academic Verification Engine',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to claim certificate.');
      }

      addToast(
        'success',
        'Certificate Awarded! 🎓',
        `Official Code Mux certificate for ${activeCourse.name} has been generated and added to your profile.`
      );
      fetchCertificates();
    } catch (err: any) {
      addToast('error', 'Issuance Error', err.message || 'Unable to generate certificate.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-stone-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF6B16] text-xs font-bold border border-orange-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Code Mux Credentialing Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            My Certificates &amp; Credentials
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Track your course completion milestones, preview your upcoming certificate design with your actual name and assigned mentor, and download officially verified PDF credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenPreview(issuedCert)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>{issuedCert ? 'View Official Certificate' : 'Preview Live Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('verify-certificate')}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Public Verify Registry</span>
          </button>
        </div>
      </div>

      {/* Course Track Selector Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF6B16]" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Select Enrolled Course Track
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            Course completion status &amp; instructor signatures update dynamically
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COURSES.map((course) => {
            const isSelected = course.id === selectedCourseId;
            const hasCert = studentCertificates.some(
              (c) =>
                c.student_id === studentId &&
                (c.course_id === course.id ||
                  c.course_name_snapshot.toLowerCase().includes(course.id) ||
                  c.course_name_snapshot.toLowerCase().includes(course.name.toLowerCase().slice(0, 15)))
            );

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                }`}
              >
                <span>{course.name.split('(')[0].trim()}</span>
                {hasCert && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Certificate Issued" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Demo Test Tool for checking certificate states */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 border-2 border-orange-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-xl bg-[#FF6B16] text-white font-extrabold text-[11px] uppercase tracking-wider shrink-0 shadow-xs">
            DEMO TEST
          </span>
          <div>
            <span className="font-bold text-stone-900">Certificate Status Test Controls:</span>{' '}
            <span className="text-stone-600">
              Course progress is currently at{' '}
              <strong className="text-[#FF6B16] font-extrabold text-sm">{effectivePercentage}%</strong>{' '}
              (At least <strong>90%</strong> required to unlock official certificate).
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSetTestProgress && onSetTestProgress(95)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              effectivePercentage >= 90
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-stone-300 text-stone-700 hover:border-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test 95% (Unlock Certificate)</span>
          </button>
          <button
            type="button"
            onClick={() => onSetTestProgress && onSetTestProgress(65)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              effectivePercentage < 90
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-stone-300 text-stone-700 hover:border-amber-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Test 65% (Lock &lt;90%)</span>
          </button>
          {courseCompletionPercentage !== undefined && (
            <button
              type="button"
              onClick={() => onSetTestProgress && onSetTestProgress(null)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Option Space: Write Student Full Name for Certificate */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF6B16]" />
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Student Full Legal Name for Certificate
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            Type your full legal name below • Updates dynamically on master certificate template ribbon
          </span>
        </div>

        <div className="space-y-2">
          <label htmlFor="certFullNameInput" className="block text-xs font-semibold text-stone-700">
            Full Name printed on official Code Mux certificate:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                id="certFullNameInput"
                type="text"
                value={customFullName}
                onChange={(e) => setCustomFullName(e.target.value)}
                placeholder="Enter your full name (e.g. Vinit Pandey)"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#FF6B16] focus:ring-1 focus:ring-[#FF6B16] transition-all"
              />
            </div>
            {customFullName !== studentName && (
              <button
                type="button"
                onClick={() => setCustomFullName(studentName)}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors cursor-pointer shrink-0"
              >
                Reset to Registered Name
              </button>
            )}
          </div>
          <p className="text-[11px] text-stone-500">
            ✨ This name will appear in custom cursive calligraphy across the central golden banner on the certificate.
          </p>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Certificate Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Card & Status (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  Active Course &amp; Assigned Faculty
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  {activeCourse.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">
                    Faculty Mentor: {activeCourse.instructorName}
                  </span>
                  <span>•</span>
                  <span>Duration: {activeCourse.duration}</span>
                </div>
              </div>

              {/* Status Badge */}
              {currentStatus === 'issued' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Official Certificate Issued
                </span>
              )}
              {currentStatus === 'eligible' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Requirements Met (≥90%) • Ready to Issue
                </span>
              )}
              {currentStatus === 'in_progress' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> In Progress ({effectivePercentage}% / 90% Required)
                </span>
              )}
              {currentStatus === 'revoked' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Credential Revoked
                </span>
              )}
            </div>

            {/* Completion Criteria Progress Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Certificate Issuance Criteria for this Course:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Enrollment */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Enrolled in Cohort</span>
                    <span className="text-[11px] text-stone-500">{activeCourse.code} Cohort 2026</span>
                  </div>
                </div>

                {/* 2. Course Completion Progress (90% Required) */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      is90PercentCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {is90PercentCompleted ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Course Progress: {effectivePercentage}%
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {is90PercentCompleted ? '≥90% Met (Unlocked ✓)' : `${Math.max(0, 90 - effectivePercentage)}% needed to unlock`}
                    </span>
                  </div>
                </div>

                {/* 3. Milestone Projects & Attendance */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      attendancePassed && projectsPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {attendancePassed && projectsPassed ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Faculty Evaluation
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {myApprovedProjects.length} approved • {attendanceRate}% attendance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issued Certificate Details or Unlock Banner */}
            {issuedCert ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Official Certificate Active
                  </span>
                  <div className="text-xs text-stone-700">
                    Serial: <span className="font-mono font-bold text-stone-900">{issuedCert.certificate_serial_number}</span> • Issued on{' '}
                    {issuedCert.issue_date} • Mentor: <span className="font-semibold">{issuedCert.instructor_name_snapshot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(issuedCert)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-emerald-500 text-stone-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    View &amp; Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('verify-certificate')}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
                    title="Verify on Public Registry"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : currentStatus === 'eligible' ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Congratulations! You have completed {effectivePercentage}% of the course (≥90% requirement met).
                  </span>
                  <p className="text-xs text-stone-600">
                    Issuing to: <span className="font-bold text-stone-900">{effectiveStudentName}</span> • Assigned mentor: {activeCourse.instructorName}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClaimEligibleCertificate}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0"
                >
                  Generate Official Certificate ({effectiveStudentName})
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    Complete at least <strong>90% of your course</strong> to unlock your official verified certificate. Current progress: <strong>{effectivePercentage}%</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenPreview()}
                  className="text-[#FF6B16] font-semibold hover:underline cursor-pointer shrink-0"
                >
                  Preview Certificate Design →
                </button>
              </div>
            )}
          </div>

          {/* Live In-Dashboard Preview Embed */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-display">
                  {issuedCert ? 'Issued Official Certificate' : 'Pre-Completion Certificate Preview'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {issuedCert
                    ? `Official credential verified on Code Mux ledger for ${activeCourse.name}.`
                    : `Live preview with student name "${effectiveStudentName}", ${activeCourse.name}, and mentor ${activeCourse.instructorName}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPreview(issuedCert)}
                className="text-xs font-bold text-[#FF6B16] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Expand Fullscreen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Render Certificate with dynamically bound Course and Mentor */}
            <CertificateMasterRenderer
              studentName={effectiveStudentName}
              courseName={issuedCert ? issuedCert.course_name_snapshot : activeCourse.name}
              duration={issuedCert ? issuedCert.course_duration_snapshot : activeCourse.duration}
              startDate={issuedCert ? issuedCert.enrollment_date : activeCourse.startDate}
              completionDate={issuedCert ? issuedCert.completion_date : activeCourse.completionDate}
              instructorName={issuedCert ? issuedCert.instructor_name_snapshot : activeCourse.instructorName}
              certificateSerialNumber={issuedCert ? issuedCert.certificate_serial_number : 'CMX-PREVIEW-DRAFT'}
              isPreview={!issuedCert}
              status={issuedCert?.certificate_status || 'active'}
              showControls={true}
            />
          </div>
        </div>

        {/* Right Column: FAQ, Anti-Fraud & Value Props */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF6B16]" />
              <span>Certificate Privileges</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Global Verification:</strong> Share your unique credential ID on LinkedIn, your resume, or job applications.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>High-Resolution Vector PDF:</strong> Suitable for physical framing, corporate submissions, and foreign university credentials.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Faculty Signatures:</strong> Authenticated by specialized faculty lead {activeCourse.instructorName} ({activeCourse.instructorTitle}).
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Anti-Gimmick Guarantee:</strong> Issued strictly upon rigorous assignment evaluation and verified attendance.
                </span>
              </div>
            </div>
          </div>

          {/* Automated Notification Card */}
          <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 p-6 space-y-3">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Automated Notification</span>
            <h4 className="text-xs font-bold text-stone-900">Email Dispatch Upon Issuance</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              As soon as your certificate is generated, an official award notification is automatically dispatched to <span className="font-semibold text-stone-900">{currentUser?.email || 'your email'}</span> with your verification link.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CertificatePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificate={selectedCertForModal}
        draftData={draftForModal || undefined}
        isPreview={isModalPreviewMode}
      />
    </div>
  );
};
