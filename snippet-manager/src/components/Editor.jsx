import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia'; // A nice dark theme

const Editor = () => {
  const [code, setCode] = useState("console.log('Hello, world!');");

  const onChange = (value) => {
    setCode(value);
  };

  return (
    <div className="editor-main">
      <h2>My First Snippet.js</h2>
      <p>This is a description for my test snippet.</p>
      
      <CodeMirror
        value={code}
        height="60vh"
        theme={okaidia} // Use the dark theme
        extensions={[javascript({ jsx: true })]} // Enable JS/JSX highlighting
        onChange={onChange}
      />
    </div>
  );
};

export default Editor;