import React, { useState, useEffect } from 'react';
import { Exam, Class } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ExamFormProps {
  exam?: Exam;
  onSubmit: (exam: Omit<Exam, 'examId'>) => void;
  onCancel: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ exam, onSubmit, onCancel }) => {
  const { classes } = useData();
  const [formData, setFormData] = useState({
    examName: '',
    examType: '',
    classId: '',
    date: '',
    duration: '',
  });

  useEffect(() => {
    if (exam) {
      setFormData({
        examName: exam.examName,
        examType: exam.examType,
        classId: exam.classId,
        date: exam.date,
        duration: exam.duration,
      });
    }
  }, [exam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const examTypes = ['Written', 'Oral', 'Practical', 'Assignment', 'Project'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Name
        </label>
        <input
          type="text"
          required
          value={formData.examName}
          onChange={(e) => setFormData(prev => ({ ...prev, examName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Mid-Term Examination"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Type
        </label>
        <select
          required
          value={formData.examType}
          onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select exam type</option>
          {examTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Date
        </label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <input
          type="text"
          required
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 3 hours"
        />
      </div>

      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {exam ? 'Update Exam' : 'Create Exam'}
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

export default ExamForm;