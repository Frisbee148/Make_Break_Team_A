import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

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

// --- AUTH ---
export const registerUser = async (email, password) => {
  const body = { email, password };
  const response = await axios.post(`${API_BASE_URL}/auth/register`, body);
  return response.data;
};

// --- SPACES ---
export const getMySpaces = async () => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/spaces`, config);
  return response.data;
};

export const createTeamSpace = async (spaceName) => {
  const config = await getAuthHeader();
  const body = { name: spaceName };
  const response = await axios.post(`${API_BASE_URL}/spaces`, body, config);
  return response.data;
};

// --- COLLABORATION ---
export const searchUserByEmail = async (email) => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/users/search`, {
    ...config,
    params: { email }
  });
  return response.data; // Returns { uid, email }
};

export const addMemberToSpace = async (spaceId, newMemberUid) => {
  const config = await getAuthHeader();
  const body = { newMemberUid };
  const response = await axios.post(`${API_BASE_URL}/spaces/${spaceId}/members`, body, config);
  return response.data;
};

// --- FOLDERS ---
export const getFolders = async (spaceId, folderId = null) => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/folders`, {
    ...config,
    params: { spaceId, parentId: folderId }
  });
  return response.data;
};

export const createFolder = async (name, spaceId, parentId = null) => {
  const config = await getAuthHeader();
  const body = { name, spaceId, parentId };
  const response = await axios.post(`${API_BASE_URL}/folders`, body, config);
  return response.data;
};

// --- SNIPPETS ---
export const getSnippets = async (spaceId, folderId = null) => {
  const config = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/snippets`, {
    ...config,
    params: { spaceId, parentId: folderId }
  });
  return response.data;
};

export const createSnippet = async (data) => {
  const config = await getAuthHeader();
  const response = await axios.post(`${API_BASE_URL}/snippets`, data, config);
  return response.data;
};