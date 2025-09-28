import { doc, updateDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Update user role directly in users collection
export const updateUserRole = async (userId, newRole) => {
  try {
    console.log('Updating user role:', userId, 'to', newRole);
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date()
    });
    
    console.log('User role updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};

// Get user role from users collection by email
export const getUserRoleByEmail = async (email) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return { success: true, role: userData.role || 'student', userData };
    }
    
    return { success: true, role: 'student', userData: null };
  } catch (error) {
    console.error('Error getting user role:', error);
    return { success: false, error: error.message, role: 'student' };
  }
};

// Get user role from users collection by UID
export const getUserRoleByUID = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { success: true, role: userData.role || 'student', userData };
    }
    
    return { success: true, role: 'student', userData: null };
  } catch (error) {
    console.error('Error getting user role:', error);
    return { success: false, error: error.message, role: 'student' };
  }
};

// Get all users with their roles
export const getAllUsersWithRoles = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = usersSnapshot.docs
      .filter(doc => doc.data().status !== 'deleted') // Filter out deleted users
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        role: doc.data().role || 'student'
      }));
    
    return { success: true, users };
  } catch (error) {
    console.error('Error getting users with roles:', error);
    return { success: false, error: error.message, users: [] };
  }
};

// Check if user is admin
export const isUserAdmin = (userData) => {
  return userData && (userData.role === 'admin' || userData.role === 'instructor');
};

// Check if user has permission for specific action
export const hasPermission = (userData, action) => {
  if (!userData) return false;
  
  const role = userData.role || 'student';
  
  const permissions = {
    student: ['view_dashboard', 'create_forecast', 'view_products'],
    instructor: ['view_dashboard', 'create_forecast', 'view_products', 'manage_students'],
    admin: ['view_dashboard', 'create_forecast', 'view_products', 'manage_students', 'manage_users', 'manage_products', 'manage_system']
  };
  
  return permissions[role]?.includes(action) || false;
};

// Migrate roles from roles collection to users collection (one-time operation)
export const migrateRolesToUsers = async () => {
  try {
    console.log('Starting role migration...');
    
    // Get all roles from roles collection
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
    
    const migrationResults = [];
    
    for (const roleDoc of rolesSnapshot.docs) {
      const roleData = roleDoc.data();
      const email = roleData.email;
      const role = roleData.role;
      
      try {
        // Find user by email in users collection
        const usersCollection = collection(db, 'users');
        const userQuery = query(usersCollection, where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);
          
          // Update user document with role
          await updateDoc(userRef, {
            role: role,
            migratedAt: new Date()
          });
          
          migrationResults.push({ email, status: 'success', role });
          console.log(`✅ Migrated role for ${email}: ${role}`);
        } else {
          migrationResults.push({ email, status: 'user_not_found', role });
          console.log(`⚠️ User not found for email: ${email}`);
        }
      } catch (error) {
        migrationResults.push({ email, status: 'error', error: error.message, role });
        console.error(`❌ Error migrating ${email}:`, error);
      }
    }
    
    console.log('Migration completed:', migrationResults);
    return { success: true, results: migrationResults };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};