const admin = require('firebase-admin');

// PLACEHOLDER: Please provide your Firebase Admin SDK service account credentials.
// You can download this from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key.
// Save the JSON file in the config folder as `serviceAccountKey.json` or paste the object directly below.

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully.");
} catch (error) {
    console.warn("⚠️ Firebase Warning: serviceAccountKey.json not found in config folder.");
    console.warn("⚠️ Please add it to enable database features.");
    // Fallback initialize without credentials (will fail on DB operations but allow app to start)
    // To allow the application to start up anyway, we can just not initialize or initialize with mock
    
    // Uncomment to initialize with default credentials if running in GCP:
    // admin.initializeApp();
}

const db = admin.firestore ? admin.firestore() : null;

module.exports = { db, admin };
