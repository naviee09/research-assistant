import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Home, BarChart3, FileText, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ask', label: 'Ask', icon: Search },
    { path: '/results', label: 'Results', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg border-b border-purple-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white hover:text-yellow-300 transition-colors duration-300">
                Smart Research Assistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Auth Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 text-base font-medium transition-all duration-300 rounded-lg mx-2',
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-white/20 my-2"></div>
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2"
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 w-full text-left"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2"
              >
                <LogIn className="w-4 h-4 mr-3" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2"
              >
                <UserPlus className="w-4 h-4 mr-3" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;