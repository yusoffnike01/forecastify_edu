import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUpWithEmail } from '../firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'student'
  });
  const [isCreating, setIsCreating] = useState(false);

  const { currentUser } = useAuth();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      setError('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const result = await signUpWithEmail(
        newUser.email, 
        newUser.password, 
        newUser.displayName
      );

      if (result.success) {
        setSuccess(`User ${newUser.displayName} created successfully!`);
        setNewUser({ email: '', password: '', displayName: '', role: 'student' });
        setShowCreateUserModal(false);
        fetchUsers(); // Refresh user list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create user: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setSuccess(`User ${userName} deleted successfully!`);
        fetchUsers(); // Refresh user list
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete user: ' + error.message);
      }
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 0.5rem'
          }}>
            User Management
          </h2>
          <p style={{
            color: '#4a5568',
            fontSize: '1rem',
            margin: 0
          }}>
            Create and manage system users
          </p>
        </div>

        <motion.button
          onClick={() => setShowCreateUserModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
          }}
        >
          + Create New User
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

      {/* Users Table */}
      <div style={{
        background: 'rgba(248, 250, 252, 0.8)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1a202c',
          margin: '0 0 1rem'
        }}>
          Registered Users ({users.length})
        </h3>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#4a5568' 
          }}>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#4a5568' 
          }}>
            No users found
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {users.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a202c',
                    marginBottom: '4px'
                  }}>
                    {user.displayName || 'No name'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#667eea',
                    marginBottom: '4px'
                  }}>
                    {user.email}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#4a5568'
                  }}>
                    Role: {user.role || 'student'} • Created: {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </div>
                </div>

                {user.uid !== currentUser?.uid && (
                  <motion.button
                    onClick={() => handleDeleteUser(user.id, user.displayName)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateUserModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '3rem',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: '0 0 0.5rem'
                }}>
                  Create New User
                </h2>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1rem',
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUser.displayName}
                    onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                    placeholder="Enter full name"
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
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Admin</option>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowCreateUserModal(false);
                      setError('');
                      setNewUser({ email: '', password: '', displayName: '', role: 'student' });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      color: '#4a5568',
                      border: '2px solid #e2e8f0',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;