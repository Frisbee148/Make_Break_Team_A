import { db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

// --- SPACE FUNCTIONS ---

/**
 * Gets all spaces (personal and team) a user is a member of.
 * @param {string} userId - The UID of the currently logged-in user.
 */
export const getMySpaces = (userId) => {
  const spacesRef = collection(db, "spaces");
  const q = query(spacesRef, where("members", "array-contains", userId));
  return getDocs(q);
};

/**
 * Creates a new team space.
 * @param {string} spaceName - The name for the new space.
 * @param {string} userId - The UID of the user creating the space (they will be the owner).
 */
export const createTeamSpace = (spaceName, userId) => {
  const spacesRef = collection(db, "spaces");
  return addDoc(spacesRef, {
    name: spaceName,
    ownerId: userId,
    members: [userId], // Start with just the owner as a member
    isPersonal: false,
    createdAt: serverTimestamp()
  });
};

/**
 * Invites a new user (by their UID) to a space.
 * @param {string} spaceId - The ID of the space to update.
 * @param {string} newMemberUid - The UID of the user to add.
 *a @param {Array<string>} currentMembers - The existing list of member UIDs.
 */
export const inviteUserToSpace = (spaceId, newMemberUid, currentMembers) => {
  // Prevent duplicate members
  if (currentMembers.includes(newMemberUid)) {
    return; 
  }
  const spaceRef = doc(db, "spaces", spaceId);
  return updateDoc(spaceRef, {
    members: [...currentMembers, newMemberUid]
  });
};


// --- FOLDER & SNIPPET FUNCTIONS ---

/**
 * Gets the top-level folders OR snippets for a given space.
 * @param {string} spaceId - The ID of the current space.
 * @param {'folders' | 'snippets'} collectionName - The collection to query.
 */
export const getTopLevelItems = (spaceId, collectionName) => {
  const itemsRef = collection(db, collectionName);
  const q = query(
    itemsRef,
    where("spaceId", "==", spaceId),
    where("parentId", "==", null) // 'null' parent means it's at the top
  );
  return getDocs(q);
};

/**
 * Gets the subfolders OR snippets inside a specific folder.
 * @param {string} folderId - The ID of the parent folder.
 * @param {'folders' | 'snippets'} collectionName - The collection to query.
 */
export const getFolderChildren = (folderId, collectionName) => {
  const itemsRef = collection(db, collectionName);
  const q = query(itemsRef, where("parentId", "==", folderId));
  return getDocs(q);
};

/**
 * Creates a new snippet.
 * @param {object} data - The snippet data.
 * @param {string} data.title - Snippet title.
 * @param {string} data.content - The code content.
 * @param {string} data.language - e.g., 'javascript'.
 * @param {string} data.spaceId - The space this snippet belongs to.
 * @param {string | null} data.folderId - The parent folder ID, or null for top-level.
 * @param {Array<string>} data.tags - List of tags.
 */
export const createSnippet = (data) => {
  const snippetsRef = collection(db, "snippets");
  return addDoc(snippetsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
};

/**
 * Creates a new folder.
 * @param {object} data - The folder data.
 * @param {string} data.name - Folder name.
 * @param {string} data.spaceId - The space this folder belongs to.
 * @param {string | null} data.parentId - The parent folder ID, or null for top-level.
 */
export const createFolder = (data) => {
  const foldersRef = collection(db, "folders");
  return addDoc(foldersRef, {
    ...data,
    createdAt: serverTimestamp()
  });
};

/**
 * Updates an existing snippet.
 * @param {string} snippetId - The ID of the snippet to update.
 * @param {object} data - The fields to update (e.g., { title, content, tags }).
 */
export const updateSnippet = (snippetId, data) => {
  const snippetRef = doc(db, "snippets", snippetId);
  return updateDoc(snippetRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

/**
 * Deletes a snippet.
 * @param {string} snippetId - The ID of the snippet to delete.
 */
export const deleteSnippet = (snippetId) => {
  const snippetRef = doc(db, "snippets", snippetId);
  return deleteDoc(snippetRef);
};

// Note: You would also add deleteFolder, updateFolder, etc.