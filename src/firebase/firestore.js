import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
// Remove ALL Firebase Auth imports to prevent any accidental auth operations
// import { 
//   createUserWithEmailAndPassword, 
//   deleteUser as deleteAuthUser,
//   getAuth,
//   signInWithEmailAndPassword,
//   signOut,
//   initializeAuth,
//   getApps,
//   initializeApp
// } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, auth } from './config';

// Get all users from Firestore (both active users and pending user data)
export const getAllUsers = async () => {
  try {
    console.log('Fetching all users from Firestore...');
    
    // Fetch active users from 'users' collection
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const activeUsers = usersSnapshot.docs
      .filter(doc => doc.data().status !== 'deleted') // Filter out deleted users
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || 'active',
        userType: 'active' // To distinguish from pending users
      }));
    
    // Fetch pending users from 'user_data' collection
    const userDataCollection = collection(db, 'user_data');
    const userDataSnapshot = await getDocs(userDataCollection);
    
    const pendingUsers = userDataSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      userType: 'pending' // To distinguish from active users
    }));
    
    // Combine both arrays
    const allUsers = [...activeUsers, ...pendingUsers];
    
    console.log(`Fetched users: ${activeUsers.length} active, ${pendingUsers.length} pending, ${allUsers.length} total`);
    return { success: true, data: allUsers };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// COMPLETELY ISOLATED user data creation (ZERO Firebase Auth operations)
