import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import logo from '../assets/logo.svg';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const Logo = () => (
    <div className="flex items-center gap-3 text-gray-900">
      <img src={logo} alt="Unhire Logo" className="h-8 w-auto object-contain" />
    </div>
  );

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 bg-white">
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex flex-1 justify-end gap-4">
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <User size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <nav className="flex items-center gap-6">
              <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/signup?role=expert">
                Find Work
              </Link>
              <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/signup?role=client">
                Find Talent
              </Link>
              <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/about">
                Why Unhire?
              </Link>
              <Link className="text-gray-700 text-sm font-medium leading-normal hover:text-gray-900 transition-colors" to="/pricing">
                Pricing
              </Link>
            </nav>
            <div className="flex gap-3">
              <Link to="/signup?role=client" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300 transform hover:scale-105">
                <span className="truncate">Signup</span>
              </Link>
              <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gray-100 text-gray-800 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                <span className="truncate">Log In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
