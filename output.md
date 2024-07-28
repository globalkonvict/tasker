# Project Overview

## Directory Structure

```plaintext
├── .eslintrc.json
├── .gitignore
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── validation
│   │   │   │   ├── route.ts
│   ├── auth
│   │   ├── login
│   │   │   ├── page.tsx
│   │   ├── reset
│   │   │   ├── page.tsx
│   │   ├── sign-up
│   │   │   ├── page.tsx
│   ├── dashboard
│   │   ├── layout.tsx
│   │   ├── settings
│   │   │   ├── page.tsx
│   │   ├── tasks
│   │   │   ├── generate-columns.tsx
│   │   │   ├── page.tsx
│   │   ├── users
│   │   │   ├── generate-columns.tsx
│   │   │   ├── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.module.css
│   ├── page.tsx
├── components
│   ├── auth
│   │   ├── AuthForm.tsx
│   ├── dashboard
│   │   ├── task-drawer.tsx
│   │   ├── task-form.tsx
│   │   ├── user-drawer.tsx
│   │   ├── user-form.tsx
│   ├── layouts
│   │   ├── basic-layout
│   │   │   ├── basic-layout.tsx
│   │   │   ├── _defaultProps.tsx
│   │   ├── dashboard-layout
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── _defaultProps.tsx
│   ├── ui
│   │   ├── comments.tsx
│   │   ├── read-more.tsx
│   │   ├── status-tag.tsx
├── contexts
│   ├── realtime-context.tsx
├── lib
│   ├── api
│   │   ├── api.ts
│   │   ├── requests.ts
│   ├── conts.ts
│   ├── pocketbase
│   │   ├── encode-cookies.ts
│   │   ├── pocketbase.ts
│   │   ├── server-cookie.ts
│   │   ├── utils.ts
│   ├── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── public
│   ├── next.svg
│   ├── vercel.svg
├── README.md
├── tsconfig.json
├── types
│   ├── api.ts

```

## File Contents

### middleware.ts
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PB_USER_COLLECTION } from "@/lib/conts";
import { getNextjsCookie } from "@/lib/pocketbase/server-cookie";
import pb from "@/lib/pocketbase/pocketbase";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Retrieve the authentication cookie from the request
  const request_cookie = request.cookies.get("pb_auth");
  const cookie = await getNextjsCookie(request_cookie);

  try {
    // Load the authentication model from the cookie if it exists or clear it
    cookie ? pb.authStore.loadFromCookie(cookie) : pb.authStore.clear();

    // Verify and refresh the authentication model if it is valid
    if (pb.authStore.isValid) {
      await pb.collection(PB_USER_COLLECTION).authRefresh();
    }
  } catch (error) {
    // Clear the auth store and update the response cookie on error
    pb.authStore.clear();
    response.headers.set(
      "set-cookie",
      pb.authStore.exportToCookie({ httpOnly: false })
    );
  }

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAuthenticated = !!pb.authStore.model;

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && !isAuthPage) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname || "/");
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    const nextUrl = request.headers.get("next-url") || "/";
    const redirectUrl = new URL(nextUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Proceed with the request
  return response;
}

// Apply the middleware to the specified routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};

```

### next-env.d.ts
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

```

### next.config.mjs
```
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

```

### package.json
```json
{
  "name": "tasker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ant-design/compatible": "^5.1.3",
    "@ant-design/pro-components": "^2.7.14",
    "@emotion/css": "^11.13.0",
    "antd": "^5.19.3",
    "axios": "^1.7.2",
    "dayjs": "^1.11.12",
    "next": "14.2.5",
    "nextjs-toploader": "^1.6.12",
    "pocketbase": "^0.21.3",
    "react": "^18",
    "react-dom": "^18",
    "react-transition-group": "^4.4.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/react-transition-group": "^4.4.10",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "typescript": "^5"
  }
}

```

### README.md
```markdown
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```

### tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

### app/globals.css
```css
/* Common CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Rest of your CSS code */
.ant-pro-card-title {
  width: 100%;
}
/* Page Transition */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}

.page-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 300ms, transform 300ms;
}

```

### app/layout.tsx
```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasker",
  description: "An app to manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}

```

### app/page.module.css
```css
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  min-height: 100vh;
}

.description {
  display: inherit;
  justify-content: inherit;
  align-items: inherit;
  font-size: 0.85rem;
  max-width: var(--max-width);
  width: 100%;
  z-index: 2;
  font-family: var(--font-mono);
}

.description a {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.description p {
  position: relative;
  margin: 0;
  padding: 1rem;
  background-color: rgba(var(--callout-rgb), 0.5);
  border: 1px solid rgba(var(--callout-border-rgb), 0.3);
  border-radius: var(--border-radius);
}

.code {
  font-weight: 700;
  font-family: var(--font-mono);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(25%, auto));
  max-width: 100%;
  width: var(--max-width);
}

.card {
  padding: 1rem 1.2rem;
  border-radius: var(--border-radius);
  background: rgba(var(--card-rgb), 0);
  border: 1px solid rgba(var(--card-border-rgb), 0);
  transition: background 200ms, border 200ms;
}

.card span {
  display: inline-block;
  transition: transform 200ms;
}

.card h2 {
  font-weight: 600;
  margin-bottom: 0.7rem;
}

.card p {
  margin: 0;
  opacity: 0.6;
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 30ch;
  text-wrap: balance;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 4rem 0;
}

.center::before {
  background: var(--secondary-glow);
  border-radius: 50%;
  width: 480px;
  height: 360px;
  margin-left: -400px;
}

.center::after {
  background: var(--primary-glow);
  width: 240px;
  height: 180px;
  z-index: -1;
}

.center::before,
.center::after {
  content: "";
  left: 50%;
  position: absolute;
  filter: blur(45px);
  transform: translateZ(0);
}

.logo {
  position: relative;
}
/* Enable hover only on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    background: rgba(var(--card-rgb), 0.1);
    border: 1px solid rgba(var(--card-border-rgb), 0.15);
  }

  .card:hover span {
    transform: translateX(4px);
  }
}

@media (prefers-reduced-motion) {
  .card:hover span {
    transform: none;
  }
}

/* Mobile */
@media (max-width: 700px) {
  .content {
    padding: 4rem;
  }

  .grid {
    grid-template-columns: 1fr;
    margin-bottom: 120px;
    max-width: 320px;
    text-align: center;
  }

  .card {
    padding: 1rem 2.5rem;
  }

  .card h2 {
    margin-bottom: 0.5rem;
  }

  .center {
    padding: 8rem 0 6rem;
  }

  .center::before {
    transform: none;
    height: 300px;
  }

  .description {
    font-size: 0.8rem;
  }

  .description a {
    padding: 1rem;
  }

  .description p,
  .description div {
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
  }

  .description p {
    align-items: center;
    inset: 0 0 auto;
    padding: 2rem 1rem 1.4rem;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid rgba(var(--callout-border-rgb), 0.25);
    background: linear-gradient(
      to bottom,
      rgba(var(--background-start-rgb), 1),
      rgba(var(--callout-rgb), 0.5)
    );
    background-clip: padding-box;
    backdrop-filter: blur(24px);
  }

  .description div {
    align-items: flex-end;
    pointer-events: none;
    inset: auto 0 0;
    padding: 2rem;
    height: 200px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgb(var(--background-end-rgb)) 40%
    );
    z-index: 1;
  }
}

/* Tablet and Smaller Desktop */
@media (min-width: 701px) and (max-width: 1120px) {
  .grid {
    grid-template-columns: repeat(2, 50%);
  }
}

@media (prefers-color-scheme: dark) {
  .vercelLogo {
    filter: invert(1);
  }

  .logo {
    filter: invert(1) drop-shadow(0 0 0.3rem #ffffff70);
  }
}

@keyframes rotate {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

```

