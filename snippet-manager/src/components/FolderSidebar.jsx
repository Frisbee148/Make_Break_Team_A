import React, { useState, useEffect } from 'react';
// Use the new server API
import { getFolders, getSnippets } from '../api/serverApi';
import { FaFileCode, FaFolder, FaPlus } from 'react-icons/fa';
import NewSnippetForm from './NewSnippetForm';
import NewFolderForm from './NewFolderForm'; // We will create this

const FolderSidebar = ({ spaceId, onSelectSnippet, openModal, refreshKey }) => {
  const [folders, setFolders] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // This will manage the current folder. For now, it's null (top-level)
  const [currentFolderId, setCurrentFolderId] = useState(null);

  useEffect(() => {
    if (spaceId) {
      setLoading(true);
      // Fetch based on current space AND folder
      const folderPromise = getFolders(spaceId, currentFolderId);
      const snippetPromise = getSnippets(spaceId, currentFolderId);

      Promise.all([folderPromise, snippetPromise])
        .then(([folderData, snippetData]) => {
          setFolders(folderData);
          setSnippets(snippetData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching items:", err);
          setLoading(false);
        });
    }
  }, [spaceId, currentFolderId, refreshKey]); // Refresh on key change

  const handleNewSnippet = () => {
    openModal(
      <NewSnippetForm 
        spaceId={spaceId} 
        folderId={currentFolderId} 
      />
    );
  };
  
  const handleNewFolder = () => {
    openModal(
      <NewFolderForm
        spaceId={spaceId}
        folderId={currentFolderId}
      />
    );
  };

  if (!spaceId) {
    return <div className="folder-sidebar">Loading space...</div>;
  }

  return (
    <div className="folder-sidebar">
      <input type="text" placeholder="Search this space..." style={{width: '90%', padding: '8px'}}/>
      
      <div className="sidebar-actions">
        <button onClick={handleNewSnippet}>
          <FaPlus /> New Snippet
        </button>
        <button onClick={handleNewFolder}>
          <FaPlus /> New Folder
        </button>
      </div>
      
      {loading && <p>Loading...</p>}

      {/* TODO: Add a "Back" button if currentFolderId is not null */}

      <h3 style={{marginTop: '20px'}}>Folders</h3>
      <ul className="item-list">
        {folders.map(folder => (
          // TODO: Add onClick to set currentFolderId
          <li key={folder.id}>
            <FaFolder /> {folder.name}
          </li>
        ))}
      </ul>

      <h3>Snippets</h3>
      <ul className="item-list">
        {snippets.map(snippet => (
          <li key={snippet.id} onClick={() => onSelectSnippet(snippet)}>
            <FaFileCode /> {snippet.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderSidebar;