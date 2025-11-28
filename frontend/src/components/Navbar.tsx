import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { darkMode } = useTheme();

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      darkMode
        ? 'bg-gray-900/95 border-gray-700'
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className={`text-3xl font-bold ${
              darkMode ? 'text-green-400' : 'text-morocco-green'
            }`}>
              MCI
            </div>
            <div className="border-l-2 border-gray-300 h-8 mx-2"></div>
            <h1 className={`text-xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Morocco Crop Insight
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-morocco-green'
              }`}
            >
              Dashboard
            </a>
            <a
              href="#analytics"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-morocco-green'
              }`}
            >
              Analytics
            </a>
            <a
              href="#map"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-morocco-green'
              }`}
            >
              Regional Map
            </a>
          </div>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
