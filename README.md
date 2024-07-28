# To-Do Application

## Project Overview

This project is a to-do application built with React and Next.js, using PocketBase as the backend. The application is designed to manage tasks where only admins can create and assign tasks to developers. Developers can log in to see the tasks assigned to them, start and stop a timer for each task, and mark tasks as complete.

## Features

- **Admin Features:**

  - Create tasks.
  - Assign tasks to developers.
  - View all tasks.

- **Developer Features:**

  - View tasks assigned to them.
  - Start and stop a timer for tasks.
  - Mark tasks as complete.

- **General Features:**
  - User authentication and authorization.
  - Commenting system for each task.
  - Real-time updates using PocketBase.

## Technology Stack

- **Frontend:**

  - React
  - Next.js
  - Ant Design for UI components

- **Backend:**

  - PocketBase for real-time database and authentication

- **Other Tools:**
  - TypeScript for static typing
  - Axios for API requests
  - Day.js for date manipulation
  - Next.js Middleware for handling authentication and routing

## Getting Started

To get started with the development server, run the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Setting Up PocketBase

Make sure you have PocketBase set up and running. Update the `PB_URL` in `lib/conts.ts` with your PocketBase URL.

This to-do application provides a robust framework for managing tasks with a clear separation of admin and developer roles, leveraging modern web technologies to ensure a smooth and responsive user experience.
