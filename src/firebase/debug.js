import { auth, db } from './config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Debug Firebase connection and permissions
export const debugFirebaseConnection = async () => {
  console.log('🔍 Firebase Debug Information:');
  
  // 1. Check authentication status
  const currentUser = auth.currentUser;
  console.log('Authentication Status:', {
    isSignedIn: !!currentUser,
    userEmail: currentUser?.email || 'Not signed in',
    userUID: currentUser?.uid || 'No UID',
    emailVerified: currentUser?.emailVerified || false
  });

  // 2. Check Firebase config
  console.log('Firebase Config:', {
    projectId: db.app.options.projectId,
    authDomain: db.app.options.authDomain
  });

  // 3. Test basic Firestore read operation
  try {
    console.log('🧪 Testing Firestore read permissions...');
    
    // Try to read a simple collection
    const testCollection = collection(db, 'users');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firestore read test successful');
    console.log(`Found ${snapshot.size} documents in users collection`);
    
    // List document IDs (without data for privacy)
    snapshot.docs.forEach((doc, index) => {
      console.log(`Document ${index + 1}: ${doc.id}`);
    });
    
  } catch (error) {
    console.error('❌ Firestore read test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide specific guidance based on error code
    if (error.code === 'permission-denied') {
      console.log('🔒 Permission Issue Detected:');
      console.log('- Check Firestore Security Rules');
      console.log('- Ensure user is authenticated');
      console.log('- Verify user has required permissions');
    }
  }

  // 4. Test user document access if authenticated
  if (currentUser) {
    try {
      console.log('🧪 Testing user document access...');
      const userDoc = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        console.log('✅ User document exists and accessible');
        console.log('User role:', userSnapshot.data().role || 'No role set');
      } else {
        console.log('⚠️ User document does not exist');
      }
    } catch (error) {
      console.error('❌ User document access failed:', error);
    }
  }

  return {
    isAuthenticated: !!currentUser,
    userEmail: currentUser?.email || null,
    projectId: db.app.options.projectId
  };
};

// Quick permission test for specific collection
export const testCollectionPermission = async (collectionName) => {
  try {
    console.log(`🧪 Testing permissions for collection: ${collectionName}`);
    
    const testCollection = collection(db, collectionName);
    const snapshot = await getDocs(testCollection);
    
    console.log(`✅ Success! Can read ${collectionName} collection`);
    console.log(`Found ${snapshot.size} documents`);
    
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error(`❌ Cannot read ${collectionName} collection:`, error);
    return { success: false, error: error.message, code: error.code };
  }
};

// Test authentication and get suggestions
export const getFirebaseDiagnostics = async () => {
  const user = auth.currentUser;
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    authentication: {
      isSignedIn: !!user,
      email: user?.email || null,
      uid: user?.uid || null,
      emailVerified: user?.emailVerified || false
    },
    suggestions: []
  };

  // Test various collections
  const collections = ['users', 'user_data', 'products'];
  diagnostics.collections = {};

  for (const collectionName of collections) {
    const result = await testCollectionPermission(collectionName);
    diagnostics.collections[collectionName] = result;
  }

  // Generate suggestions
  if (!user) {
    diagnostics.suggestions.push('❗ User is not authenticated. Please sign in first.');
  }

  const failedCollections = Object.entries(diagnostics.collections)
    .filter(([, result]) => !result.success);

  if (failedCollections.length > 0) {
    diagnostics.suggestions.push('🔒 Some collections have permission issues:');
    failedCollections.forEach(([name, result]) => {
      diagnostics.suggestions.push(`  - ${name}: ${result.error}`);
    });
    diagnostics.suggestions.push('📋 Check Firestore Security Rules in Firebase Console');
  }

  console.log('📊 Firebase Diagnostics:', diagnostics);
  return diagnostics;
};