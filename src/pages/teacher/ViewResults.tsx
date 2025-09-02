import React, { useState } from 'react';
import { Download, Eye, BarChart3, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { getGradeColor, calculatePercentage, calculateGrade } from '../../utils/gradeCalculator';
import { generateReportCard } from '../../utils/pdfGenerator';

const ViewResults: React.FC = () => {
  const { students, classes, exams, results } = useData();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');

  const selectedClass = classes.find(c => c.classId === selectedClassId);
  const selectedExam = exams.find(e => e.examId === selectedExamId);
  
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const classExams = exams.filter(e => e.classId === selectedClassId);
  
  const examResults = results.filter(r => r.examId === selectedExamId);

  const getStudentResults = (studentId: string) => {
    return results.filter(r => r.studentId === studentId && r.examId === selectedExamId);
  };

  const calculateStudentTotal = (studentId: string) => {
    const studentResults = getStudentResults(studentId);
    const total = studentResults.reduce((sum, r) => sum + r.marks, 0);
    const maxTotal = studentResults.reduce((sum, r) => sum + r.maxMarks, 0);
    return { total, maxTotal, percentage: maxTotal > 0 ? calculatePercentage(total, maxTotal) : 0 };
  };

  const handleDownloadReportCard = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const exam = exams.find(e => e.examId === selectedExamId);
    const studentResults = results.filter(r => r.studentId === studentId && r.examId === selectedExamId);

    if (student && exam && studentResults.length > 0) {
      const pdf = generateReportCard(student, exam, results, studentResults);
      pdf.save(`${student.name}_${exam.examName}_ReportCard.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">View Results</h1>
        <p className="text-gray-600 mt-1">Review and analyze student performance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedExamId('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a class</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} - Section {cls.section}
                </option>
              ))}
            </select>
          </div>

          {selectedClassId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an exam</option>
                {classExams.map((exam) => (
                  <option key={exam.examId} value={exam.examId}>
                    {exam.examName} ({exam.examType}) - {new Date(exam.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedClassId && selectedExamId && examResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Results Overview</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>{examResults.length} results found</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Student</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Roll Number</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Total Marks</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Percentage</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Overall Grade</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const studentResults = getStudentResults(student.id);
                    const { total, maxTotal, percentage } = calculateStudentTotal(student.id);
                    const overallGrade = calculateGrade(total, maxTotal);
                    const gradeColor = getGradeColor(overallGrade);

                    if (studentResults.length === 0) return null;

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                            {student.rollNo}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="font-medium text-gray-900">{total}/{maxTotal}</span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="font-medium text-gray-900">{percentage}%</span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${gradeColor}`}>
                            {overallGrade}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDownloadReportCard(student.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Download Report Card"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedExam && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Exam Statistics</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{examResults.length}</p>
                    <p className="text-sm text-gray-600">Total Results</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {Math.round(examResults.reduce((sum, r) => sum + (r.marks / r.maxMarks) * 100, 0) / examResults.length)}%
                    </p>
                    <p className="text-sm text-gray-600">Class Average</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.max(...examResults.map(r => (r.marks / r.maxMarks) * 100))}%
                    </p>
                    <p className="text-sm text-gray-600">Highest Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.min(...examResults.map(r => (r.marks / r.maxMarks) * 100))}%
                    </p>
                    <p className="text-sm text-gray-600">Lowest Score</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedClassId && selectedExamId && examResults.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No results found for this exam</p>
            <p className="text-sm text-gray-400 mt-2">Generate results first to view them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResults;