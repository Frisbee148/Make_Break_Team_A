import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

// --- LANGUAGE DETECTOR & PACKS ---
// 1. Import the base language (JS)
import { javascript } from '@codemirror/lang-javascript';
// 2. Import other languages you want to support
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
// You'll need to install these: 
// npm install @codemirror/lang-python @codemirror/lang-css @codemirror/lang-html

const Editor = () => {
  // Mock data for the currently selected snippet
  const [snippet, setSnippet] = useState({
    title: 'useDebounce.js',
    content: "function useDebounce(value, delay) {\n  // ...\n}",
    language: 'javascript', // This will control the language pack
    tags: ['react', 'hook', 'debounce'],
    lastUpdated: '2 hours ago'
  });

  const onChange = (value) => {
    setSnippet(prev => ({ ...prev, content: value }));
  };

  // --- LANGUAGE DETECTOR ---
  // 3. This function selects the correct language pack based on snippet data
  const getLanguageExtension = () => {
    switch (snippet.language) {
      case 'javascript':
        return [javascript({ jsx: true })];
      case 'python':
        return [python()];
      case 'css':
        return [css()];
      case 'html':
        return [html()];
      default:
        return [javascript({ jsx: true })]; // Default to JS
    }
  };

  return (
    <div className="editor-main">
      <h2>{snippet.title}</h2>
      
      {/* --- GITHUB-LIKE METADATA BAR --- */}
      <div className="editor-metadata">
        <span className="metadata-item">
          <strong>Language:</strong> 
          {/* --- LANGUAGE INDICATOR --- */}
          <span className="language-indicator">{snippet.language}</span>
        </span>
        
        <span className="metadata-item">
          <strong>Tags:</strong> 
          {snippet.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </span>

        <span className="metadata-item" style={{ marginLeft: 'auto' }}>
          <strong>Last Updated:</strong> {snippet.lastUpdated}
        </span>
      </div>
      
      <CodeMirror
        value={snippet.content}
        height="70vh" // Increased height
        theme={okaidia}
        extensions={getLanguageExtension()} // Use the dynamic language
        onChange={onChange}
      />
    </div>
  );
};

export default Editor;