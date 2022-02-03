/* eslint-disable react/require-default-props */
import React, { useRef } from 'react';

interface IRenderCounter {
  message?: string;
}
export const RenderCounter: React.FC<IRenderCounter> = ({ message = '' }) => {
  const renderCounter = useRef(0);
  renderCounter.current += 1;
  return (
    <h1>
      Renders: {renderCounter.current}, {message}
    </h1>
  );
};
