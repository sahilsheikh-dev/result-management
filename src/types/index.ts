export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classAssigned: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  classId: string;
  section: string;
  subjectsEnrolled: string[];
}

export interface Class {
  classId: string;
  className: string;
  section: string;
  subjects: string[];
}

export interface Exam {
  examId: string;
  examName: string;
  examType: string;
  classId: string;
  date: string;
  duration: string;
}

export interface Result {
  resultId: string;
  examId: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'teacher' | 'admin';
  name: string;
}

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type DataContextType = {
  teachers: Teacher[];
  students: Student[];
  classes: Class[];
  exams: Exam[];
  results: Result[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addClass: (classData: Class) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  addExam: (exam: Omit<Exam, 'examId'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  addResult: (result: Omit<Result, 'resultId'>) => void;
  updateResult: (id: string, result: Partial<Result>) => void;
  deleteResult: (id: string) => void;
};