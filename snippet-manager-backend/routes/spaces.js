import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
// 1. CHANGE THIS IMPORT
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// GET /api/spaces
// ... (this route is fine) ...
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid; 
    const spacesRef = db.collection('spaces');
    const snapshot = await spacesRef.where('members', 'array-contains', userId).get();
    
    const spaces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(spaces);
    
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /api/spaces
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.uid;

    if (!name) {
      return res.status(400).send('Space name is required');
    }

    const newSpace = {
      name: name,
      ownerId: userId,
      members: [userId],
      isPersonal: false,
      // 2. CHANGE THIS LINE
      createdAt: FieldValue.serverTimestamp() 
    };

    const docRef = await db.collection('spaces').add(newSpace);
    res.status(201).json({ id: docRef.id, ...newSpace });

  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;