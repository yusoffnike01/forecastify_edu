import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText, { TypingText, FadeUpText, ScaleInText } from './AnimatedText';
import { signInWithEmail, signInWithGoogle, signOutUser, resetPassword } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = ({ onNavigateToCalculation }) => {
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authError, setAuthError] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const { currentUser, userData } = useAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        setAuthError('');

        try {
            const result = await signInWithEmail(email, password);

            if (result.success) {
                setShowSignInModal(false);
                setEmail('');
                setPassword('');
                // Optional: Show success message or redirect
            } else {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsSigningIn(true);
        setAuthError('');

        try {
            const result = await signInWithGoogle();

            if (result.success) {
                setShowSignInModal(false);
                // Optional: Show success message or redirect
            } else {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsResettingPassword(true);
        setAuthError('');
        setResetMessage('');

        try {
            const result = await resetPassword(resetEmail);

            if (result.success) {
                setResetMessage('Password reset email sent! Check your inbox.');
                setResetEmail('');
                // Auto close modal after 3 seconds
                setTimeout(() => {
                    setShowForgotPasswordModal(false);
                    setResetMessage('');
                }, 3000);
            } else {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError('An unexpected error occurred. Please try again.');
        } finally {
            setIsResettingPassword(false);
        }
    };

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
        <>
            <div style={{
                minHeight: '100vh',
                background: '#ffffff',
                color: '#1a202c'
            }}>

                {/* Navigation Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        padding: '1rem 2rem'
                    }}
                >
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                                src="/images/logoforecastifyedu.jpeg"
                                alt="Forecastify EDU Logo"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    objectFit: 'contain'
                                }}
                            />
                            <div>
                                <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#1a202c' }}>
                                    Forecastify
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="desktop-nav" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem'
                        }}>
                            <a href="#home" style={{
                                color: '#4a5568',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '15px'
                            }}>
                                Home
                            </a>
                            <a href="#features" style={{
                                color: '#4a5568',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '15px'
                            }}>
                                Features
                            </a>
                            <a href="#about" style={{
                                color: '#4a5568',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '15px'
                            }}>
                                About
                            </a>

                            {currentUser ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '1rem' }}>
                                    <div style={{
                                        padding: '8px 16px',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        color: '#667eea',
                                        fontWeight: '500'
                                    }}>
                                        👋 {userData?.displayName || currentUser.email}
                                    </div>
                                    <motion.button
                                        onClick={async () => await signOutUser()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#dc2626',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Logout
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={() => setShowSignInModal(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                                        marginLeft: '1rem'
                                    }}
                                >
                                    Sign In
                                </motion.button>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            style={{
                                display: 'none',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ☰
                        </button>
                    </div>
                </motion.header>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: '80px',
                                left: 0,
                                right: 0,
                                zIndex: 40,
                                background: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(20px)',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                padding: '1rem 2rem'
                            }}
                        >
                            <motion.nav
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                <a href="#home" onClick={() => setIsMobileMenuOpen(false)} style={{
                                    color: '#4a5568',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    Home
                                </a>
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} style={{
                                    color: '#4a5568',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    Features
                                </a>
                                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} style={{
                                    color: '#4a5568',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    About
                                </a>

                                {currentUser ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        paddingTop: '12px'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: '#667eea',
                                            fontWeight: '500',
                                            textAlign: 'center'
                                        }}>
                                            👋 {userData?.displayName || currentUser.email}
                                        </div>
                                        <motion.button
                                            onClick={async () => {
                                                await signOutUser();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#dc2626',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Logout
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.button
                                        onClick={() => {
                                            setShowSignInModal(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                                            marginTop: '12px'
                                        }}
                                    >
                                        Sign In
                                    </motion.button>
                                )}
                            </motion.nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Section */}
                <motion.section
                    id="home"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        paddingTop: '70px',
                        paddingBottom: '80px',
                        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>


                        {/* Logo Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 100 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '1.2rem'
                            }}
                        >
                            <motion.img
                                src="/images/logoforecastifyedu-remove.png"
                                alt="Forecastify EDU - Educational Supply Chain Forecasting"
                                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    width: '220px',
                                    height: '220px',
                                    objectFit: 'contain'
                                }}
                            />
                        </motion.div>

                        <div style={{ marginBottom: '1rem' }}>
                            <AnimatedText
                                text="Welcome to Fundamentals of"
                                style={{
                                    fontSize: 'clamp(1.3rem, 4.5vw, 3.2rem)',
                                    fontWeight: '700',
                                    lineHeight: '1.1',
                                    background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '0.4rem'
                                }}
                            />
                            <br />
                            <FadeUpText
                                text="Supply Chain Management Forecast"
                                delay={1.2}
                                style={{
                                    fontSize: 'clamp(1.3rem, 4.5vw, 3.2rem)',
                                    fontWeight: '700',
                                    lineHeight: '1.1',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.02em'
                                }}
                            />
                        </div>

                        <FadeUpText
                            text="Complete supply chain forecasting platform with multi-currency support, product management, user administration, and advanced analytics. Built for educators, students, and professionals who demand excellence."
                            delay={1.8}
                            style={{
                                fontSize: '1.1rem',
                                color: '#4a5568',
                                lineHeight: '1.7',
                                maxWidth: '650px',
                                margin: '0 auto 2.5rem',
                                fontWeight: '400'
                            }}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.4, duration: 0.8 }}
                            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                            <motion.button
                                onClick={() => {
                                    if (currentUser) {
                                        onNavigateToCalculation();
                                    } else {
                                        setShowSignInModal(true);
                                    }
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.6, duration: 0.6 }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -2,
                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                    minWidth: '160px',
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                {currentUser ? 'Go to Dashboard →' : 'Start Free Trial →'}
                            </motion.button>

                            <motion.button
                                onClick={() => window.open('https://youtu.be/Lpp9bHtPAN0?si=YFKvDLVPi69iLKlF', '_blank')}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.8, duration: 0.6 }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -1,
                                    borderColor: '#667eea',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'white',
                                    color: '#4a5568',
                                    border: '2px solid #e2e8f0',
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    minWidth: '160px',
                                    width: '100%',
                                    maxWidth: '300px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Learn Theory
                            </motion.button>
                        </motion.div>

                        {/* Hero Image Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 3.2, duration: 1, ease: "easeOut" }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)'
                            }}
                            style={{
                                marginTop: 'clamp(2rem, 5vw, 4rem)',
                                background: 'white',
                                borderRadius: 'clamp(16px, 3vw, 24px)',
                                padding: 'clamp(1rem, 3vw, 2rem)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 3.6, duration: 0.8 }}
                                style={{
                                    borderRadius: 'clamp(12px, 2vw, 16px)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <img 
                                    src="/images/Gemini_Generated_Image.png"
                                    alt="Supply Chain Dashboard Preview"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 'clamp(200px, 50vw, 400px)',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        borderRadius: 'clamp(12px, 2vw, 16px)'
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Stats Section */}
                <section style={{
                    padding: 'clamp(2rem, 5vw, 4rem) 1rem',
                    background: 'white',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: 'clamp(1.5rem, 4vw, 3rem)',
                            padding: '0 1rem'
                        }}>
                            {[
                                { number: '10K+', label: 'Active Users', icon: '👥' },
                                { number: '1', label: 'Universities', icon: '🎓' },
                                { number: '99.9%', label: 'Uptime', icon: '⚡' },
                                { number: '4.9/5', label: 'User Rating', icon: '⭐' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div style={{
                                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                        marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
                                    }}>
                                        {stat.icon}
                                    </div>
                                    <div style={{
                                        fontSize: 'clamp(2rem, 6vw, 3rem)',
                                        fontWeight: '800',
                                        color: '#1a202c',
                                        marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                                        lineHeight: '1.1'
                                    }}>
                                        {stat.number}
                                    </div>
                                    <div style={{
                                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                                        color: '#4a5568',
                                        fontWeight: '500',
                                        lineHeight: '1.3'
                                    }}>
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" style={{
                    padding: 'clamp(3rem, 8vw, 6rem) 1rem',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <AnimatedText
                                    text="Everything you need for"
                                    style={{
                                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                        fontWeight: '800',
                                        color: '#1a202c',
                                        lineHeight: '1.2',
                                        marginBottom: '0.5rem'
                                    }}
                                />
                                <br />
                                <FadeUpText
                                    text="Supply Chain Forecasting"
                                    delay={1.5}
                                    style={{
                                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                        fontWeight: '800',
                                        lineHeight: '1.2',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                />
                            </div>
                            <FadeUpText
                                text="Comprehensive platform featuring product management, multi-currency conversion, user administration, and powerful analytics for complete supply chain mastery"
                                delay={2.2}
                                style={{
                                    fontSize: '1rem',
                                    color: '#4a5568',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                    lineHeight: '1.6'
                                }}
                            />
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'clamp(1rem, 3vw, 2rem)',
                            padding: '0 1rem'
                        }}>
                            {[
                                {
                                    icon: '📦',
                                    title: 'Product Management',
                                    description: 'Create and manage product collections with Firebase integration. Organize your inventory with streamlined name and description tracking.'
                                },
                                {
                                    icon: '💱',
                                    title: 'Multi-Currency Support',
                                    description: 'Convert forecasting results across 8 currencies with live exchange rates. Perfect for global supply chain operations and international planning.'
                                },
                                {
                                    icon: '👥',
                                    title: 'User Administration',
                                    description: 'Complete user management system with authentication, role-based access, and secure Firebase integration for educational institutions.'
                                },
                                {
                                    icon: '📊',
                                    title: 'Advanced Analytics',
                                    description: 'Interactive charts with mobile-responsive design, export capabilities, and detailed statistical analysis for comprehensive insights.'
                                },
                                {
                                    icon: '🎯',
                                    title: 'Professional UI',
                                    description: 'Modern, responsive interface with animated interactions, mobile optimization, and glassmorphism design elements.'
                                },
                                {
                                    icon: '📚',
                                    title: 'Educational Excellence',
                                    description: 'Comprehensive help documentation, step-by-step tutorials, and formula explanations designed for academic success.'
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -4 }}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(0, 0, 0, 0.05)',
                                        height: 'fit-content'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1.5rem',
                                        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        color: '#1a202c',
                                        marginBottom: '0.8rem'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#4a5568',
                                        lineHeight: '1.6',
                                        margin: 0
                                    }}>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section style={{
                    padding: 'clamp(3rem, 8vw, 6rem) 1rem',
                    background: 'white'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <AnimatedText
                                text="Loved by thousands worldwide"
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    fontWeight: '800',
                                    color: '#1a202c',
                                    marginBottom: '1rem'
                                }}
                            />
                            <FadeUpText
                                text="Join educators and students who trust Forecastify for supply chain education"
                                delay={1.8}
                                style={{
                                    fontSize: '1.2rem',
                                    color: '#4a5568',
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}
                            />
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'clamp(1rem, 3vw, 2rem)',
                            padding: '0 1rem'
                        }}>
                            {[
                                {
                                    text: "Forecastify has transformed how we teach supply chain forecasting. The step-by-step approach helps students grasp complex concepts easily.",
                                    author: "Anonymous Educator",
                                    avatar: "👩‍🏫"
                                },
                                {
                                    text: "As an educator, I love how it demonstrates real-world supply chain forecasting applications. My students now understand demand planning fundamentals!",
                                    author: "Anonymous Instructor",
                                    avatar: "👨‍🏫"
                                },
                                {
                                    text: "Perfect for learning supply chain forecasting techniques. The educational approach made it easy to understand inventory planning and demand forecasting.",
                                    author: "Anonymous Student",
                                    avatar: "👩‍🎓"
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{
                                        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⭐</span>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        color: '#1a202c',
                                        lineHeight: '1.7',
                                        marginBottom: '1.5rem',
                                        fontStyle: 'italic'
                                    }}>
                                        "{testimonial.text}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            fontSize: '2.5rem',
                                            background: 'white',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #e2e8f0'
                                        }}>
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1a202c' }}>
                                                {testimonial.author}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" style={{
                    padding: 'clamp(3rem, 8vw, 6rem) 1rem',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <AnimatedText
                                text="Meet Our Team"
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    fontWeight: '800',
                                    color: '#1a202c',
                                    marginBottom: '1rem'
                                }}
                            />
                            <FadeUpText
                                text="Dedicated lecturers from Politeknik Tuanku Sultanah Bahiyah bringing excellence in supply chain education"
                                delay={1.5}
                                style={{
                                    fontSize: '1.2rem',
                                    color: '#4a5568',
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    lineHeight: '1.7'
                                }}
                            />
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'clamp(1rem, 3vw, 2rem)',
                            marginTop: 'clamp(2rem, 4vw, 3rem)',
                            padding: '0 1rem'
                        }}>
                            {[
                                {
                                    name: 'Sharipah Khadijah Binti S.Hashim',
                                    title: 'Principal Lecturer',
                                    specialization: 'Commerce Department',
                                    image: '/images/sharifah.jpeg',
                                    email: 'sharipahkhadijah@ptsb.edu.my',
                                    description: 'Principal Lecturer in Commerce Department, with extensive research experience in Supply Chain Management and multiple fields.'
                                },
                                {
                                    name: 'Farizoh Binti Hamid',
                                    title: 'Senior Lecturer',
                                    specialization: 'Supply Chain Management & Forecasting',
                                    image: '/images/farizo.jpeg',
                                    description: 'Expert in supply chain fundamentals with over 10 years of experience in educational leadership.'
                                },
                                {
                                    name: 'Abdul Aziz Bin Ishak',
                                    title: 'Senior Lecturer',
                                    specialization: 'Commerce Department',
                                    image: '/images/aziz.jpeg',
                                    email: 'abaziz@ptsb.edu.my',
                                    description: 'Senior Lecturer in Commerce Department, with extensive research experience in Logistics, Distribution Management fields and supply chain management.'
                                },
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '2.5rem 2rem',
                                        textAlign: 'center',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        marginBottom: '1.5rem',
                                        background: member.image ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem auto',
                                        color: 'white',
                                        fontSize: '2.5rem',
                                        overflow: 'hidden'
                                    }}>
                                        {member.image ? (
                                            <img 
                                                src={member.image} 
                                                alt={member.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    objectPosition: 'center top'
                                                }}
                                            />
                                        ) : (
                                            member.avatar
                                        )}
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#1a202c',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {member.name}
                                    </h3>

                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {member.title}
                                    </div>

                                    <div style={{
                                        fontSize: '0.95rem',
                                        color: '#667eea',
                                        fontWeight: '500',
                                        marginBottom: '1rem'
                                    }}>
                                        {member.specialization}
                                    </div>

                                    {member.email && (
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#059669',
                                            fontWeight: '500',
                                            marginBottom: '1rem',
                                            textDecoration: 'none'
                                        }}>
                                            📧 {member.email}
                                        </div>
                                    )}

                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#4a5568',
                                        lineHeight: '1.6',
                                        margin: 0
                                    }}>
                                        {member.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            viewport={{ once: true }}
                            style={{
                                textAlign: 'center',
                                marginTop: '4rem',
                                padding: '2rem',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                marginBottom: '0.5rem'
                            }}>
                                Politeknik Tuanku Sultanah Bahiyah
                            </div>
                            <p style={{
                                color: '#4a5568',
                                fontSize: '1rem',
                                margin: 0
                            }}>
                                Excellence in Technical and Vocational Education
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={{
                    padding: 'clamp(3rem, 8vw, 6rem) 1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <ScaleInText
                                text="Ready to start forecasting?"
                                delay={0.2}
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    lineHeight: '1.2',
                                    color: 'white'
                                }}
                            />
                            <FadeUpText
                                text="Join thousands of educators and students who master supply chain forecasting fundamentals with Forecastify."
                                delay={0.8}
                                style={{
                                    fontSize: '1.2rem',
                                    marginBottom: '3rem',
                                    opacity: 0.9,
                                    lineHeight: '1.7',
                                    color: 'white'
                                }}
                            />

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                padding: '0 1rem'
                            }}>
                                <motion.button
                                    onClick={() => {
                                        if (currentUser) {
                                            onNavigateToCalculation();
                                        } else {
                                            setShowSignInModal(true);
                                        }
                                    }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'white',
                                        color: '#667eea',
                                        border: 'none',
                                        padding: '16px 32px',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        minWidth: '200px',
                                        width: '100%',
                                        maxWidth: '300px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    {currentUser ? 'Go to Dashboard →' : 'Sign In →'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer style={{
                    background: '#1a202c',
                    color: 'white',
                    padding: 'clamp(1.5rem, 4vw, 2rem)'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '2rem',
                            marginBottom: '1.5rem'
                        }}>
                            {/* Logo and Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src="/images/logoforecastifyedu.jpeg"
                                    alt="Forecastify EDU Logo"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        objectFit: 'contain'
                                    }}
                                />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
                                    Forecastify
                                </h3>
                            </div>

                            {/* Quick Links */}
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <a href="#features" style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.2s ease'
                                }}>
                                    Features
                                </a>
                                <a href="#about" style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.2s ease'
                                }}>
                                    About Us
                                </a>
                                <a href="#" style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.2s ease'
                                }}>
                                    Contact
                                </a>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingTop: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <p style={{ opacity: 0.7, margin: 0, fontSize: '13px', marginBottom: '2px' }}>
                                    © {new Date().getFullYear()} Forecastify. All rights reserved.
                                </p>
                                <p style={{ opacity: 0.6, margin: 0, fontSize: '12px' }}>
                                    Developed by Politeknik Tuanku Sultanah Bahiyah
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <a href="#" style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    transition: 'color 0.2s ease'
                                }}>
                                    Privacy Policy
                                </a>
                                <a href="#" style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    transition: 'color 0.2s ease'
                                }}>
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Sign In Modal */}
            <AnimatePresence>
                {showSignInModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSignInModal(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '3rem',
                                width: '100%',
                                maxWidth: '480px',
                                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <img
                                    src="/images/logoforecastifyedu.jpeg"
                                    alt="Forecastify EDU Logo"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        objectFit: 'contain',
                                        margin: '0 auto 1.5rem'
                                    }}
                                />
                                <h2 style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: '#1a202c',
                                    margin: '0 0 0.5rem 0'
                                }}>
                                    Welcome back
                                </h2>
                                <p style={{ color: '#4a5568', margin: 0, fontSize: '16px' }}>
                                    Sign in to continue to Forecastify
                                </p>
                            </div>

                            <form onSubmit={handleSignIn}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1a202c',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1a202c',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                {/* Error Message */}
                                {authError && (
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: '#dc2626',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        marginBottom: '1rem',
                                        border: '1px solid rgba(239, 68, 68, 0.2)'
                                    }}>
                                        {authError}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <motion.button
                                        type="submit"
                                        disabled={isSigningIn}
                                        whileHover={{ scale: isSigningIn ? 1 : 1.02 }}
                                        whileTap={{ scale: isSigningIn ? 1 : 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: isSigningIn
                                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: isSigningIn ? 'not-allowed' : 'pointer',
                                            opacity: isSigningIn ? 0.7 : 1
                                        }}
                                    >
                                        {isSigningIn ? 'Signing in...' : 'Sign in'}
                                    </motion.button>

                                    {/* Forgot Password Link */}
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setShowSignInModal(false);
                                            setShowForgotPasswordModal(true);
                                            setAuthError('');
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: 'transparent',
                                            color: '#667eea',
                                            border: 'none',
                                            padding: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Forgot your password?
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        onClick={() => setShowSignInModal(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            color: '#4a5568',
                                            border: '2px solid #e2e8f0',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>

                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowForgotPasswordModal(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '3rem',
                                width: '100%',
                                maxWidth: '480px',
                                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <img
                                    src="/images/logoforecastifyedu.jpeg"
                                    alt="Forecastify EDU Logo"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        objectFit: 'contain',
                                        margin: '0 auto 1.5rem'
                                    }}
                                />
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#1a202c',
                                    margin: '0 0 0.5rem'
                                }}>
                                    Reset Password
                                </h2>
                                <p style={{
                                    color: '#4a5568',
                                    fontSize: '1rem',
                                    margin: 0
                                }}>
                                    Enter your email to receive a password reset link
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1a202c',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>

                                {/* Success Message */}
                                {resetMessage && (
                                    <div style={{
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        color: '#16a34a',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        marginBottom: '1rem',
                                        border: '1px solid rgba(34, 197, 94, 0.2)'
                                    }}>
                                        {resetMessage}
                                    </div>
                                )}

                                {/* Error Message */}
                                {authError && (
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: '#dc2626',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        marginBottom: '1rem',
                                        border: '1px solid rgba(239, 68, 68, 0.2)'
                                    }}>
                                        {authError}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <motion.button
                                        type="submit"
                                        disabled={isResettingPassword}
                                        whileHover={{ scale: isResettingPassword ? 1 : 1.02 }}
                                        whileTap={{ scale: isResettingPassword ? 1 : 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: isResettingPassword
                                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: isResettingPassword ? 'not-allowed' : 'pointer',
                                            opacity: isResettingPassword ? 0.7 : 1
                                        }}
                                    >
                                        {isResettingPassword ? 'Sending...' : 'Send Reset Email'}
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPasswordModal(false);
                                            setShowSignInModal(true);
                                            setAuthError('');
                                            setResetMessage('');
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            color: '#4a5568',
                                            border: '2px solid #e2e8f0',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Back to Sign In
                                    </motion.button>
                                </div>

                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingPage;