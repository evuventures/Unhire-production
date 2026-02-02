import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Settings,
    User,
    LogOut,
    ChevronRight,
    PlusCircle,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';

interface SidebarProps {
    role: 'client' | 'expert';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isCollapsed));
        // Update a CSS variable on the document root to help pages adjust their margin
        document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '80px' : '256px');
    }, [isCollapsed]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const commonLinks = [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const clientLinks = [
        { name: 'Dashboard', path: '/client-dashboard', icon: LayoutDashboard },
        { name: 'Post Project', path: '/post-project', icon: PlusCircle },
        ...commonLinks,
    ];

    const expertLinks = [
        { name: 'Dashboard', path: '/expert-dashboard', icon: LayoutDashboard },
        ...commonLinks,
    ];

    const links = role === 'client' ? clientLinks : expertLinks;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            className="h-screen fixed left-0 top-0 border-r border-border bg-surface flex flex-col p-4 z-40 transition-all duration-300"
        >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-10 px-2 pt-2`}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center"
                        >
                            <Link to="/" className="flex items-center gap-2 group">
                                <img src={logo} alt="Unhire Logo" className="h-8 w-auto filter invert brightness-200 transition-transform group-hover:scale-105" />
                            </Link>
                        </motion.div>
                    )}
                    {isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Link to="/">
                                <img src={logo} alt="Unhire Logo" className="h-8 w-auto filter invert brightness-200" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="mx-auto mb-10 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <Menu size={20} />
                </button>
            )}

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <link.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {link.name}
                                </motion.span>
                            )}

                            {!isCollapsed && isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="ml-auto"
                                >
                                    <ChevronRight size={16} />
                                </motion.div>
                            )}

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {link.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-border mt-auto">
                <button
                    onClick={handleLogout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 w-full group relative`}
                >
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}

                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-bold">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
