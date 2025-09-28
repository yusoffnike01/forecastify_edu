import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Simple sign in - just authenticate, no complex Firestore operations
export const signInSimple = async (email, password) => {
  try {
    console.log('🔐 Attempting simple sign in for:', email);
    
    // Try normal Firebase Auth sign in first
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    console.log('✅ Authentication successful');
    
    return { success: true, user };
  } catch (error) {
    console.error('❌ Sign in failed:', error);
    
    // More user-friendly error messages
    let friendlyMessage = error.message;
    
    switch (error.code) {
      case 'auth/user-not-found':
        friendlyMessage = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        friendlyMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        friendlyMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        friendlyMessage = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        friendlyMessage = 'Too many failed attempts. Please try again later';
        break;
      case 'permission-denied':
        friendlyMessage = 'Missing or insufficient permissions';
        break;
      default:
        // Keep original message for other errors
        break;
    }
    
    return { success: false, error: friendlyMessage };
  }
};

// Get user data after successful authentication
export const getUserDataAfterAuth = async (uid) => {
  try {
    console.log('📖 Fetching user data for UID:', uid);
    
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      console.log('✅ User data found');
      return { success: true, userData: userDoc.data() };
    } else {
      console.log('⚠️ No user data found, creating basic profile');
      
      // Create basic user document if it doesn't exist
      const basicUserData = {
        uid: uid,
        email: auth.currentUser?.email,
        displayName: auth.currentUser?.displayName || 'User',
        role: 'student',
        institution: 'Politeknik Tuanku Sultanah Bahiyah',
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', uid), basicUserData);
      
      return { success: true, userData: basicUserData };
    }
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogleSimple = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutSimple = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPasswordSimple = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen for authentication state changes
export const onAuthStateChangeSimple = (callback) => {
  return onAuthStateChanged(auth, callback);
};