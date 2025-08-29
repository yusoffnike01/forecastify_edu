import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import CalculationPage from './components/Calculation/CalculationPage';
import ProtectedRoute from './components/ProtectedRoute';
import SessionTimer from './components/SessionTimer';
import { TypingText, FadeUpText } from './components/AnimatedText';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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


  return (
      <div className="app">
      {/* Header - Only show on calculation page */}
      {currentPage === 'calculation' && (
        <motion.header 
          className="app-header"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="header-content">
            <div className="header-left">
              <TypingText 
                text="FORECASTIFY EDU" 
                className="app-title"
                style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px'
                }}
              />
              <FadeUpText 
                text="Educational Supply Chain Forecasting System" 
                className="app-subtitle"
                delay={1.2}
                style={{
                  fontSize: '0.9rem',
                  color: '#e3f2fd',
                  opacity: 0.9
                }}
              />
            </div>
            <div className="header-right">
              <motion.button
                className="back-button"
                onClick={() => setCurrentPage('home')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
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
                  className="arrow"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  ←
                </motion.span>
                Back to Home
              </motion.button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <LandingPage 
              key="home"
              onNavigateToCalculation={() => setCurrentPage('calculation')}
            />
          ) : (
            <CalculationPage key="calculation" />
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
