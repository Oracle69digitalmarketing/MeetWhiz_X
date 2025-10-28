# MeetWhiz Dashboard

Welcome to the MeetWhiz Dashboard, the command center for your AI-powered WhatsApp meeting assistant. This platform transforms chaotic group chats into structured, actionable outcomes.

## Overview

MeetWhiz is a two-part ecosystem:
1.  **A WhatsApp Bot**: An AI agent that lives inside your WhatsApp groups to record meetings, moderate chats, and post summaries.
2.  **A Web Dashboard (This App)**: A powerful web interface for admins and members to review meeting history, track tasks, use advanced AI tools, and manage the bot.

This repository contains the code for the front-end web dashboard, built with React, TypeScript, and Tailwind CSS, and powered by the Google Gemini API.

## Key Features

-   **Role-Based Access**: Separate, tailored views for Admins (full control) and Members (personalized view).
-   **Meetings Dashboard**: At-a-glance overview of key metrics, task statuses, and team productivity.
-   **Meeting History**: Browse and review detailed summaries and action points from all past meetings.
-   **Task Tracking**: A centralized place to view all assigned tasks, filterable by user.
-   **Live Meeting Scribe**: A real-time transcription and AI assistant that proactively identifies action items, decisions, and questions during a live meeting.
-   **AI Creator Studio**: A suite of powerful AI tools to:
    -   Generate summaries from text.
    -   Analyze content from uploaded images.
    -   Summarize uploaded videos.
    -   Generate high-quality images and logos from text prompts.
    -   Generate short videos for ads or announcements.
-   **Conversational AI Assistant**: An in-app chatbot to help you navigate the app, retrieve data, and answer questions.
-   **Gamification System**: Earn coins for productive actions and completing tasks, creating an engaging user experience.

## Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (including Gemini 2.5 Flash, 2.5 Pro, Imagen 4, and Veo models)
-   **Real-time Transcription**: Browser Web Speech API

## Getting Started

This project is designed to run in a web-based development environment that provides the necessary API keys as environment variables.

1.  **Dependencies**: All dependencies are managed via an `importmap` in `index.html` and are loaded from a CDN. No `npm install` is required.
2.  **API Keys**: The application requires a Google Gemini API key, which must be available as `process.env.API_KEY`.
3.  **Running the App**: Serve the `index.html` file through a local web server.

## Project Structure

```
/
├── components/         # Reusable React components
│   ├── icons/          # SVG icon components
│   ├── AIAssistant.tsx # The in-app chatbot
│   ├── CreatorStudioView.tsx # AI content generation tools
│   ├── DashboardView.tsx # Main dashboard view
│   ├── Header.tsx      # Top navigation bar
│   ├── LiveMeetingView.tsx # Live transcription and AI assistant
│   ├── LoginScreen.tsx # User login view
│   ├── MeetingsView.tsx # Meeting history view
│   ├── SettingsView.tsx # Integrations and settings
│   ├── Sidebar.tsx     # Main sidebar navigation
│   └── TasksView.tsx   # Task tracking view
├── constants.ts        # Mock data and navigation configuration
├── types.ts            # Core TypeScript type definitions
├── App.tsx             # Main application component and routing
├── index.html          # Entry HTML file
└── index.tsx           # React application entry point
```
