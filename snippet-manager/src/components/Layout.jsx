import React, { useState } from 'react';
import SpaceSidebar from './SpaceSidebar';
import FolderSidebar from './FolderSidebar';
import Editor from './Editor';
import Modal from './Modal';

const Layout = () => {
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null); // Keep track of current folder
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // This state is the key to refreshing our data
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

  return (
    <>
      <div className="app-layout">
        <SpaceSidebar 
          onSelectSpace={setSelectedSpaceId}
          refreshKey={refreshKey} // Pass the key down
          triggerRefresh={triggerRefresh} // Pass the function down
        />
        
        <FolderSidebar 
          spaceId={selectedSpaceId} 
          onSelectSnippet={setSelectedSnippet}
          openModal={openModal}
          triggerRefresh={triggerRefresh}
          refreshKey={refreshKey}
        />
        
        <Editor snippet={selectedSnippet} />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* We pass 'triggerRefresh' to the form */}
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