import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="flex justify-center border-t border-gray-200 bg-white">
      <div className="flex max-w-5xl flex-1 flex-col">
        <div className="flex flex-col gap-8 px-5 py-12">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a className="text-gray-500 text-sm font-normal leading-normal hover:text-gray-900 transition-colors" href="#">
              About
            </a>
            <a className="text-gray-500 text-sm font-normal leading-normal hover:text-gray-900 transition-colors" href="#">
              Contact
            </a>
            <a className="text-gray-500 text-sm font-normal leading-normal hover:text-gray-900 transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-gray-500 text-sm font-normal leading-normal hover:text-gray-900 transition-colors" href="#">
              Privacy Policy
            </a>
          </div>
          <p className="text-gray-500 text-sm font-normal leading-normal text-center">
            © 2024 Unhire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;