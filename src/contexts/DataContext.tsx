import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataContextType, Teacher, Student, Class, Exam, Result } from '../types';
import teachersData from '../data/teachers.json';
import studentsData from '../data/students.json';
import classesData from '../data/classes.json';
import examsData from '../data/exams.json';
import resultsData from '../data/results.json';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(teachersData);
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [classes, setClasses] = useState<Class[]>(classesData);
  const [exams, setExams] = useState<Exam[]>(examsData);
  const [results, setResults] = useState<Result[]>(resultsData);

  const generateId = () => Date.now().toString();

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: generateId() };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...teacher } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: generateId() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...student } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addClass = (classData: Class) => {
    setClasses(prev => [...prev, classData]);
  };

  const updateClass = (id: string, classData: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.classId === id ? { ...c, ...classData } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.classId !== id));
  };

  const addExam = (exam: Omit<Exam, 'examId'>) => {
    const newExam = { ...exam, examId: generateId() };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, exam: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.examId === id ? { ...e, ...exam } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.examId !== id));
  };

  const addResult = (result: Omit<Result, 'resultId'>) => {
    const newResult = { ...result, resultId: generateId() };
    setResults(prev => [...prev, newResult]);
  };

  const updateResult = (id: string, result: Partial<Result>) => {
    setResults(prev => prev.map(r => r.resultId === id ? { ...r, ...result } : r));
  };

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(r => r.resultId !== id));
  };

  const value: DataContextType = {
    teachers,
    students,
    classes,
    exams,
    results,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addStudent,
    updateStudent,
    deleteStudent,
    addClass,
    updateClass,
    deleteClass,
    addExam,
    updateExam,
    deleteExam,
    addResult,
    updateResult,
    deleteResult,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};