import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { 
  getAllUsers, 
  createUserWithPermission, 
  updateUser, 
  deleteUser 
} from '../../firebase/firestore';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    role: 'user'
  });

  // Role options for react-select
  const roleOptions = [
    { 
      value: 'user', 
      label: '👤 Regular User',
      description: 'Standard user access'
    },
    { 
      value: 'admin', 
      label: '👨‍💻 Administrator',
      description: 'Full system access'
    }
  ];

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '4px 8px',
      fontSize: '0.875rem',
      minHeight: '44px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
      borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
      '&:hover': {
        borderColor: '#2563eb'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px',
      fontSize: '0.875rem',
      backgroundColor: state.isSelected ? '#f0f9ff' : state.isFocused ? '#f8fafc' : 'white',
      color: '#1f2937',
      cursor: 'pointer'
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#1f2937'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#9ca3af'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      border: '1px solid #d1d5db',
      zIndex: 10000
    })
  };

  useEffect(() => {
    loadUsers();
  }, []);


  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user using the admin function (preserves current session)
      const result = await createUserWithPermission(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role
      );

      if (result.success) {
        if (result.adminPreserved) {
          setSuccess('✅ User data created successfully! Admin session preserved. Check console for verification logs.');
          setFormData({ email: '', displayName: '', password: '', role: 'user' });
          setShowCreateForm(false);
          loadUsers();
        } else {
          setSuccess('User created successfully!');
          setFormData({ email: '', displayName: '', password: '', role: 'user' });
          setShowCreateForm(false);
          loadUsers();
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user: ' + error.message);
    }
    
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      displayName: user.displayName,
      password: '',
      role: user.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateUser(editingUser.id, {
      displayName: formData.displayName,
      role: formData.role
    });

    if (result.success) {
      setSuccess('User updated successfully!');
      setEditingUser(null);
      setFormData({ email: '', displayName: '', password: '', role: 'user' });
      loadUsers();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDeleteUser = async (userData) => {
    setDeletingUser(userData);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    
    setLoading(true);
    const result = await deleteUser(deletingUser.id);
    
    if (result.success) {
      if (result.warning) {
        setSuccess(`User deleted successfully! Note: ${result.warning}`);
      } else {
        setSuccess('User deleted successfully from all systems!');
      }
      loadUsers();
    } else {
      setError(`Failed to delete user: ${result.error}`);
    }
    
    setShowDeleteConfirm(false);
    setDeletingUser(null);
    setLoading(false);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setDeletingUser(null);
  };

  // Keyboard navigation for delete modal
  const handleKeyDown = (e) => {
    if (!showDeleteConfirm || loading) return;
    
    if (e.key === 'Escape') {
      cancelDeleteUser();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Ctrl/Cmd + Enter to confirm delete
      confirmDeleteUser();
    }
  };

  // Focus management
  React.useEffect(() => {
    if (showDeleteConfirm) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDeleteConfirm, loading]);

  const resetForm = () => {
    setFormData({ email: '', displayName: '', password: '', role: 'user' });
    setShowCreateForm(false);
    setEditingUser(null);
    setError('');
    setSuccess('');
    setShowRoleDropdown(false);
    setSearchTerm('');
  };

  if (loading && users.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        Loading users...
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--space-6)' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: 'var(--space-2)' 
          }}>
            User Management
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Manage users and their permissions
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
          }}
        >
          <span style={{ 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center'
          }}>
            ✨
          </span>
          Create New User
        </motion.button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-lg)',
          color: '#dc2626',
          marginBottom: 'var(--space-4)'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-lg)',
          color: '#16a34a',
          marginBottom: 'var(--space-4)'
        }}>
          {success}
        </div>
      )}

      {/* Users Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ 
                  padding: 'var(--space-4)', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Name
                </th>
                <th style={{ 
                  padding: 'var(--space-4)', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Email
                </th>
                <th style={{ 
                  padding: 'var(--space-4)', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Role
                </th>
                <th style={{ 
                  padding: 'var(--space-4)', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData, index) => (
                <tr key={userData.id || index} style={{ 
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {userData.displayName || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', color: '#6b7280' }}>
                    {userData.email}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{
                      padding: 'var(--space-1) var(--space-2)',
                      backgroundColor: userData.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                      color: userData.role === 'admin' ? '#2563eb' : '#6b7280',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {userData.role || 'user'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => handleEditUser(userData)}
                        style={{
                          padding: 'var(--space-1) var(--space-2)',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          color: '#374151',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData)}
                        style={{
                          padding: 'var(--space-1) var(--space-2)',
                          backgroundColor: '#fef2f2',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          color: '#dc2626',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <AnimatePresence>
        {(showCreateForm || editingUser) && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '0',
                maxWidth: '400px',
                width: '100%',
                minHeight: 'auto',
                overflow: 'visible',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={resetForm}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '18px',
                  transition: 'all 0.2s ease',
                  zIndex: 1
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(107, 114, 128, 0.2)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>

              {/* Header Section */}
              <div style={{
                padding: '24px 24px 20px',
                borderBottom: '1px solid #f1f5f9',
                textAlign: 'center'
              }}>
                {/* Icon */}
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                  borderRadius: '12px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}>
                  {editingUser ? '👤' : '👨‍💻'}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: '700', 
                  marginBottom: '6px',
                  color: '#1e293b',
                  letterSpacing: '-0.025em'
                }}>
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                
                <p style={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  margin: 0,
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}>
                  {editingUser 
                    ? 'Update user information and access level' 
                    : 'Add a new team member with the appropriate permissions'
                  }
                </p>
              </div>

              {/* Form Section */}
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} style={{ padding: '24px', overflow: 'visible' }}>
                
                {/* Email Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#374151'
                  }}>
                    Email Address {!editingUser && <span style={{ color: '#dc2626' }}>*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={editingUser}
                    required
                    placeholder={editingUser ? "Email cannot be changed" : "user@example.com"}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${editingUser ? '#d1d5db' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      backgroundColor: editingUser ? '#f8fafc' : 'white',
                      color: editingUser ? '#6b7280' : '#1f2937',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!editingUser) {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Full Name Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#374151'
                  }}>
                    Full Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Password Field */}
                {!editingUser && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block',
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: '#374151'
                    }}>
                      Password <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter a secure password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        backgroundColor: 'white',
                        color: '#1f2937',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '6px 0 0'
                    }}>
                      Password should be at least 6 characters long
                    </p>
                  </div>
                )}

                {/* Role Field with React-Select */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#374151'
                  }}>
                    User Role <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  
                  <Select
                    value={roleOptions.find(option => option.value === formData.role)}
                    onChange={(selectedOption) => 
                      setFormData({...formData, role: selectedOption.value})
                    }
                    options={roleOptions}
                    styles={selectStyles}
                    isSearchable={true}
                    placeholder="Select user role..."
                    isClearable={false}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  paddingTop: '20px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                      e.target.style.color = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{
                      flex: 2,
                      padding: '12px 20px',
                      background: loading 
                        ? '#9ca3af' 
                        : 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: loading 
                        ? 'none' 
                        : '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff40',
                          borderTop: '2px solid #ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {editingUser ? 'Update User' : 'Create User'}
                      </>
                    )}
                  </motion.button>
                </div>
                
                {/* Add CSS keyframes for loading spinner */}
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: loading 
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                        : `
                            0 8px 25px rgba(220, 38, 38, 0.35),
                            0 2px 8px rgba(220, 38, 38, 0.2),
                            inset 0 2px 0 rgba(255, 255, 255, 0.15),
                            inset 0 -2px 0 rgba(0, 0, 0, 0.1)
                          `,
                      position: 'relative',
                      overflow: 'hidden',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(145deg, #dc2626, #b91c1c, #7f1d1d)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '3px solid rgba(255, 255, 255, 0.2)',
                            borderTop: '3px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '50%'
                          }}
                        />
                        <motion.span
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Deleting User...
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <motion.span 
                          style={{ fontSize: '18px' }}
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          🗑️
                        </motion.span>
                        <motion.span
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Delete Permanently
                        </motion.span>
                      </>
                    )}
                    
                    {/* Ripple effect overlay */}
                    {!loading && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 0 }}
                        whileHover={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                          borderRadius: '16px',
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </motion.button>
                </motion.div>

                {/* Additional Safety Notice */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  style={{
                    marginTop: '20px',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    border: '1px solid #f59e0b',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: '#92400e',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>⚡</span>
                  Press <kbd style={{ 
                    background: 'rgba(0,0,0,0.1)', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>ESC</kbd> to cancel or <kbd style={{ 
                    background: 'rgba(0,0,0,0.1)', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>Ctrl+Enter</kbd> to delete
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - SIMPLE VERSION */}
      <AnimatePresence>
        {showDeleteConfirm && deletingUser && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '20px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !loading) {
                cancelDeleteUser();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  margin: '0 0 8px 0'
                }}>
                  Delete User
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  Are you sure you want to delete this user?
                </p>
              </div>

              {/* User Info */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {deletingUser.displayName || 'Unknown User'}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '8px'
                }}>
                  {deletingUser.email}
                </div>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {deletingUser.role || 'user'}
                </span>
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <button
                  onClick={cancelDeleteUser}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={confirmDeleteUser}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: loading ? '#9ca3af' : '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;