### app/page.tsx
```tsx
"use client";
import { Spin } from "antd";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase/pocketbase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push("/dashboard/tasks");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return <Spin fullscreen />;
}

```

### contexts/realtime-context.tsx
```tsx
"use client";
import React, { createContext, useState, useEffect, useRef } from "react";
import type { ActionType } from "@ant-design/pro-components";
import pb from "@/lib/pocketbase/pocketbase";

type RealtimeContextType = {
  subscribe: (collection: string) => () => void;
  actionRef: React.MutableRefObject<ActionType | undefined>;
} | null;

export const RealtimeContext = createContext<RealtimeContextType>(null);

type RealtimeProviderProps = {
  children: React.ReactNode;
};

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({
  children,
}) => {
  const actionRef = useRef<ActionType>();
  const [collection, setCollection] = useState("");

  const subscribe = (collection: string) => {
    setCollection(collection);
    return () => {
      setCollection("");
    };
  };

  useEffect(() => {
    if (collection && actionRef.current) {
      pb.collection(collection).subscribe("*", (e) => {
        console.log("Realtime event", e);
        if (["create", "update", "delete"].includes(e.action)) {
          actionRef?.current?.reload();
        }
      });

      return () => {
        pb.collection(collection).unsubscribe("*");
      };
    }
  }, [collection, actionRef]);

  return (
    <RealtimeContext.Provider value={{ subscribe, actionRef }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (collection: string) => {
  const context = React.useContext(RealtimeContext);

  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }

  useEffect(() => {
    const unsubscribe = context?.subscribe(collection) || console.log;
    return () => {
      unsubscribe("Could not unsubscribe...");
    };
  }, [collection, context]);

  return context?.actionRef;
};

```

### lib/conts.ts
```typescript
export const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
export const PB_ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN;
export const PB_API_URL = PB_URL + `/api`;
export const PB_USER_COLLECTION = "users";
export const PB_TODO_COLLECTION = "todos";
export const PB_COMMENT_COLLECTION = "comments";

```

### lib/utils.ts
```typescript
/**
 * Debounce function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge, instead of the trailing
 * @returns A debounced version of the passed function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<T>): void {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Deletes the browser cookie
 * @param name - Cookie key
 */
export function removeCookie(name: string) {
  // This function will attempt to remove a cookie from all paths.
  const pathBits = location.pathname.split("/");
  let pathCurrent = " path=";

  // do a simple pathless delete first.
  document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";

  for (let i = 0; i < pathBits.length; i++) {
    pathCurrent += (pathCurrent.substring(-1) != "/" ? "/" : "") + pathBits[i];
    document.cookie =
      name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;" + pathCurrent + ";";
  }
}

/**
 * Formats the seconds to human readable string
 * @param seconds
 * @returns
 */
export function formatSeconds(seconds: number) {
  // Calculate days, hours, minutes, and remaining seconds
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Build the formatted time string
  let formattedTime = "";

  if (days > 0) {
    formattedTime += `${days} D, ${hours} H`;
  } else if (hours > 0) {
    formattedTime += `${hours} H ${minutes} M`;
  } else if (minutes > 0) {
    formattedTime += `${minutes} M ${remainingSeconds} S`;
  } else {
    formattedTime += `${remainingSeconds} S`;
  }

  return formattedTime;
}

/**
 * Returns random color
 * @returns color string in hex
 */
export function randomColor() {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

```

### public/next.svg
```
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

### public/vercel.svg
```
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg>
```

### types/api.ts
```typescript
import type { ParamsType } from "@ant-design/pro-components";
import exp from "constants";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  created: string;
  updated: string;
  timer: number;
  assignedTo: string;
  startTime: string | null;
  expand: {
    assignedTo: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  };
  owner: string;
};

export type TaskSearchParam = {
  pageSize?: number;
  current?: number;
} & TaskItem &
  ParamsType;

export type Comment = {
  todo: string;
  user: string;
  content: React.ReactNode;
  created?: string;
  expand?: {
    user?: {
      id: string;
      name: string;
      email: string;
      username: string;
      avatar: string;
    };
    todo?: TaskItem;
  };
};

export type User = {
  id: string;
  name: string;
  role: "admin" | "developer";
  email: string;
  username: string;
  avatar?: string;
  created: string;
  updated: string;
};

export type UserSearchParam = {
  pageSize?: number;
  current?: number;
} & User &
  ParamsType;
```

### app/dashboard/layout.tsx
```tsx
import { RealtimeProvider } from "@/contexts/realtime-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RealtimeProvider>{children}</RealtimeProvider>;
}

```

### components/auth/AuthForm.tsx
```tsx
import React, { useState } from "react";
import { Form, Button, message, Typography, Space, Flex } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProCard,
} from "@ant-design/pro-components";
import Link from "next/link";
import pb from "@/lib/pocketbase/pocketbase";
import type { RecordModel, RecordAuthResponse } from "pocketbase";
import { api } from "@/lib/api/api";
import { debounce } from "@/lib/utils";

