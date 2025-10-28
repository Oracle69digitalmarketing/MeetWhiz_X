import { NavItem, Meeting, ActionPoint, User, UserRole, Priority, Status } from './types';
import ChartBarIcon from './components/icons/ChartBarIcon';
import DocumentTextIcon from './components/icons/DocumentTextIcon';
import TasksIcon from './components/icons/TasksIcon';
import CogIcon from './components/icons/CogIcon';
import WandIcon from './components/icons/WandIcon';
import MicrophoneIcon from './components/icons/MicrophoneIcon';

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { id: 'meetings', label: 'Meetings', icon: DocumentTextIcon, adminOnly: true },
  { id: 'tasks', label: 'Tasks', icon: TasksIcon },
  { id: 'live-meeting', label: 'Live Meeting', icon: MicrophoneIcon, adminOnly: true },
  { id: 'creator-studio', label: 'Creator Studio', icon: WandIcon, adminOnly: true },
  { id: 'settings', label: 'Settings', icon: CogIcon, adminOnly: true },
];

export const USERS: User[] = [
    {
        id: '1',
        name: 'Alex Starr (Admin)',
        email: 'alex.starr@example.com',
        role: UserRole.Admin,
        coins: 1250,
        avatarUrl: 'https://i.pravatar.cc/150?u=alexstarr'
    },
    {
        id: '2',
        name: 'Casey Lane (Member)',
        email: 'casey.lane@example.com',
        role: UserRole.Member,
        coins: 380,
        avatarUrl: 'https://i.pravatar.cc/150?u=caseylane'
    }
];

export const ACTION_POINTS_DATA: ActionPoint[] = [
    { id: 'ap1', meetingId: 'm1', title: 'Draft Q3 Marketing Plan', details: 'Prepare initial draft of the marketing plan focusing on new social media channels.', assignedTo: 'Casey Lane', priority: Priority.High, status: Status.InProgress },
    { id: 'ap2', meetingId: 'm1', title: 'Update Client Onboarding Docs', details: 'Incorporate feedback from the last client workshop into the onboarding documentation.', assignedTo: 'Alex Starr', priority: Priority.Medium, status: Status.Completed },
    { id: 'ap3', meetingId: 'm1', title: 'Research Competitor APIs', details: 'Analyze the public APIs of our top 3 competitors and document key features.', assignedTo: 'Casey Lane', priority: Priority.High, status: Status.Pending },
    { id: 'ap4', meetingId: 'm2', title: 'Finalize Budget for "Project Phoenix"', details: 'Review all department estimates and finalize the total budget for approval.', assignedTo: 'Alex Starr', priority: Priority.High, status: Status.Completed },
    { id: 'ap5', meetingId: 'm2', title: 'Design User Profile Mockups', details: 'Create high-fidelity mockups for the new user profile page, including mobile views.', assignedTo: 'Casey Lane', priority: Priority.Medium, status: Status.InProgress },
    { id: 'ap6', meetingId: 'm3', title: 'Schedule Sprint Planning Session', details: 'Coordinate with the dev team to schedule the next sprint planning meeting.', assignedTo: 'Alex Starr', priority: Priority.Low, status: Status.Completed },
];

export const MEETINGS_DATA: Meeting[] = [
    {
        id: 'm1',
        title: 'Q3 Marketing Strategy Sync',
        date: '2024-07-22',
        summary: 'Discussed the overall strategy for the upcoming quarter, focusing on expanding our reach through new social media platforms. Key decisions were made regarding content pillars and influencer collaborations. Several action items were assigned to kickstart the process.',
        actionPoints: ACTION_POINTS_DATA.filter(ap => ap.meetingId === 'm1'),
    },
    {
        id: 'm2',
        title: 'Project Phoenix - Budget Review',
        date: '2024-07-20',
        summary: 'A detailed review of the proposed budget for "Project Phoenix". The team analyzed costs across departments and identified areas for potential savings. The budget was approved pending final mockups from the design team.',
        actionPoints: ACTION_POINTS_DATA.filter(ap => ap.meetingId === 'm2'),
    },
    {
        id: 'm3',
        title: 'Weekly Team Stand-up',
        date: '2024-07-18',
        summary: 'Standard weekly check-in. Team members provided updates on their ongoing tasks. No major blockers were identified. Confirmed schedule for the next sprint planning session.',
        actionPoints: ACTION_POINTS_DATA.filter(ap => ap.meetingId === 'm3'),
    },
];