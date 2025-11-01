import axios from 'axios';
import { auth } from '../firebase'; // This is just for the login/logout functions

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token found. Please log in.');
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

export const loginUser = async (email, password) => {
  const body = { email, password };
  const response = await axios.post(`${API_BASE_URL}/auth/login`, body);
  return response.data;
};

export const getMe = async () => {
  const config = getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/users/me`, config);
  return response.data;
};

// --- SPACES ---
export const getMySpaces = async () => {
  const config = getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/spaces`, config);
  return response.data;
};

export const createTeamSpace = async (spaceName) => {
  const config = getAuthHeader();
  const body = { name: spaceName };
  const response = await axios.post(`${API_BASE_URL}/spaces`, body, config);
  return response.data;
};

// --- COLLABORATION ---
export const searchUserByEmail = async (email) => {
  const config = getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/users/search`, {
    ...config,
    params: { email }
  });
  return response.data;
};

export const addMemberToSpace = async (spaceId, newMemberUid) => {
  const config = getAuthHeader();
  const body = { newMemberUid };
  const response = await axios.post(`${API_BASE_URL}/spaces/${spaceId}/members`, body, config);
  return response.data;
};

// --- FOLDERS ---
export const getFolders = async (spaceId, folderId = null) => {
  const config = getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/folders`, {
    ...config,
    params: { spaceId, parentId: folderId }
  });
  return response.data;
};

export const createFolder = async (name, spaceId, parentId = null) => {
  const config = getAuthHeader();
  const body = { name, spaceId, parentId };
  const response = await axios.post(`${API_BASE_URL}/folders`, body, config);
  return response.data;
};

// --- FILES (formerly Snippets) ---
export const getFiles = async (spaceId, folderId = null) => {
  const config = getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/files`, {
    ...config,
    params: { spaceId, parentId: folderId }
  });
  return response.data;
};

export const createFile = async (data) => {
  const config = getAuthHeader();
  const response = await axios.post(`${API_BASE_URL}/files`, data, config);
  return response.data;
};

// --- NEW "SAVE" FUNCTION ---
export const updateFile = async (fileId, content) => {
  const config = getAuthHeader();
  const body = { content };
  const response = await axios.put(`${API_BASE_URL}/files/${fileId}`, body, config);
  return response.data;
};