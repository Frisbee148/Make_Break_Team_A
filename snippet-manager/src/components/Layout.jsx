import React, { useState } from 'react';
import SpaceSidebar from './SpaceSidebar';
import FolderSidebar from './FolderSidebar';
import Editor from './Editor';
import Modal from './Modal';
import SpaceSettings from './SpaceSettings'; // Import the new settings component

const Layout = () => {
  const [selectedSpace, setSelectedSpace] = useState(null); // Store the whole space object
  const [selectedSnippet, setSelectedSnippet] = useState(null);

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

  // This function will be passed to the FolderSidebar
  const handleOpenSettings = () => {
    if (!selectedSpace) return;
    openModal(
      <SpaceSettings space={selectedSpace} />
    );
  };

  return (
    <>
      <div className="app-layout">
        <SpaceSidebar 
          onSelectSpace={setSelectedSpace} // Pass the full space object
          refreshKey={refreshKey}
          triggerRefresh={triggerRefresh}
        />
        
        <FolderSidebar 
          space={selectedSpace} // Pass the full space object
          onSelectSnippet={setSelectedSnippet}
          openModal={openModal}
          triggerRefresh={triggerRefresh}
          refreshKey={refreshKey}
          onOpenSettings={handleOpenSettings} // Pass the settings handler
        />
        
        <Editor snippet={selectedSnippet} />
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