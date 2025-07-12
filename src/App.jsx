import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ToastContainer from './components/UI/Toast';
import MyQuestions from './pages/MyQuestions';

function App() {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        const newToast = { id, message, type };
        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="App">
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/question/:id" element={<QuestionDetail />} />
                            <Route path="/ask" element={<AskQuestion />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/my-questions" element={<MyQuestions />} />
                        </Routes>
                    </Layout>

                    <ToastContainer toasts={toasts} removeToast={removeToast} />
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 