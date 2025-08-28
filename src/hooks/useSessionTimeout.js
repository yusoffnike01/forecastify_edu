import { useState, useEffect, useCallback } from 'react';
import { signOutUser } from '../firebase/auth';

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useSessionTimeout = (user) => {
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(SESSION_DURATION);
    setShowWarning(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await signOutUser();
    setIsActive(false);
    setTimeLeft(SESSION_DURATION);
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (user) {
      setIsActive(true);
      resetTimer();
    } else {
      setIsActive(false);
      setTimeLeft(SESSION_DURATION);
      setShowWarning(false);
    }
  }, [user, resetTimer]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1000;
          
          // Show warning when 5 minutes left
          if (newTime <= 5 * 60 * 1000 && newTime > 0) {
            setShowWarning(true);
          }
          
          // Auto logout when time expires
          if (newTime <= 0) {
            handleLogout();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleLogout]);

  // Reset timer on user activity
  useEffect(() => {
    const resetOnActivity = () => {
      if (isActive) {
        resetTimer();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetOnActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetOnActivity, true);
      });
    };
  }, [isActive, resetTimer]);

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
    resetTimer,
    handleLogout
  };
};