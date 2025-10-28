import React, { useState } from 'react';
import { User, View, UserRole, ShareableContent } from './types';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MeetingsView from './components/MeetingsView';
import TasksView from './components/TasksView';
import SettingsView from './components/SettingsView';
import AIAssistant from './components/AIAssistant';
import CreatorStudioView from './components/CreatorStudioView';
import LiveMeetingView from './components/LiveMeetingView';
import ShareModal from './components/ShareModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [shareableContent, setShareableContent] = useState<ShareableContent>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleLogin = (selectedUser: User) => {
    setUser(selectedUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const openShareModal = (content: ShareableContent) => {
    setShareableContent(content);
    setIsShareModalOpen(true);
  };

  const renderView = () => {
    if (!user) return null;
    switch (currentView) {
      case 'dashboard':
        return <DashboardView user={user} />;
      case 'meetings':
        return <MeetingsView onShare={openShareModal} />;
      case 'tasks':
        return <TasksView user={user} />;
      case 'live-meeting':
        return <LiveMeetingView />;
      case 'creator-studio':
        return <CreatorStudioView onShare={openShareModal} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView user={user} />;
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <div className={`flex h-screen bg-gray-100 ${isAIAssistantOpen ? 'filter blur-sm' : ''}`}>
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          userRole={user.role as UserRole}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={user}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {renderView()}
          </main>
        </div>
      </div>
      <AIAssistant isOpen={isAIAssistantOpen} setIsOpen={setIsAIAssistantOpen} />
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        content={shareableContent} 
      />
    </>
  );
};

export default App;
