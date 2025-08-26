import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, where, getDoc } from "firebase/firestore";
import { db } from "./config";

// Collections
const COLLECTIONS = {
  USERS: 'users',
  FORECASTS: 'forecasts',
  ANALYTICS: 'analytics',
  FEEDBACK: 'feedback',
  ROLES: 'roles',
  PERMISSIONS: 'permission'
};

// User-related functions
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
};

// Forecast-related functions
export const saveForecast = async (forecastData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FORECASTS), {
      ...forecastData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving forecast:", error);
    return { success: false, error: error.message };
  }
};

export const getForecasts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.FORECASTS));
    const forecasts = [];
    querySnapshot.forEach((doc) => {
      forecasts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: forecasts };
  } catch (error) {
    console.error("Error getting forecasts:", error);
    return { success: false, error: error.message };
  }
};

// Feedback functions
export const submitFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK), {
      ...feedbackData,
      createdAt: serverTimestamp(),
      status: 'new'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: error.message };
  }
};

// Analytics functions
export const logUserAction = async (actionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ANALYTICS), {
      ...actionData,
      timestamp: serverTimestamp(),
      clientTimestamp: Date.now(), // Add unique client timestamp
      sessionId: Math.random().toString(36).substr(2, 9), // Add unique session ID
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    // Suppress error logging to avoid console spam, but still return error status
    return { success: false, error: error.message };
  }
};

// Permission and role functions
export const getUserPermissions = async (email) => {
  try {
    const q = query(collection(db, COLLECTIONS.PERMISSIONS), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: doc.data() };
    } else {
      return { success: false, error: "User permissions not found" };
    }
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return { success: false, error: error.message };
  }
};

export const isAdmin = async (email) => {
  try {
    const permissions = await getUserPermissions(email);
    if (permissions.success) {
      return permissions.data.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// User management functions for admin
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
};

export const createUserWithPermission = async (email, password, displayName, role = 'user') => {
  try {
    // Create user document
    const userRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      email,
      displayName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Create permission document
    await addDoc(collection(db, COLLECTIONS.PERMISSIONS), {
      email,
      role,
      createdAt: serverTimestamp()
    });

    return { success: true, id: userRef.id };
  } catch (error) {
    console.error("Error creating user with permission:", error);
    return { success: false, error: error.message };
  }
};