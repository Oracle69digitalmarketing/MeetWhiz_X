import React, { useState } from 'react';
import { User } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import LogoutIcon from './icons/LogoutIcon';
import ChevronDoubleLeftIcon from './icons/ChevronDoubleLeftIcon';
import CoinIcon from './icons/CoinIcon';
import SparklesIcon from './icons/SparklesIcon';


interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onOpenAIAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, isSidebarCollapsed, onOpenAIAssistant }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronDoubleLeftIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${!isSidebarCollapsed && 'rotate-180'}`} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onOpenAIAssistant}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-purple-600"
          title="Open AI Assistant"
        >
            <SparklesIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full">
            <CoinIcon className="w-5 h-5" />
            <span>{user.coins}</span>
        </div>
        <div className="relative">
            <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" /> : <UserCircleIcon className="w-8 h-8 text-gray-500" />}
            <span className="font-semibold text-gray-700 hidden sm:block">{user.name.split(' ')[0]}</span>
            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="border-t border-gray-200"></div>
                <button
                onClick={onLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
                </button>
            </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
