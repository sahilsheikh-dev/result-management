import React, { useState, useEffect } from 'react';
import { Teacher, Class } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (teacher: Omit<Teacher, 'id'>) => void;
  onCancel: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSubmit, onCancel }) => {
  const { classes } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    classAssigned: [] as string[],
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        classAssigned: teacher.classAssigned,
      });
    }
  }, [teacher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClassToggle = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classAssigned: prev.classAssigned.includes(classId)
        ? prev.classAssigned.filter(id => id !== classId)
        : [...prev.classAssigned, classId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teacher Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter teacher name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Subject
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter subject taught"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Assigned Classes
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {classes.map((cls) => (
            <label key={cls.classId} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.classAssigned.includes(cls.classId)}
                onChange={() => handleClassToggle(cls.classId)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {cls.className} - Section {cls.section}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {teacher ? 'Update Teacher' : 'Add Teacher'}
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

export default TeacherForm;