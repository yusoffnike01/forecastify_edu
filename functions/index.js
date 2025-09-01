const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Cloud Function to create a user without affecting the current admin's session
 * This function uses Firebase Admin SDK to create users without signing them in
 * 
 * Usage from frontend:
 * 
 * const createUserAdmin = firebase.functions().httpsCallable('createUserAdmin');
 * const result = await createUserAdmin({ email, password, displayName, role });
 */
exports.createUserAdmin = functions.https.onCall(async (data, context) => {
  try {
    // Verify that the user is authenticated and is an admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    // Get the calling user's custom claims to check admin status
    const callingUser = await admin.auth().getUser(context.auth.uid);
    const isAdmin = callingUser.customClaims && callingUser.customClaims.admin === true;

    if (!isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can create users.'
      );
    }

    const { email, password, displayName, role } = data;

    if (!email || !password || !displayName) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email, password, and display name are required.'
      );
    }

    console.log(`Admin ${context.auth.email} creating user: ${email} with role: ${role}`);

    // Create user in Firebase Auth using Admin SDK (doesn't affect current session)
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false
    });

    console.log(`✅ Created auth user: ${userRecord.uid}`);

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      role: role || 'user',
      institution: 'Politeknik Tuanku Sultanah Bahiyah',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);
    console.log(`✅ Created user document in Firestore for: ${userRecord.uid}`);

    // Set custom claims if admin
    if (role === 'admin') {
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
      console.log(`✅ Set admin claims for user: ${userRecord.uid}`);
    }

    return {
      success: true,
      message: 'User created successfully without affecting admin session',
      userData: {
        id: userRecord.uid,
        ...userData,
        createdAt: new Date() // Convert for frontend
      }
    };

  } catch (error) {
    console.error('Error in createUserAdmin:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while creating the user: ' + error.message
    );
  }
});

/**
 * Cloud Function to completely delete a user from both Firestore and Firebase Auth
 * This function requires Firebase Admin SDK and should be called from your frontend
 * 
 * Usage from frontend:
 * 
 * const deleteUserComplete = firebase.functions().httpsCallable('deleteUserComplete');
 * const result = await deleteUserComplete({ userId: 'user-uid-here' });
 */
exports.deleteUserComplete = functions.https.onCall(async (data, context) => {
  try {
    // Verify that the user is authenticated and is an admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    // Get the calling user's custom claims to check admin status
    const callingUser = await admin.auth().getUser(context.auth.uid);
    const isAdmin = callingUser.customClaims && callingUser.customClaims.admin === true;

    if (!isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can delete users.'
      );
    }

    const { userId } = data;

    if (!userId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'User ID is required.'
      );
    }

    console.log(`Starting complete deletion of user: ${userId}`);

    // Step 1: Get user data from Firestore before deletion
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found in database.'
      );
    }

    const userData = userDoc.data();
    const userEmail = userData.email;

    // Step 2: Delete user from Firestore
    await admin.firestore().collection('users').doc(userId).delete();
    console.log(`✅ Deleted user ${userId} from Firestore`);

    // Step 3: Delete user from Firebase Authentication
    try {
      await admin.auth().deleteUser(userId);
      console.log(`✅ Deleted user ${userId} from Firebase Auth`);
    } catch (authError) {
      console.error(`Error deleting user from Auth:`, authError);
      
      // If auth deletion fails, we should still report success for Firestore deletion
      // but warn about the auth deletion failure
      return {
        success: true,
        warning: `User removed from database but could not be removed from authentication: ${authError.message}`,
        userEmail: userEmail
      };
    }

    // Step 4: Clean up any additional user data (optional)
    // Delete from roles collection if it exists
    try {
      await admin.firestore().collection('roles').doc(userEmail).delete();
      console.log(`✅ Deleted user role for ${userEmail}`);
    } catch (roleError) {
      console.log(`No role document found for ${userEmail} or error deleting:`, roleError.message);
    }

    // Delete any user-specific data collections (customize as needed)
    // await admin.firestore().collection('user_data').doc(userId).delete();

    console.log(`✅ Complete deletion successful for user: ${userId}`);
    
    return {
      success: true,
      message: 'User completely deleted from all systems',
      userEmail: userEmail,
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    };

  } catch (error) {
    console.error('Error in deleteUserComplete:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while deleting the user: ' + error.message
    );
  }
});

/**
 * Cloud Function to set admin custom claims
 * Call this once to make a user an admin
 * 
 * Usage: 
 * const setAdminClaim = firebase.functions().httpsCallable('setAdminClaim');
 * await setAdminClaim({ email: 'admin@example.com' });
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  try {
    // This function should only be called by existing admins
    // For the first admin, you can temporarily remove this check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    const { email } = data;
    
    if (!email) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email is required.'
      );
    }

    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Set admin claims for user: ${email}`);
    
    return {
      success: true,
      message: `Admin privileges granted to ${email}`,
      uid: user.uid
    };

  } catch (error) {
    console.error('Error in setAdminClaim:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while setting admin claim: ' + error.message
    );
  }
});

/**
 * Background function to process deletion requests
 * This processes entries from the 'deletion_requests' collection
 */
exports.processDeletionRequests = functions.firestore
  .document('deletion_requests/{requestId}')
  .onCreate(async (snap, context) => {
    try {
      const requestData = snap.data();
      const { userId, email } = requestData;
      
      console.log(`Processing deletion request for user: ${userId}`);
      
      // Delete from Firebase Auth
      try {
        await admin.auth().deleteUser(userId);
        console.log(`✅ Deleted user ${userId} from Firebase Auth`);
        
        // Update request status
        await snap.ref.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          result: 'success'
        });
        
      } catch (error) {
        console.error(`Error deleting user ${userId} from Auth:`, error);
        
        // Update request status with error
        await snap.ref.update({
          status: 'failed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: error.message
        });
      }
      
    } catch (error) {
      console.error('Error processing deletion request:', error);
    }
  });