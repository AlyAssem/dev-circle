import React, { ReactElement, useState } from 'react';

interface ITooltip {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
  content: string;
  delay: number;
}

const Tooltip: React.FC<ITooltip> = ({ children, content, delay }) => {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 200);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className='inline-block relative'
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {active && (
        <div
          className='z-50 absolute bg-black text-white -top-8 -right-9 whitespace-nowrap p-1 rounded-md flex flex-col
        mb-6 shadow-md'
        >
          <span className='text-sm'>{content}</span>
          <div className='transform rotate-45 absolute -bottom-1.5 right-11 w-3 h-3 -mt-2 bg-black' />
        </div>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
