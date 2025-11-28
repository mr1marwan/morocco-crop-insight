import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface MultiCropSelectorProps {
  crops: Array<{ en: string; fr: string }>;
  selectedCrops: string[];
  onSelectCrops: (crops: string[]) => void;
}

const MultiCropSelector = ({ crops, selectedCrops, onSelectCrops }: MultiCropSelectorProps) => {
  const { darkMode } = useTheme();
  const { language } = useLanguage();

  const toggleCrop = (cropEn: string) => {
    if (selectedCrops.includes(cropEn)) {
      // Remove if already selected
      onSelectCrops(selectedCrops.filter(c => c !== cropEn));
    } else {
      // Add if not selected (max 4 crops)
      if (selectedCrops.length < 4) {
        onSelectCrops([...selectedCrops, cropEn]);
      }
    }
  };

  return (
    <div id="dashboard" className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {crops.map(crop => {
          const isSelected = selectedCrops.includes(crop.en);
          const isDisabled = !isSelected && selectedCrops.length >= 4;

          return (
            <button
              key={crop.en}
              onClick={() => toggleCrop(crop.en)}
              disabled={isDisabled}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                isSelected
                  ? darkMode
                    ? 'bg-green-600 text-white shadow-xl scale-105'
                    : 'bg-morocco-green text-white shadow-xl scale-105'
                  : isDisabled
                    ? darkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-lg border border-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-lg'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg border border-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
              }`}
            >
              {language === 'en' ? crop.en : crop.fr}
              {isSelected && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-white text-green-600 rounded-full font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className={`text-center mt-3 text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {selectedCrops.length}/4 crops selected
      </div>
    </div>
  );
};

export default MultiCropSelector;
