import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface YearRangeFilterProps {
  minYear: number;
  maxYear: number;
  selectedMinYear: number;
  selectedMaxYear: number;
  onMinYearChange: (year: number) => void;
  onMaxYearChange: (year: number) => void;
}

const YearRangeFilter = ({
  minYear,
  maxYear,
  selectedMinYear,
  selectedMaxYear,
  onMinYearChange,
  onMaxYearChange
}: YearRangeFilterProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-6 rounded-xl shadow-lg mb-8 transition-all duration-300`}>
      <h3 className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {t('filter.yearRange')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Year */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('filter.fromYear')}
          </label>
          <select
            value={selectedMinYear}
            onChange={(e) => onMinYearChange(Number(e.target.value))}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-morocco-green'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              darkMode ? 'focus:ring-green-500' : 'focus:ring-morocco-green'
            } transition-all duration-200`}
          >
            {years.filter(y => y <= selectedMaxYear).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* To Year */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('filter.toYear')}
          </label>
          <select
            value={selectedMaxYear}
            onChange={(e) => onMaxYearChange(Number(e.target.value))}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-morocco-green'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              darkMode ? 'focus:ring-green-500' : 'focus:ring-morocco-green'
            } transition-all duration-200`}
          >
            {years.filter(y => y >= selectedMinYear).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className={`mt-4 text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t('filter.showingData')}: {selectedMinYear} - {selectedMaxYear} ({selectedMaxYear - selectedMinYear + 1} {t('filter.years')})
      </div>
    </div>
  );
};

export default YearRangeFilter;
