import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onNavigateToCalculation }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="homepage"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="hero-section"
        variants={itemVariants}
        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
      >
        {/* Welcome Message */}
        <motion.div
          variants={itemVariants}
          style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}
        >
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)'
          }}>
            Welcome to Professional Forecasting
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            maxWidth: '700px',
            margin: '0 auto',
            marginBottom: 'var(--space-8)'
          }}>
            Transform your sales data into actionable insights with our advanced forecasting system. 
            Perfect for educational and professional use.
          </p>
          
          {/* CTA Button */}
          <motion.button
            className="btn btn-primary"
            onClick={onNavigateToCalculation}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontSize: '1.3rem',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: '600',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            🚀 Start Forecasting
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features Preview */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-8)'
        }}
      >
        <motion.div
          className="feature-preview"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: 'var(--bg-card)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-3)'
          }}>
            📊
          </div>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            Advanced Analytics
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            Powerful forecasting algorithms with detailed step-by-step calculations
          </p>
        </motion.div>

        <motion.div
          className="feature-preview"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: 'var(--bg-card)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-3)'
          }}>
            📈
          </div>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            Interactive Charts
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            Beautiful visualizations with multiple chart types and export options
          </p>
        </motion.div>

        <motion.div
          className="feature-preview"
          whileHover={{ scale: 1.02, y: -3 }}
          style={{
            background: 'var(--bg-card)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-3)'
          }}>
            🎓
          </div>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            Educational Focus
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            Perfect for learning forecasting concepts and professional development
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;