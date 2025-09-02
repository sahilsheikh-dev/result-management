import React, { useState, useEffect } from 'react';
import { Class } from '../../types';

interface ClassFormProps {
  classData?: Class;
  onSubmit: (classData: Class) => void;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ classData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    section: '',
    subjects: [] as string[],
  });

  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    }
  }, [classData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class ID
        </label>
        <input
          type="text"
          required
          value={formData.classId}
          onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 10A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class Name
        </label>
        <input
          type="text"
          required
          value={formData.className}
          onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Grade 10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section
        </label>
        <input
          type="text"
          required
          value={formData.section}
          onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subjects
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter subject name"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.subjects.map((subject) => (
              <span
                key={subject}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {subject}
                <button
                  type="button"
                  onClick={() => removeSubject(subject)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {classData ? 'Update Class' : 'Create Class'}
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

export default ClassForm;