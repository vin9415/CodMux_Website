'use client';
import { COUNTRY_CODES } from '../../data/countryCodes';
import React, { useEffect, useState } from 'react';
import { useApp, CODEMUX_COURSES } from '../../context/AppContext';
import {
  Shield,
  Users,
  Calendar,
  UserCheck,
  Award,
  BookOpen,
  Presentation,
  Send,
  LogOut,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  Download,
  Filter,
  Sparkles,
  Briefcase,
  GraduationCap,
  Clock,
  History,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Github } from '../../components/GithubIcon';
import {
  AuthUser,
  ClassSchedule,
  ProjectItem,
  UserRole,
  SyllabusTrack,
} from '../../types';
import {
  sanitizeName,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePhone,
} from '../../utils/validation';
import { AdminCertificateSection } from '../../components/certificate/AdminCertificateSection';

export const AdminPortalView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    usersList,
    addUser,
    updateUser,
    deleteUser,
    impersonateUser,
    classesList,
    addClassSchedule,
    updateClassSchedule,
    deleteClassSchedule,
    attendanceList,
    batchMarkAttendance,
    mentorAttendanceList,
    projectsList,
    addProject,
    deleteProject,
    submissionsList,
    reviewSubmission,
    presentationsList,
    addPresentation,
    deletePresentation,
 syllabusTracks,
updateSyllabusTrack,
addSyllabusTrack,
deleteSyllabusTrack,
    earlyAccessList,
updateLeadStatus,
deleteLead,
    contactInquiries,
    updateInquiryStatus,
    announcements,
    addAnnouncement,
    auditLogs,
    addToast,
    navigateTo,
  } = useApp();

  // Load real users from PostgreSQL
const [directoryUsers, setDirectoryUsers] = useState<AuthUser[]>([]);
const [usersLoading, setUsersLoading] = useState(true);
const [usersError, setUsersError] = useState('');

useEffect(() => {
  let cancelled = false;

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await fetch('/api/admin/users', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users');
      }

      if (!cancelled) {
        setDirectoryUsers(data.users || []);
        setUsersError('');
      }
    } catch (error) {
      if (!cancelled) {
        setUsersError(
          error instanceof Error ? error.message : 'Failed to load users'
        );
      }
    } finally {
      if (!cancelled) {
        setUsersLoading(false);
      }
    }
  };

  loadUsers();

  return () => {
    cancelled = true;
  };
}, []);
    // Database-driven Admin Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    upcomingClasses: 0,
    pendingSubmissions: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to fetch dashboard statistics.');
        }

        const data = await response.json();

        if (isMounted) {
          setDashboardStats(data);
        }
      } catch (error) {
        console.error('Dashboard statistics error:', error);
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Active top-level admin tab
  const [adminTab, setAdminTab] = useState<
    'overview' | 'users' | 'timetable' | 'attendance' | 'projects' | 'syllabus' | 'ppts' | 'leads' | 'broadcast' | 'certificates'
  >('overview');

  // ================= USERS MODAL STATE =================
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
const [newUserTrack, setNewUserTrack] = useState<string>(CODEMUX_COURSES[0]);
  const [newUserBatch, setNewUserBatch] = useState('Cohort 2026-A');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('IN');

const selectedCountry = COUNTRY_CODES.find(
  (country) => country.code === newUserCountry
) || COUNTRY_CODES[0];
  
  const [newUserPassword, setNewUserPassword] = useState('');
const [isCreatingUser, setIsCreatingUser] = useState(false);


const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isCreatingUser) return;

  const nameCheck = validateName(newUserName);
  if (!nameCheck.isValid) {
    addToast(
      'error',
      'Name Protection Error',
      nameCheck.error || 'Please enter a valid name.'
    );
    return;
  }

  const emailCheck = validateEmail(newUserEmail);
  if (!emailCheck.isValid) {
    addToast(
      'error',
      'Invalid Email',
      emailCheck.error || 'Please enter a valid email address.'
    );
    return;
  }

  if (newUserPassword.length < 6) {
    addToast(
      'error',
      'Invalid Password',
      'Password must be at least 6 characters long.'
    );
    return;
  }

