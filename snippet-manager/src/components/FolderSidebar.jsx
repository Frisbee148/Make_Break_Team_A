import React, { useState, useEffect } from 'react';
import { getFolders, getSnippets } from '../api/serverApi';
import { FaFileCode, FaFolder, FaPlus, FaArrowLeft, FaCog } from 'react-icons/fa'; // Added FaCog
import NewSnippetForm from './NewSnippetForm';
import NewFolderForm from './NewFolderForm';

const FolderSidebar = ({ space, onSelectSnippet, openModal, refreshKey, onOpenSettings }) => {
  const [folders, setFolders] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null); // { id, name }

  useEffect(() => {
    if (space) {
      setLoading(true);
      const folderId = currentFolder ? currentFolder.id : null;
      const spaceId = space.id;

      const folderPromise = getFolders(spaceId, folderId);
      const snippetPromise = getSnippets(spaceId, folderId);

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
  }, [space, currentFolder, refreshKey]); // Re-fetch when space or folder changes

  const handleNewSnippet = () => {
    openModal(
      <NewSnippetForm 
        spaceId={space.id} 
        folderId={currentFolder ? currentFolder.id : null} 
      />
    );
  };
  
  const handleNewFolder = () => {
    openModal(
      <NewFolderForm
        spaceId={space.id}
        folderId={currentFolder ? currentFolder.id : null}
      />
    );
  };

  if (!space) {
    return <div className="folder-sidebar">Loading space...</div>;
  }

  return (
    <div className="folder-sidebar">
      <div className="sidebar-header">
        <h3 style={{ flex: 1 }}>{space.name}</h3>
        {/* Settings button, only show for non-personal spaces */}
        {!space.isPersonal && (
          <button className="settings-btn" onClick={onOpenSettings}>
            <FaCog />
          </button>
        )}
      </div>

      <input type="text" placeholder="Search this space..." style={{width: '90%', padding: '8px'}}/>
      
      <div className="sidebar-actions">
        <button onClick={handleNewSnippet}><FaPlus /> New Snippet</button>
        <button onClick={handleNewFolder}><FaPlus /> New Folder</button>
      </div>
      
      {loading && <p>Loading...</p>}

      {currentFolder && (
        <button className="back-button" onClick={() => setCurrentFolder(null)}>
          <FaArrowLeft /> Back to Top
        </button>
      )}

      <h4 style={{marginTop: '20px'}}>
        {currentFolder ? currentFolder.name : 'Top Level'}
      </h4>
      
      <ul className="item-list">
        {folders.map(folder => (
          <li key={folder.id} onClick={() => setCurrentFolder(folder)}>
            <FaFolder /> {folder.name}
          </li>
        ))}
      </ul>

      <h4>Snippets</h4>
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