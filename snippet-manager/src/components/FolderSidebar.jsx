import React, { useState } from 'react';
// Import the icons for the new action bar
import { IoMdAdd } from "react-icons/io";
import { MdOutlineFileUpload, MdCreateNewFolder } from "react-icons/md";

const FolderSidebar = () => {
  // Mock data for the file tree
  const [tree, setTree] = useState([
    { id: 'f1', type: 'folder', name: 'src', children: [
      { id: 'f2', type: 'folder', name: 'components', children: [
        { id: 's1', type: 'snippet', name: 'Button.js' },
        { id: 's2', type: 'snippet', name: 'Modal.js' },
      ]},
      { id: 'f3', type: 'folder', name: 'hooks', children: [
        { id: 's3', type: 'snippet', name: 'useDebounce.js' },
      ]},
    ]},
    { id: 's4', type: 'snippet', name: 'Dockerfile' },
  ]);

  // Placeholder functions for the new buttons
  const handleNewSnippet = () => alert("Opening new snippet...");
  const handleNewFolder = () => alert("Creating new folder...");
  const handleFileUpload = () => alert("Opening file upload...");

  // A simple function to render the tree (you'll make this more complex later)
  const renderTree = (nodes) => (
    <ul style={{ listStyle: 'none', paddingLeft: '15px' }}>
      {nodes.map(node => (
        <li key={node.id}>
          {node.type === 'folder' ? '📁' : '📄'} {node.name}
          {node.children && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="folder-sidebar">
      <div className="folder-sidebar-header">
        <h3 style={{ margin: 0 }}>My Personal Space</h3>
        <div className="actions">
          <MdCreateNewFolder className="action-icon" title="New Folder" onClick={handleNewFolder} />
          <MdOutlineFileUpload className="action-icon" title="Upload Files" onClick={handleFileUpload} />
          <IoMdAdd className="action-icon" title="New Snippet" onClick={handleNewSnippet} />
        </div>
      </div>

      <input type="text" placeholder="Search..." style={{ width: '92%', padding: '8px', margin: '10px 0' }} />
      
      {renderTree(tree)}
    </div>
  );
};

export default FolderSidebar;