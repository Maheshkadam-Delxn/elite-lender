// components/AnimatedHeader.js
"use client";
import React from 'react';

const AnimatedHeader = ({ text }) => {
  return (
    <div className="flex items-center justify-center">
      <h2 className="text-center font-medium md:text-2xl xs:text-lg  xxs:text-lg desktop3xl:text-5xl">
        {text}
      </h2>
    </div>
  );
};

export default AnimatedHeader;
