import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Modal from '../../components/Common/Modal';
import StudentForm from '../../components/Forms/StudentForm';
import SearchInput from '../../components/Common/SearchInput';
import { Student } from '../../types';

const ManageStudents: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.classId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (studentData: Omit<Student, 'id'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    setIsModalOpen(false);
    setEditingStudent(undefined);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(undefined);
  };

  const getClassInfo = (classId: string) => {
    const cls = classes.find(c => c.classId === classId);
    return cls ? `${cls.className} - Section ${cls.section}` : classId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage student information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search students by name, roll number, or class..."
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Name</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Roll Number</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Class</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Subjects</th>
                <th className="text-center py-4 px-2 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      {student.rollNo}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600">{getClassInfo(student.classId)}</td>
                  <td className="py-4 px-2">
                    <div className="flex flex-wrap gap-1">
                      {student.subjectsEnrolled.slice(0, 3).map((subject) => (
                        <span key={subject} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                      {student.subjectsEnrolled.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{student.subjectsEnrolled.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={editingStudent}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ManageStudents;