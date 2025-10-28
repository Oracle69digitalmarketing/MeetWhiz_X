import React from 'react';
import { MEETINGS_DATA } from '../constants';
import { Meeting, ActionPoint, Status, ShareableContent } from '../types';
import ShareIcon from './icons/ShareIcon';

const StatusBadge = ({ status }: { status: Status }) => {
    const statusClasses = {
        [Status.Completed]: 'bg-green-100 text-green-800',
        [Status.InProgress]: 'bg-blue-100 text-blue-800',
        [Status.Pending]: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const MeetingCard = ({ meeting, onShare }: { meeting: Meeting; onShare: (content: ShareableContent) => void; }) => {
    
    const handleShare = () => {
        const actionPointsText = meeting.actionPoints.map(ap => `- ${ap.title} (Assigned to: ${ap.assignedTo})`).join('\n');
        onShare({
            title: `Meeting Summary: ${meeting.title}`,
            text: `*Summary:*\n${meeting.summary}\n\n*Action Points:*\n${actionPointsText}`
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{meeting.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{new Date(meeting.date).toLocaleDateString()}</p>
                </div>
                <button onClick={handleShare} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full">
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
            <p className="text-gray-600 mb-4">{meeting.summary}</p>
            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Action Points:</h3>
                <ul className="space-y-2">
                    {meeting.actionPoints.map((ap: ActionPoint) => (
                        <li key={ap.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium text-gray-800">{ap.title}</p>
                                <p className="text-gray-500">Assigned to: {ap.assignedTo}</p>
                            </div>
                           <StatusBadge status={ap.status} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


interface MeetingsViewProps {
    onShare: (content: ShareableContent) => void;
}

const MeetingsView: React.FC<MeetingsViewProps> = ({ onShare }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Meetings</h1>
            <p className="mt-2 text-gray-600 mb-6">Review past meetings, summaries, and action points.</p>
            <div className="space-y-6">
                {MEETINGS_DATA.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} onShare={onShare} />
                ))}
            </div>
        </div>
    );
};

export default MeetingsView;
