import React from 'react';

export const Header: React.FC = () => {
  return (
    <>
      {/* Top Bar */}
      <header className="border-b border-gray-100 bg-white">
        <div className="bg-blue-90 flex h-14 w-full items-center pl-4 pr-3 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
          <h1 className="text-2xl font-semibold text-primary">HRMS</h1>
        </div>
      </header>

      {/* Banner */}
      <div className="h-50 relative w-full overflow-hidden bg-gradient-to-r from-blue-900 to-blue-600 md:h-80">
        {/* Abstract overlay simulating the tech background */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <img
          src="https://depositphotos-blog.s3.eu-west-1.amazonaws.com/uploads/2017/07/Soothing-nature-backgrounds-2.jpg"
          alt="Banner"
          className="h-full w-full object-cover"
        />
      </div>
    </>
  );
};
