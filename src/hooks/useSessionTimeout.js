import { useState, useEffect, useCallback } from 'react';
import { signOutUser } from '../firebase/auth';

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_START_KEY = 'forecastify_session_start';

export const useSessionTimeout = (user) => {
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const startNewSession = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(SESSION_START_KEY, now.toString());
    setTimeLeft(SESSION_DURATION);
    setShowWarning(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOutUser();
    localStorage.removeItem(SESSION_START_KEY);
    setIsActive(false);
    setTimeLeft(SESSION_DURATION);
    setShowWarning(false);
  }, []);

  const calculateTimeLeft = useCallback(() => {
    const sessionStart = localStorage.getItem(SESSION_START_KEY);
    if (!sessionStart) return SESSION_DURATION;
    
    const elapsed = Date.now() - parseInt(sessionStart);
    const remaining = SESSION_DURATION - elapsed;
    
    return remaining > 0 ? remaining : 0;
  }, []);

  useEffect(() => {
    if (user) {
      setIsActive(true);
      
      // Check if there's an existing session
      const existingSession = localStorage.getItem(SESSION_START_KEY);
      if (existingSession) {
        const remaining = calculateTimeLeft();
        if (remaining <= 0) {
          // Session expired, logout immediately
          handleLogout();
        } else {
          setTimeLeft(remaining);
        }
      } else {
        // Start new session
        startNewSession();
      }
    } else {
      setIsActive(false);
      localStorage.removeItem(SESSION_START_KEY);
      setTimeLeft(SESSION_DURATION);
      setShowWarning(false);
    }
  }, [user, startNewSession, handleLogout, calculateTimeLeft]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        const remaining = calculateTimeLeft();
        
        // Show warning when 5 minutes left
        if (remaining <= 5 * 60 * 1000 && remaining > 0) {
          setShowWarning(true);
        }
        
        // Auto logout when time expires
        if (remaining <= 0) {
          handleLogout();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, calculateTimeLeft, handleLogout]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    showWarning,
    resetTimer: startNewSession, // Renamed to allow manual session extension
    handleLogout
  };
};