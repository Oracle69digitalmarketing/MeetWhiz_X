import React from 'react';
import { ACTION_POINTS_DATA } from '../constants';
import { User, UserRole, Priority, Status } from '../types';

interface TasksViewProps {
  user: User;
}

const getPriorityPillClass = (priority: Priority) => {
    switch (priority) {
        case Priority.High: return 'bg-red-100 text-red-800';
        case Priority.Medium: return 'bg-yellow-100 text-yellow-800';
        case Priority.Low: return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusPillClass = (status: Status) => {
    switch (status) {
        case Status.Completed: return 'bg-blue-100 text-blue-800';
        case Status.InProgress: return 'bg-purple-100 text-purple-800';
        case Status.Pending: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const TasksView: React.FC<TasksViewProps> = ({ user }) => {
  const tasks = user.role === UserRole.Admin 
    ? ACTION_POINTS_DATA 
    : ACTION_POINTS_DATA.filter(ap => ap.assignedTo === user.name.split(' ')[0] + ' ' + user.name.split(' ')[1]);

  const viewTitle = user.role === UserRole.Admin ? 'All Tasks' : 'My Tasks';
  const viewDescription = user.role === UserRole.Admin ? 'An overview of all action points from all meetings.' : 'Here are all the tasks currently assigned to you.';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{viewTitle}</h1>
      <p className="mt-2 text-gray-600 mb-6">{viewDescription}</p>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityPillClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
