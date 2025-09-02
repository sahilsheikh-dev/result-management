import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  BarChart3, 
  ClipboardList,
  Home,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminNavItems = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/teachers', icon: Users, label: 'Manage Teachers' },
    { to: '/admin/students', icon: GraduationCap, label: 'Manage Students' },
    { to: '/admin/classes', icon: BookOpen, label: 'Manage Classes' },
    { to: '/admin/exams', icon: FileText, label: 'Manage Exams' },
  ];

  const teacherNavItems = [
    { to: '/teacher', icon: Home, label: 'Dashboard' },
    { to: '/teacher/generate-results', icon: ClipboardList, label: 'Generate Results' },
    { to: '/teacher/view-results', icon: BarChart3, label: 'View Results' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : teacherNavItems;

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">EduManage</h2>
            <p className="text-gray-400 text-sm">{user?.role === 'admin' ? 'Admin Panel' : 'Teacher Panel'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 text-gray-400">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Version 1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;