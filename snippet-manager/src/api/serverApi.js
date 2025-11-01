import axios from 'axios';
import { auth } from '../firebase'; // We still use this to get the current user

// Your server's address
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * A helper function to get the current user's auth token
 * and create the required headers for our backend.
 */
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is logged in.');
  
  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// --- SPACE FUNCTIONS ---

export const getMySpaces = async () => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/spaces`, config);
  return response.data; // Returns the [spaces] array
};

export const createTeamSpace = async (spaceName) => {
  const config = await getAuthHeader();
  const body = { name: spaceName };
  const response = await axios.post(`${API_BASE_URL}/spaces`, body, config);
  return response.data; // Returns the {newSpace} object
};

// --- FOLDER FUNCTIONS (These were missing) ---

/**
 * Gets folders. If 'folderId' is null, gets top-level folders.
 */
export const getFolders = async (spaceId, folderId = null) => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/folders`, {
    ...config,
    params: { spaceId, parentId: folderId } // Send as query params
  });
  return response.data;
};

/**
 * Creates a new folder.
 */
export const createFolder = async (name, spaceId, parentId = null) => {
  const config = await getAuthHeader();
  const body = { name, spaceId, parentId };
  const response = await axios.post(`${API_BASE_URL}/folders`, body, config);
  return response.data;
};

// --- SNIPPET FUNCTIONS (These were missing) ---

/**
 * Gets snippets. If 'folderId' is null, gets top-level snippets.
 */
export const getSnippets = async (spaceId, folderId = null) => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/snippets`, {
    ...config,
    params: { spaceId, parentId: folderId } // Send as query params
  });
  return response.data;
};
// --- ADD THIS NEW FUNCTION ---
export const registerUser = async (email, password) => {
  const body = { email, password };
  // This is a public route, so it does NOT need an auth header
  const response = await axios.post(`${API_BASE_URL}/auth/register`, body);
  return response.data;
}

/**
 * Creates a new snippet.
 */
export const createSnippet = async (data) => {
  const config = await getAuthHeader();
  // 'data' is the object { title, content, language, tags, spaceId, parentId }
  const response = await axios.post(`${API_BASE_URL}/snippets`, data, config);
  return response.data;
};