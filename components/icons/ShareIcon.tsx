import React from 'react';

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.042.583.042h6.116c.193 0 .388-.017.583-.042m-7.282 0c-.195-.025-.39-.042-.583-.042h-1.99a2.25 2.25 0 00-2.247 2.247v.001a2.25 2.25 0 002.247 2.247h1.99c.193 0 .388-.017.583-.042m4.5-4.5h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008zm-4.5 4.5h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z"
    />
  </svg>
);

export default ShareIcon;
