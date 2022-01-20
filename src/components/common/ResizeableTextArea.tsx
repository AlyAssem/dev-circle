import React, { useState, useRef, useEffect } from 'react';

export const ResizeableTextArea: React.FC = () => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef?.current) {
      // no need to re-evaluate the height if the user hasn't switched to the next line.
      if (
        `${textareaRef.current.scrollHeight}px` !==
        textareaRef.current.style.height
      ) {
        // reseting and resizing the height of the textarea
        textareaRef.current.style.overflow = 'hidden';
        textareaRef.current.style.height = '0px';
        const { scrollHeight } = textareaRef.current;
        textareaRef.current.style.height = `${scrollHeight}px`;
      }

      const heightValueWithNoPx = Number(
        textareaRef.current.style.height.slice(0, -2)
      );

      // make the textarea scrollable after a certain height
      if (heightValueWithNoPx > 256) {
        textareaRef.current.style.overflow = 'auto';
      }
    }
  }, [value, textareaRef.current?.scrollHeight]);

  return (
    <textarea
      id='post-title'
      ref={textareaRef}
      className='card__input overflow-hidden resize-none max-h-64'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
