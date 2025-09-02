import React, { useState } from 'react';
import { Save, Download, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { calculateGrade, getGradeColor } from '../../utils/gradeCalculator';
import { generateReportCard } from '../../utils/pdfGenerator';

const GenerateResults: React.FC = () => {
  const { students, classes, exams, results, addResult, updateResult } = useData();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [marks, setMarks] = useState<Record<string, { marks: number; maxMarks: number; remarks: string }>>({});

  const selectedClass = classes.find(c => c.classId === selectedClassId);
  const selectedExam = exams.find(e => e.examId === selectedExamId);
  
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const classExams = exams.filter(e => e.classId === selectedClassId);

  const handleMarksChange = (studentId: string, field: string, value: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === 'remarks' ? value : Number(value) || 0,
      }
    }));
  };

  const handleSaveResults = () => {
    Object.entries(marks).forEach(([studentId, data]) => {
      if (data.marks !== undefined && data.maxMarks !== undefined) {
        const grade = calculateGrade(data.marks, data.maxMarks);
        const existingResult = results.find(r => 
          r.examId === selectedExamId && 
          r.studentId === studentId && 
          r.subject === selectedSubject
        );

        const resultData = {
          examId: selectedExamId,
          studentId,
          subject: selectedSubject,
          marks: data.marks,
          maxMarks: data.maxMarks,
          grade,
          remarks: data.remarks || '',
        };

        if (existingResult) {
          updateResult(existingResult.resultId, resultData);
        } else {
          addResult(resultData);
        }
      }
    });

    alert('Results saved successfully!');
    setMarks({});
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
        <h1 className="text-3xl font-bold text-gray-900">Generate Results</h1>
        <p className="text-gray-600 mt-1">Enter marks and evaluate student performance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSubject('');
                setSelectedExamId('');
                setMarks({});
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

          {selectedClass && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setMarks({});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a subject</option>
                {selectedClass.subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSubject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => {
                  setSelectedExamId(e.target.value);
                  setMarks({});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an exam</option>
                {classExams.map((exam) => (
                  <option key={exam.examId} value={exam.examId}>
                    {exam.examName} ({exam.examType})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedClassId && selectedSubject && selectedExamId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Enter Marks</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveResults}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Results
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Student</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Roll Number</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Marks Obtained</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Max Marks</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Grade</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Remarks</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const studentMarks = marks[student.id] || { marks: 0, maxMarks: 100, remarks: '' };
                    const grade = calculateGrade(studentMarks.marks, studentMarks.maxMarks);
                    const gradeColor = getGradeColor(grade);

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="py-4 px-2 text-gray-600">{student.rollNo}</td>
                        <td className="py-4 px-2">
                          <input
                            type="number"
                            min="0"
                            value={studentMarks.marks || ''}
                            onChange={(e) => handleMarksChange(student.id, 'marks', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="py-4 px-2">
                          <input
                            type="number"
                            min="1"
                            value={studentMarks.maxMarks || ''}
                            onChange={(e) => handleMarksChange(student.id, 'maxMarks', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${gradeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <input
                            type="text"
                            value={studentMarks.remarks || ''}
                            onChange={(e) => handleMarksChange(student.id, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add remarks..."
                          />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateResults;