import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title - Clickable to navigate to homepage */}
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
              Poke X
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm hidden sm:inline">Explore • Experience • Expert</p>
          </div>
          
          {/* Navigation Links and Theme Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/list"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/list')
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-gray-800'
              }`}
            >
              List
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }}
              className="p-2 rounded-lg transition-colors hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              type="button"
            >
              {theme === 'dark' ? (
                <img 
                  src="/image/day.png" 
                  alt="Switch to light mode" 
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <img 
                  src="/image/night.png" 
                  alt="Switch to dark mode" 
                  className="w-6 h-6 rounded-full"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
