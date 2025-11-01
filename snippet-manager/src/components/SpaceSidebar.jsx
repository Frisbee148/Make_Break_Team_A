import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaSignOutAlt, FaFire, FaUserPlus } from 'react-icons/fa'; // Added FaUserPlus
import CollaboratorModal from './CollaboratorModal'; // We will create this

const SpaceSidebar = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-sidebar">
      {/* This will be your space switcher later */}
      <div style={{ padding: '10px', cursor: 'pointer' }} title="Personal Space">
        <FaFire size={28} />
      </div>
      
      {/* Add Collaborator Button */}
      <div 
        style={{ padding: '10px', cursor: 'pointer', marginTop: '10px' }} 
        title="Add Collaborator"
        onClick={() => setIsModalOpen(true)}
      >
        <FaUserPlus size={24} />
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: 'auto', padding: '20px', cursor: 'pointer' }} onClick={logout}>
        <FaSignOutAlt size={24} title="Logout" />
      </div>

      {/* The Modal itself */}
      <CollaboratorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SpaceSidebar;