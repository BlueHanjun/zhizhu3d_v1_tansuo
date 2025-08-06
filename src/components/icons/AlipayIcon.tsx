import React from 'react';

const AlipayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M864 64H160C106.912 64 64 106.912 64 160v704c0 53.088 42.912 96 96 96h704c53.088 0 96-42.912 96-96V160c0-53.088-42.912-96-96-96z"
      fill="#1677FF"
    ></path>
    <path
      d="M622.848 369.088h-194.432v102.4h168.064v78.592h-168.064v124.672h194.432v78.592H349.824V290.496h351.616v78.592z"
      fill="#FFFFFF"
    ></path>
  </svg>
);

export default AlipayIcon;