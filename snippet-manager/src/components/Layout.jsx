import React, { useState } from 'react';
import Sidebar from './Sidebar'; // The new all-in-one sidebar
import Editor from './Editor';
import Modal from './Modal';
import SpaceSettings from './SpaceSettings';
import NewFileForm from './NewFileForm';
import NewFolderForm from './NewFolderForm';

const Layout = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Renamed from snippet
  const [currentSpace, setCurrentSpace] = useState(null); // We'll pass this down
  const [currentFolderId, setCurrentFolderId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(key => key + 1);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // --- Handlers for the Sidebar ---
  const handleOpenSettings = () => {
    if (!currentSpace) return;
    openModal(<SpaceSettings space={currentSpace} />);
  };

  const handleNewFile = () => {
    openModal(
      <NewFileForm 
        spaceId={currentSpace.id} 
        folderId={currentFolderId} 
      />
    );
  };
  
  const handleNewFolder = () => {
    openModal(
      <NewFolderForm
        spaceId={currentSpace.id}
        folderId={currentFolderId}
      />
    );
  };

  return (
    <>
      <div className="app-layout-2-column"> {/* New CSS class */}
        <Sidebar 
          onSelectFile={setSelectedFile}
          onSelectSpace={setCurrentSpace}
          onSelectFolder={setCurrentFolderId}
          onOpenSettings={handleOpenSettings}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          refreshKey={refreshKey}
          triggerRefresh={triggerRefresh}
        />
        
        <Editor 
          file={selectedFile} // Renamed prop
          triggerRefresh={triggerRefresh} 
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent && React.cloneElement(modalContent, {
          onClose: () => {
            closeModal();
            triggerRefresh();
          }
        })}
      </Modal>
    </>
  );
};

export default Layout;