type AuthFormProps = {
  title: string;
  type: "login" | "signup" | "reset";
  onSubmit: (
    values: any
  ) => Promise<RecordModel | RecordAuthResponse<RecordModel> | void>;
  initialValues?: Record<string, any>;
};

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  initialValues = {},
  title = "",
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await onSubmit(values);

      if (type === "login") {
        //  add the authstore to a cookie for easy server side use
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        router.push("/");
      }

      message.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`
      );
      form.resetFields();
    } catch (error) {
      message.error(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the username/email already exists
  const checkUserExists =
    (type: "email" | "username") => async (rule: any, value: string) => {
      if (!value) {
        return Promise.resolve();
      }
      try {
        const { data } = await api.get("/auth/validation", {
          params: type === "email" ? { email: value } : { username: value },
        });

        if (data.success) {
          return Promise.resolve();
        }
        return Promise.reject(
          `${type === "email" ? "Email" : "Username"} already exists!`
        );
      } catch (err) {
        return Promise.reject(
          `Error checking ${type === "email" ? "email" : "username"}!`
        );
      }
    };

  // Debounce the validation function
  const debouncedCheckUserExists = (
    type: "email" | "username",
    wait: number
  ) => {
    const debouncedFunc = debounce(
      (
        resolve: (value: unknown) => void,
        reject: (reason?: any) => void,
        value: string
      ) => {
        checkUserExists(type)(null, value).then(resolve).catch(reject);
      },
      wait
    );

    return async (_: any, value: string) => {
      return new Promise((resolve, reject) => {
        debouncedFunc(resolve, reject, value);
      });
    };
  };

  const getFields = () => {
    switch (type) {
      case "login":
        return (
          <>
            <ProFormText
              name="username"
              label="Username/Email"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username or email!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              label="Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            />
          </>
        );
      case "signup":
        return (
          <>
            <ProFormText
              name="name"
              label="Name"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            />
            <ProFormText
              name="username"
              label="Username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Username"
              rules={[
                {
                  min: 3,
                  message: "Username must be at least 3 characters long!",
                },
                {
                  max: 150,
                  message: "Username must be at most 150 characters long!",
                },
                { required: true, message: "Please input your username!" },
                { validator: debouncedCheckUserExists("username", 500) },
              ]}
              validateFirst="parallel"
            />
            <ProFormText
              name="email"
              label="Email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined className="site-form-item-icon" />,
              }}
              placeholder="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
                { validator: debouncedCheckUserExists("email", 500) },
              ]}
              validateFirst="parallel"
            />
            <ProFormText.Password
              name="password"
              label="Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long!",
                },
              ]}
              validateFirst="parallel"
            />
            <ProFormText.Password
              name="confirmPassword"
              label="Confirm Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Confirm Password"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            />
          </>
        );
      case "reset":
        return (
          <>
            <ProFormText
              name="email"
              label="Email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined className="site-form-item-icon" />,
              }}
              placeholder="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProCard
      style={{ maxWidth: 500, padding: 16 }}
      title={
        <Typography.Title
          style={{ width: "100%", textAlign: "center" }}
          level={2}
        >
          {title}
        </Typography.Title>
      }
    >
      <ProForm
        form={form}
        name="auth-form"
        initialValues={initialValues}
        onFinish={handleSubmit}
        scrollToFirstError
        submitter={{
          render: (props, dom) => (
            <Flex
              vertical
              style={{ width: "100%" }}
              align="center"
              justify="center"
              gap="large"
            >
              {type !== "reset" && (
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginTop: -18 }}
                  align="end"
                >
                  <Typography.Text>
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Typography.Text>
                </Space>
              )}
              <Button type="primary" htmlType="submit" loading={loading} block>
                {type === "login"
                  ? "Log in"
                  : type === "signup"
                  ? "Sign up"
                  : "Reset Password"}
              </Button>
              {/** Render the login or sign up link based on the type but don't render on reset password page */}
              {type !== "reset" && (
                <>
                  <Typography.Text
                    style={{ width: "100%", textAlign: "center" }}
                    type="secondary"
                    underline
                  >
                    {type === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </Typography.Text>
                  <Link
                    href={type === "login" ? "/auth/sign-up" : "/auth/login"}
                    style={{ width: "100%" }}
                  >
                    <Button block>
                      {type === "login" ? "Sign up" : "Log in"}
                    </Button>
                  </Link>
                </>
              )}
            </Flex>
          ),
        }}
      >
        {getFields()}
      </ProForm>
    </ProCard>
  );
};

export default AuthForm;

```

### components/dashboard/task-drawer.tsx
```tsx
"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Drawer,
  Flex,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Button,
  message,
} from "antd";
import StatusTag from "@/components/ui/status-tag";
import Comments from "@/components/ui/comments";
import TaskForm from "@/components/dashboard/task-form";
import ReadMoreParagraph from "@/components/ui/read-more";
import { formatSeconds } from "@/lib/utils";
import type { TaskItem } from "@/types/api";
import { updateTaskTimer } from "@/lib/api/requests";

type TaskDrawerViewProps = {
  variant: "view";
  viewTask: TaskItem | undefined;
  openViewTask: boolean;
  setViewTask: (val: TaskItem | undefined) => void;
  setOpenViewTask: (val: boolean) => void;
};

type TaskDrawerCreateProps = {
  variant: "create";
  users: { label: string; value: string }[];
  openCreateTask: boolean;
  setOpenCreateTask: (val: boolean) => void;
};

type TaskDrawerProps = TaskDrawerViewProps | TaskDrawerCreateProps;

const TaskDrawer: React.FC<TaskDrawerProps> = (props) => {
  const { variant } = props;
  const [totalTimeWorked, setTotalTimeWorked] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      if (variant === "view") {
        if (props.viewTask) {
          if (props.viewTask.startTime) {
            const timeWorked = dayjs().diff(
              dayjs(props.viewTask.startTime),
              "second"
            );
            setTotalTimeWorked(props.viewTask.timer + timeWorked);
          } else {
            setTotalTimeWorked(props.viewTask.timer);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [props, variant]);

  if (variant === "view") {
    const { viewTask, openViewTask, setViewTask, setOpenViewTask } = props;

    const toggleTimer = async () => {
      if (!viewTask) return;

      if (viewTask.startTime) {
        // Stop timer
        const timeWorked = dayjs().diff(dayjs(viewTask.startTime), "second");
        await updateTaskTimer(viewTask?.id, viewTask?.timer + timeWorked, null);
        setViewTask({
          ...viewTask,
          startTime: null,
          timer: viewTask?.timer + timeWorked,
        });
        message.success("Timer stopped");
      } else {
        // Start timer
        await updateTaskTimer(
          viewTask.id,
          viewTask.timer,
          dayjs().toISOString()
        );
        setViewTask({
          ...viewTask,
          startTime: dayjs().toISOString(),
        });
        message.success("Timer started");
      }
    };

    return (
      <>
        <Drawer
          open={openViewTask}
          closable={false}
          onClose={() => {
            setViewTask(undefined);
            setOpenViewTask(false);
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Tooltip title={viewTask?.title}>
              <Typography.Title level={4} underline>
                {viewTask?.title}
              </Typography.Title>
            </Tooltip>
            <Button block onClick={toggleTimer}>
              {viewTask?.startTime ? "Stop Timer" : "Start Timer"}
            </Button>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Deadline
              </Typography.Title>
              <Typography.Text mark style={{ marginLeft: 8 }}>
                {dayjs(viewTask?.startDate).format("D MMM YYYY") +
                  " - " +
                  dayjs(viewTask?.endDate).format("D MMM YYYY")}
              </Typography.Text>
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Status
              </Typography.Title>
              <StatusTag
                status={viewTask?.status ?? "pending"}
                style={{ marginLeft: 8 }}
              />
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Assigned To
              </Typography.Title>
              <Tooltip
                title={viewTask?.expand.assignedTo.name.replace(/^./, (m) =>
                  m.toUpperCase()
                )}
              >
                <Avatar
                  size={24}
                  style={{ backgroundColor: "#87d068", marginLeft: 8 }}
                >
                  {viewTask?.expand.assignedTo.username[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Total Time Worked
              </Typography.Title>
              <Typography.Text code style={{ marginLeft: 8 }}>
                {formatSeconds(totalTimeWorked ?? 0)}
              </Typography.Text>
            </Flex>
            <Typography.Title style={{ margin: 0 }} level={5}>
              Task Description
            </Typography.Title>
            <ReadMoreParagraph text={viewTask?.description ?? ""} lines={3} />
            <Flex vertical>
              <Typography.Title level={4}>Discussions</Typography.Title>
              <Typography.Text type="secondary">
                Ask Questions or comment
              </Typography.Text>
              {viewTask?.id && <Comments todo={viewTask?.id} />}
            </Flex>
          </Space>
        </Drawer>
      </>
    );
  }

  if (variant === "create") {
    const { users, openCreateTask, setOpenCreateTask } = props;
    return (
      <Drawer
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        closable={false}
      >
        <TaskForm users={users} setOpenCreateTask={setOpenCreateTask} />
      </Drawer>
    );
  }
};

export default TaskDrawer;

```

