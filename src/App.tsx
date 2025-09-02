import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageClasses from "./pages/admin/ManageClasses";
import ManageExams from "./pages/admin/ManageExams";
import TeacherDashboard from "./pages/teacher/Dashboard";
import GenerateResults from "./pages/teacher/GenerateResults";
import ViewResults from "./pages/teacher/ViewResults";
import ProtectedRoute from "./components/Common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageTeachers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/classes"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageClasses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/exams"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageExams />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generate-results"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <GenerateResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-results"
                element={
                  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                    <ViewResults />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
