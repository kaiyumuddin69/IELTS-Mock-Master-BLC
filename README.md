# IELTS Mock Test Platform

A complete computer-based IELTS practice platform built with React, Express, and Prisma.

## 🏗️ Architecture Overview

The platform follows a modern full-stack architecture designed for scalability and performance.

### 1. Frontend (React + Vite)
- **State Management**: React Hooks (useState, useEffect, useContext).
- **Styling**: Tailwind CSS for a modern, clean IELTS exam-style interface.
- **Animations**: Framer Motion for smooth transitions and layout animations.
- **Routing**: React Router for SPA navigation.
- **Exam Interface**: Split-screen layout using `react-resizable-panels`.

### 2. Backend (Node.js + Express)
- **API Design**: RESTful API endpoints for authentication, tests, results, and batches.
- **Authentication**: JWT-based secure auth with role-based access control (RBAC).
- **ORM**: Prisma for type-safe database interactions.
- **Middleware**: Express middleware for authentication and role verification.

### 3. Database (PostgreSQL / SQLite)
- **Users**: Stores student and admin profiles.
- **Tests**: Stores test metadata, duration, and content (passages, audio URLs).
- **Questions**: Stores question structure and correct answers in JSON format.
- **Results**: Stores student submissions, raw scores, band scores, and feedback.
- **Batches**: Allows grouping students into courses or sessions.

### 4. IELTS Question Engine
- **Generic Scoring**: A flexible scoring engine that handles 10+ question types.
- **JSON Structure**: Questions are stored as dynamic JSON objects, allowing for complex IELTS tasks like Map Labeling or Matching.

### 5. Security & Anti-Cheat
- **Tab-Switch Detection**: Monitors `visibilitychange` to warn students against switching tabs.
- **Auto-Save**: Periodically saves student answers to local storage and the database to prevent data loss.
- **JWT Protection**: All sensitive endpoints are protected by JWT tokens.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Database Setup**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
3. **Seed Data**:
   ```bash
   npx tsx seed.ts
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
5. **Open in Browser**:
   Navigate to `http://localhost:3000`

## 📊 ER Diagram (Textual)

- **User** (1) ---- (N) **Result**
- **Test** (1) ---- (N) **Question**
- **Test** (1) ---- (N) **Result**
- **Batch** (1) ---- (N) **User**

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, tsx.
- **Database**: Prisma, SQLite (Dev) / PostgreSQL (Prod).
- **Tools**: Axios, JWT, bcryptjs.