### components/dashboard/task-form.tsx
```tsx
"use client";
import React from "react";

import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import pb from "@/lib/pocketbase/pocketbase";

import type { TaskItem } from "@/types/api";

type TaskFormProps = {
  users: { label: string; value: string }[];
  setOpenCreateTask: (v: boolean) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ users, setOpenCreateTask }) => {
  const [form] = ProForm.useForm();
  const handleSubmit = async (values: TaskItem) => {
    try {
      await pb.collection("todos").create({
        title: values.title,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        timer: values.timer,
        assignedTo: values.assignedTo,
      });
      message.success("Todo created successfully");
      form.resetFields();
      setOpenCreateTask(false);
    } catch (error) {
      message.error("Failed to create todo");
    }
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      submitter={{
        searchConfig: {
          submitText: "Create Todo",
        },
      }}
    >
      <ProFormText
        name="title"
        label="Title"
        placeholder="Enter the title"
        rules={[{ required: true, message: "Title is required" }]}
      />
      <ProFormTextArea
        name="description"
        label="Description"
        placeholder="Enter the description"
        rules={[{ required: true, message: "Description is required" }]}
      />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
        ]}
        placeholder="Select the status"
        rules={[{ required: true, message: "Status is required" }]}
        initialValue={"pending"}
      />
      <ProForm.Group>
        <ProFormDatePicker
          name="startDate"
          label="Start Date"
          placeholder="Select the start date"
          rules={[{ required: true, message: "Start Date is required" }]}
        />
        <ProFormDatePicker
          name="endDate"
          label="End Date"
          placeholder="Select the end date"
          rules={[{ required: true, message: "End Date is required" }]}
        />
      </ProForm.Group>
      <ProFormDigit
        name="timer"
        label="Timer"
        placeholder="Enter the timer (default 0)"
        min={0}
        initialValue={0}
      />
      <ProFormSelect
        name="assignedTo"
        label="Assigned To"
        options={users}
        placeholder="Select the user"
        rules={[{ required: true, message: "Assigned To is required" }]}
        fieldProps={{
          showSearch: true,
        }}
      />
    </ProForm>
  );
};

export default TaskForm;

```

### components/dashboard/user-drawer.tsx
```tsx
"use client";
import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import UserForm from "@/components/dashboard/user-form";
import { updateTaskTimer } from "@/lib/api/requests";

type UserDrawerProps = {
  openCreateUser: boolean;
  setOpenCreateUser: (val: boolean) => void;
};

const UserDrawer: React.FC<UserDrawerProps> = (props) => {
  const { openCreateUser, setOpenCreateUser } = props;

  return (
    <Drawer
      open={openCreateUser}
      onClose={() => setOpenCreateUser(false)}
      closable={false}
    >
      <UserForm setOpenCreateTask={setOpenCreateUser} />
    </Drawer>
  );
};

export default UserDrawer;

```

### components/dashboard/user-form.tsx
```tsx
"use client";
import React from "react";

import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import pb from "@/lib/pocketbase/pocketbase";

import type { TaskItem } from "@/types/api";

type UsersFormProps = {
  setOpenCreateTask: (v: boolean) => void;
};

const UsersForm: React.FC<UsersFormProps> = ({  setOpenCreateTask }) => {
  const [form] = ProForm.useForm();
  const handleSubmit = async (values: TaskItem) => {
    try {
      await pb.collection("todos").create({
        title: values.title,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        timer: values.timer,
        assignedTo: values.assignedTo,
      });
      message.success("Todo created successfully");
      form.resetFields();
      setOpenCreateTask(false);
    } catch (error) {
      message.error("Failed to create todo");
    }
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      submitter={{
        searchConfig: {
          submitText: "Create Todo",
        },
      }}
    >
      <ProFormText
        name="name"
        label="Name"
        placeholder="Enter the title"
        rules={[{ required: true, message: "Name is required" }]}
      />
      <ProFormTextArea
        name="description"
        label="Description"
        placeholder="Enter the description"
        rules={[{ required: true, message: "Description is required" }]}
      />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
        ]}
        placeholder="Select the status"
        rules={[{ required: true, message: "Status is required" }]}
        initialValue={"pending"}
      />
      <ProForm.Group>
        <ProFormDatePicker
          name="startDate"
          label="Start Date"
          placeholder="Select the start date"
          rules={[{ required: true, message: "Start Date is required" }]}
        />
        <ProFormDatePicker
          name="endDate"
          label="End Date"
          placeholder="Select the end date"
          rules={[{ required: true, message: "End Date is required" }]}
        />
      </ProForm.Group>
      <ProFormDigit
        name="timer"
        label="Timer"
        placeholder="Enter the timer (default 0)"
        min={0}
        initialValue={0}
      />
      <ProFormSelect
        name="assignedTo"
        label="Assigned To"
        options={[
            { label: "Admin", value: "admin" },
            { label: "Developer", value: "developer" },
        ]}
        placeholder="Select the user"
        rules={[{ required: true, message: "Assigned To is required" }]}
        fieldProps={{
          showSearch: true,
        }}
      />
    </ProForm>
  );
};

export default UsersForm;

```

