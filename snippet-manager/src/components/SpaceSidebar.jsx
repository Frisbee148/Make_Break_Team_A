import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaSignOutAlt, FaUserCircle, FaFire } from 'react-icons/fa'; // Example icons

const SpaceSidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="space-sidebar">
      {/* This will be your space switcher later */}
      <div style={{ padding: '10px', cursor: 'pointer' }} title="Personal Space">
        <FaFire size={28} />
      </div>
      
      {/* Logout Button */}
      <div style={{ marginTop: 'auto', padding: '20px', cursor: 'pointer' }} onClick={logout}>
        <FaSignOutAlt size={24} title="Logout" />
      </div>
    </div>
  );
};

export default SpaceSidebar;