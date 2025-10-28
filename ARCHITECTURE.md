# MeetWhiz System Architecture

This document outlines the high-level architecture of the MeetWhiz platform. The system is designed as a distributed application with three main components: the Frontend Web App, a conceptual Backend Server, and the WhatsApp Bot Client.

---

### 1. Frontend Web App (This Repository)

The user-facing dashboard for managing and interacting with the MeetWhiz service.

-   **Technology**: React, TypeScript, Tailwind CSS.
-   **Responsibilities**:
    -   **User Interface**: Provides a rich, interactive UI for Admins and Members.
    -   **User Authentication**: Manages user login and role-based access (Admin vs. Member).
    -   **Client-Side Logic**: Handles complex UI state, such as the Live Meeting Scribe (using the Web Speech API) and client-side video frame extraction for summarization.
    -   **API Communication**: Makes secure API calls to the Backend Server to fetch data and trigger actions.
    -   **Direct AI Interaction**: Interacts directly with the Google Gemini API for client-side tasks like the conversational AI assistant and content generation in the Creator Studio.

### 2. Backend Server (Conceptual)

The central hub of the MeetWhiz ecosystem. It handles business logic, data persistence, and communication between the web app and the WhatsApp bot.

-   **Technology (Example)**: Node.js with Express/Fastify, MongoDB/PostgreSQL for the database.
-   **Responsibilities**:
    -   **Business Logic**: Manages user accounts, group settings, billing, and the coin economy.
    -   **Database Management**: Stores all persistent data, including user profiles, meeting transcripts, summaries, action points, and integration credentials.
    -   **Secure API**: Provides a RESTful or GraphQL API for the Frontend Web App to consume.
    -   **Job Scheduling**: Runs scheduled tasks (e.g., via cron jobs) to send reminders for overdue tasks or missed meetings.
    -   **Integration Hub**: Manages OAuth flows and token securely for third-party integrations like Google Tasks, Slack, etc.
    -   **Real-time Communication**: Pushes real-time updates to the web app (e.g., via WebSockets) when the bot posts a new meeting summary.

### 3. WhatsApp Bot Client

The agent that lives inside WhatsApp groups, acting as the primary point of contact for most users.

-   **Technology (Example)**: A server-side application using the WhatsApp Business Platform (Cloud API).
-   **Responsibilities**:
    -   **Message Handling**: Listens for incoming messages in connected groups.
    -   **Command Parsing**: Detects commands like `#meeting_start`, `#meeting_end`, and `!login`.
    -   **Meeting Recording**: Buffers messages between `#meeting_start` and `#meeting_end` commands and sends the transcript to the Backend for processing.
    -   **Responding to Users**: Posts AI-generated summaries, task lists, reminders, and generated content (from the Creator Studio) back into the group.
    -   **Direct Messaging**: Sends secure, unique login links to members who request them.
    -   **Moderation**: (Future feature) Can be configured to delete offensive messages or enforce group rules.

---

### High-Level Interaction Flow

```mermaid
graph TD
    A[User in WhatsApp Group] -- sends #meeting_start --> B(WhatsApp Bot);
    B -- sends transcript --> C{Backend Server};
    C -- processes and stores --> D[(Database)];
    C -- calls Gemini API for summary --> E[Google Gemini API];
    E -- returns summary --> C;
    C -- sends summary back --> B;
    B -- posts summary to group --> A;

    F[Admin on Web App] -- logs in --> G(Frontend Web App);
    G -- requests meeting data --> C;
    C -- queries data --> D;
    D -- returns data --> C;
    C -- sends data to --> G;
    G -- displays data --> F;

    F -- uses Creator Studio --> G;
    G -- calls Gemini API directly --> E;
    E -- returns generated content --> G;
    G -- displays content to --> F;
    F -- clicks "Share to Group" --> G;
    G -- sends content to --> C;
    C -- commands bot to post --> B;
    B -- posts content --> A;

```
