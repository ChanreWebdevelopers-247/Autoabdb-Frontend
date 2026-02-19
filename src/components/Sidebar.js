import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Receipt, 
  PieChart, 
  Settings, 
  HelpCircle, 
  Component,
  UserPlus,
  FileText,
  Database,
  Download,
  Upload,
  Shield,
  Activity,
  ClipboardList
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { siteName } from '@/utils/general';

const Sidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { user } = useSelector((state) => state.auth);
  
  // Define menu items based on roles
  const getMenuItems = (userRole) => {
    const baseItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: `/dashboard/${userRole?.toLowerCase()}` }
    ];

    switch (userRole) {
      case 'superAdmin':
        return [
          ...baseItems,
          // { name: 'System Users', icon: Shield, path: '/admin/system-users' },
          { name: 'All Users', icon: Users, path: '/users' },
          // { name: 'User Roles', icon: UserPlus, path: '/admin/roles' },
          // { name: 'System Settings', icon: Settings, path: '/admin/system-settings' },
          { name: 'Autoantibody', icon: Calendar, path: '/dashboard/disease/disease' },
          { name: 'Add Disease', icon: Calendar, path: '/dashboard/disease/add-disease' },
          { name: 'Import Disease', icon: Upload, path: '/dashboard/disease/import' },
          { name: 'Clinical Manifestations Import', icon: Upload, path: '/dashboard/biomarker/import' },
          { name: 'Submissions', icon: ClipboardList, path: '/dashboard/submission' },
          { name: 'New Submission', icon: Upload, path: '/dashboard/submission/new' },
          { name: 'Articles', icon: FileText, path: '/dashboard/article' },
          // { name: 'System Reports', icon: PieChart, path: '/admin/reports' },
          // { name: 'Audit Logs', icon: Activity, path: '/admin/audit-logs' },
        ];

      case 'Admin':
        return [
          ...baseItems,
          { name: 'Users', icon: Users, path: '/users' },
          // { name: 'Doctors', icon: Users, path: '/admin/doctors' },
          // { name: 'Receptionists', icon: Users, path: '/admin/receptionists' },
          // { name: 'Accountants', icon: Users, path: '/admin/accountants' },
          { name: 'Autoantibody', icon: Calendar, path: '/dashboard/disease/disease' },
          { name: 'Add Disease', icon: Calendar, path: '/dashboard/disease/add-disease' },
          { name: 'Clinical Manifestations Import', icon: Upload, path: '/dashboard/biomarker/import' },
          { name: 'My Submissions', icon: ClipboardList, path: '/dashboard/submission' },
          { name: 'Submit Disease', icon: Upload, path: '/dashboard/submission/new' },
          // { name: 'Reports', icon: PieChart, path: '/reports' },

        ];

      case 'Doctor':
        return [
          ...baseItems,
          // { name: 'My Patients', icon: Users, path: '/doctor/patients' },
          // { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
          { name: 'Autoantibody', icon: Database, path: '/dashboard/disease/disease' },
          // { name: 'Clinical Manifestations Import', icon: Upload, path: '/dashboard/biomarker/import' },
          { name: 'My Submissions', icon: ClipboardList, path: '/dashboard/submission' },
          { name: 'Submit Disease', icon: Upload, path: '/dashboard/submission/new' },
          // { name: 'Medical Records', icon: FileText, path: '/doctor/medical-records' },
          // { name: 'Prescriptions', icon: ClipboardList, path: '/doctor/prescriptions' },
          // { name: 'Reports', icon: PieChart, path: '/doctor/reports' },
        ];

      case 'Receptionist':
        return [
          ...baseItems,
          { name: 'Autoantibody', icon: Database, path: '/dashboard/disease/disease' },
          { name: 'My Submissions', icon: ClipboardList, path: '/dashboard/submission' },
          { name: 'Submit Disease', icon: Upload, path: '/dashboard/submission/new' },
        ];

      case 'Accountant':
        return [
          ...baseItems,
          { name: 'Autoantibody', icon: Database, path: '/dashboard/disease/disease' },
          { name: 'My Submissions', icon: ClipboardList, path: '/dashboard/submission' },
          { name: 'Submit Disease', icon: Upload, path: '/dashboard/submission/new' },
        ];

      default:
        return baseItems;
    }
  };

  // Common bottom menu items for all roles
  const getBottomMenuItems = (userRole) => {
    const commonItems = [
      { name: 'Settings', icon: Settings, path: '/settings' },
      { name: 'Help', icon: HelpCircle, path: '/help' },
    ];

    // Add role-specific bottom items
    if (userRole === 'superAdmin' || userRole === 'Admin') {
      return [
        { name: 'System Logs', icon: Activity, path: '/logs' },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems(user?.role);
  const bottomMenuItems = getBottomMenuItems(user?.role);

  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    const colors = {
      superAdmin: 'bg-red-100 text-red-800',
      Admin: 'bg-blue-100 text-blue-800',
      Doctor: 'bg-green-100 text-green-800',
      Receptionist: 'bg-yellow-100 text-yellow-800',
      Accountant: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <aside className={` bg-white
      fixed inset-y-0 left-0 z-50
      w-64 border-r
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      transition-transform duration-200 ease-in-out
      flex flex-col h-screen
    `}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b sticky top-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center px-2">
            <span className="text-white font-bold text-xs">AAD</span>
          </div>
          <span className="text-sm font-bold">{siteName}</span>
        </div>
      </div>

      {/* User Role Badge */}
      {/* <div className="px-6 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Welcome,</span>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {user?.name || 'User'}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(user?.role)}`}>
            {user?.role}
          </span>
        </div>
      </div> */}

      {/* Main Menu - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setActiveItem(item.name)}
              >
                <span className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}>
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Role-specific section dividers */}
        {/* {(user?.role === 'superAdmin' || user?.role === 'Admin') && (
          <div className="px-4 py-2">
            <div className="border-t border-gray-200"></div>
            <span className="text-xs text-gray-500 font-medium mt-2 block">
              ADMINISTRATION
            </span>
          </div>
        )} */}
      </div>

      {/* Bottom Menu - Sticky Footer */}
      <div className="p-4 border-t sticky bottom-0 bg-white">
        <div className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.path}>
                <span className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                  <Icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;