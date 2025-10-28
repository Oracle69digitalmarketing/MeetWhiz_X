import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import { USERS } from '../constants';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
        <SparklesIcon className="w-16 h-16 mx-auto text-purple-400 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Welcome to MeetWhiz</h1>
        <p className="text-gray-400 mb-8">Select a profile to log in to your workspace.</p>
        <div className="space-y-4">
            {USERS.map(user => (
                <button
                    key={user.id}
                    onClick={() => onLogin(user)}
                    className="w-full bg-gray-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center"
                >
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                    <div className="text-left">
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;