# 🔥 Firebase Rules untuk Testing

## Temporary Rules - Untuk Debug Permissions Issue

Pergi ke Firebase Console → Firestore Database → Rules dan ganti dengan rules ini untuk testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary - Allow all authenticated users full access for testing
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Selepas Test Berjaya - Production Rules

Selepas confirm authentication berfungsi, tukar kepada rules yang lebih secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to manage all users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User data collection (for admin user creation)
    match /user_data/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // General collections for authenticated users
    match /forecasts/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /analytics/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing Steps

1. **Start with temporary rules** (first rules above)
2. **Test sign in** dengan existing account
3. **Check Firebase Debug Panel** - semua collections should show ✅
4. **Test basic functionality** 
5. **Switch to production rules** when everything works
6. **Test again** to ensure proper permissions

## Important Notes

- **JANGAN tinggalkan temporary rules dalam production**
- Rules pertama membenarkan semua authenticated users access semua data
- Guna untuk debug sahaja, kemudian tukar ke production rules