'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthUser,
  UserRole,
  ContactInquiry,
  Announcement,
  SystemAuditLog,
  ClassSchedule,
  AttendanceRecord,
  MentorAttendance,
  ProjectItem,
  StudentProjectSubmission,
  PresentationDeck,
  SyllabusTrack,
  SyllabusModule,
} from '../types';

export type PageRoute =
  | 'home'
  | 'domains'
  | 'placements'
  | 'about'
  | 'contact'
  | 'faq'
  | 'login'
  | 'student-portal'
  | 'mentor-portal'
  | 'admin-portal'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'conduct'
  | 'verify-certificate';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

export interface EarlyAccessEntry {
  id: string;
  name: string;
  email: string;
  interest: string;
  phone?: string;
  submittedAt: string;
  status?: 'pending' | 'enrolled' | 'contacted';
}



interface AppContextType {
  currentPage: PageRoute;
  navigateTo: (page: PageRoute) => void;

  currentUser: AuthUser | null;
  loginUser: (userOrEmail: string | any, role?: UserRole, name?: string) => void;
  logoutUser: () => void;
  registerUser: (name: string, email: string, interest: string, phone?: string) => boolean;

  // User Directory Management (Admin oversight)
  usersList: AuthUser[];
  addUser: (user: Omit<AuthUser, 'id' | 'joinedAt'>) => void;
  updateUser: (id: string | number, updates: Partial<AuthUser>) => void;
  deleteUser: (id: string | number) => void;
  impersonateUser: (user: AuthUser) => void;

  // Timetable & Class Schedules
  classesList: ClassSchedule[];
  addClassSchedule: (cls: Omit<ClassSchedule, 'id'>) => void;
  updateClassSchedule: (id: string | number, updates: Partial<ClassSchedule>) => void;
  deleteClassSchedule: (id: string | number) => void;

  // Attendance Management (Students)
  attendanceList: AttendanceRecord[];
  markAttendance: (
    classId: string | number,
    studentId: string | number,
    status: 'present' | 'absent' | 'late' | 'excused',
    remarks?: string
  ) => void;
  batchMarkAttendance: (
    classId: string | number,
    records: { studentId: string | number; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }[]
  ) => void;

  // Mentor Attendance & Conduction Log
  mentorAttendanceList: MentorAttendance[];
  logMentorSession: (classId: string | number, notes?: string) => void;
  updateMentorAttendanceStatus: (id: string | number, status: 'conducted' | 'scheduled' | 'leave') => void;

  // Projects & Deliverables
  projectsList: ProjectItem[];
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string | number, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string | number) => void;

  // Student Submissions & Grading
  submissionsList: StudentProjectSubmission[];
  submitProject: (
    
    projectId: string | number,
    githubUrl: string,
    liveDemoUrl?: string,
    notes?: string
  ) => void;
  reviewSubmission: (
    submissionId: string | number,
    status: 'approved' | 'needs_changes',
    grade: string,
    feedback: string
  ) => void;

  // Presentation PPTs
  presentationsList: PresentationDeck[];
  addPresentation: (deck: Omit<PresentationDeck, 'id' | 'uploadedAt'>) => void;
  deletePresentation: (id: string | number) => void;

  // Syllabus & Curriculum
  syllabusTracks: SyllabusTrack[];
  updateSyllabusModule: (trackId: string | number, module: SyllabusModule) => void;

  // Early access, Inquiries, Announcements & Logs
  earlyAccessList: EarlyAccessEntry[];
  joinEarlyAccess: (
  name: string,
  email: string,
  interest: string,
  phone?: string
) => Promise<boolean>;
  updateLeadStatus: (id: string | number, status: 'pending' | 'enrolled' | 'contacted') => void;
