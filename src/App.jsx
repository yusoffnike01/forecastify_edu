import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import CalculationPage from './components/Calculation/CalculationPage';
import HelpScreen from './components/Help/HelpScreen';
import ProtectedRoute from './components/ProtectedRoute';
import SessionTimer from './components/SessionTimer';
import { TypingText, FadeUpText } from './components/AnimatedText';
import UserManagement from './components/UserManagement/UserManagement';
import ProductManagement from './components/ProductManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signOutUser } from './firebase/auth';
import { getUserRole } from './firebase/roles';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const { currentUser } = useAuth();

  // Fetch user role when user changes
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser?.email) {
        try {
          const result = await getUserRole(currentUser.email);
          if (result.success) {
            setUserRole(result.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('student'); // Default to student on error
        }
      } else {
        setUserRole('student'); // Default for no user
      }
    };
    
    fetchUserRole();
  }, [currentUser]);

  // Auto-redirect authenticated users to calculation page
  useEffect(() => {
    if (currentUser && currentPage === 'home') {
      setCurrentPage('calculation');
    } else if (!currentUser && currentPage !== 'home' && currentPage !== 'help') {
      setCurrentPage('home');
    }
  }, [currentUser]);

  // Redirect non-admin users away from admin pages
  useEffect(() => {
    if (userRole !== 'admin' && (currentPage === 'products' || currentPage === 'users')) {
      setCurrentPage('calculation');
    }
  }, [userRole, currentPage]);

  // Navigation handler with authentication check
  const handleNavigateToCalculation = () => {
    if (!currentUser) {
      // User is not authenticated, stay on home page
      // The landing page should handle showing sign-in modal
      return;
    }
    setCurrentPage('calculation');
  };

  // Additional protection: prevent direct page setting without authentication or proper role
  const safeSetCurrentPage = (page) => {
    if ((page === 'calculation' || page === 'products' || page === 'users') && !currentUser) {
      // Force stay on home page if trying to access protected pages without auth
      setCurrentPage('home');
      return;
    }
    
    // Additional check for admin-only pages
    if ((page === 'products' || page === 'users') && userRole !== 'admin') {
      // Redirect non-admin users to calculation page
      setCurrentPage('calculation');
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
      {/* Header - Show on calculation, products, users and help pages */}
      {(currentPage === 'calculation' || currentPage === 'products' || currentPage === 'users' || currentPage === 'help') && (
        <motion.header 
          className="app-header"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '1rem 2rem',
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
                  objectFit: 'contain'
                }}
              />
              <div>
                <TypingText 
                  text="FORECASTIFY EDU" 
                  className="app-title"
                  style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: '#1a202c',
                    marginBottom: '2px'
                  }}
                />
                <FadeUpText 
                  text="Educational Supply Chain Forecasting System" 
                  className="app-subtitle"
                  delay={1.2}
                  style={{
                    fontSize: '0.8rem',
                    color: '#4a5568',
                    opacity: 0.9
                  }}
                />
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Forecasting Button with User Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.button
                  onClick={() => setCurrentPage('calculation')}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentPage === 'calculation' ? '#1a202c' : '#4a5568',
                    textDecoration: 'none',
                    fontWeight: currentPage === 'calculation' ? '600' : '500',
                    fontSize: '0.95rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  Forecasting
                </motion.button>
                
                {/* User Email Display */}
                {currentUser && (
                  <motion.div
                    className="user-email-display"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: userRole === 'admin' 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'white',
                      boxShadow: userRole === 'admin'
                        ? '0 2px 8px rgba(245, 158, 11, 0.3)'
                        : '0 2px 8px rgba(74, 85, 104, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'default',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Background shine effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: userRole === 'admin' ? 'shine 3s ease-in-out infinite' : 'none'
                    }} />
                    
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      style={{ fontSize: '14px', zIndex: 1 }}
                    >
                      {userRole === 'admin' ? '👑' : '👤'}
                    </motion.span>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '2px',
                      zIndex: 1
                    }}>
                      <span style={{ 
                        maxWidth: '140px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {currentUser.email}
                      </span>
                      {userRole === 'admin' && (
                        <span style={{
                          fontSize: '0.65rem',
                          opacity: 0.9,
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Admin
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {userRole === 'admin' && (
                <motion.button
                  onClick={() => setCurrentPage('products')}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentPage === 'products' ? '#1a202c' : '#4a5568',
                    textDecoration: 'none',
                    fontWeight: currentPage === 'products' ? '600' : '500',
                    fontSize: '0.95rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  Products
                </motion.button>
              )}

              {userRole === 'admin' && (
                <motion.button
                  onClick={() => setCurrentPage('users')}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentPage === 'users' ? '#1a202c' : '#4a5568',
                    textDecoration: 'none',
                    fontWeight: currentPage === 'users' ? '600' : '500',
                    fontSize: '0.95rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  User Management
                </motion.button>
              )}

              <motion.button
                onClick={() => setCurrentPage('help')}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentPage === 'help' ? '#1a202c' : '#4a5568',
                  textDecoration: 'none',
                  fontWeight: currentPage === 'help' ? '600' : '500',
                  fontSize: '0.95rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Help
              </motion.button>

              {/* Divider */}
              <div style={{
                width: '1px',
                height: '30px',
                background: 'rgba(0, 0, 0, 0.1)',
                margin: '0 8px'
              }} />

              {/* Logout Button */}
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
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

            {/* Mobile Menu Button */}
            <motion.button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#4a5568'
              }}
            >
              ☰
            </motion.button>
          </div>
        </motion.header>
      )}

      {/* Mobile Menu Overlay */}
      {(currentPage === 'calculation' || currentPage === 'products' || currentPage === 'users' || currentPage === 'help') && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                display: 'none'
              }}
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '280px',
                  height: '100vh',
                  background: 'white',
                  boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
                  padding: '80px 0 2rem 0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Menu Items */}
                <div style={{ padding: '0 2rem' }}>
                  {/* User Info Display */}
                  {currentUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        padding: '16px',
                        margin: '0 0 20px 0',
                        background: userRole === 'admin' 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        fontSize: '24px',
                        marginBottom: '8px'
                      }}>
                        {userRole === 'admin' ? '👑' : '👤'}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        wordBreak: 'break-word',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}>
                        {currentUser.email}
                      </div>
                      {userRole === 'admin' && (
                        <div style={{
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          opacity: 0.9,
                          background: 'rgba(255, 255, 255, 0.2)',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}>
                          Admin
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  <motion.button
                    onClick={() => {
                      setCurrentPage('calculation');
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 8 }}
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      fontWeight: currentPage === 'calculation' ? '600' : '500',
                      color: currentPage === 'calculation' ? '#667eea' : '#4a5568',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    📊 Forecasting
                  </motion.button>

                  {userRole === 'admin' && (
                    <motion.button
                      onClick={() => {
                        setCurrentPage('products');
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ x: 8 }}
                      style={{
                        width: '100%',
                        padding: '16px 0',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '1.1rem',
                        fontWeight: currentPage === 'products' ? '600' : '500',
                        color: currentPage === 'products' ? '#667eea' : '#4a5568',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      📦 Products
                    </motion.button>
                  )}

                  {userRole === 'admin' && (
                    <motion.button
                      onClick={() => {
                        setCurrentPage('users');
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ x: 8 }}
                      style={{
                        width: '100%',
                        padding: '16px 0',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '1.1rem',
                        fontWeight: currentPage === 'users' ? '600' : '500',
                        color: currentPage === 'users' ? '#667eea' : '#4a5568',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      👥 User Management
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => {
                      setCurrentPage('help');
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 8 }}
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      fontWeight: currentPage === 'help' ? '600' : '500',
                      color: currentPage === 'help' ? '#667eea' : '#4a5568',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    💡 Help
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 8 }}
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      color: '#dc2626',
                      cursor: 'pointer',
                      marginTop: '2rem'
                    }}
                  >
                    🚪 Logout
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <LandingPage 
              key="home"
              onNavigateToCalculation={handleNavigateToCalculation}
            />
          ) : currentPage === 'help' ? (
            <HelpScreen key="help" />
          ) : currentPage === 'products' ? (
            <ProtectedRoute>
              <ProductManagement key="products" />
            </ProtectedRoute>
          ) : currentPage === 'users' ? (
            <ProtectedRoute>
              <UserManagement key="users" />
            </ProtectedRoute>
          ) : (
            <ProtectedRoute>
              <CalculationPage key="calculation" />
            </ProtectedRoute>
          )}
        </AnimatePresence>
      </main>

      {/* Session Timer - Show on calculation, products and users pages */}
      {(currentPage === 'calculation' || currentPage === 'products' || currentPage === 'users') && <SessionTimer />}

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
