import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import logo from '../assets/logo.svg';


interface HeaderProps {
  variant?: 'landing' | 'app';
}

const Header: React.FC<HeaderProps> = ({ variant = 'landing' }) => {
  const Logo = () => (
    <div className="flex items-center gap-3 text-gray-900 ml-10">
      <img
        src={logo}
        alt="Unhire Logo"
        className="h-8 w-auto object-contain"
      />
    </div>
  );

  if (variant === 'landing') {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 bg-white">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex flex-1 justify-end gap-4">
          <nav className="flex items-center gap-6">
            <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/find-jobs">
              Find Work
            </Link>
            <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/post-job">
              Find Talent
            </Link>
            <a className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" href="#">
              Why Unhire?
            </a>
            <a className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" href="#">
              Pricing
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              to="/post-job"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300 transform hover:scale-105"
            >
              <span className="truncate">Post a Job</span>
            </Link>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gray-100 text-gray-800 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
              <span className="truncate">Log In</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 bg-white">
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex flex-1 justify-end gap-4">
        <nav className="flex items-center gap-6">
          <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/">
            Home
          </Link>
          <a className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" href="#">
            Dashboard
          </a>
          <a className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" href="#">
            My Jobs
          </a>
          <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/find-jobs">
            Find Talent
          </Link>
        </nav>
        <div className="flex gap-3">
          <button className="relative flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <Bell size={20} />
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-transparent hover:border-[#87CEEB] transition-colors cursor-pointer" 
               style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100")' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;