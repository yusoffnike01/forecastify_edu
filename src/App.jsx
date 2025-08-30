import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import CalculationPage from './components/Calculation/CalculationPage';
import ProtectedRoute from './components/ProtectedRoute';
import SessionTimer from './components/SessionTimer';
import { TypingText, FadeUpText } from './components/AnimatedText';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signOutUser } from './firebase/auth';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { currentUser } = useAuth();

  // Auto-redirect authenticated users to calculation page
  useEffect(() => {
    if (currentUser) {
      setCurrentPage('calculation');
    } else {
      setCurrentPage('home');
    }
  }, [currentUser]);

  // Navigation handler with authentication check
  const handleNavigateToCalculation = () => {
    if (!currentUser) {
      // User is not authenticated, stay on home page
      // The landing page should handle showing sign-in modal
      return;
    }
    setCurrentPage('calculation');
  };

  // Additional protection: prevent direct page setting without authentication
  const safeSetCurrentPage = (page) => {
    if (page === 'calculation' && !currentUser) {
      // Force stay on home page if trying to access calculation without auth
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
      <div className="app">
      {/* Header - Only show on calculation page */}
      {currentPage === 'calculation' && (
        <motion.header 
          className="app-header"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '0 0 24px 24px',
            padding: '1rem 2rem',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }}>
            {/* Logo and Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.img
                src="/images/logoforecastifyedu.jpeg"
                alt="Forecastify EDU"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  objectFit: 'contain',
                  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
                }}
              />
              <div>
                <TypingText 
                  text="FORECASTIFY EDU" 
                  className="app-title"
                  style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '2px'
                  }}
                />
                <FadeUpText 
                  text="Educational Supply Chain Forecasting System" 
                  className="app-subtitle"
                  delay={1.2}
                  style={{
                    fontSize: '0.8rem',
                    color: '#e3f2fd',
                    opacity: 0.9
                  }}
                />
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <motion.a
                href="#dashboard"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f1f5f9' }}
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Dashboard
              </motion.a>
              
              <motion.a
                href="#analytics"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f1f5f9' }}
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Analytics
              </motion.a>

              <motion.a
                href="#reports"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f1f5f9' }}
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Reports
              </motion.a>

              <motion.a
                href="#help"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f1f5f9' }}
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Help
              </motion.a>

              {/* Divider */}
              <div style={{
                width: '1px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.3)',
                margin: '0 8px'
              }} />

              {/* Logout Button */}
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 8px 25px rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.span 
                  className="logout-icon"
                  animate={{ x: [-1, 0, -1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  🚪
                </motion.span>
                Logout
              </motion.button>
            </nav>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <LandingPage 
              key="home"
              onNavigateToCalculation={handleNavigateToCalculation}
            />
          ) : (
            <ProtectedRoute>
              <CalculationPage key="calculation" />
            </ProtectedRoute>
          )}
        </AnimatePresence>
      </main>

      {/* Session Timer - Only show when on calculation page */}
      {currentPage === 'calculation' && <SessionTimer />}

      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
