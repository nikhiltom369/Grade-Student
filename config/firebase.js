const admin = require('firebase-admin');

// PLACEHOLDER: Please provide your Firebase Admin SDK service account credentials.
// You can download this from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key.
// Save the JSON file in the config folder as `serviceAccountKey.json` or paste the object directly below.

let db = null;

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully.");
    db = admin.firestore();
} catch (error) {
    console.warn("⚠️ Firebase Warning: serviceAccountKey.json not found in config folder.");
    console.warn("⚠️ Please add it to enable database features.");
    console.warn("⚠️ Application started in limited mode without Firebase.");
    db = null;
}

module.exports = { db, admin };
