import { motion, AnimatePresence } from 'framer-motion';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { useAuth } from '../contexts/AuthContext';

const SessionTimer = () => {
  const { currentUser } = useAuth();
  const { formattedTime, showWarning, resetTimer, handleLogout } = useSessionTimeout(currentUser);

  if (!currentUser) return null;

  return (
    <>
      {/* Session Timer Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: showWarning 
            ? 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          border: `2px solid ${showWarning ? 'rgba(245, 101, 101, 0.3)' : 'rgba(255, 255, 255, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '140px'
        }}
      >
        <motion.div
          animate={showWarning ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: showWarning ? Infinity : 0, duration: 1 }}
          style={{ fontSize: '16px' }}
        >
          {showWarning ? '⚠️' : '⏰'}
        </motion.div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: showWarning ? 'white' : '#1a202c'
          }}>
            Session
          </div>
          <div style={{
            fontSize: '13px',
            color: showWarning ? 'rgba(255,255,255,0.9)' : '#4a5568',
            fontFamily: 'monospace',
            fontWeight: '700'
          }}>
            {formattedTime}
          </div>
        </div>
      </motion.div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: '3rem', marginBottom: '1rem' }}
              >
                ⚠️
              </motion.div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#e53e3e',
                marginBottom: '1rem'
              }}>
                Session Expiring Soon!
              </h3>
              
              <p style={{
                fontSize: '1rem',
                color: '#4a5568',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                Your session will expire in <strong style={{ color: '#e53e3e' }}>{formattedTime}</strong>.
                <br />
                Click "Continue" to extend your session.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  Continue Session
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(229, 62, 62, 0.1)',
                    color: '#e53e3e',
                    border: '2px solid rgba(229, 62, 62, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Logout Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SessionTimer;