### components/ui/comments.tsx
```tsx
"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Form, Button, List, Input, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createComment, fetchComments } from "@/lib/api/requests";
import { Comment as CommentType } from "@/types/api";
import pb from "@/lib/pocketbase/pocketbase";
import { randomColor } from "@/lib/utils";

dayjs.extend(relativeTime);

const { TextArea } = Input;

type CommentListProps = {
  comments: CommentType[];
};

const userColors: Record<string, string> = {};

const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => {
      const { user, content, created } = props;
      if (user && !userColors[user]) {
        userColors[user] = randomColor();
      }
      return (
        <Comment
          author={props.expand?.user?.name}
          avatar={
            <Tooltip title={props.expand?.user?.name}>
              <Avatar
                alt={props.expand?.user?.name}
                style={{ backgroundColor: userColors[user] }}
              >
                {props.expand?.user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          }
          content={content}
          datetime={dayjs(created).fromNow()}
        />
      );
    }}
  />
);

type EditorProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
};

const Editor: React.FC<EditorProps> = ({
  onChange,
  onSubmit,
  submitting,
  value,
}) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

type CommentSectionProps = {
  todo: string;
};

const CommentSection: React.FC<CommentSectionProps> = ({ todo }) => {
  const userData = pb.authStore.model ?? {};
  const [comments, setComments] = useState<CommentType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!value) {
      return;
    }
    try {
      setSubmitting(true);
      await createComment({ todo, content: value, user: userData?.id });
      setSubmitting(false);
      setComments([
        ...comments,
        {
          todo,
          content: value,
          user: userData?.id,
          created: new Date().toISOString(),
        },
      ]);
      setValue("");
    } catch (error) {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    fetchComments(todo).then((comments) => {
      setComments(comments);
    });

    pb.collection("comments").subscribe("*", (e) => {
      if (["create", "update", "delete"].includes(e.action)) {
        fetchComments(todo).then((comments) => {
          setComments(comments);
        });
      }
    });

    return () => {
      pb.collection("comments").unsubscribe("*");
    };
  }, [todo]);

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={
          <Tooltip title={userData?.name ?? "User"}>
            <Avatar
              alt={userData?.name ?? "User"}
              style={{ backgroundColor: userColors[userData?.id] }}
            >
              {userData?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};

export default CommentSection;

```

### components/ui/read-more.tsx
```tsx
"use client";
import React, { useState, useRef, useEffect } from "react";

type ReadMoreParagraphProps = {
  text: string;
  lines: number;
};

const ReadMoreParagraph: React.FC<ReadMoreParagraphProps> = ({
  text,
  lines,
}) => {
  const [expanded, setExpanded] = useState(false);

  const paragraphStyle = {
    display: "-webkit-box",
    WebkitLineClamp: expanded ? "unset" : lines.toString(),
    WebkitBoxOrient: "vertical" as "vertical",
    overflow: expanded ? "visible" : "hidden",
    whiteSpace: expanded ? "pre-wrap" : "normal",
    textOverflow: expanded ? "unset" : "ellipsis",
  };

  return (
    <div>
      <div style={paragraphStyle}>{text}</div>

      <a onClick={() => setExpanded(!expanded)}>
        {expanded ? "Read Less" : "Read More"}
      </a>
    </div>
  );
};

export default ReadMoreParagraph;

```

### components/ui/status-tag.tsx
```tsx
import React, { CSSProperties } from "react";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

type StatusTagProps = {
  status: "pending" | "in-progress" | "completed";
  style?: CSSProperties
};

const StatusTag: React.FC<StatusTagProps> = ({ status, style = {} }) => {
  const statusConfig = {
    "in-progress": [ClockCircleOutlined, "processing"],
    completed: [CheckCircleOutlined, "success"],
    pending: [ExclamationCircleOutlined, "warning"],
  };

  const StatusIcon = statusConfig[status][0];
  const statusColor = statusConfig[status][1];
  const statusText = status[0].toUpperCase() + status.slice(1);

  return (
    <Tag icon={<StatusIcon />} color={statusColor as "warning"} style={style}>
      {statusText}
    </Tag>
  );
};

export default StatusTag;

```

### lib/api/api.ts
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});


```

### lib/api/requests.ts
```typescript
import {
  PB_COMMENT_COLLECTION,
  PB_TODO_COLLECTION,
  PB_USER_COLLECTION,
} from "../conts";
import { message } from "antd";
import pb from "@/lib/pocketbase/pocketbase";
import { SortOrder } from "antd/es/table/interface";
import { TaskSearchParam, TaskItem, Comment, UserSearchParam, User } from "@/types/api";
import { generatePBFilter, generatePBSort } from "@/lib/pocketbase/utils";

/**
 * Fetch all users from pocketbase (for admins to assign tasks) when called by non admin users it will return only their own user
 * @returns users
 */
export const getAllUsers = async () => {
  try {
    const response = await pb.collection(PB_USER_COLLECTION).getList(1, 500);
    return response.items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    return [];
  }
};

/**
 * Fetch tasks from pocketbase for the table component in the tasks page
 * @param params
 * @param sort
 * @returns tasks
 */
