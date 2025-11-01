import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { updateFile } from '../api/serverApi'; // Import the new save function

const Editor = ({ file, triggerRefresh }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // When the 'file' prop changes (user clicks a new file),
  // update the local 'content' state.
  useEffect(() => {
    if (file) {
      setContent(file.content);
      setSaveMessage('');
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;

    setIsSaving(true);
    setSaveMessage('Saving...');
    try {
      await updateFile(file.id, content);
      setIsSaving(false);
      setSaveMessage('File saved successfully!');
      triggerRefresh(); // Refresh sidebar in case name/etc changed (future)
    } catch (err) {
      console.error("Error saving file:", err);
      setIsSaving(false);
      setSaveMessage('Error saving file.');
    }
  };

  if (!file) {
    return (
      <div className="editor-main">
        <h2>Select a file to view or edit</h2>
        <p>Or, click "New File" to create one.</p>
      </div>
    );
  }

  return (
    <div className="editor-main">
      <div className="editor-header">
        <h2>{file.title}</h2>
        <div className="editor-actions">
          <span>{saveMessage}</span>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save File'}
          </button>
        </div>
      </div>
      
      <p>{file.description || "No description provided."}</p>
      
      <CodeMirror
        value={content}
        height="70vh"
        theme={okaidia}
        extensions={[javascript({ jsx: true })]}
        onChange={(value) => setContent(value)} // Update local state on edit
        readOnly={false} // It's now editable
      />
    </div>
  );
};

export default Editor;