deleteLead: (id: string | number) => Promise<void>;
  contactInquiries: ContactInquiry[];
  submitContactForm: (
  inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>
) => Promise<boolean>;
  updateInquiryStatus: (id: string | number, status: 'new' | 'responded') => void;

  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, targetRole: 'all' | 'student' | 'mentor') => void;

  auditLogs: SystemAuditLog[];

  // Modals & Notifications
  isEarlyAccessModalOpen: boolean;
  openEarlyAccessModal: (defaultInterest?: string) => void;
  closeEarlyAccessModal: () => void;
  modalDefaultInterest: string;

  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'codemux_v2_';

function getStored<T>(key: string, defVal: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defVal;
  } catch (e) {
    return defVal;
  }
}

function save<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
}

const getInitialPage = (): PageRoute => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('verify-certificate')) return 'verify-certificate';
    if (path.includes('student-portal')) return 'student-portal';
    if (path.includes('mentor-portal')) return 'mentor-portal';
    if (path.includes('admin-portal')) return 'admin-portal';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('refund')) return 'refund';
    if (path.includes('conduct')) return 'conduct';
    if (path.includes('contact')) return 'contact';
    if (path.includes('about')) return 'about';
    if (path.includes('placements')) return 'placements';
    if (path.includes('domains')) return 'domains';
    if (path.includes('login')) return 'login';
    if (window.location.search.includes('id=CMX-')) return 'verify-certificate';
  }
  return 'home';
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);


  // Users Directory
  const [usersList, setUsersList] = useState<AuthUser[]>(() =>
    getStored<AuthUser[]>('usersList', [])
  );

  // Timetable
  const [classesList, setClassesList] = useState<ClassSchedule[]>(() =>
    getStored<ClassSchedule[]>('classesList', [])
  );

  // Attendance
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(() =>
    getStored<AttendanceRecord[]>('attendanceList', [])
  );

  // Mentor Attendance
  const [mentorAttendanceList, setMentorAttendanceList] = useState<MentorAttendance[]>(() =>
    getStored<MentorAttendance[]>('mentorAttendanceList', [])
  );

  // Projects
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() =>
    getStored<ProjectItem[]>('projectsList', [])
  );

  // Submissions
  const [submissionsList, setSubmissionsList] = useState<StudentProjectSubmission[]>(() =>
    getStored<StudentProjectSubmission[]>('submissionsList', [])
  );

  // Presentations / PPTs
  const [presentationsList, setPresentationsList] = useState<PresentationDeck[]>(() =>
    getStored<PresentationDeck[]>('presentationsList', [])
  );

  // Syllabus
  const [syllabusTracks, setSyllabusTracks] = useState<SyllabusTrack[]>(() =>
    getStored<SyllabusTrack[]>('syllabusTracks', [])
  );

  // Early Access & Inquiries
  const [earlyAccessList, setEarlyAccessList] = useState<EarlyAccessEntry[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getStored<Announcement[]>('announcements', [])
  );

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() =>
    getStored<SystemAuditLog[]>('auditLogs', [])
  );



  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [modalDefaultInterest, setModalDefaultInterest] = useState('Full-Stack Web Development');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to local storage
  useEffect(() => { save('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { save('usersList', usersList); }, [usersList]);
  useEffect(() => { save('classesList', classesList); }, [classesList]);
  useEffect(() => { save('attendanceList', attendanceList); }, [attendanceList]);
  useEffect(() => { save('mentorAttendanceList', mentorAttendanceList); }, [mentorAttendanceList]);
  useEffect(() => { save('projectsList', projectsList); }, [projectsList]);
  useEffect(() => { save('submissionsList', submissionsList); }, [submissionsList]);
  useEffect(() => { save('presentationsList', presentationsList); }, [presentationsList]);
  useEffect(() => { save('syllabusTracks', syllabusTracks); }, [syllabusTracks]);
 
// Load leads and inquiries from PostgreSQL for ADMIN users
useEffect(() => {
  if (currentUser?.role !== 'admin') {
    return;
  }

  let cancelled = false;

  const loadAdminSubmissions = async () => {
    try {
      const [leadsResponse, inquiriesResponse] = await Promise.all([
        fetch('/api/leads', { cache: 'no-store' }),
        fetch('/api/inquiries', { cache: 'no-store' }),
      ]);

      if (!leadsResponse.ok || !inquiriesResponse.ok) {
        throw new Error('Unable to load leads and inquiries.');
      }

      const [leads, inquiries] = await Promise.all([
        leadsResponse.json(),
        inquiriesResponse.json(),
      ]);

      if (cancelled) return;

      setEarlyAccessList(
        leads.map((lead: any) => ({
          id: String(lead.id),
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          interest: lead.interest,
          submittedAt: new Date(lead.submittedAt).toLocaleString('en-IN'),
          status: String(lead.status).toLowerCase(),
        }))
      );

      setContactInquiries(
        inquiries.map((inquiry: any) => ({
          ...inquiry,
          id: String(inquiry.id),
          submittedAt: new Date(inquiry.submittedAt).toLocaleString('en-IN'),
          status: String(inquiry.status).toLowerCase(),
        }))
      );
    } catch (error) {
      console.error('Admin submissions loading error:', error);

      if (!cancelled) {
        addToast(
          'error',
          'Unable to Load Submissions',
          'Please refresh the admin portal and try again.'
        );
      }
    }
  };

  loadAdminSubmissions();

  return () => {
    cancelled = true;
  };
}, [currentUser?.role]);

  useEffect(() => { save('announcements', announcements); }, [announcements]);
  useEffect(() => { save('auditLogs', auditLogs); }, [auditLogs]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (actor: string, role: string, action: string, details: string) => {
    const log: SystemAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role,
      action,
      details,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = page === 'home' ? '/' : `/${page}`;
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // 1. Hydrate page from URL pathname
    setCurrentPage(getInitialPage());

    // 2. Validate real database session via /api/auth/me
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const u: AuthUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role.toLowerCase() as UserRole,
            track: data.user.track,
            batch: data.user.batch,
            joinedAt: data.user.createdAt ? data.user.createdAt.split('T')[0] : '2026-01-01',
            status: data.user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
          };
          setCurrentUser(u);
        } else {
          setCurrentUser(null);
          try {
            localStorage.removeItem('codemux_v2_currentUser');
          } catch {}
        }
      })
      .catch(() => {});

    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loginUser = (userOrEmail: string | any, roleParam?: UserRole, customName?: string) => {
    let email: string;
    let role: UserRole;
    let name: string;
    let id: string;
    let track: string | undefined;
    let batch: string | undefined;

    if (typeof userOrEmail === 'object' && userOrEmail !== null) {
      email = userOrEmail.email;
      role = (userOrEmail.role?.toLowerCase() as UserRole) || 'student';
      name = userOrEmail.name || 'User';
      id = userOrEmail.id || 'usr-' + Date.now();
      track = userOrEmail.track;
      batch = userOrEmail.batch;
    } else {
      email = userOrEmail;
      role = roleParam || 'student';
      name = customName || email.split('@')[0] || 'User';
      id = 'usr-' + Date.now();
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const user: AuthUser = {
      id: id || existing?.id || 'usr-' + Date.now(),
      name: name || existing?.name || 'User',
      email: email.toLowerCase(),
      role,
      joinedAt: existing?.joinedAt || new Date().toISOString().split('T')[0],
      status: 'active',
      track: track || existing?.track || (role === 'student' ? 'Full-Stack Web & Cloud Engineering (React, Node & AWS)' : undefined),
      batch: batch || existing?.batch || (role === 'student' ? 'Cohort 2026-A' : undefined),
    };

    setCurrentUser(user);
    logAudit(user.name, user.role.toUpperCase(), 'USER_LOGIN', `Logged in as ${user.role} (${user.email})`);
    addToast('success', `Welcome back, ${user.name}!`, `Signed in to CoDMux ${user.role} portal.`);

    if (user.role === 'admin') {
      navigateTo('admin-portal');
    } else if (user.role === 'mentor') {
      navigateTo('mentor-portal');
    } else {
      navigateTo('student-portal');
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    if (currentUser) {
      logAudit(currentUser.name, currentUser.role.toUpperCase(), 'USER_LOGOUT', `Logged out`);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('codemux_v2_currentUser');
    } catch {}
    addToast('info', 'Logged Out', 'You have been signed out.');
    navigateTo('home');
  };

  const registerUser = (name: string, email: string, interest: string, phone?: string): boolean => {
    const user: AuthUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'student',
      interest,
      track: interest,
      batch: 'Cohort 2026-A',
      phone,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setUsersList((prev) => [...prev, user]);
    setCurrentUser(user);
    logAudit(name, 'STUDENT', 'STUDENT_REGISTER', `New student registered for ${interest}`);
    addToast('success', 'Account Created!', `Welcome to CoDMux, ${name}!`);
    navigateTo('student-portal');
    return true;
  };

  // User Management
  const addUser = (newUser: Omit<AuthUser, 'id' | 'joinedAt'>) => {
    const user: AuthUser = {
      ...newUser,
      id: 'usr-' + Date.now(),
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setUsersList((prev) => [user, ...prev]);
    logAudit('Admin', 'ADMIN', 'USER_CREATE', `Created user ${user.name} (${user.role})`);
    addToast('success', 'User Added', `Added ${user.name} to the platform directory.`);
  };

  const updateUser = (id: string | number, updates: Partial<AuthUser>) => {
    setUsersList((prev) => prev.map((u) => (String(u.id) === String(id) ? { ...u, ...updates } : u)));
    if (String(currentUser?.id) === String(id)) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    logAudit('Admin', 'ADMIN', 'USER_UPDATE', `Updated user ID: ${id}`);
    addToast('success', 'User Updated', 'User profile details were successfully saved.');
  };

  const deleteUser = (id: string | number) => {
    const target = usersList.find((u) => String(u.id) === String(id));
    setUsersList((prev) => prev.filter((u) => String(u.id) !== String(id)));
    logAudit('Admin', 'ADMIN', 'USER_DELETE', `Deleted user: ${target?.name || id}`);
    addToast('info', 'User Removed', 'User has been deleted from the directory.');
  };

  const impersonateUser = (target: AuthUser) => {
    setCurrentUser(target);
    logAudit('Admin', 'ADMIN', 'IMPERSONATE', `Switched view as ${target.name} (${target.role})`);
    addToast('info', `Switched View: ${target.name}`, `Now previewing as ${target.role}.`);
    if (target.role === 'mentor') navigateTo('mentor-portal');
    else if (target.role === 'student') navigateTo('student-portal');
    else navigateTo('admin-portal');
  };

  // Timetable
  const addClassSchedule = (cls: Omit<ClassSchedule, 'id'>) => {
    const newClass: ClassSchedule = {
      ...cls,
      id: 'cls-' + Date.now(),
    };
    setClassesList((prev) => [newClass, ...prev]);

    // Also auto-add to mentor attendance schedule
    const mentorAtt: MentorAttendance = {
      id: 'matt-' + Date.now(),
      classId: newClass.id,
      classTopic: newClass.topic,
      mentorId: newClass.mentorId,
      mentorName: newClass.mentorName,
      date: newClass.date,
      scheduledTime: newClass.time,
      status: 'scheduled',
      durationMinutes: 120,
    };
    setMentorAttendanceList((prev) => [mentorAtt, ...prev]);

    logAudit('Admin', 'ADMIN', 'CLASS_CREATE', `Scheduled "${cls.topic}" on ${cls.date}`);
    addToast('success', 'Class Scheduled', `Live session added to the timetable.`);
  };

  const updateClassSchedule = (id: string | number, updates: Partial<ClassSchedule>) => {
    setClassesList((prev) => prev.map((c) => (String(c.id) === String(id) ? { ...c, ...updates } : c)));
    logAudit('Admin/Mentor', 'ADMIN', 'CLASS_UPDATE', `Updated class ID: ${id}`);
    addToast('success', 'Schedule Updated', 'Class details and room links saved.');
  };

  const deleteClassSchedule = (id: string | number) => {
    setClassesList((prev) => prev.filter((c) => String(c.id) !== String(id)));
    logAudit('Admin', 'ADMIN', 'CLASS_DELETE', `Deleted class ID: ${id}`);
    addToast('info', 'Class Removed', 'Session deleted from the timetable.');
  };

  // Attendance
  const markAttendance = (
    classId: string | number,
    studentId: string | number,
    status: 'present' | 'absent' | 'late' | 'excused',
    remarks?: string
  ) => {
    const targetClass = classesList.find((c) => String(c.id) === String(classId));
    const targetStudent = usersList.find((u) => String(u.id) === String(studentId));

    const existingIdx = attendanceList.findIndex(
      (a) => String(a.classId) === String(classId) && String(a.studentId) === String(studentId)
    );

    const record: AttendanceRecord = {
      id: existingIdx >= 0 ? attendanceList[existingIdx].id : 'att-' + Date.now() + Math.random().toString().slice(2, 5),
      classId,
      classTopic: targetClass?.topic || 'Live Session',
      classDate: targetClass?.date || new Date().toISOString().split('T')[0],
      studentId,
      studentName: targetStudent?.name || 'Student',
      studentEmail: targetStudent?.email,
      track: targetClass?.track || 'General',
      batch: targetClass?.batch || 'Cohort 2026-A',
      status,
      markedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      markedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System',
      remarks,
    };

    if (existingIdx >= 0) {
      setAttendanceList((prev) => {
        const copy = [...prev];
        copy[existingIdx] = record;
        return copy;
      });
    } else {
      setAttendanceList((prev) => [record, ...prev]);
    }

    logAudit(currentUser?.name || 'Mentor', 'ATTENDANCE', 'MARK_ATTENDANCE', `Marked ${status} for ${targetStudent?.name}`);
    addToast('success', 'Attendance Marked', `Recorded ${status} for ${targetStudent?.name}.`);
  };

  const batchMarkAttendance = (
    classId: string | number,
    records: { studentId: string | number; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }[]
  ) => {
    const targetClass = classesList.find((c) => String(c.id) === String(classId));
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const marker = currentUser ? `${currentUser.name} (${currentUser.role})` : 'System';

    setAttendanceList((prev) => {
      const updated = [...prev];
      for (const item of records) {
        const student = usersList.find((u) => String(u.id) === String(item.studentId));
        const idx = updated.findIndex((a) => String(a.classId) === String(classId) && String(a.studentId) === String(item.studentId));
        const rec: AttendanceRecord = {
          id: idx >= 0 ? updated[idx].id : 'att-' + Date.now() + Math.random().toString().slice(2, 6),
          classId,
          classTopic: targetClass?.topic || 'Class',
          classDate: targetClass?.date || nowStr.split(' ')[0],
          studentId: item.studentId,
          studentName: student?.name || 'Student',
          studentEmail: student?.email,
          track: targetClass?.track || 'General',
          batch: targetClass?.batch || 'Cohort 2026-A',
          status: item.status,
          markedAt: nowStr,
          markedBy: marker,
          remarks: item.remarks,
        };
        if (idx >= 0) {
          updated[idx] = rec;
        } else {
          updated.push(rec);
        }
      }
      return updated;
    });

    logAudit(currentUser?.name || 'Mentor', 'ATTENDANCE', 'BATCH_MARK', `Saved attendance for ${records.length} students`);
    addToast('success', 'Attendance Saved', `Roster updated for ${records.length} learners.`);
  };

  // Mentor Session Conduction
  const logMentorSession = (classId: string | number, notes?: string) => {
    if (!currentUser || currentUser.role !== 'mentor') {
  addToast('error', 'Unable to Record Session', 'Please log in as a mentor.');
  return;
}
    const targetClass = classesList.find((c) => String(c.id) === String(classId));
    const mentor = currentUser;

    const existingIdx = mentorAttendanceList.findIndex((m) => String(m.classId) === String(classId));
    const rec: MentorAttendance = {
      id: existingIdx >= 0 ? mentorAttendanceList[existingIdx].id : 'matt-' + Date.now(),
      classId,
      classTopic: targetClass?.topic || 'Lecture',
     mentorId: mentor?.id || '',
mentorName: mentor?.name || '',
      date: targetClass?.date || new Date().toISOString().split('T')[0],
      scheduledTime: targetClass?.time || '10:00 AM - 12:00 PM',
      status: 'conducted',
      durationMinutes: 120,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || 'Session delivered successfully with interactive hands-on lab.',
    };

    if (existingIdx >= 0) {
      setMentorAttendanceList((prev) => {
        const copy = [...prev];
        copy[existingIdx] = rec;
        return copy;
      });
    } else {
      setMentorAttendanceList((prev) => [rec, ...prev]);
    }

    // Mark class as completed
    updateClassSchedule(classId, { status: 'completed' });
    logAudit(mentor?.name || 'Mentor', 'MENTOR', 'SESSION_CHECKIN', `Conducted class "${rec.classTopic}"`);
    addToast('success', 'Session Completed', 'Mentor attendance verified and lecture marked as conducted.');
  };

  const updateMentorAttendanceStatus = (id: string | number, status: 'conducted' | 'scheduled' | 'leave') => {
    setMentorAttendanceList((prev) =>
      prev.map((m) => (String(m.id) === String(id) ? { ...m, status } : m))
    );
    addToast('info', 'Status Updated', `Mentor attendance marked as ${status}`);
  };

  // Projects
  const addProject = (proj: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...proj,
      id: 'proj-' + Date.now(),
    };
    setProjectsList((prev) => [newProj, ...prev]);
    logAudit('Admin', 'ADMIN', 'PROJECT_CREATE', `Created project: ${proj.title}`);
    addToast('success', 'Project Added', `"${proj.title}" published to student portal.`);
  };

  const updateProject = (id: string | number, updates: Partial<ProjectItem>) => {
    setProjectsList((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updates } : p)));
    addToast('success', 'Project Updated', 'Project specifications saved.');
  };

  const deleteProject = (id: string | number) => {
    setProjectsList((prev) => prev.filter((p) => String(p.id) !== String(id)));
    addToast('info', 'Project Removed', 'Project removed from assignments.');
  };

  // Submissions & Grading
  const submitProject = (

    projectId: string | number,
    githubUrl: string,
    liveDemoUrl?: string,
    notes?: string
  ) => {
    const proj = projectsList.find((p) => String(p.id) === String(projectId));
    const student = currentUser;

    const submission: StudentProjectSubmission = {
      id: 'sub-' + Date.now(),
      projectId,
      projectTitle: proj?.title || 'Capstone Project',
      studentId: student?.id || 'usr-student-1',
      studentName: student?.name || 'Student',
      studentEmail: student?.email || 'student@codemux.in',
      track: proj?.track || student?.track || 'Full-Stack Web Development',
      githubUrl,
      liveDemoUrl,
      notes,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending_review',
    };

    setSubmissionsList((prev) => [submission, ...prev]);
    logAudit(student?.name || 'Student', 'STUDENT', 'PROJECT_SUBMIT', `Submitted project: ${submission.projectTitle}`);
    addToast('success', 'Project Submitted!', 'Your code has been submitted to mentors for evaluation.');
  };

  const reviewSubmission = (
    submissionId: string | number,
    status: 'approved' | 'needs_changes',
    grade: string,
    feedback: string
  ) => {
    const reviewer = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Mentor';
    setSubmissionsList((prev) =>
      prev.map((s) =>
        String(s.id) === String(submissionId)
          ? {
              ...s,
              status,
              grade,
              feedback,
              reviewedBy: reviewer,
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : s
      )
    );
    logAudit(reviewer, 'MENTOR/ADMIN', 'PROJECT_REVIEW', `Evaluated submission ID ${submissionId}: ${status}`);
    addToast('success', 'Review Saved', `Project marked as ${status} with grade ${grade}.`);
  };

  // Presentations / PPTs
  const addPresentation = (deck: Omit<PresentationDeck, 'id' | 'uploadedAt'>) => {
    const newDeck: PresentationDeck = {
      ...deck,
      id: 'ppt-' + Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setPresentationsList((prev) => [newDeck, ...prev]);
    logAudit(deck.uploadedBy, 'MENTOR/ADMIN', 'PPT_UPLOAD', `Uploaded slide deck: ${deck.title}`);
    addToast('success', 'Slide Deck Uploaded', `"${deck.title}" is now available in PPT portal.`);
  };

  const deletePresentation = (id: string | number) => {
    setPresentationsList((prev) => prev.filter((p) => String(p.id) !== String(id)));
    addToast('info', 'Deck Removed', 'Slide deck removed from library.');
  };

  // Syllabus
  const updateSyllabusModule = (trackId: string | number, module: SyllabusModule) => {
    setSyllabusTracks((prev) =>
      prev.map((track) => {
        if (String(track.id) !== String(trackId)) return track;
        const modIdx = track.modules.findIndex((m) => String(m.id) === String(module.id));
        const newMods = [...track.modules];
        if (modIdx >= 0) {
          newMods[modIdx] = module;
        } else {
          newMods.push(module);
        }
        return { ...track, modules: newMods };
      })
    );
    addToast('success', 'Syllabus Updated', 'Course module outline updated.');
  };

  // Early access & Inquiries
  const openEarlyAccessModal = (defaultInterest = 'Full-Stack Web Development') => {
    setModalDefaultInterest(defaultInterest);
    setIsEarlyAccessModalOpen(true);
  };

  const closeEarlyAccessModal = () => {
    setIsEarlyAccessModalOpen(false);
  };

  const joinEarlyAccess = async (
  name: string,
  email: string,
  interest: string,
  phone?: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        interest,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit demo booking.');
    }

    const lead = result.lead;

    const entry: EarlyAccessEntry = {
      id: String(lead.id),
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      interest: lead.interest,
      submittedAt: new Date(lead.submittedAt).toLocaleString('en-IN'),
      status: String(lead.status).toLowerCase() as 'pending' | 'enrolled' | 'contacted',
    };

    setEarlyAccessList((prev) => [entry, ...prev]);

    logAudit(
      name,
      'VISITOR',
      'WAITLIST_SUBMIT',
      `Joined early access for ${interest}`
    );

    addToast(
      'success',
      'Demo Booking Received!',
      `Thank you, ${name}! Your details have been saved successfully.`
    );

    closeEarlyAccessModal();
    return true;
  } catch (error) {
    console.error('Demo booking submission error:', error);

    addToast(
      'error',
      'Submission Failed',
      error instanceof Error ? error.message : 'Please try again.'
    );

    return false;
  }
};



 

 
 

const updateLeadStatus = async (
  id: string | number,
  status: 'pending' | 'enrolled' | 'contacted'
) => {
  try {
    const response = await fetch('/api/leads', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Number(id),
        status: status.toUpperCase(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update lead status.');
    }

    const updatedLead = result.lead;

    setEarlyAccessList((prev) =>
      prev.map((lead) =>
        String(lead.id) === String(id)
          ? {
              ...lead,
              status: String(updatedLead.status).toLowerCase() as
                | 'pending'
                | 'enrolled'
                | 'contacted',
            }
          : lead
      )
    );

    addToast('success', 'Lead Status Updated', `Lead status changed to ${status}.`);
  } catch (error) {
    console.error('Lead status update error:', error);
    addToast(
      'error',
      'Update Failed',
      error instanceof Error ? error.message : 'Please try again.'
    );
  }
};

const deleteLead = async (id: string | number): Promise<void> => {
  try {
    const response = await fetch(
      `/api/leads?id=${encodeURIComponent(String(id))}`,
      { method: 'DELETE' }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete lead.');
    }

    setEarlyAccessList((prev) =>
      prev.filter((lead) => String(lead.id) !== String(id))
    );

    addToast('success', 'Lead Deleted', 'The lead has been permanently deleted.');
  } catch (error) {
    console.error('Delete lead error:', error);
    addToast(
      'error',
      'Delete Failed',
      error instanceof Error ? error.message : 'Please try again.'
    );
  }
};





  const submitContactForm = async (
  inquiryData: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>
): Promise<boolean> => {
  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: inquiryData.name.trim(),
        email: inquiryData.email.trim(),
        subject: inquiryData.subject,
        interest: inquiryData.interest,
        message: inquiryData.message.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit inquiry.');
    }

    const savedInquiry = result.inquiry;

    const inquiry: ContactInquiry = {
      ...savedInquiry,
      id: String(savedInquiry.id),
      submittedAt: new Date(savedInquiry.submittedAt).toLocaleString('en-IN'),
      status: String(savedInquiry.status).toLowerCase() as 'new' | 'responded',
    };

    setContactInquiries((prev) => [inquiry, ...prev]);

    logAudit(
      inquiry.name,
      'PUBLIC',
      'CONTACT_SUBMIT',
      `Enquiry: ${inquiry.subject}`
    );

    addToast(
      'success',
      'Message Received',
      'Thank you for contacting CoDMux. We will reply to your email within 24 business hours.'
    );

    return true;
  } catch (error) {
    console.error('Contact inquiry submission error:', error);

    addToast(
      'error',
      'Submission Failed',
      error instanceof Error ? error.message : 'Please try again.'
    );

    return false;
  }
};

 
const updateInquiryStatus = async (
  id: string | number,
  status: 'new' | 'responded'
) => {
  try {
    const response = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Number(id),
        status: status.toUpperCase(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update inquiry status.');
    }

    const updatedInquiry = result.inquiry;

    setContactInquiries((prev) =>
      prev.map((inquiry) =>
        String(inquiry.id) === String(id)
          ? {
              ...inquiry,
              status: String(updatedInquiry.status).toLowerCase() as
                | 'new'
                | 'responded',
            }
          : inquiry
      )
    );

    addToast(
      'success',
      'Inquiry Status Updated',
      `Inquiry status changed to ${status}.`
    );
  } catch (error) {
    console.error('Inquiry status update error:', error);

    addToast(
      'error',
      'Update Failed',
      error instanceof Error ? error.message : 'Please try again.'
    );
  }
};


  const addAnnouncement = (title: string, content: string, targetRole: 'all' | 'student' | 'mentor') => {
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title,
      content,
      targetRole,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAudit(currentUser?.name || 'Admin', 'ADMIN', 'ANNOUNCEMENT_POST', `Broadcasted: ${title}`);
    addToast('success', 'Announcement Published', 'Notification sent to target users.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        currentUser,
        loginUser,
        logoutUser,
        registerUser,

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
        markAttendance,
        batchMarkAttendance,

        mentorAttendanceList,
        logMentorSession,
        updateMentorAttendanceStatus,

        projectsList,
        addProject,
        updateProject,
        deleteProject,

        submissionsList,
        submitProject,
        reviewSubmission,

        presentationsList,
        addPresentation,
        deletePresentation,

        syllabusTracks,
        updateSyllabusModule,

        earlyAccessList,
joinEarlyAccess,
updateLeadStatus,
deleteLead,

        contactInquiries,
        submitContactForm,
        updateInquiryStatus,

        announcements,
        addAnnouncement,

        auditLogs,

        isEarlyAccessModalOpen,
        openEarlyAccessModal,
        closeEarlyAccessModal,
        modalDefaultInterest,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