export const fetchTasks = async (
  params: Partial<TaskSearchParam>,
  sort: Record<"startDate" | "endDate" | "timer", SortOrder>
) => {
  try {
    const { page, pageSize, ...filterParams } = params;
    const sortStr = generatePBSort(sort);
    const pbFilter = generatePBFilter(filterParams);

    const response = await pb
      .collection(PB_TODO_COLLECTION)
      .getList<TaskItem>(page, pageSize, {
        expand: "assignedTo",
        filter: pbFilter,
        sort: sortStr,
      });

    return {
      data: response.items,
      total: response.totalItems,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    return {
      data: [],
      success: false,
    };
  }
};

/**
 * Updates a task in pocketbase
 * @param id task id
 * @param values task values to update
 */
export const updateTask = async (id: string, values: Partial<TaskItem>) => {
  try {
    await pb.collection(PB_TODO_COLLECTION).update(id, values);
    message.success("Task updated successfully");
  } catch (error) {
    message.error("Failed to update task");
  }
};

/**
 * Deletes a task from pocketbase
 * @param values ids of tasks to delete
 * @param setOpenCreateTask
 */
export const deleteTasks = async (ids: string[]) => {
  try {
    const bulkDelete = ids.map((id) =>
      pb.collection(PB_TODO_COLLECTION).delete(id as string)
    );
    await Promise.all(bulkDelete);
    message.success("Deleted selected tasks");
  } catch (error) {
    console.log(error);
    message.error("Failed to delete selected tasks");
  }
};

/**
 * Fetches all comments for a task from pocketbase
 * @param taskId task id
 * @returns comments
 */
export const fetchComments = async (taskId: string) => {
  try {
    const response = await pb
      .collection<Comment>(PB_COMMENT_COLLECTION)
      .getList(1, 500, {
        filter: `todo='${taskId}'`,
        expand: "user",
      });
    return response.items;
  } catch (error) {
    return [];
  }
};

/**
 * Creates a comment in pocketbase
 * @param values comment values
 * @param todo task id
 */
export const createComment = async (values: Comment) => {
  try {
    await pb.collection(PB_COMMENT_COLLECTION).create({
      ...values,
    });
    message.success("Comment added successfully");
  } catch (error) {
    message.error("Failed to add comment");
  }
};

/**
 * Updates a task timer in pocketbase
 * @param id task id
 * @param timer new timer value
 * @param startTime new start time value
 */
export const updateTaskTimer = async (
  id: string,
  timer: number,
  startTime: string | null = null
) => {
  try {
    await pb.collection(PB_TODO_COLLECTION).update(id, { timer, startTime });
  } catch (error) {
    console.error("Failed to update task timer", error);
  }
};

/**
 * Fetch users from pocketbase for the table component in the users page
 * @param params
 * @param sort
 * @returns users
 */
export const fetchUsers = async (
  params: Partial<UserSearchParam>,
  sort: Record<string, SortOrder>
) => {
  try {
    const { page, pageSize, ...filterParams } = params;
    const sortStr = generatePBSort(sort);
    const pbFilter = generatePBFilter(filterParams);

    const response = await pb
      .collection(PB_USER_COLLECTION)
      .getList<User>(page, pageSize, {
        filter: pbFilter,
        sort: sortStr,
      });

    return {
      data: response.items,
      total: response.totalItems,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch users", error);
    return {
      data: [],
      success: false,
    };
  }
};
```

### lib/pocketbase/encode-cookies.ts
```typescript
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function encodeCookie(cookie: { [key: string]: string }): string {
  let encodedCookie = "";
  
  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; `;
  }
  return encodedCookie.trimEnd();
}

export function encodeNextPBCookie(next_cookie: RequestCookie | undefined) {
  if (!next_cookie) {
    return "";
  }

  let encodedCookie = "";
  const cookie = { pb_auth: next_cookie.value };

  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; `;
  }

  return encodedCookie.trimEnd();
}

```

### lib/pocketbase/pocketbase.ts
```typescript
import PocketBase from "pocketbase";
import { PB_URL } from "../conts";
import { SortOrder } from "antd/es/table/interface";

const pb = new PocketBase(PB_URL);

type ParamsType = {
  [key: string]: any;
};

type FieldConfig = {
  type: "string" | "number" | "date";
  range?: boolean;
};

const fieldConfigs: { [key: string]: FieldConfig } = {
  title: { type: "string" },
  status: { type: "string" },
  assignedTo: { type: "string" },
  startDate: { type: "date", range: true },
  endDate: { type: "date", range: true },
};

/**
 * Generates the filter string for querying pocketbase
 * @param params
 * @returns pocketbase filter string
 */
export function generatePBFilter<T extends ParamsType>(
  params: Partial<T>
): string {
  const filters: string[] = [];

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      const config = fieldConfigs[key];
      if (config) {
        switch (config.type) {
          case "string":
          case "number":
            filters.push(`${key}='${params[key]}'`);
            break;
          case "date":
            if (config.range) {
              if (key === "startDate") {
                filters.push(`${key} >= '${params[key]}T00:00:00.000Z'`);
              } else if (key === "endDate") {
                filters.push(`${key} <= '${params[key]}T00:00:00.000Z'`);
              }
            } else {
              filters.push(`${key}='${params[key]}'`);
            }
            break;
        }
      }
    }
  }

  return filters.join(" && ");
}

/**
 * Generates the sort string
 * @param sort
 */
export function generatePBSort(sort: Record<string, SortOrder>) {
  const sortStr = Object.entries(sort).reduce((prev, [k, v]) => {
    const order = v === "ascend" ? "+" : "-";
    prev += `${order}${k}`;
    return prev;
  }, "");
  return sortStr;
}

export default pb;

```

### lib/pocketbase/server-cookie.ts
```typescript
import { cookies } from "next/headers";
import { encodeNextPBCookie } from "./encode-cookies";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function getNextjsCookie(request_cookie?: RequestCookie) {
  try {
    if (request_cookie) {
      const cookie = encodeNextPBCookie(request_cookie);
      return cookie;
    }
    const next_cookie = await cookies().get("pb_auth");
    if (!next_cookie) {
      return "";
    }
    const cookie = encodeNextPBCookie(next_cookie);
    return cookie;
  } catch (error: any) {
    console.log("issue getting next-cookie  === ", error);
    return "";
  }
}

```

### lib/pocketbase/utils.ts
```typescript
import { SortOrder } from "antd/es/table/interface";

type ParamsType = {
  [key: string]: any;
};

type FieldConfig = {
  type: "string" | "number" | "date";
  range?: boolean;
};

const fieldConfigs: { [key: string]: FieldConfig } = {
  title: { type: "string" },
  status: { type: "string" },
  assignedTo: { type: "string" },
  startDate: { type: "date", range: true },
  endDate: { type: "date", range: true },
  role: { type: "string" },
  email: { type: "string" },
  username: { type: "string" },
};

/**
 * Generates the filter string for querying pocketbase
 * @param params
 * @returns pocketbase filter string
 */
export function generatePBFilter<T extends ParamsType>(
  params: Partial<T>
): string {
  const filters: string[] = [];

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      const config = fieldConfigs[key];
      if (config) {
        switch (config.type) {
          case "string":
          case "number":
            filters.push(`${key}='${params[key]}'`);
            break;
          case "date":
            if (config.range) {
              if (key === "startDate") {
                filters.push(`${key} >= '${params[key]}T00:00:00.000Z'`);
              } else if (key === "endDate") {
                filters.push(`${key} <= '${params[key]}T00:00:00.000Z'`);
              }
            } else {
              filters.push(`${key}='${params[key]}'`);
            }
            break;
        }
      }
    }
  }

  return filters.join(" && ");
}

/**
 * Generates the sort string
 * @param sort
 */
export function generatePBSort(sort: Record<string, SortOrder>) {
  const sortStr = Object.entries(sort).reduce((prev, [k, v]) => {
    const order = v === "ascend" ? "+" : "-";
    prev += `${order}${k}`;
    return prev;
  }, "");
  return sortStr;
}

```

### app/auth/reset/page.tsx
```tsx
"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const Reset = () => {
  return (
    <AuthForm type="reset" onSubmit={async (values) => {}} title="Reset" />
  );
};

export default withBasicLayout(Reset);

```

### app/auth/login/page.tsx
```tsx
"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import pb from "@/lib/pocketbase/pocketbase";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const Login = () => {
  const handleLogin = async (values: any) => {
    return await pb
      .collection("users")
      .authWithPassword(values.username, values.password);
  };

  return <AuthForm type="login" onSubmit={handleLogin} title="Login" />;
};

export default withBasicLayout(Login);

