import { useState } from 'react';
import { debugFirebaseConnection, getFirebaseDiagnostics } from '../../firebase/debug';
import { useAuth } from '../../contexts/AuthContext';

const FirebaseDebug = () => {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { currentUser } = useAuth();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const result = await getFirebaseDiagnostics();
      setDiagnostics(result);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    }
    setLoading(false);
  };

  const runBasicConnection = async () => {
    setLoading(true);
    try {
      await debugFirebaseConnection();
    } catch (error) {
      console.error('Error testing connection:', error);
    }
    setLoading(false);
  };

  // Show toggle button if not visible
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Show Firebase Debug Panel"
      >
        🔧
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          🔧 Firebase Debug Panel
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666'
          }}
          title="Hide Debug Panel"
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '12px', fontSize: '14px' }}>
        <strong>Auth Status:</strong> {currentUser ? '✅ Signed In' : '❌ Not Signed In'}
        {currentUser && (
          <div style={{ color: '#666', fontSize: '12px' }}>
            {currentUser.email}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={runBasicConnection}
          disabled={loading}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Running...' : 'Full Diagnostics'}
        </button>
      </div>

      {diagnostics && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          background: '#f7fafc', 
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <div><strong>Collections Status:</strong></div>
          {Object.entries(diagnostics.collections).map(([name, result]) => (
            <div key={name} style={{ margin: '4px 0' }}>
              {result.success ? '✅' : '❌'} {name}: {result.success ? `${result.count} docs` : result.error}
            </div>
          ))}
          
          {diagnostics.suggestions.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <strong>Suggestions:</strong>
              {diagnostics.suggestions.map((suggestion, index) => (
                <div key={index} style={{ margin: '2px 0', fontSize: '11px' }}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '8px', 
        fontSize: '10px', 
        color: '#666',
        borderTop: '1px solid #e2e8f0',
        paddingTop: '8px'
      }}>
        💡 Check browser console for detailed logs
      </div>
    </div>
  );
};

export default FirebaseDebug;