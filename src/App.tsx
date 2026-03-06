
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService, testService } from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './components/student/StudentDashboard';
import InstructorPanel from './components/instructor/InstructorPanel';
import ExamPage from './pages/ExamPage';
import AdminDashboard from './pages/AdminDashboard';
import TestEditor from './pages/TestEditor';
import ResultDetailPage from './pages/ResultDetailPage';
import SubmissionReview from './pages/SubmissionReview';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const LandingPageWrapper = ({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) => {
  const navigate = useNavigate();
  return <LandingPage onLoginClick={() => navigate('/login')} onAuthSuccess={onAuthSuccess} />;
};

const LoginWrapper = ({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) => {
  const navigate = useNavigate();
  return <Login onAuthSuccess={onAuthSuccess} onBack={() => navigate('/')} />;
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [practiceTasks, setPracticeTasks] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [readingTests, setReadingTests] = useState<any[]>([]);
  const [listeningTests, setListeningTests] = useState<any[]>([]);
  const [writingTests, setWritingTests] = useState<any[]>([]);
  const [speakingTests, setSpeakingTests] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const tests = await testService.getTests();
      setReadingTests(tests.filter((t: any) => t.type === 'READING'));
      setListeningTests(tests.filter((t: any) => t.type === 'LISTENING'));
      setWritingTests(tests.filter((t: any) => t.type === 'WRITING'));
      
      const results = await testService.getMyResults();
      setUserResults(results);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    fetchData();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/login" element={<LoginWrapper onAuthSuccess={handleAuthSuccess} />} />
        
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard 
                user={user}
                practiceTasks={practiceTasks}
                userResults={userResults}
                readingTests={readingTests}
                listeningTests={listeningTests}
                writingTests={writingTests}
                speakingTests={speakingTests}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                newTaskDueDate={newTaskDueDate}
                setNewTaskDueDate={setNewTaskDueDate}
                handleAddTask={() => {}}
                toggleTask={() => {}}
                deleteTask={() => {}}
                isAddingTask={isAddingTask}
                startTest={(type, test) => window.location.href = `/exam/${test.id}`}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/tests/new" 
          element={
            <ProtectedRoute role="ADMIN">
              <TestEditor />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/review/:resultId" 
          element={
            <ProtectedRoute role="ADMIN">
              <SubmissionReview />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/result/:resultId" 
          element={
            <ProtectedRoute>
              <ResultDetailPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/exam/:testId" 
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
