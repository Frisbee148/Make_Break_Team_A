import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

/**
 * GET /api/folders
 * Gets all folders for a given space, filtered by parentId.
 * Query Params: ?spaceId=... & ?parentId=...
 */
router.get('/', async (req, res) => {
  try {
    const { spaceId, parentId } = req.query;
    const userId = req.user.uid; // From auth middleware

    if (!spaceId) {
      return res.status(400).send('spaceId is required');
    }

    let query = db.collection('folders')
                  .where('spaceId', '==', spaceId);
                  
    // This logic handles getting top-level (null) or nested folders
    if (parentId && parentId !== 'null') {
      query = query.where('parentId', '==', parentId);
    } else {
      query = query.where('parentId', '==', null);
    }

    // We also check if the user is a member of the space
    // This is optional since our authMiddleware implies user is valid,
    // but it's good practice for multi-tenant security.
    const spaceSnap = await db.collection('spaces').doc(spaceId).get();
    if (!spaceSnap.exists || !spaceSnap.data().members.includes(userId)) {
      return res.status(403).send('Forbidden: Not a member of this space');
    }

    const snapshot = await query.get();
    const folders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(folders);

  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * POST /api/folders
 * Creates a new folder.
 */
router.post('/', async (req, res) => {
  try {
    const { name, spaceId, parentId = null } = req.body;
    const userId = req.user.uid;

    if (!name || !spaceId) {
      return res.status(400).send('name and spaceId are required');
    }
    
    // Again, server-side check for permission
    const spaceSnap = await db.collection('spaces').doc(spaceId).get();
    if (!spaceSnap.exists || !spaceSnap.data().members.includes(userId)) {
      return res.status(403).send('Forbidden: Not a member of this space');
    }

    const newFolder = {
      name,
      spaceId,
      parentId,
      ownerId: userId,
      createdAt: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('folders').add(newFolder);
    res.status(201).json({ id: docRef.id, ...newFolder });

  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;