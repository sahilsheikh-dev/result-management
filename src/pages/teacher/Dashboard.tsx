import React from "react";
import {
  ClipboardList,
  BarChart3,
  Users,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const { students, exams, results, classes } = useData();
  const { user } = useAuth();

  // Filter data for current teacher
  const teacherClasses = classes.filter(
    (cls) => user?.name && cls.classId.includes("10") // Simple filter for demo
  );

  const teacherStudents = students.filter((student) =>
    teacherClasses.some((cls) => cls.classId === student.classId)
  );

  const teacherExams = exams.filter((exam) =>
    teacherClasses.some((cls) => cls.classId === exam.classId)
  );

  const stats = [
    {
      title: "My Classes",
      value: teacherClasses.length,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "My Students",
      value: teacherStudents.length,
      icon: Users,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      title: "Scheduled Exams",
      value: teacherExams.length,
      icon: FileText,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "Results Entered",
      value: results.length,
      icon: Award,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  const upcomingExams = teacherExams
    .filter((exam) => new Date(exam.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentResults = results.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Results
            </h2>
          </div>

          <div className="space-y-4">
            {recentResults.length > 0 ? (
              recentResults.map((result) => {
                const student = students.find((s) => s.id === result.studentId);
                return (
                  <div
                    key={result.resultId}
                    className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student?.name}
                      </h3>
                      <p className="text-sm text-gray-600">{result.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {result.marks}/{result.maxMarks}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          result.grade === "A+" || result.grade === "A"
                            ? "bg-green-100 text-green-800"
                            : result.grade === "B+" || result.grade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : result.grade === "C+" || result.grade === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.grade}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">
                No results available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Generate Results</h3>
          </div>
          <p className="text-blue-100 mb-4">
            Enter marks and evaluate student performance
          </p>
          <NavLink to="/teacher/generate-results">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Start Evaluation
            </button>
          </NavLink>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">View Results</h3>
          </div>
          <p className="text-emerald-100 mb-4">
            Review and analyze student performance data
          </p>
          <NavLink to="/teacher/view-results">
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              View Reports
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
