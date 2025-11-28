import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className={`w-full sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
    }`}>
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${
              darkMode ? 'text-green-400' : 'text-morocco-green'
            }`}>
              MCI
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <h1 className={`text-xl font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('nav.title')}
              </h1>
            </div>
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
              {t('nav.dashboard')}
            </a>
            <a
              href="#analytics"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-morocco-green'
              }`}
            >
              {t('nav.analytics')}
            </a>
            <a
              href="#map"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-morocco-green'
              }`}
            >
              {t('nav.map')}
            </a>
          </div>

          {/* Language & Dark Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className={`flex items-center gap-1 border rounded-lg p-1 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  language === 'en'
                    ? darkMode
                      ? 'bg-green-600 text-white'
                      : 'bg-morocco-green text-white'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  language === 'fr'
                    ? darkMode
                      ? 'bg-green-600 text-white'
                      : 'bg-morocco-green text-white'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FR
              </button>
            </div>

            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
