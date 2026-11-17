import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const COURSE_CODE_MAP: Record<string, string> = {
  'webdev': 'MERN',
  'Full-Stack Web Development': 'MERN',
  'Full-Stack Web & Cloud Engineering (React, Node & AWS)': 'MERN',
  'java': 'JAVA',
  'Java Programming (Beginner)': 'JAVA',
  'python': 'PYTHON',
  'Python Programming & AI Essentials': 'PYTHON',
  'Young Coders: MIT Scratch, Game Design & Creative Python': 'PYTHON',
  'data': 'DATA',
  'Data Analytics & BI': 'DATA',
  'Data Analytics & Global Business Intelligence (Power BI & Tableau)': 'DATA',
  'placement': 'DSA',
  'Placement Preparation & Interview Mastery': 'DSA',
  'Global Tech Career, LeetCode DSA & Remote Interview Mastery': 'DSA',
  'vedic-maths': 'VEDIC',
  'Vedic Maths & Speed Mental Arithmetic': 'VEDIC',
  'english-junior': 'ENG',
  'Global English: Public Speaking, Debate & Model UN (MUN)': 'ENG',
  'hindi-junior': 'HINDI',
  'Hindi & Sanskrit Heritage: Spoken Fluency & Cultural Literature': 'HINDI',
  'robotics-junior': 'ROBOT',
  'Robotics, Micro:bit & STEM Automation for Kids': 'ROBOT',
  'olympiad-math': 'OLYMP',
  'International Math Olympiad & Critical Logic Puzzles': 'OLYMP',
  'ai-junior': 'AIKIDS',
  'AI for Kids: Prompting, Machine Learning & Creative Computing': 'AIKIDS',
  'cybersecurity': 'CYBER',
  'Cybersecurity & Ethical Defense Fundamentals': 'CYBER',
};

export function getCourseCode(courseIdOrName: string): string {
  if (COURSE_CODE_MAP[courseIdOrName]) {
    return COURSE_CODE_MAP[courseIdOrName];
  }
  const cleaned = courseIdOrName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return cleaned.slice(0, 6) || 'GEN';
}

export function generateSerialNumber(courseCode: string, sequence: number, year: number = new Date().getFullYear()): string {
  const paddedSeq = String(sequence).padStart(6, '0');
  return `CMX-${year}-${courseCode}-${paddedSeq}`;
}

export interface CertificateRenderData {
  serialNumber: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  courseDuration?: string;
  enrollmentDate: string;
  completionDate: string;
  status: 'ACTIVE' | 'REVOKED';
}

export function renderCertificatePDF(data: CertificateRenderData): Buffer {
  const templatePath = path.resolve(process.cwd(), 'public/assets/aistudio/WhatsApp_Image_2026-10-29_at_9.00.34_PM_3fdb0a95.jpeg');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Master certificate template image file missing at ' + templatePath);
  }

  const imgBuf = fs.readFileSync(templatePath);
  const base64 = 'data:image/jpeg;base64,' + imgBuf.toString('base64');

  // Create A4 Landscape PDF (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // 1. Draw Master Template Background
  doc.addImage(base64, 'JPEG', 0, 0, 297, 210);

  // 2. Mask Golden Ribbon placeholder 'Name'
  doc.setFillColor(254, 217, 66);
  doc.roundedRect(65, 83, 167, 18, 2, 2, 'F');

  // Draw Dynamic Student Name in Elegant Calligraphic Style
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(26);
  doc.setTextColor(28, 25, 23);
  doc.text(data.studentName || 'Student Name', 148.5, 95.5, { align: 'center' });

  // 3. Mask Light-Blue Course Paragraph Placeholder
  doc.setFillColor(155, 195, 221);
  doc.roundedRect(50, 110, 197, 44, 3, 3, 'F');

  // Draw Dynamic Course Paragraph
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(18, 18, 18);
  const courseText = `for successfully completing the ${data.courseName}`;
  const durationText = `course of ${data.courseDuration || '60 Days'} from ${data.enrollmentDate} to ${data.completionDate}.`;
  doc.text(courseText, 148.5, 122, { align: 'center' });
  doc.text(durationText, 148.5, 131, { align: 'center' });
  doc.setFontSize(12.5);
  doc.text('Provided by CODMUX', 148.5, 144, { align: 'center' });

  // 4. Mask Mentor Name Placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(215, 187, 66, 14, 'F');
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(13);
  doc.setTextColor(25, 25, 25);
  doc.text(data.instructorName || 'CoDMux Academic Mentor', 248, 196.5, { align: 'center' });

  // 5. Mask Serial Number Placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(106, 204.5, 86, 5.2, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(35, 35, 35);
  doc.text(`Certificate No.: ${data.serialNumber}`, 148.5, 208.2, { align: 'center' });

  // 6. If Revoked, Stamp Clear Revocation Watermark
  if (data.status === 'REVOKED') {
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('REVOKED', 148.5, 160, { align: 'center', angle: 25 });
  }

  return Buffer.from(doc.output('arraybuffer'));
}

