import { Router } from 'express';
import { auth, db } from '../firebaseAdmin.js'; // Use the Admin SDK
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

/**
 * POST /api/auth/register
 * Creates a new user in Firebase Auth AND creates their personal space in Firestore.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Step 1: Create the user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });
    
    const uid = userRecord.uid;

    // Step 2: Create their personal space in Firestore
    const spaceRef = db.collection('spaces').doc(`personal_${uid}`);
    await spaceRef.set({
      name: "My Personal Space",
      ownerId: uid,
      members: [uid], // They are the only member
      isPersonal: true,
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(201).json({ uid: uid, email: userRecord.email, message: 'User created successfully' });

  } catch (error) {
    // Handle errors (e.g., email already exists)
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;