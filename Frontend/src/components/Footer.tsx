import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Unhire Logo" className="h-8 w-auto filter invert brightness-200" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link to="/about" className="text-text-secondary text-sm hover:text-white transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-text-secondary text-sm hover:text-white transition-colors">
              Pricing
            </Link>
            <a href="#" className="text-text-secondary text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-text-secondary text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Unhire. Empowering the global freelance economy.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/company/unhirecom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-white transition-colors"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;