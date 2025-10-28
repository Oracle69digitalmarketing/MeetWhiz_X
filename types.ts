import React from 'react';

// FIX: Define AIStudio interface to resolve conflict with existing global type.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    pdfjsLib: any;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    aistudio?: AIStudio;
  }
}

export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum Status {
  Completed = 'Completed',
  InProgress = 'In Progress',
  Pending = 'Pending',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coins: number;
  avatarUrl: string;
}

export type View = 'dashboard' | 'meetings' | 'tasks' | 'live-meeting' | 'creator-studio' | 'settings';

export interface NavItem {
  id: View;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  adminOnly?: boolean;
}

export interface ActionPoint {
  id: string;
  meetingId: string;
  title: string;
  details: string;
  assignedTo: string;
  priority: Priority;
  status: Status;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  summary: string;
  actionPoints: ActionPoint[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isLoading?: boolean;
}

export enum AITask {
    GenerateSummary = 'Generate Summary',
    AnalyzeDocument = 'Analyze Document',
    AnalyzeImage = 'Analyze Image',
    SummarizeVideo = 'Summarize Video',
    GenerateImage = 'Generate Image',
    GenerateVideo = 'Generate Video',
}

export type ShareableContent = {
  title: string;
  text: string;
} | null;