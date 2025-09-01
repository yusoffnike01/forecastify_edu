import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
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

// Sign in with email and password (with invitation handling)
export const signInWithEmail = async (email, password) => {
  try {
    // First, check if this is a user invitation trying to log in for the first time
    // Check both 'users' collection (old system) and 'user_data' collection (new system)
    
    // Check old users collection
    const usersCollection = collection(db, 'users');
    const invitationQuery = query(
      usersCollection, 
      where('email', '==', email),
      where('status', '==', 'invited'),
      where('tempPassword', '==', password)
    );
    const invitationSnapshot = await getDocs(invitationQuery);
    
    // Check new user_data collection
    const userDataCollection = collection(db, 'user_data');
    const userDataQuery = query(
      userDataCollection,
      where('email', '==', email),
      where('status', '==', 'awaiting_registration'),
      where('initialPassword', '==', password)
    );
    const userDataSnapshot = await getDocs(userDataQuery);
    
    if (!invitationSnapshot.empty) {
      // This is a first-time login from old invitation system
      console.log('🎯 Processing user invitation for first login...');
      
      const invitationDoc = invitationSnapshot.docs[0];
      const invitationData = invitationDoc.data();
      
      // Create the actual Firebase Auth user
      const authResult = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = authResult.user;
      
      // Update the user profile
      await updateProfile(newUser, {
        displayName: invitationData.displayName
      });
      
      // Update the Firestore document with real UID and activate account
      const realUserData = {
        uid: newUser.uid,
        email: email,
        displayName: invitationData.displayName,
        role: invitationData.role,
        institution: invitationData.institution,
        status: 'active', // Activate the account
        invitedBy: invitationData.invitedBy,
        invitedAt: invitationData.invitedAt,
        createdAt: new Date(),
        lastLogin: new Date(),
        activatedAt: new Date()
      };
      
      // Delete the temporary invitation document
      await deleteDoc(doc(db, 'users', invitationDoc.id));
      
      // Create the real user document with the Firebase Auth UID
      await setDoc(doc(db, 'users', newUser.uid), realUserData);
      
      console.log('✅ User invitation converted to active account');
      return { success: true, user: newUser, firstLogin: true };
    }
    
    if (!userDataSnapshot.empty) {
      // This is a first-time login from new user creation system
      console.log('🎯 Processing user data for first-time registration...');
      
      const userDataDoc = userDataSnapshot.docs[0];
      const userData = userDataDoc.data();
      
      // Create the actual Firebase Auth user
      const authResult = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = authResult.user;
      
      // Update the user profile
      await updateProfile(newUser, {
        displayName: userData.displayName
      });
      
      // Create the real user document with the Firebase Auth UID
      const realUserData = {
        uid: newUser.uid,
        email: email,
        displayName: userData.displayName,
        role: userData.role,
        institution: userData.institution || 'Politeknik Tuanku Sultanah Bahiyah',
        status: 'active',
        createdBy: userData.createdBy,
        createdByUid: userData.createdByUid,
        createdAt: userData.createdAt,
        activatedAt: new Date().toISOString(),
        lastLogin: new Date()
      };
      
      // Delete the temporary user_data document
      await deleteDoc(doc(db, 'user_data', userDataDoc.id));
      
      // Create the real user document with the Firebase Auth UID
      await setDoc(doc(db, 'users', newUser.uid), realUserData);
      
      console.log('✅ User data converted to active Firebase Auth account');
      return { success: true, user: newUser, firstLogin: true };
    }
    
    // Normal login for existing users
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Check if user account is deleted/disabled before allowing login
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // Block deleted/disabled users
      if (userData.status === 'deleted' || userData.isActive === false) {
        // Sign out immediately
        await signOut(auth);
        return { 
          success: false, 
          error: 'Your account has been deactivated. Please contact an administrator.' 
        };
      }
      
      // Update last login for active users
      await updateDoc(userDocRef, {
        lastLogin: new Date()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    // Check if error is due to user not existing in Firebase Auth
    if (error.code === 'auth/user-not-found') {
      // Maybe they're trying to use invitation credentials
      return { 
        success: false, 
        error: 'Invalid email or password. If you just received an invitation, make sure you use the exact email and password provided.'
      };
    }
    
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

// Register user (alias for signUpWithEmail for consistency)
export const registerUser = async (email, password, displayName, role = 'student') => {
  return await signUpWithEmail(email, password, displayName, role);
};

// Delete current user with reauthentication
export const deleteCurrentUserWithReauth = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user currently signed in' };
    }

    // Reauthenticate user before deletion
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // Delete user from Firestore first
    await deleteDoc(doc(db, 'users', user.uid));
    
    // Delete user from Firebase Auth
    await deleteUser(user);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting current user:', error);
    return { success: false, error: error.message };
  }
};

// Complete user cleanup (for admin use)
export const completeUserCleanup = async (email) => {
  try {
    console.log('Starting complete user cleanup for email:', email);
    
    // Delete from Firestore users collection
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(userDoc => 
      deleteDoc(doc(db, 'users', userDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('User data cleaned up from Firestore');
    
    // Note: Firebase Auth user deletion requires admin SDK or the user to be currently authenticated
    // This function handles the Firestore cleanup, auth deletion should be handled separately
    
    return { success: true, message: 'User data cleaned up from Firestore' };
  } catch (error) {
    console.error('Error in complete user cleanup:', error);
    return { success: false, error: error.message };
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};