```

### app/auth/sign-up/page.tsx
```tsx
"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import pb from "@/lib/pocketbase/pocketbase";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const SignUp = () => {
  const handleSignUp = async (values: any) => {
    const user = await pb.collection("users").create({
      username: values.username,
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
      name: values.name,
      role: "developer",
    });
    return user;
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} title="Sign Up" />;
};

export default withBasicLayout(SignUp);

```

### app/dashboard/settings/page.tsx
```tsx
"use client";
import React from "react";
import withDashLayout from "@/components/layouts/dashboard-layout/dashboard-layout";

const Page = () => {
  return <div>Page</div>;
};

export default withDashLayout(Page);

```

### app/dashboard/tasks/generate-columns.tsx
```tsx
"use client";

import { TableDropdown } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatSeconds } from "@/lib/utils";
import StatusTag from "@/components/ui/status-tag";
import type { TaskItem } from "@/types/api";
import { deleteTasks } from "@/lib/api/requests";

type generateColumnsProps = {
  users: { label: string; value: string }[];
  setViewTask: (val: TaskItem) => void;
  setOpenViewTask: (val: boolean) => void;
};

// Generate columns for the task table
const generateColumns = (params: generateColumnsProps) => {
  const { users, setViewTask, setOpenViewTask } = params;
  const columns: ProColumns<TaskItem>[] = [
    {
      dataIndex: "id",
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Title is required",
          },
        ],
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        pending: {
          text: "Pending",
          status: "Pending",
        },
        "in-progress": {
          text: "In Progress",
          status: "In Progress",
        },
        completed: {
          text: "Completed",
          status: "Completed",
        },
      },
      renderText: (text: "pending" | "in-progress" | "completed") => {
        return <StatusTag status={text} />;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Time (s)",
      dataIndex: "timer",
      valueType: "digit",
      sorter: true,
      hideInSearch: true,
      render: (x, task) => {
        return formatSeconds(task.timer);
      },
    },
    {
      title: "Assigned To ",
      dataIndex: "assignedTo",
      valueType: "select",
      render: (text, record) => {
        return record.expand?.assignedTo?.name;
      },
      fieldProps: {
        options: users,
        showSearch: true,
        style: { marginLeft: 8 },
      },
    },
    {
      title: "TimeLine",
      valueType: "dateRange",
      key: "timeline",
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startDate: value[0],
            endDate: value[1],
          };
        },
      },
    },
    {
      title: "Options",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            {
              key: "edit",
              name: "Edit",
              onClick: () => {
                action?.startEditable?.(record.id, record);
              },
              icon: <EditOutlined />,
            },
            {
              key: "view",
              name: "View",
              onClick: () => {
                setViewTask(record);
                setOpenViewTask(true);
              },
              icon: <EyeOutlined />,
            },
            {
              key: "delete",
              name: "Delete",
              icon: <DeleteOutlined />,
              onClick: () => {
                deleteTasks([record.id]);
              },
            },
          ]}
        >
          Operations
        </TableDropdown>,
      ],
    },
  ];

  return columns;
};

export default generateColumns;

```

### app/dashboard/tasks/page.tsx
```tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import generateColumns from "./generate-columns";
import TaskDrawer from "@/components/dashboard/task-drawer";
import {
  deleteTasks,
  fetchTasks,
  getAllUsers,
  updateTask,
} from "@/lib/api/requests";
import withDashLayout from "@/components/layouts/dashboard-layout/dashboard-layout";
import { useRealtime } from "@/contexts/realtime-context";

import type { TaskItem } from "@/types/api";

const Page = () => {
  const actionRef = useRealtime("todos");
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [viewTask, setViewTask] = useState<TaskItem>();
  const [openViewTask, setOpenViewTask] = useState<boolean>(false);
  const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <ProTable<TaskItem>
        columns={generateColumns({ users, setViewTask, setOpenViewTask })}
        scroll={{ x: 1200 }}
        actionRef={actionRef}
        cardBordered
        request={fetchTasks}
        editable={{
          type: "multiple",
          onSave: async (_, row, originalRow) => {
            const { status } = row;
            const { status: originalStatus } = originalRow;

            if (typeof status !== "string") {
              row.status = originalStatus;
            }

            await updateTask(row.id, row);
          },
          onDelete: async (_, row) => {
            await deleteTasks([row.id]);
          },
          deletePopconfirmMessage: "Are you sure you want to delete this task?",
        }}
        rowKey="id"
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                timeline: [values.startDate, values.endDate],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Button
              size="small"
              danger
              onClick={() => deleteTasks(selectedRowKeys as string[])}
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>
          );
        }}
        dateFormatter="string"
        headerTitle="Tasks"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateTask(true);
            }}
            type="primary"
          >
            New
          </Button>,
        ]}
      />

      <TaskDrawer
        variant="view"
        viewTask={viewTask}
        openViewTask={openViewTask}
        setViewTask={setViewTask}
        setOpenViewTask={setOpenViewTask}
      />
      <TaskDrawer
        variant="create"
        users={users}
        openCreateTask={openCreateTask}
        setOpenCreateTask={setOpenCreateTask}
      />
    </>
  );
};

export default withDashLayout(Page);

```

### app/dashboard/users/generate-columns.tsx
```tsx
"use client";

import { TableDropdown } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { User } from "@/types/api";
import {} from "@/lib/api/requests";
import { Tag } from "antd";

type generateColumnsProps = {};

// Generate columns for the task table
const generateColumns = (params: generateColumnsProps) => {
  const {} = params;
  const columns: ProColumns<User>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      dataIndex: "id",
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Name is required",
          },
        ],
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Username is required",
          },
        ],
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Email is required",
          },
        ],
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      valueType: "select",
      valueEnum: {
        admin: {
          text: "Admin",
        },
        developer: {
          text: "Developer",
        },
      },
      renderText: (text) => {
        return <Tag color={text === "admin" ? "red" : "blue"}>{text}</Tag>;
      },
    },
  ];

  return columns;
};

export default generateColumns;

```

### app/dashboard/users/page.tsx
```tsx
"use client";
import { ProTable } from "@ant-design/pro-components";
import generateColumns from "./generate-columns";
import { fetchUsers } from "@/lib/api/requests";
import withDashLayout from "@/components/layouts/dashboard-layout/dashboard-layout";

