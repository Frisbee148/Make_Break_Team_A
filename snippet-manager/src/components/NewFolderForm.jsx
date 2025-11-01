import React, { useState } from 'react';
import { createFolder } from '../api/serverApi'; // Use new API

const NewFolderForm = ({ spaceId, folderId = null, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter a folder name.");
      return;
    }

    try {
      // Pass the name, spaceId, and parentId to the API
      await createFolder(name, spaceId, folderId);
      onClose(); // Close modal and trigger refresh
    } catch (err) {
      console.error("Error creating folder:", err);
      alert("Failed to create folder");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <h3>New Folder</h3>
      <input
        type="text"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Folder</button>
    </form>
  );
};

export default NewFolderForm;