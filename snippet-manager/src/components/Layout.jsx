import React from 'react';
import SpaceSidebar from './SpaceSidebar';
import FolderSidebar from './FolderSidebar';
import Editor from './Editor';

const Layout = () => {
  return (
    <div className="app-layout">
      <SpaceSidebar />
      <FolderSidebar />
      <Editor />
    </div>
  );
};

export default Layout;