const Page = () => {
  return (
    <>
      <ProTable
        columns={generateColumns({})}
        scroll={{ x: 1200 }}
        cardBordered
        request={fetchUsers}
        rowKey="id"
        form={{
          syncToUrl: true,
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="Users"
      />
    </>
  );
};

export default withDashLayout(Page);

```

### components/layouts/basic-layout/basic-layout.tsx
```tsx
"use client";
import {
  PageContainer,
  ProConfigProvider,
  ProLayout,
} from "@ant-design/pro-components";
import { ConfigProvider, Dropdown, Grid, Flex } from "antd";
import React, { useState, useEffect } from "react";
import defaultProps from "./_defaultProps";
import enUS from "antd/locale/en_US";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Basic Layout only for auth pages like login and signup
 * @param param0  children
 * @returns
 */
const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();
  const screens = Grid.useBreakpoint();
  const [pathname, setPathname] = useState("/auth/login");

  useEffect(() => {
    setPathname(path);
  }, [path]);

  if (typeof document === "undefined") {
    return <div />;
  }

  return (
    <ConfigProvider locale={enUS}>
      <ProConfigProvider hashed={false}>
        <ProLayout
          {...defaultProps}
          location={{
            pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: "rgba(0,0,0,0.10)",
            },
          }}
          menuFooterRender={() => {
            return (
              <div
                style={{
                  textAlign: "center",
                  paddingBlockStart: 12,
                }}
              >
                <div>Tasker Made with love</div>
                <div>by Sarthak</div>
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <Link
              href={item.path || path}
              onClick={() => {
                setPathname(item.path || path);
              }}
            >
              {dom}
            </Link>
          )}
          fixSiderbar={true}
          layout="top"
          splitMenus={true}
          contentWidth="Fixed"
          menuProps={
            screens.md
              ? {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "auto",
                    minWidth: "100%",
                  },
                }
              : {}
          }
        >
          <PageContainer breadcrumb={{ itemRender: () => null }} title={false}>
            <Flex
              justify="center"
              align="center"
              style={{ minHeight: "calc(100vh - 150px)" }}
            >
              {children}
            </Flex>
          </PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </ConfigProvider>
  );
};

/**
 * HOC to wrap a component with BasicLayout
 * @param Component
 * @returns
 */
const withBasicLayout = (Component: React.FC) => {
  const WrappedComponent: React.FC = () => (
    <BasicLayout>
      <Component />
    </BasicLayout>
  );
  return WrappedComponent;
};

export default withBasicLayout;

export { BasicLayout };

```

### components/layouts/basic-layout/_defaultProps.tsx
```tsx
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-components";

// This only includes the routes for the auth pages like login and signup and not the main app routes like dashboard
const config: ProLayoutProps = {
  title: "Tasker",
  route: {
    path: "/",
    routes: [
      {
        path: "auth/login",
        name: "Login",
        icon: <LoginOutlined />,
      },
      {
        path: "auth/sign-up",
        name: "SignUp",
        icon: <UserAddOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default config;

```

### components/layouts/dashboard-layout/dashboard-layout.tsx
```tsx
"use client";
import {
  PageContainer,
  ProConfigProvider,
  ProLayout,
} from "@ant-design/pro-components";
import { ConfigProvider, Dropdown, Grid, Flex, message } from "antd";
import React, { useState, useEffect } from "react";
import defaultProps from "./_defaultProps";
import enUS from "antd/locale/en_US";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import pb from "@/lib/pocketbase/pocketbase";
import { AuthModel } from "pocketbase";
import { removeCookie } from "@/lib/utils";

/**
 * Dash Layout only for the main app pages like dashboard
 * @param param0  children
 * @returns
 */
const DashLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();
  const [pathname, setPathname] = useState("/auth/login");
  const [user, setUser] = useState<AuthModel>();

  useEffect(() => {
    setPathname(path);
    if (pb.authStore.model) setUser(pb.authStore.model);
  }, [path]);

  if (typeof document === "undefined") {
    return <div />;
  }

  return (
    <ConfigProvider locale={enUS}>
      <ProConfigProvider hashed={false}>
        <ProLayout
          {...defaultProps}
          location={{
            pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: "rgba(0,0,0,0.10)",
            },
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return null;

            return (
              <div
                style={{
                  textAlign: "center",
                  paddingBlockStart: 12,
                }}
              >
                <div>Tasker Made with love</div>
                <div>by Sarthak</div>
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <Link
              href={item.path || path}
              onClick={() => {
                setPathname(item.path || path);
              }}
            >
              {dom}
            </Link>
          )}
          layout="mix"
          avatarProps={{
            src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
            size: "small",
            title: user?.username ?? "User",
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "settings",
                        icon: <SettingOutlined />,
                        label: "Settings",
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: "LogOut",
                        onClick: () => {
                          message.loading("Logging you out...", () => {
                            pb.authStore.clear();
                            removeCookie("pb_auth");
                            window.location.reload();
                            message.success("Logged out!");
                          });
                        },
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
        >
          <PageContainer>{children}</PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </ConfigProvider>
  );
};

/**
 * HOC to wrap a component with DashLayout
 * @param Component
 * @returns
 */
const withDashLayout = (Component: React.FC) => {
  const WrappedComponent: React.FC = () => (
    <DashLayout>
      <Component />
    </DashLayout>
  );
  return WrappedComponent;
};

export default withDashLayout;

export { DashLayout };

```

### components/layouts/dashboard-layout/_defaultProps.tsx
```tsx
import pb from "@/lib/pocketbase/pocketbase";
import {
  UnorderedListOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-components";

// This only includes the routes for the auth pages like login and signup and not the main app routes like dashboard
const config: ProLayoutProps = {
  title: "Tasker",
  route: {
    path: "/dashboard",
    routes: [
      {
        path: "/dashboard/tasks",
        name: "Tasks",
        icon: <UnorderedListOutlined />,
      },
      pb.authStore.model?.role === "admin" && {
        path: "/dashboard/users",
        name: "Users",
        icon: <UserOutlined />,
      },
      {
        path: "/dashboard/settings",
        name: "Settings",
        icon: <SettingOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default config;

```

### app/api/auth/validation/route.ts
```typescript
import { type NextRequest } from "next/server";
import pb from "@/lib/pocketbase/pocketbase";
import { PB_ADMIN_TOKEN } from "@/lib/conts";

const generateFilter = (username?: string, email?: string) => {
  const filterObj: Record<string, string> = {
    filter: username
      ? `username='${username}'`
      : email
      ? `email='${email}'`
      : "",
    requestKey: username ? username : email ? email : "generic",
  };

  if (filterObj.filter === "") {
    delete filterObj.filter;
  }

  return filterObj;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    // Save the admin token to the auth store
    pb.authStore.save(PB_ADMIN_TOKEN!);

    if (!username && !email) {
      return Response.json({
        success: false,
        message: "Please provide a username or email to check availability",
      });
    }

    const records = await pb
      .collection("users")
      .getFullList(200, generateFilter(username as string, email as string));

    if (records.length === 0) {
      return Response.json({ success: true, message: "User not found" });
    }

    return Response.json({ success: false, message: "User found" });
  } catch (error) {
    return Response.json({ success: false, message: error?.toString() });
  } finally {
    // Clear the auth store after the request is completed to prevent token leakage
    pb.authStore.clear();
  }
}

```
