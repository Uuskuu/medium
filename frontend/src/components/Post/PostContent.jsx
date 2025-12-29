import React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import './PostContent.css';

const PostContent = ({ content }) => {
  if (!content) return null;

  try {
    const contentState = convertFromRaw(JSON.parse(content));
    const editorState = EditorState.createWithContent(contentState);

    return (
      <div className="post-content-display">
        <Editor editorState={editorState} readOnly={true} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering content:', error);
    return <div>Агуулгыг ачаалж чадсангүй</div>;
  }
};

export default PostContent;

