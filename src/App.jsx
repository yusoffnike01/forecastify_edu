import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import CalculationPage from './components/Calculation/CalculationPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'calculation'


  return (
    <div className="app">
      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">FORECASTIFY EDU</h1>
            <p className="app-subtitle">Educational Sales Forecasting System</p>
          </div>
          <div className="header-right">
            {currentPage === 'calculation' && (
              <motion.button
                className="back-button"
                onClick={() => setCurrentPage('home')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="arrow">←</span>
                Back to Home
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

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

    </div>
  );
}

export default App;
