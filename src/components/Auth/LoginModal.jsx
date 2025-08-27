import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInUser, registerUser, resetPassword } from '../../firebase/auth';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin] = useState(true); // Always login mode (no registration)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (showForgotPassword) {
        // Handle password reset
        if (!formData.email) {
          setError('Please enter your email address');
          setIsLoading(false);
          return;
        }
        
        const result = await resetPassword(formData.email);
        if (result.success) {
          setSuccess('Password reset email sent! Check your inbox.');
          setShowForgotPassword(false);
        } else {
          setError(result.error);
        }
      } else if (isLogin) {
        // Handle login
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        
        const result = await signInUser(formData.email, formData.password);
        if (result.success) {
          onSuccess(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      } else {
        // Handle registration
        if (!formData.email || !formData.password || !formData.displayName) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
        
        const result = await registerUser(formData.email, formData.password, formData.displayName);
        if (result.success) {
          onSuccess(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
    setError('');
    setSuccess('');
    setShowForgotPassword(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(10px)'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: 'var(--space-4)',
            maxWidth: '320px',
            width: '80%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 'var(--space-4)',
              right: 'var(--space-4)',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: 'var(--space-2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <img 
              src="/images/logoforecastifyedu.jpeg" 
              alt="FORECASTIFY EDU Logo"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                objectFit: 'cover',
                margin: '0 auto var(--space-2)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
              }}
            />
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: 'var(--space-2)'
            }}>
              {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0
            }}>
              {showForgotPassword 
                ? 'Enter your email to reset your password' 
                : 'Sign in to access the SCM Dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: 'var(--space-2)'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '2px solid #e5e7eb',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password (not for forgot password) */}
            {!showForgotPassword && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 'var(--space-2)'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '2px solid #e5e7eb',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            )}


            {/* Error Message */}
            {error && (
              <div style={{
                padding: 'var(--space-3)',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-lg)',
                color: '#dc2626',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div style={{
                padding: 'var(--space-3)',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-lg)',
                color: '#16a34a',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {success}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading 
                ? 'Please wait...' 
                : showForgotPassword 
                  ? 'Send Reset Email' 
                  : 'Sign In'
              }
            </motion.button>

            {/* Footer Links */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
              {!showForgotPassword && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot your password?
                </button>
              )}
              
              {showForgotPassword && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ← Back to sign in
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
