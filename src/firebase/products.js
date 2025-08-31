import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'products';

// Add a new product
export const addProduct = async (productData, userId) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get all products for a user
export const getUserProducts = async (userId) => {
  try {
    console.log('Fetching products for userId:', userId);
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      console.log('Found product:', doc.id, doc.data());
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log('Total products found:', products.length);
    // Sort by createdAt in memory instead of in query
    return products.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};