if (newUserPhone && !/^\d{10}$/.test(newUserPhone)) {
  addToast(
    'error',
    'Invalid Phone Number',
    'Please enter exactly 10 digits.'
  );
  return;
}

  try {
    setIsCreatingUser(true);

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword,
        role: newUserRole.toUpperCase(),
        phone: newUserPhone
  ? `${selectedCountry.dialCode}${newUserPhone}`
  : null,
        track: newUserTrack,
        batch: newUserRole === 'student' ? newUserBatch : null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to create account.');
    }

    // Refresh the directory from PostgreSQL
    const usersResponse = await fetch('/api/admin/users', {
      credentials: 'include',
      cache: 'no-store',
    });

    const usersData = await usersResponse.json();

    if (!usersResponse.ok) {
      throw new Error(
        'Account was created, but the directory could not be refreshed. Please refresh the page.'
      );
    }

    setDirectoryUsers(usersData.users || []);

    addToast(
      'success',
      'Account Created',
      data.message || 'User account created successfully.'
    );

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserCountry('IN');
    setNewUserRole('student');
   setNewUserTrack(CODEMUX_COURSES[0]);
    setNewUserBatch('Cohort 2026-A');

  } catch (error) {
    addToast(
      'error',
      'Account Creation Failed',
      error instanceof Error ? error.message : 'Something went wrong.'
    );
  } finally {
    setIsCreatingUser(false);
  }
};


  // ================= TIMETABLE MODAL STATE =================
  const [isScheduleClassOpen, setIsScheduleClassOpen] = useState(false);
  const [clsTopic, setClsTopic] = useState('');
  const [clsDescription, setClsDescription] = useState('');
  const [clsTrack, setClsTrack] = useState('Full-Stack Web Development');
  const [clsBatch, setClsBatch] = useState('Cohort 2026-A');
  const [clsDate, setClsDate] = useState('2026-11-06');
  const [clsTime, setClsTime] = useState('10:00 AM - 12:00 PM');
  const [clsRoomLink, setClsRoomLink] = useState('https://meet.google.com/mux-live-class');
  const [clsMentorId, setClsMentorId] = useState(usersList.find((u) => u.role === 'mentor')?.id || '');
  const [clsPptTitle, setClsPptTitle] = useState('');
  const [clsPptUrl, setClsPptUrl] = useState('');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsTopic || !clsDate || !clsTime) return;
    const mentor = usersList.find((u) => u.id === clsMentorId);

    addClassSchedule({
      topic: clsTopic,
      description: clsDescription || 'Core technical concept training and live code along.',
      track: clsTrack,
      batch: clsBatch,
      date: clsDate,
      time: clsTime,
      roomLink: clsRoomLink,
      mentorId: clsMentorId || 'usr-mentor-1',
      mentorName: mentor ? mentor.name : 'Senior Mentor',
      pptTitle: clsPptTitle || undefined,
      pptUrl: clsPptUrl || undefined,
      status: 'upcoming',
    });

    setIsScheduleClassOpen(false);
    setClsTopic('');
    setClsDescription('');
    setClsPptTitle('');
    setClsPptUrl('');
  };

  // ================= PROJECTS MODAL STATE =================
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projTrack, setProjTrack] = useState('Full-Stack Web Development');
  const [projDifficulty, setProjDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [projDeadline, setProjDeadline] = useState('2026-11-30');
  const [projDeliverablesStr, setProjDeliverablesStr] = useState('GitHub Repo, Live URL, Documentation');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;
    addProject({
      title: projTitle,
      description: projDescription,
      track: projTrack,
      difficulty: projDifficulty,
      deadline: projDeadline,
      deliverables: projDeliverablesStr.split(',').map((s) => s.trim()),
      evaluationCriteria: ['Code quality', 'Schema design', 'User interface polish'],
    });
    setIsAddProjectOpen(false);
    setProjTitle('');
    setProjDescription('');
  };

  // ================= PPT MODAL STATE =================
  const [isAddPptOpen, setIsAddPptOpen] = useState(false);
  const [pptTitle, setPptTitle] = useState('');
  const [pptTopic, setPptTopic] = useState('');
  const [pptTrack, setPptTrack] = useState('Full-Stack Web Development');
  const [pptUrl, setPptUrl] = useState('');
  const [pptSlides, setPptSlides] = useState(35);
  const [pptType, setPptType] = useState<'PPTX' | 'PDF Deck' | 'Google Slides'>('PPTX');

  const handleCreatePpt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pptTitle || !pptUrl) return;
    addPresentation({
      title: pptTitle,
      topic: pptTopic || pptTitle,
      track: pptTrack,
      slidesCount: Number(pptSlides) || 30,
      fileType: pptType,
      downloadOrViewUrl: pptUrl,
      description: 'Official CoDMux Curriculum Slide Deck',
      uploadedBy: 'Admin Console',
    });
    setIsAddPptOpen(false);
    setPptTitle('');
    setPptUrl('');
  };

  // ================= BROADCAST STATE =================
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastRole, setBroadcastRole] = useState<'all' | 'student' | 'mentor'>('all');
  // ================= SYLLABUS EDITOR STATE =================
const [editingSyllabus, setEditingSyllabus] =
  useState<SyllabusTrack | null>(null);

const [isCreatingSyllabus, setIsCreatingSyllabus] = useState(false);

const openSyllabusEditor = (track: SyllabusTrack) => {
  setIsCreatingSyllabus(false);
  setEditingSyllabus(JSON.parse(JSON.stringify(track)));
};

const openNewSyllabusEditor = () => {
  setIsCreatingSyllabus(true);

  setEditingSyllabus({
    id: `syllabus-${Date.now()}`,
    trackName: '',
    badge: '',
    description: '',
    durationWeeks: 1,
    modules: [],
  });
};

const handleSaveSyllabus = () => {
  if (!editingSyllabus) return;

  if (!editingSyllabus.trackName.trim()) {
    addToast('error', 'Missing Course Title', 'Please enter a course title.');
    return;
  }

  if (editingSyllabus.durationWeeks < 1) {
    addToast('error', 'Invalid Duration', 'Duration must be at least 1 week.');
    return;
  }

  if (editingSyllabus.modules.length === 0) {
    addToast('error', 'No Modules', 'Please add at least one module.');
    return;
  }

  const hasIncompleteModule = editingSyllabus.modules.some(
    (module) =>
      !module.title.trim() ||
      !module.summary.trim() ||
      !module.handsOnLab.trim() ||
      module.weekNumber < 1
  );

  if (hasIncompleteModule) {
    addToast(
      'error',
      'Incomplete Module',
      'Please complete every module title, week number, description and lab.'
    );
    return;
  }

  if (isCreatingSyllabus) {
    addSyllabusTrack(editingSyllabus);
  } else {
    updateSyllabusTrack(editingSyllabus);
  }

  setEditingSyllabus(null);
  setIsCreatingSyllabus(false);
};

