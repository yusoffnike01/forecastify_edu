import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth } from "./config";
import { logUserAction } from "./firestore";

// Sign in with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Log successful login
    await logUserAction({
      action: 'user_login',
      userId: user.uid,
      email: user.email,
      method: 'email_password'
    });
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
  } catch (error) {
    console.error("Sign in error:", error);
    
    // User-friendly error messages
    let errorMessage = "Login failed. Please try again.";
    if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email address.";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "This account has been disabled.";
    }
    
    return { success: false, error: errorMessage };
  }
};

// Register new user
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Log successful registration
    await logUserAction({
      action: 'user_register',
      userId: user.uid,
      email: user.email,
      displayName: displayName || null
    });
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    let errorMessage = "Registration failed. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "An account with this email already exists.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters long.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await logUserAction({
        action: 'user_logout',
        userId: user.uid,
        email: user.email
      });
    }
    
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out. Please try again." };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    
    let errorMessage = "Failed to send reset email. Please try again.";
    if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email address.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Please enter a valid email address.";
    }
    
    return { success: false, error: errorMessage };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};