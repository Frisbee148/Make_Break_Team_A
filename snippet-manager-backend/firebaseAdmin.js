import admin from 'firebase-admin';

// --- THIS IS THE FIX ---
// We use 'createRequire' to import the JSON file
// This is the standard way to do it in older Node.js versions
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
// --- END OF FIX ---

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export the services we'll use
export const db = admin.firestore();
export const auth = admin.auth();