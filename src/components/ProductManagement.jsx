import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addProduct, getUserProducts, updateProduct, deleteProduct } from '../firebase/products';

const ProductManagement = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const loadProducts = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userProducts = await getUserProducts(currentUser.uid);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load products from Firebase
  useEffect(() => {
    if (currentUser) {
      loadProducts();
    }
  }, [currentUser, loadProducts]);

  const handleAddProduct = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      setLoading(true);
      try {
        await addProduct(formData, currentUser.uid);
        await loadProducts(); // Reload products
        setFormData({ name: '', description: '' });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in both product name and description.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      setLoading(true);
      try {
        await updateProduct(editingProduct, formData);
        await loadProducts(); // Reload products
        setFormData({ name: '', description: '' });
        setShowAddForm(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in both product name and description.');
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteProduct = async (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      try {
        await deleteProduct(productToDelete.id);
        await loadProducts(); // Reload products
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleCancelForm = () => {
    setFormData({ name: '', description: '' });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      padding: '2rem'
    }}>
      
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <motion.img
              src="/images/logoforecastifyedu.jpeg"
              alt="Forecastify EDU"
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                background: 'white'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '2px'
                }}
              >
                FORECASTIFY EDU
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  fontSize: '0.7rem',
                  color: '#4a5568',
                  opacity: 0.9
                }}
              >
                Educational Supply Chain Forecasting System
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '800',
              marginBottom: '0.8rem',
              background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2'
            }}
          >
            Product Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              fontSize: '1rem',
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}
          >
            Create and manage your product collection for forecasting analysis
          </motion.p>
        </motion.div>

        {/* Add Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}
        >
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            ➕ Add New Product
          </motion.button>
        </motion.div>

        {/* Add/Edit Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter product name"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      opacity: loading ? 0.6 : 1
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={4}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.3s ease',
                      opacity: loading ? 0.6 : 1
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <motion.button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                >
                  {editingProduct ? '💾 Update' : '➕ Add'}
                </motion.button>

                <motion.button
                  onClick={handleCancelForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'transparent',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                >
                  ❌ Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            📋 Product Collection ({products.length})
          </h3>

          {products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#4a5568' }}>
                No Products Yet
              </h4>
              <p style={{ fontSize: '1rem' }}>
                Create your first product to start building your collection
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '0.5rem'
                      }}>
                        {product.name}
                      </h4>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <motion.button
                        onClick={() => handleEditProduct(product)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteProduct(product)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    {product.description && (
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#4a5568',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '0.5rem'
                  }}>
                    Created: {new Date(product.createdAt?.toDate ? product.createdAt.toDate() : product.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Enhanced Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}
              onClick={cancelDelete}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  maxWidth: '450px',
                  width: '100%',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {/* Warning Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3))'
                  }}>
                    ⚠️
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  Delete Product?
                </motion.h3>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }}
                >
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}>
                    Are you sure you want to delete this product?
                  </p>
                  {productToDelete && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2d3748',
                        marginBottom: '0.5rem'
                      }}>
                        {productToDelete.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#718096'
                      }}>
                        {productToDelete.description}
                      </div>
                    </div>
                  )}
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#e53e3e',
                    fontWeight: '500',
                    marginTop: '1rem'
                  }}>
                    This action cannot be undone.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center'
                  }}
                >
                  <motion.button
                    onClick={cancelDelete}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'transparent',
                      color: '#4a5568',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      minWidth: '100px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#cbd5e0';
                      e.target.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    onClick={confirmDelete}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    style={{
                      background: loading 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      minWidth: '100px',
                      opacity: loading ? 0.7 : 1,
                      boxShadow: loading ? 'none' : '0 4px 20px rgba(220, 38, 38, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ProductManagement;