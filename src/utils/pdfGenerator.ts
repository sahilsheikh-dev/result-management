import jsPDF from 'jspdf';
import { Student, Result, Exam } from '../types';

export const generateReportCard = (
  student: Student,
  exam: Exam,
  results: Result[],
  studentResults: Result[]
) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SCHOOL REPORT CARD', 105, 20, { align: 'center' });
  
  // Student Information
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Student Information:', 20, 40);
  pdf.text(`Name: ${student.name}`, 20, 50);
  pdf.text(`Roll Number: ${student.rollNo}`, 20, 60);
  pdf.text(`Class: ${student.classId} - Section ${student.section}`, 20, 70);
  
  // Exam Information
  pdf.text('Exam Information:', 20, 90);
  pdf.text(`Exam: ${exam.examName}`, 20, 100);
  pdf.text(`Type: ${exam.examType}`, 20, 110);
  pdf.text(`Date: ${new Date(exam.date).toLocaleDateString()}`, 20, 120);
  
  // Results Table
  pdf.text('Results:', 20, 140);
  
  let yPos = 155;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Subject', 20, yPos);
  pdf.text('Marks', 80, yPos);
  pdf.text('Max Marks', 120, yPos);
  pdf.text('Grade', 160, yPos);
  
  pdf.setFont('helvetica', 'normal');
  studentResults.forEach((result, index) => {
    yPos += 15;
    pdf.text(result.subject, 20, yPos);
    pdf.text(result.marks.toString(), 80, yPos);
    pdf.text(result.maxMarks.toString(), 120, yPos);
    pdf.text(result.grade, 160, yPos);
  });
  
  // Overall Performance
  const totalMarks = studentResults.reduce((sum, r) => sum + r.marks, 0);
  const totalMaxMarks = studentResults.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = Math.round((totalMarks / totalMaxMarks) * 100);
  
  yPos += 30;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Performance:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Marks: ${totalMarks}/${totalMaxMarks}`, 20, yPos + 15);
  pdf.text(`Percentage: ${percentage}%`, 20, yPos + 25);
  
  // Footer
  pdf.text('Generated on: ' + new Date().toLocaleDateString(), 20, 280);
  
  return pdf;
};