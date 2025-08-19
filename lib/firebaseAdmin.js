// lib/firebaseAdmin.js
// Server-side Firebase Admin initialization (for Next.js API routes)
const admin = require('firebase-admin');

// Use env vars (recommended on Vercel). Make sure to set these in your project settings.
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Replace literal \n with real newlines for private key
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (e) {
    console.error('Firebase admin init error:', e);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
