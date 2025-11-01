import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMySpaces, createTeamSpace } from '../api/serverApi'; // Use new API
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';

const SpaceSidebar = ({ onSelectSpace, refreshKey, triggerRefresh }) => {
  const { currentUser, logout } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpaceId, setActiveSpaceId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // We are now fetching, not listening in real-time
      getMySpaces()
        .then(data => {
          setSpaces(data);
          // If no space is active, select the first one
          if (data.length > 0 && !activeSpaceId) {
            const firstSpaceId = data[0].id;
            setActiveSpaceId(firstSpaceId);
            onSelectSpace(firstSpaceId);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching spaces:", err);
          setLoading(false);
          if (err.response?.status === 401) logout(); // Bad token, force logout
        });
    }
  }, [currentUser, onSelectSpace, activeSpaceId, logout, refreshKey]); // Refresh when key changes

  const handleCreateSpace = async () => {
    const spaceName = prompt("Enter new space name:");
    if (spaceName && currentUser) {
      try {
        await createTeamSpace(spaceName);
        triggerRefresh(); // Tell layout to refresh all data
      } catch (err) {
        console.error("Error creating space:", err);
        alert("Failed to create space.");
      }
    }
  };
  
  const handleSelectSpace = (spaceId) => {
    setActiveSpaceId(spaceId);
    onSelectSpace(spaceId);
  };

  return (
    <div className="space-sidebar">
      {spaces.map(space => (
        <div
          key={space.id}
          className={`space-icon ${space.id === activeSpaceId ? 'active' : ''}`}
          title={space.name}
          onClick={() => handleSelectSpace(space.id)}
        >
          {space.name.charAt(0).toUpperCase()}
        </div>
      ))}
      
      <div
        className="space-icon new-space-btn"
        title="Create New Space"
        onClick={handleCreateSpace}
      >
        <FaPlus />
      </div>
      
      <div 
        className="space-icon" 
        style={{ marginTop: 'auto' }} 
        onClick={logout} 
        title="Logout"
      >
        <FaSignOutAlt size={24} />
      </div>
    </div>
  );
};

export default SpaceSidebar;