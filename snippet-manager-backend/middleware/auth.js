import { auth } from '../firebaseAdmin.js';

const authMiddleware = async (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check if it's a Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  // 3. Get the token
  const idToken = authHeader.split(' ')[1];

  try {
    // 4. Verify the token with Firebase
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // 5. Success! Attach the user's data to the request object
    req.user = decodedToken; 
    next(); // Continue to the next function (the route handler)
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

export default authMiddleware;