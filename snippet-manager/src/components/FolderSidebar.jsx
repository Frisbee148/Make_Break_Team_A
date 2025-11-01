import React from 'react';

const FolderSidebar = () => {
  // Later, you will fetch and display your folders/snippets here
  return (
    <div className="folder-sidebar">
      <input type="text" placeholder="Search..." style={{width: '90%', padding: '8px'}}/>
      <h3 style={{marginTop: '20px'}}>My Personal Space</h3>
      
      {/* This is where your folder tree component will go */}
      <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
        <li>📄 My First Snippet.js</li>
        <li>📄 CSS-Tricks.css</li>
      </ul>
    </div>
  );
};

export default FolderSidebar;