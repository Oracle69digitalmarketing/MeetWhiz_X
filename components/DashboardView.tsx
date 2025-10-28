import React from 'react';
import { ACTION_POINTS_DATA } from '../constants';
import { Status, User } from '../types';

interface DashboardViewProps {
  user: User;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user }) => {
  const totalTasks = ACTION_POINTS_DATA.length;
  const completedTasks = ACTION_POINTS_DATA.filter(t => t.status === Status.Completed).length;
  const inProgressTasks = ACTION_POINTS_DATA.filter(t => t.status === Status.InProgress).length;
  const pendingTasks = ACTION_POINTS_DATA.filter(t => t.status === Status.Pending).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks },
    { label: 'Completed', value: completedTasks },
    { label: 'In Progress', value: inProgressTasks },
    { label: 'Completion Rate', value: `${completionRate}%` },
  ];

  const TaskStatusBar = ({ status, count, total, color }: { status: string, count: number, total: number, color: string }) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{status}</span>
        <span className="text-sm font-medium text-gray-700">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(count / total) * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name.split(' ')[0]}!</h1>
      <p className="mt-2 text-gray-600">Here's a summary of your workspace.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Status Overview</h2>
        <div className="space-y-4">
          <TaskStatusBar status="Completed" count={completedTasks} total={totalTasks} color="bg-green-500" />
          <TaskStatusBar status="In Progress" count={inProgressTasks} total={totalTasks} color="bg-blue-500" />
          <TaskStatusBar status="Pending" count={pendingTasks} total={totalTasks} color="bg-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
