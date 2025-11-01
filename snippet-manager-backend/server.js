import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

// Import our middleware and ALL routes
import authMiddleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';     // <-- ADD THIS
import spaceRoutes from './routes/spaces.js';
import folderRoutes from './routes/folders.js';
import snippetRoutes from './routes/snippets.js';

const app = express();
app.use(cors()); 
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.send('Server is healthy! 🚀');
});

// --- Public Auth Routes (No middleware) ---
app.use('/api/auth', authRoutes); // <-- ADD THIS

// --- Protected Data Routes (Uses middleware) ---
app.use('/api/spaces', authMiddleware, spaceRoutes);
app.use('/api/folders', authMiddleware, folderRoutes);
app.use('/api/snippets', authMiddleware, snippetRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});