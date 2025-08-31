import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config';

// Clean up duplicate users (keep the one with Admin role if exists)
export const cleanupDuplicateUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    
    const emailGroups = {};
    
    // Group users by email
    userSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      const email = userData.email;
      
      if (!emailGroups[email]) {
        emailGroups[email] = [];
      }
      
      emailGroups[email].push({
        id: userDoc.id,
        data: userData
      });
    });
    
    // Process duplicates
    for (const email in emailGroups) {
      const userGroup = emailGroups[email];
      
      if (userGroup.length > 1) {
        console.log(`Found ${userGroup.length} users with email: ${email}`);
        
        // Sort by role priority (admin > staff > student > guest)
        const rolePriority = { admin: 4, staff: 3, student: 2, guest: 1 };
        userGroup.sort((a, b) => {
          const aPriority = rolePriority[a.data.role] || 0;
          const bPriority = rolePriority[b.data.role] || 0;
          return bPriority - aPriority;
        });
        
        // Keep the first one (highest priority), delete the rest
        const keepUser = userGroup[0];
        const deleteUsers = userGroup.slice(1);
        
        console.log(`Keeping user with role: ${keepUser.data.role}`);
        
        for (const user of deleteUsers) {
          console.log(`Deleting duplicate user with role: ${user.data.role}`);
          await deleteDoc(doc(db, 'users', user.id));
        }
      }
    }
    
    return { success: true, message: 'Cleanup completed' };
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    return { success: false, error: error.message };
  }
};