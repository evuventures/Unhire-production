import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, ArrowRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    if (token) {
      fetchNotifications();
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Find Work', path: '/signup?role=expert' },
    { name: 'Find Talent', path: '/signup?role=client' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="container mx-auto px-6">
        <div className={`glass rounded-2xl px-6 py-2 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-surface/80 shadow-lg' : 'bg-transparent'}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Unhire Logo" className="h-8 w-auto filter invert brightness-200 transition-transform group-hover:scale-105" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center size-10 rounded-full glass hover:bg-white/10 transition-colors border border-white/20">
                    <User size={20} className="text-white" />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-48 glass-card overflow-hidden shadow-2xl p-1 z-50">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-white/10 rounded-xl transition-colors">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative flex items-center justify-center size-10 rounded-full glass hover:bg-white/10 transition-colors border border-white/20">
                    <Bell size={20} className="text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-80 glass-card overflow-hidden shadow-2xl p-2 z-50 max-h-[400px] overflow-y-auto">
                        <h3 className="text-sm font-bold p-3 border-b border-white/5">Notifications</h3>
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-xs text-text-secondary">No notifications yet</p>
                        ) : (
                          <div className="flex flex-col gap-1 mt-2">
                            {notifications.map((n) => (
                              <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-3 rounded-xl cursor-pointer transition-colors ${n.isRead ? 'opacity-60 hover:bg-white/5' : 'bg-primary/10 hover:bg-primary/20'}`}>
                                <p className="text-xs text-text-primary mb-1">{n.message}</p>
                                <p className="text-[10px] text-text-secondary">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">Log In</Link>
                  <Link to="/signup?role=client" className="btn-primary py-2 px-5 text-sm flex items-center gap-2 group">
                    Get Started
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass-card mx-6 mt-2 overflow-hidden border-white/10 shadow-2xl">
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-white">
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white">Log In</Link>
              <Link to="/signup?role=client" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
