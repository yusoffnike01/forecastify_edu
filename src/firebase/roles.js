import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './config';

// Save user role to roles collection
export const saveUserRole = async (email, role) => {
  try {
    console.log('Saving role for:', email, 'Role:', role); // Debug log
    
    // Use email as document ID, save email and role as fields
    const roleRef = doc(db, 'roles', email);
    
    const roleData = {
      email: email,
      role: role
    };
    
    console.log('Saving data:', roleData); // Debug log
    await setDoc(roleRef, roleData);
    console.log('Role saved successfully'); // Debug log
    
    return { success: true };
  } catch (error) {
    console.error('Error saving role:', error); // Debug log
    return { success: false, error: error.message };
  }
};

// Get user role from roles collection
export const getUserRole = async (email) => {
  try {
    const roleRef = doc(db, 'roles', email);
    const roleDoc = await getDoc(roleRef);
    
    if (roleDoc.exists()) {
      const data = roleDoc.data();
      return { success: true, role: data.role || 'student' };
    }
    
    return { success: true, role: 'student' };
  } catch (error) {
    return { success: false, error: error.message, role: 'student' };
  }
};

// Get all roles
export const getAllRoles = async () => {
  try {
    const rolesCollection = collection(db, 'roles');
    const roleSnapshot = await getDocs(rolesCollection);
    
    const roles = {};
    roleSnapshot.docs.forEach(doc => {
      const data = doc.data();
      roles[data.email] = { role: data.role };
    });
    
    return { success: true, roles };
  } catch (error) {
    return { success: false, error: error.message, roles: {} };
  }
};

// Delete user role from roles collection
export const deleteUserRole = async (email) => {
  try {
    console.log('Deleting role for:', email); // Debug log
    
    // Delete from roles collection
    const roleRef = doc(db, 'roles', email);
    await deleteDoc(roleRef);
    
    console.log('Role deleted successfully'); // Debug log
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error); // Debug log
    return { success: false, error: error.message };
  }
};