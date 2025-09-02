import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Modal from '../../components/Common/Modal';
import ExamForm from '../../components/Forms/ExamForm';
import SearchInput from '../../components/Common/SearchInput';
import { Exam } from '../../types';

const ManageExams: React.FC = () => {
  const { exams, classes, addExam, updateExam, deleteExam } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = exams.filter(exam =>
    exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.classId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (examData: Omit<Exam, 'examId'>) => {
    if (editingExam) {
      updateExam(editingExam.examId, examData);
    } else {
      addExam(examData);
    }
    setIsModalOpen(false);
    setEditingExam(undefined);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExam(undefined);
  };

  const getClassInfo = (classId: string) => {
    const cls = classes.find(c => c.classId === classId);
    return cls ? `${cls.className} - Section ${cls.section}` : classId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Exams</h1>
          <p className="text-gray-600 mt-1">Schedule and organize examinations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search exams by name, type, or class..."
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.examId} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.examName}</h3>
                  <p className="text-gray-600">{getClassInfo(exam.classId)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exam.examId)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Type:</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                    {exam.examType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {/* <Calendar className="w-4 h-4" /> */}
                  <span className="font-medium">Date:</span>
                  <span>{new Date(exam.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Duration:</span>
                  <span>{exam.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exams found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExam ? 'Edit Exam' : 'Create New Exam'}
        size="lg"
      >
        <ExamForm
          exam={editingExam}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ManageExams;