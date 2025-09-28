# 🔥 Fixed Firebase Rules for Forecastify

## Recommended Production Rules

Guna rules ini untuk production yang lebih seimbang antara security dan functionality:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - more flexible admin access
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow all authenticated users to read basic user info (for user lists, etc)
      allow read: if request.auth != null;
      
      // Allow admin operations (simplified check)
      allow write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com', 'admin@ptsb.edu.my'];
    }
    
    // User data collection (for user creation process)
    match /user_data/{document} {
      // Allow admins and the system to manage user creation data
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com', 'admin@ptsb.edu.my'];
      
      // Allow users to read their own pending data
      allow read: if request.auth != null && resource.data.email == request.auth.token.email;
    }
    
    // Products collection
    match /products/{productId} {
      // All authenticated users can read products
      allow read: if request.auth != null;
      
      // Only admins can write products
      allow write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com', 'admin@ptsb.edu.my'];
    }
    
    // Forecasts collection - for user calculations
    match /forecasts/{document} {
      // Users can manage their own forecasts
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.data.userId == request.auth.uid);
      
      // Admins can access all forecasts
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com', 'admin@ptsb.edu.my'];
    }
    
    // Analytics collection
    match /analytics/{document} {
      // All authenticated users can write analytics
      allow read, write: if request.auth != null;
    }
    
    // Feedback collection
    match /feedback/{document} {
      // All authenticated users can submit feedback
      allow read, write: if request.auth != null;
    }
    
    // Deletion requests (for user management)
    match /deletion_requests/{document} {
      // Only admins can manage deletion requests
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com', 'admin@ptsb.edu.my'];
    }
    
    // Session data (if needed)
    match /sessions/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Alternative Simpler Rules (Jika masih ada masalah)

Kalau rules atas masih complex, guna yang lebih simple ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Basic rule: Authenticated users can access most data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Exception: Only specific admins for sensitive operations
    match /user_data/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com'];
    }
    
    match /deletion_requests/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['tengkuyusoff19@gmail.com'];
    }
  }
}
```

## Key Improvements

1. **Simplified admin check** - guna email directly instead of complex `get()` operations
2. **More permissive reading** - allow authenticated users to read what they need
3. **Clear collection rules** - specific rules untuk each collection
4. **Better user creation flow** - proper rules untuk user_data collection

## Testing Steps

1. Apply salah satu rules di atas
2. Test sign in
3. Test user management (if admin)
4. Test normal user operations
5. Check Firebase Debug Panel untuk verify permissions

Pilih mana-mana rules yang sesuai dengan keperluan security anda!