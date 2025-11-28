import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CropSelectorProps {
  crops: Array<{ en: string; fr: string }>;
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
}

const CropSelector = ({ crops, selectedCrop, onSelectCrop }: CropSelectorProps) => {
  const { darkMode } = useTheme();
  const { language } = useLanguage();

  return (
    <div id="dashboard" className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {crops.map(crop => (
          <button
            key={crop.en}
            onClick={() => onSelectCrop(crop.en)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
              selectedCrop === crop.en
                ? darkMode
                  ? 'bg-green-600 text-white shadow-xl scale-105'
                  : 'bg-morocco-green text-white shadow-xl scale-105'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg border border-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
            }`}
          >
            {language === 'en' ? crop.en : crop.fr}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CropSelector;
