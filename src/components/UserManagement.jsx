import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUpWithEmail, deleteUserFromFirestore } from '../firebase/auth';
import { saveUserRole, getAllRoles, deleteUserRole } from '../firebase/roles';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'student'
  });
  const [isCreating, setIsCreating] = useState(false);

  const { currentUser } = useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const roleResult = await getAllRoles();
      if (roleResult.success) {
        // Convert roles object to array for display
        const roleList = Object.entries(roleResult.roles).map(([email, data]) => ({
          email: email,
          role: data.role,
          id: email // Use email as ID
        }));
        setRoles(roleList);
      } else {
        setError('Failed to fetch roles: ' + roleResult.error);
      }
    } catch (error) {
      setError('Failed to fetch roles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      // Check if user with this email already exists
      const existingRole = roles.find(role => role.email === newUser.email);
      if (existingRole) {
        setError('A user with this email already exists.');
        setIsCreating(false);
        return;
      }

      // Create user with Firebase Authentication
      const result = await signUpWithEmail(
        newUser.email, 
        newUser.password, 
        newUser.displayName || newUser.email.split('@')[0],
        newUser.role
      );

      if (result.success) {
        console.log('User created successfully, now saving role...'); // Debug log
        
        // Save role to roles collection
        const roleResult = await saveUserRole(newUser.email, newUser.role);
        
        console.log('Role save result:', roleResult); // Debug log
        
        if (roleResult.success) {
          setSuccess(`User created successfully!`);
          setNewUser({ email: '', password: '', displayName: '', role: 'student' });
          setShowCreateUserModal(false);
          fetchRoles(); // Refresh roles list
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        } else {
          console.error('Role save failed:', roleResult.error); // Debug log
          setError('User created but failed to save role: ' + roleResult.error);
        }
      } else {
        console.error('User creation failed:', result.error); // Debug log
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create user: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRole = async (email, role) => {
    // Prevent deleting admin users
    if (role === 'admin') {
      setError('Cannot delete admin users');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      setLoading(true);
      try {
        // Delete from roles collection
        const roleResult = await deleteUserRole(email);
        if (!roleResult.success) {
          throw new Error(roleResult.error);
        }

        // Delete from users collection
        const userResult = await deleteUserFromFirestore(email);
        if (!userResult.success) {
          console.warn('Failed to delete from users collection:', userResult.error);
        }

        setSuccess(`User ${email} deleted successfully!`);
        fetchRoles(); // Refresh roles list
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete user: ' + error.message);
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: isMobile ? '1rem' : '2rem',
      boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      margin: isMobile ? '0.5rem 0.5rem 2rem 0.5rem' : '0 0 2rem 0'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: isMobile ? '1.5rem' : '2rem',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '1rem' : '0'
      }}>
        <div>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 0.5rem'
          }}>
            User Management
          </h2>
          <p style={{
            color: '#4a5568',
            fontSize: isMobile ? '0.9rem' : '1rem',
            margin: 0
          }}>
            Create and manage system users
          </p>
        </div>

        <motion.button
          onClick={() => setShowCreateUserModal(!showCreateUserModal)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: isMobile ? '10px 16px' : '12px 24px',
            borderRadius: '12px',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            width: isMobile ? '100%' : 'auto',
            textAlign: 'center'
          }}
        >
          {showCreateUserModal ? '❌ Cancel' : '➕ Create New User'}
        </motion.button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#16a34a',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '1rem',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Roles Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: isMobile ? '1.5rem' : '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginTop: isMobile ? '1rem' : '1.5rem',
          marginBottom: isMobile ? '1rem' : '2rem'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0
            }}>
              User Roles
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              {roles.length} users • Manage user roles and permissions
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#4a5568' 
          }}>
            Loading roles...
          </div>
        ) : roles.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#4a5568' 
          }}>
            No users found
          </div>
        ) : (
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white'
          }}>
            {/* Table Header - Hide on mobile */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div style={{ padding: '12px 16px' }}>Email</div>
                <div style={{ padding: '12px 16px' }}>Role</div>
                <div style={{ padding: '12px 16px' }}>Action</div>
              </div>
            )}

            {/* Table Rows */}
            {roles.map((role, index) => (
              isMobile ? (
                // Mobile Card Layout
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    padding: '16px',
                    borderBottom: index < roles.length - 1 ? '1px solid #f3f4f6' : 'none',
                    background: 'white'
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>
                      Email
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem',
                      color: '#000000',
                      wordBreak: 'break-all'
                    }}>
                      {role.email}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '12px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        marginBottom: '4px'
                      }}>
                        Role
                      </div>
                      <span style={{
                        background: role.role === 'admin' ? '#fef3c7' : 
                                   role.role === 'staff' ? '#ddd6fe' : 
                                   role.role === 'guest' ? '#fde68a' : '#dcfce7',
                        color: role.role === 'admin' ? '#92400e' : 
                               role.role === 'staff' ? '#5b21b6' : 
                               role.role === 'guest' ? '#d97706' : '#166534',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {role.role || 'student'}
                      </span>
                    </div>
                    
                    <div>
                      {role.role !== 'admin' ? (
                        <motion.button
                          onClick={() => handleDeleteRole(role.email, role.role)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🗑️ Delete
                        </motion.button>
                      ) : (
                        <span style={{
                          color: '#9ca3af',
                          fontSize: '0.75rem',
                          fontStyle: 'italic'
                        }}>
                          Protected
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Desktop Table Layout
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    borderBottom: index < roles.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <div style={{ 
                    padding: '16px', 
                    fontSize: '0.85rem',
                    color: '#000000',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {role.email}
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      background: role.role === 'admin' ? '#fef3c7' : 
                                 role.role === 'staff' ? '#ddd6fe' : 
                                 role.role === 'guest' ? '#fde68a' : '#dcfce7',
                      color: role.role === 'admin' ? '#92400e' : 
                             role.role === 'staff' ? '#5b21b6' : 
                             role.role === 'guest' ? '#d97706' : '#166534',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {role.role || 'student'}
                    </span>
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {role.role !== 'admin' ? (
                      <motion.button
                        onClick={() => handleDeleteRole(role.email, role.role)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        🗑️ Delete
                      </motion.button>
                    ) : (
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '0.75rem',
                        fontStyle: 'italic'
                      }}>
                        Protected
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        )}
      </motion.div>

      {/* Create User Form */}
      <AnimatePresence>
        {showCreateUserModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: isMobile ? '1.5rem' : '2rem',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              marginTop: isMobile ? '1rem' : '2rem',
              maxWidth: isMobile ? '100%' : '600px',
              margin: isMobile ? '1rem 0 0' : '2rem auto 0',
              width: isMobile ? 'calc(100% - 1rem)' : 'auto'
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              marginBottom: isMobile ? '1.5rem' : '2rem' 
            }}>
              <h2 style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0 0 0.5rem'
              }}>
                Create New User
              </h2>
              <p style={{
                color: '#4a5568',
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                margin: 0
              }}>
                Add a new user to the system
              </p>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '0.5rem'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Enter password"
                  required
                  minLength="6"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '0.5rem'
                }}>
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isCreating}
                whileHover={{ scale: isCreating ? 1 : 1.02 }}
                whileTap={{ scale: isCreating ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  background: isCreating 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  opacity: isCreating ? 0.7 : 1
                }}
              >
                {isCreating ? 'Creating User...' : 'Create User'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;