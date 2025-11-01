import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMySpaces, createTeamSpace, getFolders, getFiles } from '../api/serverApi';
import { FaFileCode, FaFolder, FaPlus, FaArrowLeft, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ 
  onSelectFile, 
  onSelectSpace, 
  onSelectFolder, 
  onOpenSettings, 
  onNewFile, 
  onNewFolder, 
  refreshKey, 
  triggerRefresh 
}) => {
  const { currentUser, logout } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- THIS useEffect IS NOW FIXED ---
  useEffect(() => {
    if (currentUser) {
      getMySpaces()
        .then(data => {
          setSpaces(data);

          // --- THIS IS THE FIXED LOGIC ---
          if (currentSpace) {
            // If we have a space selected, find its updated version in the new data
            const updatedCurrentSpace = data.find(s => s.id === currentSpace.id);
            if (updatedCurrentSpace) {
              setCurrentSpace(updatedCurrentSpace);
              onSelectSpace(updatedCurrentSpace);
            }
          } else if (data.length > 0) {
            // If no space is selected, default to the first one
            setCurrentSpace(data[0]);
            onSelectSpace(data[0]);
          }
          // --- END OF FIX ---
        })
        .catch(err => console.error("Error fetching spaces:", err));
    }
  }, [currentUser, refreshKey, onSelectSpace]); // 'currentSpace' is removed from deps

  // Fetch content whenever space or folder changes
  useEffect(() => {
    if (currentSpace) {
      setLoading(true);
      const folderId = currentFolder ? currentFolder.id : null;
      
      const folderPromise = getFolders(currentSpace.id, folderId);
      const filePromise = getFiles(currentSpace.id, folderId);

      Promise.all([folderPromise, filePromise])
        .then(([folderData, fileData]) => {
          setFolders(folderData);
          setFiles(fileData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching items:", err);
          setLoading(false);
        });
    }
  }, [currentSpace, currentFolder, refreshKey]);
  
  // Update parent when folder changes
  useEffect(() => {
    onSelectFolder(currentFolder ? currentFolder.id : null);
  }, [currentFolder, onSelectFolder]);

  const handleCreateSpace = async () => {
    const spaceName = prompt("Enter new space name:");
    if (spaceName && currentUser) {
      try {
        await createTeamSpace(spaceName);
        triggerRefresh(); // Refresh everything
      } catch (err) {
        console.error("Error creating space:", err);
      }
    }
  };

  const handleSelectSpace = (e) => {
    const space = spaces.find(s => s.id === e.target.value);
    setCurrentSpace(space);
    onSelectSpace(space);
    setCurrentFolder(null); // Go back to top level
  };

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <span>{currentUser?.email}</span>
        <button className="settings-btn" onClick={logout} title="Logout">
          <FaSignOutAlt />
        </button>
      </div>

      <div className="space-switcher">
        <select onChange={handleSelectSpace} value={currentSpace?.id || ''}>
          {spaces.map(space => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
        <button className="new-space-btn" onClick={handleCreateSpace} title="New Space">
          <FaPlus />
        </button>
      </div>

      {currentSpace && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3 style={{ flex: 1 }}>{currentSpace.name}</h3>
            {!currentSpace.isPersonal && (
              <button className="settings-btn" onClick={onOpenSettings} title="Space Settings">
                <FaCog />
              </button>
            )}
          </div>
          
          <div className="sidebar-actions">
            <button onClick={onNewFile}><FaPlus /> New File</button>
            <button onClick={onNewFolder}><FaPlus /> New Folder</button>
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

          <h4>Files</h4>
          <ul className="item-list">
            {files.map(file => (
              <li key={file.id} onClick={() => onSelectFile(file)}>
                <FaFileCode /> {file.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;