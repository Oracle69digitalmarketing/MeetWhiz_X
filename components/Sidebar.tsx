import React from 'react';
import { View, UserRole } from '../types';
import { NAV_ITEMS } from '../constants';
import SparklesIcon from './icons/SparklesIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isCollapsed, userRole }) => {
  const accessibleNavItems = NAV_ITEMS.filter(item => 
    !item.adminOnly || userRole === UserRole.Admin
  );
  
  return (
    <aside className={`bg-gray-800 text-gray-300 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center h-16 border-b border-gray-700 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
        <SparklesIcon className="w-8 h-8 text-white" />
        {!isCollapsed && <span className="ml-3 text-white font-semibold text-lg">MeetWhiz</span>}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {accessibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center py-2.5 rounded-lg transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            } ${isCollapsed ? 'px-3 justify-center' : 'px-4'}`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
            {!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;