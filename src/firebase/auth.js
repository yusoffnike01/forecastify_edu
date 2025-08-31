import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './config';

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName, role = 'student') => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update the user profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role, // Use the provided role
      institution: 'Politeknik Tuanku Sultanah Bahiyah',
      createdAt: new Date()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'student',
        institution: 'Politeknik Tuanku Sultanah Bahiyah',
        createdAt: new Date()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, userData: userDoc.data() };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete user from users collection by email
export const deleteUserFromFirestore = async (email) => {
  try {
    console.log('Deleting user from Firestore:', email); // Debug log
    
    // Query users collection to find user by email
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    // Delete all matching user documents
    const deletePromises = querySnapshot.docs.map(userDoc => 
      deleteDoc(doc(db, 'users', userDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('User deleted from Firestore successfully'); // Debug log
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user from Firestore:', error); // Debug log
    return { success: false, error: error.message };
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};