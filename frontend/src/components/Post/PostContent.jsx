import React from 'react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import './PostContent.css';

const PostContent = ({ content }) => {
  if (!content) return null;

  try {
    const contentState = convertFromRaw(JSON.parse(content));
    const editorState = EditorState.createWithContent(contentState);
    const currentContentState = editorState.getCurrentContent();

    const Media = (props) => {
      const entity = props.contentState.getEntity(props.block.getEntityAt(0));
      const entityType = entity.getType();
      const data = entity.getData();

      if (entityType === 'IMAGE') {
        return <img src={data.src} alt={data.alt || ''} />;
      }

      return null;
    };

    const blockRendererFn = (block) => {
      if (block.getType() === 'atomic') {
        const entityKey = block.getEntityAt(0);
        if (!entityKey) return null;
        const entity = currentContentState.getEntity(entityKey);
        if (entity.getType() === 'IMAGE') {
          return {
            component: Media,
            editable: false,
            props: {
              contentState: currentContentState,
            },
          };
        }
      }
      return null;
    };

    return (
      <div className="post-content-display">
        <Editor editorState={editorState} readOnly={true} blockRendererFn={blockRendererFn} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering content:', error);
    return <div>Агуулгыг ачаалж чадсангүй</div>;
  }
};

export default PostContent;

