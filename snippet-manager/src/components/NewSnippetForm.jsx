import React, { useState } from 'react';
import { createSnippet } from '../api/serverApi'; // Use new API
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

// 'onClose' will be passed by the Modal
const NewSnippetForm = ({ spaceId, folderId = null, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in a title and some code.");
      return;
    }

    const data = {
      title,
      content,
      language,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      spaceId: spaceId,
      parentId: folderId,
    };

    try {
      await createSnippet(data); // Call server API
      onClose(); // Close the modal (this also triggers a refresh)
    } catch (err) {
      console.error("Error creating snippet:", err);
      alert("Failed to create snippet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <h3>New Code Snippet</h3>
      <input
        type="text"
        placeholder="Snippet title (e.g., 'myFunction.js')"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Language (e.g., 'javascript')"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated, e.g., 'react, hook')"
        value={tags}
        onChange={(e) => setTags(e.g.target.value)}
      />
      <CodeMirror
        value={content}
        height="300px"
        theme={okaidia}
        extensions={[javascript({ jsx: true })]}
        onChange={(value) => setContent(value)}
      />
      <button type="submit">Create Snippet</button>
    </form>
  );
};

export default NewSnippetForm;