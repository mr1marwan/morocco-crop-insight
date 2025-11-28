import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ComparisonModeToggleProps {
  comparisonMode: boolean;
  onToggle: (enabled: boolean) => void;
}

const ComparisonModeToggle = ({ comparisonMode, onToggle }: ComparisonModeToggleProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-4 rounded-xl shadow-lg mb-6 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-base font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('comparison.title')}
          </h3>
          <p className={`text-sm mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('comparison.description')}
          </p>
        </div>

        <button
          onClick={() => onToggle(!comparisonMode)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            comparisonMode
              ? (darkMode ? 'bg-green-600 focus:ring-green-500' : 'bg-morocco-green focus:ring-morocco-green')
              : (darkMode ? 'bg-gray-600 focus:ring-gray-500' : 'bg-gray-300 focus:ring-gray-400')
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
              comparisonMode ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ComparisonModeToggle;