const handleAddSyllabusModule = () => {
  if (!editingSyllabus) return;

  const nextWeek =
    editingSyllabus.modules.length > 0
      ? Math.max(...editingSyllabus.modules.map((m) => m.weekNumber)) + 1
      : 1;

  const newModule = {
  id: `module-${Date.now()}`,
  weekNumber: nextWeek,
  title: '',
  summary: '',
  handsOnLab: '',
  topics: [],
};

  setEditingSyllabus((prev) =>
    prev
      ? { ...prev, modules: [...prev.modules, newModule] }
      : prev
  );
};

const handleRemoveSyllabusModule = (moduleId: string | number) => {
  setEditingSyllabus((prev) =>
    prev
      ? {
          ...prev,
          modules: prev.modules.filter(
            (module) => String(module.id) !== String(moduleId)
          ),
        }
      : prev
  );
};

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;
    addAnnouncement(broadcastTitle, broadcastContent, broadcastRole);
    setBroadcastTitle('');
    setBroadcastContent('');
  };



  return (
    <div className="w-full py-8 sm:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF6B16] shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FF6B16] font-bold uppercase tracking-wider">
                  Master Administrator Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                  Full Authority
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                {currentUser?.name || 'Administrator'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Central control for Users, Mentors, Timetables, Attendance, Projects &amp; Syllabus.
              </p>
            </div>
          </div>

          {/* Quick Omni Preview Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateTo('student-portal')}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Student Portal &amp; Progress Gauge
            </button>
            <button
              onClick={() => navigateTo('mentor-portal')}
              className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" /> Preview Mentor Portal
            </button>
            <button
              onClick={logoutUser}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-rose-400 hover:text-rose-600 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>


{/* Global Stats bar */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
    <div className="text-xs text-stone-500 font-bold uppercase">
      Enrolled Students
    </div>
    <div className="text-2xl font-bold text-stone-900 mt-1">
      {statsLoading ? '...' : dashboardStats.totalStudents}
    </div>
    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
      Active Learners
    </div>
  </div>

  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
    <div className="text-xs text-stone-500 font-bold uppercase">
      Technical Mentors
    </div>
    <div className="text-2xl font-bold text-stone-900 mt-1">
      {statsLoading ? '...' : dashboardStats.totalMentors}
    </div>
    <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
      Registered Mentors
    </div>
  </div>

  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
    <div className="text-xs text-stone-500 font-bold uppercase">
      Upcoming Classes
    </div>
    <div className="text-2xl font-bold text-stone-900 mt-1">
      {statsLoading ? '...' : dashboardStats.upcomingClasses}
    </div>
    <div className="text-[11px] text-[#FF6B16] font-semibold mt-0.5">
      Scheduled This Week
    </div>
  </div>

  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
    <div className="text-xs text-stone-500 font-bold uppercase">
      Pending Submissions
    </div>
    <div className="text-2xl font-bold text-stone-900 mt-1">
      {statsLoading ? '...' : dashboardStats.pendingSubmissions}
    </div>
    <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
      Awaiting Grading
    </div>
  </div>

</div>


        {/* Main Admin Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
          {[
            { id: 'overview', label: 'Dashboard', icon: TrendingUp },
            { id: 'users', label: `Users & Mentors (${usersLoading ? '...' : directoryUsers.length})`, icon: Users },
            { id: 'timetable', label: `Timetable (${classesList.length})`, icon: Calendar },
            { id: 'attendance', label: `Attendance Master (${attendanceList.length})`, icon: UserCheck },
            { id: 'projects', label: `Projects & Grades (${projectsList.length})`, icon: Award },
            { id: 'syllabus', label: `Syllabus Editor (${syllabusTracks.length})`, icon: BookOpen },
            { id: 'ppts', label: `PPTs & Slide Decks (${presentationsList.length})`, icon: Presentation },
            { id: 'leads', label: `Waitlist Leads (${earlyAccessList.length})`, icon: GraduationCap },
            { id: 'certificates', label: 'Certificate Management', icon: Award },
            { id: 'broadcast', label: 'Announcements & Logs', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FF6B16] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB: DASHBOARD OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF6B16]" /> Central Administrative Management
                </h3>
                <p className="text-xs text-stone-600">
                  You have full privileges over every portal. Choose an operation below to manage student timetables, mentor attendance, project evaluations, and slide decks.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setAdminTab('users');
                      setIsAddUserOpen(true);
                    }}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-[#FF6B16] text-xs font-bold text-stone-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-[#FF6B16]" /> Add User / Mentor
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('timetable');
                      setIsScheduleClassOpen(true);
                    }}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-[#FF6B16] text-xs font-bold text-stone-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#FF6B16]" /> Schedule Class
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('projects');
                      setIsAddProjectOpen(true);
                    }}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-[#FF6B16] text-xs font-bold text-stone-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-[#FF6B16]" /> Add Capstone Project
                  </button>
                  <button
                    onClick={() => {
                      setAdminTab('ppts');
                      setIsAddPptOpen(true);
                    }}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-[#FF6B16] text-xs font-bold text-stone-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Presentation className="w-4 h-4 text-[#FF6B16]" /> Upload PPT Deck
                  </button>
                  <button
                    onClick={() => navigateTo('student-portal')}
                    className="col-span-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-400 text-xs font-bold text-emerald-950 text-left transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      Inspect Student Portal &amp; Live Circular Progress Gauge
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      Open View →
                    </span>
                  </button>
                </div>
              </div>

              {/* Portal Simulation Card */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" /> Immediate Role Portal Impersonation
                </h3>
                <p className="text-xs text-stone-600">
                  Jump directly into any student or mentor view with one click to verify what they see:
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  {usersList
                    .filter((u) => u.role !== 'admin')
                    .slice(0, 4)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {user.role === 'mentor' ? (
                            <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className="font-semibold text-stone-900">{user.name}</span>
                          <span className="text-[11px] text-stone-500">({user.role} - {user.track || user.email})</span>
                        </div>
                        <button
                          onClick={() => impersonateUser(user)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
                        >
                          View As
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Code Privacy & Security Status Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-display">
                      Platform Source Code &amp; Developer Privacy Protection
                    </h3>
                    <p className="text-xs text-stone-500">
                      Active security guards preventing non-developers and visitors from viewing, inspecting, or extracting application source code.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 self-start sm:self-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  All Shields Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Right-Click Protection</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Enforced</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">ContextMenu and browser inspector triggers blocked for regular visitors.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">DevTools Shortcut Guard</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Enforced</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U intercepted and restricted.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Source Map Shielding</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">TypeScript source maps disabled in build to prevent exposing raw code.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Role-Based Route Guard</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">Portals isolated; unauthorized visitors blocked with authentication gates.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USERS & MENTORS MANAGEMENT */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">User &amp; Mentor Master Directory</h2>
                <p className="text-xs text-stone-500">Manage registered students, faculty mentors, and account statuses.</p>
              </div>
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="px-4 py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Add New User
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Track / Specialty</th>
                      <th className="py-3 px-4">Batch</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {usersLoading ? (
  <tr>
    <td colSpan={7} className="py-8 text-center text-stone-500">
      Loading users from database...
    </td>
  </tr>
) : usersError ? (
  <tr>
    <td colSpan={7} className="py-8 text-center text-red-600">
      {usersError}
    </td>
  </tr>
) : directoryUsers.length === 0 ? (
  <tr>
    <td colSpan={7} className="py-8 text-center text-stone-500">
      No registered users found.
    </td>
  </tr>
) : (
  directoryUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <Shield className="w-3.5 h-3.5 text-[#FF6B16]" />
                          ) : user.role === 'mentor' ? (
                            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>{user.name}</span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              user.role === 'admin'
                                ? 'bg-orange-100 text-orange-900'
                                : user.role === 'mentor'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{user.track || '—'}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{user.batch || '—'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => impersonateUser(user)}
                              title="Impersonate & Switch View"
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer"
                            >
                              Impersonate
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              title="Delete user"
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add User Modal */}
            {isAddUserOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-display">Add User or Mentor</h3>
                    <button onClick={() => setIsAddUserOpen(false)} className="text-stone-400">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-stone-700">Full Name *</label>
                        <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                          Alphabets only (A-Z)
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(sanitizeName(e.target.value))}
                        pattern="[a-zA-Z\s]+"
                        title="Only letters and spaces are allowed"
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-stone-700">Email Address *</label>
                        <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                          Strict email
                        </span>
                      </div>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value.trim())}
                        placeholder="vikram@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
  <label className="block font-semibold text-stone-700 mb-1">
    Login Password *
  </label>
  <input
    type="password"
    required
    minLength={6}
    autoComplete="new-password"
    value={newUserPassword}
    onChange={(e) => setNewUserPassword(e.target.value)}
    placeholder="Create password (minimum 6 characters)"
    className="w-full px-3 py-2 rounded-xl border border-stone-300"
  />
</div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Role *</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          
                        </select>
                      </div>

                    
<div>
  <div className="flex items-center justify-between mb-1">
    <label className="block font-semibold text-stone-700">
      Phone
    </label>
    <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
      Exactly 10 digits
    </span>
  </div>

  <div className="flex gap-2">
    <select
      value={newUserCountry}
      onChange={(e) => setNewUserCountry(e.target.value)}
      className="w-[42%] min-w-0 px-2 py-2 rounded-xl border border-stone-300 bg-white"
      aria-label="Country calling code"
    >
      {COUNTRY_CODES.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.dialCode}
        </option>
      ))}
    </select>

    <input
      type="tel"
      inputMode="numeric"
      pattern="[0-9]{10}"
      maxLength={10}
      value={newUserPhone}
      onChange={(e) =>
        setNewUserPhone(
          e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
        )
      }
      placeholder="9876543210"
      className="w-[58%] min-w-0 px-3 py-2 rounded-xl border border-stone-300"
          title="Enter exactly 10 digits"
    />
  </div>
</div>
</div>


  <label className="block font-semibold text-stone-700 mb-1">
    Track Assignment
  </label>


                   <div>
  <label className="block font-semibold text-stone-700 mb-1">
    Track Assignment
  </label>

  <select
    value={newUserTrack}
    onChange={(e) => setNewUserTrack(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
  >
    {CODEMUX_COURSES.map((course) => (
      <option key={course} value={course}>
        {course}
      </option>
    ))}
  </select>
</div>

                    {newUserRole === 'student' && (
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Batch Assignment</label>
                        <input
                          type="text"
                          value={newUserBatch}
                          onChange={(e) => setNewUserBatch(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddUserOpen(false)}
                        className="px-3.5 py-2 text-stone-600 rounded-xl"
                      >
                        Cancel
                      </button>
                     <button
  type="submit"
  disabled={isCreatingUser}
  className="px-4 py-2 bg-[#FF6B16] text-white font-bold rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isCreatingUser ? 'Creating Account...' : 'Create User'}
</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: TIMETABLE MASTER */}
        {adminTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Master Class Timetable &amp; Schedule</h2>
                <p className="text-xs text-stone-500">Configure lectures, assign mentors, Google Meet rooms, and slide decks.</p>
              </div>
              <button
                onClick={() => setIsScheduleClassOpen(true)}
                className="px-4 py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Schedule New Class
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classesList.map((cls) => (
                <div
                  key={cls.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                        {cls.track}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          cls.status === 'completed'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cls.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{cls.topic}</h3>
                    <p className="text-xs text-stone-600">{cls.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                      <div>Date: <strong className="text-stone-800">{cls.date}</strong></div>
                      <div>Time: <strong className="text-stone-800">{cls.time}</strong></div>
                      <div>Mentor: <strong className="text-stone-800">{cls.mentorName}</strong></div>
                      <div>Batch: <strong className="text-stone-800">{cls.batch}</strong></div>
                    </div>

                    <div className="text-xs text-stone-500 truncate">
                      Room Link: <a href={cls.roomLink} target="_blank" rel="noreferrer" className="text-[#FF6B16] hover:underline font-mono">{cls.roomLink}</a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        updateClassSchedule(cls.id, {
                          status: cls.status === 'completed' ? 'upcoming' : 'completed',
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                    >
                      Toggle Status ({cls.status === 'completed' ? 'Mark Upcoming' : 'Mark Completed'})
                    </button>

                    <button
                      onClick={() => deleteClassSchedule(cls.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Schedule Class Modal */}
            {isScheduleClassOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-display">Schedule Live Class Session</h3>
                    <button onClick={() => setIsScheduleClassOpen(false)} className="text-stone-400">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateClass} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Class Topic / Lecture Title *</label>
                      <input
                        type="text"
                        required
                        value={clsTopic}
                        onChange={(e) => setClsTopic(e.target.value)}
                        placeholder="e.g. Distributed Database Sharding & Caching"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Track</label>
                        <select
                          value={clsTrack}
                          onChange={(e) => setClsTrack(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <optgroup label="🌟 Junior Foundation Academy">
                            <option>Vedic Maths & Speed Mental Arithmetic</option>
                            <option>English Mastery: Grammar, Spoken Fluency & Writing</option>
                            <option>Hindi Vyakaran, Sahitya & Conversational Fluency</option>
                            <option>Young Coders: Scratch & Creative Python</option>
                          </optgroup>
                          <optgroup label="💼 Career & Technical Specializations">
                            <option>Full-Stack Web Development</option>
                            <option>Data Analytics & BI</option>
                            <option>Placement Preparation & Interview Mastery</option>
                            <option>Python Programming & AI Essentials</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Batch</label>
                        <input
                          type="text"
                          value={clsBatch}
                          onChange={(e) => setClsBatch(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Assigned Mentor</label>
                        <select
                          value={clsMentorId}
                          onChange={(e) => setClsMentorId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          {usersList
                            .filter((u) => u.role === 'mentor')
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.track || 'Mentor'})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Date *</label>
                        <input
                          type="date"
                          required
                          value={clsDate}
                          onChange={(e) => setClsDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Time Slot *</label>
                        <input
                          type="text"
                          required
                          value={clsTime}
                          onChange={(e) => setClsTime(e.target.value)}
                          placeholder="10:00 AM - 12:00 PM"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Meeting Link *</label>
                        <input
                          type="url"
                          required
                          value={clsRoomLink}
                          onChange={(e) => setClsRoomLink(e.target.value)}
                          placeholder="https://meet.google.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Attach PPT Title (Optional)</label>
                        <input
                          type="text"
                          value={clsPptTitle}
                          onChange={(e) => setClsPptTitle(e.target.value)}
                          placeholder="e.g. System Design Slides"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Slide Deck Link</label>
                        <input
                          type="url"
                          value={clsPptUrl}
                          onChange={(e) => setClsPptUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsScheduleClassOpen(false)}
                        className="px-3.5 py-2 text-stone-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FF6B16] text-white font-bold rounded-xl shadow-xs"
                      >
                        Schedule Session
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ATTENDANCE MASTER */}
        {adminTab === 'attendance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">Student &amp; Mentor Attendance Overseer</h2>
              <p className="text-xs text-stone-500">Cross-batch attendance logs, mentor teaching verification, and audit stamps.</p>
            </div>

            {/* Mentor teaching logs summary */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" /> Mentor Teaching Conduction Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Mentor</th>
                      <th className="py-2.5 px-3">Session Topic</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Check-In</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {mentorAttendanceList.map((m) => (
                      <tr key={m.id}>
                        <td className="py-2 px-3 font-mono">{m.date}</td>
                        <td className="py-2 px-3 font-bold text-stone-900">{m.mentorName}</td>
                        <td className="py-2 px-3">{m.classTopic}</td>
                        <td className="py-2 px-3 text-stone-600">{m.scheduledTime}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {m.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-stone-500">{m.checkedInAt || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Attendance Logs */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> Student Attendance Master Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Topic</th>
                      <th className="py-2.5 px-3">Batch</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Verified By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {attendanceList.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2 px-3 font-mono">{a.classDate}</td>
                        <td className="py-2 px-3 font-bold text-stone-900">{a.studentName}</td>
                        <td className="py-2 px-3">{a.classTopic}</td>
                        <td className="py-2 px-3 text-stone-600">{a.batch}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              a.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : a.status === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-stone-500">{a.markedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROJECTS & GRADES */}
        {adminTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Capstone Projects &amp; Student Submissions</h2>
                <p className="text-xs text-stone-500">Configure project briefs and review all student code submissions.</p>
              </div>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="px-4 py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Add Project Assignment
              </button>
            </div>

            {/* Submissions awaiting review */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm">All Student Submissions ({submissionsList.length})</h3>
              <div className="space-y-3 text-xs">
                {submissionsList.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-stone-900">{sub.projectTitle}</div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-stone-500">
                      Student: <strong className="text-stone-800">{sub.studentName}</strong> · Submitted: {sub.submittedAt}
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-[#FF6B16] font-semibold hover:underline flex items-center gap-1">
                        <Github className="w-3.5 h-3.5" /> Repository
                      </a>
                      {sub.liveDemoUrl && (
                        <a href={sub.liveDemoUrl} target="_blank" rel="noreferrer" className="text-[#FF6B16] font-semibold hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Project
                        </a>
                      )}
                    </div>
                    {sub.grade && (
                      <div className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        Grade: {sub.grade} — {sub.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Project Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsList.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {p.track}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800">
                        {p.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base">{p.title}</h3>
                    <p className="text-xs text-stone-600">{p.description}</p>
                    <div className="text-xs text-stone-500">Deadline: <strong>{p.deadline}</strong></div>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Modal */}
            {isAddProjectOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-display">Create Capstone Project Brief</h3>
                    <button onClick={() => setIsAddProjectOpen(false)} className="text-stone-400">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProject} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="e.g. Distributed Task Queue System"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Track</label>
                      <select
                        value={projTrack}
                        onChange={(e) => setProjTrack(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <optgroup label="🌟 Junior Foundation Academy">
                          <option>Vedic Maths & Speed Mental Arithmetic</option>
                          <option>English Mastery: Grammar, Spoken Fluency & Writing</option>
                          <option>Hindi Vyakaran, Sahitya & Conversational Fluency</option>
                          <option>Young Coders: Scratch & Creative Python</option>
                        </optgroup>
                        <optgroup label="💼 Career & Technical Specializations">
                          <option>Full-Stack Web Development</option>
                          <option>Data Analytics & BI</option>
                          <option>Placement Preparation & Interview Mastery</option>
                          <option>Python Programming & AI Essentials</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Difficulty</label>
                        <select
                          value={projDifficulty}
                          onChange={(e) => setProjDifficulty(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Deadline Date</label>
                        <input
                          type="date"
                          value={projDeadline}
                          onChange={(e) => setProjDeadline(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={projDescription}
                        onChange={(e) => setProjDescription(e.target.value)}
                        placeholder="What problem does this project solve?"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Deliverables (comma-separated)</label>
                      <input
                        type="text"
                        value={projDeliverablesStr}
                        onChange={(e) => setProjDeliverablesStr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProjectOpen(false)}
                        className="px-3.5 py-2 text-stone-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FF6B16] text-white font-bold rounded-xl shadow-xs"
                      >
                        Publish Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      
{/* TAB: SYLLABUS EDITOR */}
{adminTab === 'syllabus' && (
  <div className="space-y-6">
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h2 className="text-xl font-bold text-stone-900 font-display">
      Curriculum &amp; Syllabus Manager
    </h2>
    <p className="text-xs text-stone-500">
      Manage course details, duration and modules across all learning tracks.
    </p>
  </div>

  <button
    type="button"
    onClick={openNewSyllabusEditor}
    className="px-5 py-3 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
  >
    <PlusCircle className="w-4 h-4" />
    Add New Syllabus
  </button>
</div>
    

    <div className="space-y-6">
      {syllabusTracks.map((trk) => (
        <div
          key={trk.id}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs text-[#FF6B16] font-bold uppercase">
                {trk.badge}
              </span>

              <h3 className="text-lg font-bold text-stone-900">
                {trk.trackName}
              </h3>

              <p className="text-xs text-stone-500">
                {trk.description}
              </p>

              <p className="text-xs text-stone-500 mt-1">
                {trk.modules.length} Modules
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
  <span className="text-xs font-semibold px-3 py-1 bg-stone-100 rounded-lg text-stone-700">
    {trk.durationWeeks} Weeks
  </span>

  <button
    type="button"
    onClick={() => openSyllabusEditor(trk)}
    className="px-4 py-2 rounded-xl bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 transition-colors"
  >
    <Edit className="w-3.5 h-3.5" />
    Edit Syllabus
  </button>

  <button
    type="button"
    onClick={() => {
      const confirmed = window.confirm(
        `Are you sure you want to remove "${trk.trackName}"?`
      );

      if (confirmed) {
        deleteSyllabusTrack(trk.id);
      }
    }}
    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2 transition-colors"
  >
    <Trash2 className="w-3.5 h-3.5" />
    Remove
  </button>
</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {trk.modules.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1.5"
              >
                <div className="font-bold text-stone-900">
                  Module {idx + 1} (W{m.weekNumber}): {m.title}
                </div>

                <p className="text-stone-600">
                  {m.summary}
                </p>

                <div className="text-[11px] text-[#FF6B16] font-semibold">
                  Lab: {m.handsOnLab}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* EDIT SYLLABUS MODAL */}
    {editingSyllabus && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-3 sm:p-6">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">

          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-stone-200 p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
  {isCreatingSyllabus
    ? 'Add New Course Syllabus'
    : 'Edit Course Syllabus'}
</h3>
              <p className="text-xs text-stone-500 mt-1">
                Update course information and manage modules.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditingSyllabus(null)}
              className="text-stone-400 hover:text-rose-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-6">

            {/* COURSE DETAILS */}
            <section className="space-y-4">
              <h4 className="font-bold text-stone-900">
                Course Information
              </h4>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Course Title *
                </label>

                <input
                  type="text"
                  value={editingSyllabus.trackName}
                  onChange={(e) =>
                    setEditingSyllabus((prev) =>
                      prev ? { ...prev, trackName: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-[#FF6B16] outline-none"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Track Badge / Category
                </label>

                <input
                  type="text"
                  value={editingSyllabus.badge}
                  onChange={(e) =>
                    setEditingSyllabus((prev) =>
                      prev ? { ...prev, badge: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-[#FF6B16] outline-none"
                  placeholder="e.g. FLAGSHIP ENGINEERING TRACK"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Course Description
                </label>

                <textarea
                  rows={3}
                  value={editingSyllabus.description}
                  onChange={(e) =>
                    setEditingSyllabus((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-[#FF6B16] outline-none resize-y"
                  placeholder="Describe this course"
                />
              </div>

              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Course Duration (Weeks) *
                </label>

                <input
                  type="number"
                  min="1"
                  value={editingSyllabus.durationWeeks}
                  onChange={(e) =>
                    setEditingSyllabus((prev) =>
                      prev
                        ? {
                            ...prev,
                            durationWeeks: Number(e.target.value),
                          }
                        : prev
                    )
                  }
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:border-[#FF6B16] outline-none"
                />
              </div>
            </section>

            {/* MODULE MANAGEMENT */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-stone-900">
                    Course Modules ({editingSyllabus.modules.length})
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Add, remove or edit as many modules as your course needs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSyllabusModule}
                  className="px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[#FF6B16] hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Module
                </button>
              </div>

              {editingSyllabus.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-sm text-stone-900">
                      Module {index + 1}
                    </h5>

                    <button
                      type="button"
                      onClick={() => handleRemoveSyllabusModule(module.id)}
                      className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Module Title *
                      </label>

                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) =>
                          setEditingSyllabus((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  modules: prev.modules.map((m) =>
                                    String(m.id) === String(module.id)
                                      ? { ...m, title: e.target.value }
                                      : m
                                  ),
                                }
                              : prev
                          )
                        }
                        className="w-full p-2.5 rounded-lg border border-stone-300 text-sm outline-none focus:border-[#FF6B16]"
                        placeholder="Enter module title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Week Number *
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={module.weekNumber}
                        onChange={(e) =>
                          setEditingSyllabus((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  modules: prev.modules.map((m) =>
                                    String(m.id) === String(module.id)
                                      ? {
                                          ...m,
                                          weekNumber: Number(e.target.value),
                                        }
                                      : m
                                  ),
                                }
                              : prev
                          )
                        }
                        className="w-full p-2.5 rounded-lg border border-stone-300 text-sm outline-none focus:border-[#FF6B16]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Module Description *
                    </label>

                    <textarea
                      rows={2}
                      value={module.summary}
                      onChange={(e) =>
                        setEditingSyllabus((prev) =>
                          prev
                            ? {
                                ...prev,
                                modules: prev.modules.map((m) =>
                                  String(m.id) === String(module.id)
                                    ? { ...m, summary: e.target.value }
                                    : m
                                ),
                              }
                            : prev
                        )
                      }
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm outline-none focus:border-[#FF6B16] resize-y"
                      placeholder="Describe what students will learn"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Practical Lab / Project *
                    </label>

                    <textarea
                      rows={2}
                      value={module.handsOnLab}
                      onChange={(e) =>
                        setEditingSyllabus((prev) =>
                          prev
                            ? {
                                ...prev,
                                modules: prev.modules.map((m) =>
                                  String(m.id) === String(module.id)
                                    ? { ...m, handsOnLab: e.target.value }
                                    : m
                                ),
                              }
                            : prev
                        )
                      }
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm outline-none focus:border-[#FF6B16] resize-y"
                      placeholder="Describe the practical lab or project"
                    />
                  </div>
                </div>
              ))}

              {editingSyllabus.modules.length === 0 && (
                <div className="p-8 text-center rounded-xl border border-dashed border-stone-300 text-stone-500 text-sm">
                  No modules added yet. Click Add Module to create one.
                </div>
              )}
            </section>
          </div>

          {/* MODAL FOOTER */}
          <div className="sticky bottom-0 bg-white border-t border-stone-200 p-5 flex flex-col-reverse sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSyllabus(null)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-xs font-bold hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveSyllabus}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
             <CheckCircle2 className="w-4 h-4" />
{isCreatingSyllabus ? 'Create Syllabus' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}


        {/* TAB: PPTS & PRESENTATIONS */}
        {adminTab === 'ppts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Slide Decks &amp; Presentation Library</h2>
                <p className="text-xs text-stone-500">Upload and link official slide presentations for classes.</p>
              </div>
              <button
                onClick={() => setIsAddPptOpen(true)}
                className="px-4 py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Upload Slide Deck
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presentationsList.map((deck) => (
                <div key={deck.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between gap-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600 uppercase text-[11px] bg-orange-50 px-2 py-0.5 rounded-md">
                        {deck.track}
                      </span>
                      <span className="font-mono text-stone-500">{deck.fileType} · {deck.slidesCount} slides</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm">{deck.title}</h3>
                    <p className="text-stone-600">{deck.description}</p>
                    <div className="text-stone-400 text-[11px]">Uploaded by {deck.uploadedBy} on {deck.uploadedAt}</div>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <a href={deck.downloadOrViewUrl} target="_blank" rel="noreferrer" className="text-[#FF6B16] hover:underline font-bold flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> View / Download
                    </a>
                    <button
                      onClick={() => deletePresentation(deck.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add PPT Modal */}
            {isAddPptOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-display">Upload Slide Deck</h3>
                    <button onClick={() => setIsAddPptOpen(false)} className="text-stone-400">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePpt} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Deck Title *</label>
                      <input
                        type="text"
                        required
                        value={pptTitle}
                        onChange={(e) => setPptTitle(e.target.value)}
                        placeholder="e.g. Relational Data Modeling & Normalization"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Track</label>
                      <select
                        value={pptTrack}
                        onChange={(e) => setPptTrack(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <optgroup label="🌟 Junior Foundation Academy">
                          <option>Vedic Maths & Speed Mental Arithmetic</option>
                          <option>English Mastery: Grammar, Spoken Fluency & Writing</option>
                          <option>Hindi Vyakaran, Sahitya & Conversational Fluency</option>
                          <option>Young Coders: Scratch & Creative Python</option>
                        </optgroup>
                        <optgroup label="💼 Career & Technical Specializations">
                          <option>Full-Stack Web Development</option>
                          <option>Data Analytics & BI</option>
                          <option>Placement Preparation & Interview Mastery</option>
                          <option>Python Programming & AI Essentials</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">File Type</label>
                        <select
                          value={pptType}
                          onChange={(e) => setPptType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option>PPTX</option>
                          <option>PDF Deck</option>
                          <option>Google Slides</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Slide Count</label>
                        <input
                          type="number"
                          value={pptSlides}
                          onChange={(e) => setPptSlides(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Slide Deck Link *</label>
                      <input
                        type="url"
                        required
                        value={pptUrl}
                        onChange={(e) => setPptUrl(e.target.value)}
                        placeholder="https://codemux.in/slides/my-deck.pptx"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddPptOpen(false)}
                        className="px-3.5 py-2 text-stone-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FF6B16] text-white font-bold rounded-xl shadow-xs"
                      >
                        Publish Slide Deck
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: LEADS / EARLY ACCESS */}
        {adminTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-display">Admissions Waitlist &amp; Early Access</h2>
                <p className="text-xs text-stone-500">Student interest leads captured via the public portal.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-stone-100 rounded-lg">
                {earlyAccessList.length} Leads Registered
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Interest</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {earlyAccessList.map((lead) => (
                      <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-stone-500">{lead.submittedAt}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">{lead.name}</td>
                        <td className="py-3 px-4 text-stone-600">{lead.email}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{lead.phone || '—'}</td>
                        <td className="py-3 px-4 text-stone-700">{lead.interest}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              lead.status === 'enrolled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {lead.status || 'pending'}
                          </span>
                        </td>
                       
<td className="py-3 px-4 text-right">
  <div className="flex items-center justify-end gap-2">
    <button
      onClick={() => updateLeadStatus(lead.id, 'enrolled')}
      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
    >
      Mark Enrolled
    </button>

    <button
      onClick={() => {
        const confirmed = window.confirm(
          `Are you sure you want to permanently delete the lead from ${lead.name}?`
        );

        if (confirmed) {
          void deleteLead(lead.id);
        }
      }}
      title="Delete Lead"
      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BROADCAST & LOGS */}
        {adminTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Broadcast Announcement */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
                <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FF6B16]" /> Broadcast Announcement
                </h3>

                <form onSubmit={handleBroadcast} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Headline *</label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. Schedule Change for Cohort 2026-A"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Target Audience</label>
                    <select
                      value={broadcastRole}
                      onChange={(e) => setBroadcastRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="all">All Users (Students + Mentors)</option>
                      <option value="student">Students Only</option>
                      <option value="mentor">Mentors Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Message Content *</label>
                    <textarea
                      rows={3}
                      required
                      value={broadcastContent}
                      onChange={(e) => setBroadcastContent(e.target.value)}
                      placeholder="Detailed announcement text..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#FF6B16] hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
                  >
                    Broadcast to Platform
                  </button>
                </form>
              </div>

              {/* System Audit Logs */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
                <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                  <History className="w-4 h-4 text-stone-600" /> Platform Security &amp; Activity Log
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-stone-900">{log.action}</span>
                        <span className="font-mono text-stone-400">{log.timestamp}</span>
                      </div>
                      <div className="text-stone-600 mt-0.5">{log.details}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">By {log.actor} ({log.role})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CERTIFICATE MANAGEMENT */}
        {adminTab === 'certificates' && <AdminCertificateSection />}

      </div>
    </div>
  );
};
