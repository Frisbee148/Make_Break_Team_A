
import React from 'react';

const CollaboratorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // This stops the click from closing the modal
  const handleModalClick = (e) => e.stopPropagation();

  return (
    // The "overlay" is the dark background
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <h2>Add Collaborator</h2>
        <p>Invite a user to this space by their email.</p>
        
        <input 
          type="email" 
          placeholder="user@example.com" 
          style={{ width: '90%', padding: '10px' }}
        />
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
          <button style={{ backgroundColor: '#0e639c', color: 'white' }}>Send Invite</button>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;