import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

/**
 * GET /api/snippets
 * Gets all snippets for a given space, filtered by parentId.
 * Query Params: ?spaceId=... & ?parentId=...
 */
router.get('/', async (req, res) => {
  try {
    const { spaceId, parentId } = req.query;
    const userId = req.user.uid;

    if (!spaceId) {
      return res.status(400).send('spaceId is required');
    }

    let query = db.collection('snippets')
                  .where('spaceId', '==', spaceId);
                  
    if (parentId && parentId !== 'null') {
      query = query.where('parentId', '==', parentId);
    } else {
      query = query.where('parentId', '==', null);
    }

    const spaceSnap = await db.collection('spaces').doc(spaceId).get();
    if (!spaceSnap.exists || !spaceSnap.data().members.includes(userId)) {
      return res.status(403).send('Forbidden: Not a member of this space');
    }

    const snapshot = await query.get();
    const snippets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(snippets);

  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * POST /api/snippets
 * Creates a new snippet.
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, language, tags, spaceId, parentId = null } = req.body;
    const userId = req.user.uid;

    if (!title || !content || !spaceId) {
      return res.status(400).send('title, content, and spaceId are required');
    }

    const spaceSnap = await db.collection('spaces').doc(spaceId).get();
    if (!spaceSnap.exists || !spaceSnap.data().members.includes(userId)) {
      return res.status(403).send('Forbidden: Not a member of this space');
    }

    const newSnippet = {
      title,
      content,
      language: language || 'plaintext',
      tags: tags || [],
      spaceId,
      parentId,
      ownerId: userId,
      createdAt: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('snippets').add(newSnippet);
    res.status(201).json({ id: docRef.id, ...newSnippet });

  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;