import React, { useState, useEffect } from 'react';
import { Student, Class } from '../../types';
import { useData } from '../../contexts/DataContext';

interface StudentFormProps {
  student?: Student;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
  const { classes } = useData();
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    classId: '',
    section: '',
    subjectsEnrolled: [] as string[],
  });

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        rollNo: student.rollNo,
        classId: student.classId,
        section: student.section,
        subjectsEnrolled: student.subjectsEnrolled,
      });
      const cls = classes.find(c => c.classId === student.classId);
      setSelectedClass(cls || null);
    }
  }, [student, classes]);

  useEffect(() => {
    if (formData.classId) {
      const cls = classes.find(c => c.classId === formData.classId);
      setSelectedClass(cls || null);
      if (cls) {
        setFormData(prev => ({
          ...prev,
          section: cls.section,
          subjectsEnrolled: cls.subjects,
        }));
      }
    }
  }, [formData.classId, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter student name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roll Number
        </label>
        <input
          type="text"
          required
          value={formData.rollNo}
          onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter roll number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class
        </label>
        <select
          required
          value={formData.classId}
          onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls.classId} value={cls.classId}>
              {cls.className} - Section {cls.section}
            </option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <input
              type="text"
              value={formData.section}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrolled Subjects
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {selectedClass.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {student ? 'Update Student' : 'Add Student'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;