export const createUserWithPermission = async (email, password, displayName, role = 'user') => {
  try {
    console.log('🔒 ISOLATED USER CREATION - NO AUTH OPERATIONS');
    console.log('📝 Creating user data:', { email, displayName, role });
    
    // Store current admin info for verification
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Must be logged in as admin to create users');
    }
    
    const adminEmail = currentUser.email;
    const adminUid = currentUser.uid;
    
    console.log(`🔐 Current admin: ${adminEmail} (${adminUid})`);
    console.log('🚫 NO Firebase Auth operations will be performed');
    
    // Check if user with this email already exists (including deleted users)
    const usersCollection = collection(db, 'users');
    const existingUserQuery = query(usersCollection, where('email', '==', email));
    const existingUserSnapshot = await getDocs(existingUserQuery);
    
    if (!existingUserSnapshot.empty) {
      const existingUserDoc = existingUserSnapshot.docs[0];
      const existingUserData = existingUserDoc.data();
      
      // If user was deleted, reactivate them instead of creating new
      if (existingUserData.status === 'deleted') {
        console.log('🔄 Reactivating deleted user:', email);
        
        await updateDoc(doc(db, 'users', existingUserDoc.id), {
          status: 'active',
          isActive: true,
          displayName: displayName,
          role: role,
          reactivatedBy: adminEmail,
          reactivatedAt: new Date().toISOString(),
          deletedAt: null,
          deletedBy: null
        });
        
        console.log('✅ User reactivated successfully');
        return { 
          success: true, 
          data: { ...existingUserData, status: 'active', isActive: true },
          message: `User ${email} has been reactivated. Admin session preserved.`,
          adminPreserved: true
        };
      } else {
        throw new Error('User with this email already exists and is active');
      }
    }
    
    // Generate unique ID for user data
    const userData = {
      id: `userdata_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email,
      displayName: displayName,
      initialPassword: password, // For their first registration
      role: role,
      institution: 'Politeknik Tuanku Sultanah Bahiyah',
      status: 'awaiting_registration',
      createdBy: adminEmail,
      createdByUid: adminUid,
      createdAt: new Date().toISOString(),
      isActive: false
    };
    
    console.log('💾 Storing user data in Firestore only...');
    
    // ONLY Firestore operation - NO Firebase Auth
    await setDoc(doc(db, 'user_data', userData.id), userData);
    
    console.log('✅ User data stored successfully');
    console.log(`🔐 Admin ${adminEmail} session UNCHANGED`);
    console.log('🎯 Current auth user should still be:', adminEmail);
    
    // Verify admin is still logged in
    const stillCurrentUser = auth.currentUser;
    if (stillCurrentUser && stillCurrentUser.email === adminEmail) {
      console.log('✅ VERIFIED: Admin session preserved!');
    } else {
      console.error('❌ CRITICAL: Admin session was changed!');
    }
    
    return { 
      success: true, 
      data: userData,
      message: `User data created for ${email}. Admin session preserved.`,
      adminPreserved: true
    };
    
  } catch (error) {
    console.error('❌ Error in isolated user creation:', error);
    return { success: false, error: error.message };
  }
};

// Update user information
export const updateUser = async (userId, updateData) => {
  try {
    console.log('Updating user:', userId, updateData);
    
    const userRef = doc(db, 'users', userId);
    
    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await updateDoc(userRef, dataToUpdate);
    
    console.log('User updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

// Delete user - mark as deleted and disable account
export const deleteUser = async (userId) => {
  try {
    console.log('Starting user deletion for ID:', userId);
    
    // Try to use Cloud Function for complete deletion first
    try {
      const functions = getFunctions();
      const deleteUserComplete = httpsCallable(functions, 'deleteUserComplete');
      
      console.log('Attempting deletion via Cloud Function...');
      const result = await deleteUserComplete({ userId });
      
      if (result.data.success) {
        console.log('✅ User deleted successfully via Cloud Function');
        if (result.data.warning) {
          console.warn('⚠️ Warning:', result.data.warning);
          return { success: true, warning: result.data.warning };
        }
        return { success: true };
      } else {
        throw new Error(result.data.error || 'Cloud function returned unsuccessful result');
      }
      
    } catch (cloudFunctionError) {
      console.warn('⚠️ Cloud Function deletion failed, falling back to account disabling:', cloudFunctionError.message);
      
      // Fallback: Mark user as deleted instead of physical deletion
      let userEmail = null;
      let userRef = null;
      let userData = null;
      
      // Try to find user in 'users' collection first
      userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        userData = userDoc.data();
        userEmail = userData.email;
      } else {
        // Try to find user in 'user_data' collection
        const userDataRef = doc(db, 'user_data', userId);
        const userDataDoc = await getDoc(userDataRef);
        
        if (userDataDoc.exists()) {
          userData = userDataDoc.data();
          userEmail = userData.email;
          // Delete from user_data collection completely
          await deleteDoc(userDataRef);
          console.log('✅ User data deleted from user_data collection');
          return { success: true };
        }
      }
      
      if (!userEmail || !userRef) {
        console.error('User document not found in either collection');
        return { success: false, error: 'User not found in database' };
      }
      
      console.log('Found user data:', { email: userEmail, uid: userId });
      
      // Instead of deleting, mark as deleted and disable account
      await updateDoc(userRef, {
        status: 'deleted',
        isActive: false,
        deletedAt: new Date().toISOString(),
        deletedBy: auth.currentUser?.email || 'system'
      });
      
      console.log('✅ User account disabled and marked as deleted');
      
      return { 
        success: true, 
        warning: 'User account has been disabled. They will no longer be able to access the system.' 
      };
    }
  } catch (error) {
    console.error('Error in complete user deletion:', error);
    return { success: false, error: error.message };
  }
};

// Alternative delete function using admin approach (requires Cloud Function)
export const requestUserDeletion = async (userId) => {
  try {
    console.log('Requesting user deletion via admin function for ID:', userId);
    
    // This would call a Cloud Function that uses Firebase Admin SDK
    // Example implementation:
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    
    // Add deletion request to a queue collection
    await setDoc(doc(db, 'deletion_requests', userId), {
      userId: userId,
      email: userData.email,
      requestedAt: new Date(),
      status: 'pending'
    });
    
    // Delete from Firestore immediately
    await deleteDoc(userRef);
    
    return { 
      success: true, 
      message: 'User deletion requested. Authentication cleanup will be processed shortly.' 
    };
    
  } catch (error) {
    console.error('Error requesting user deletion:', error);
    return { success: false, error: error.message };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return { success: false, error: error.message };
  }
};