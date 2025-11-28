import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ExportButtonProps {
  data: any[];
  selectedCrop: string;
}

const ExportButton = ({ data, selectedCrop }: ExportButtonProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  const exportToCSV = () => {
    const csv = data.map(d =>
      `${d.year},${d.crop_fr},${d.production_kt},${d.area_ha},${d.yield_tha}`
    ).join('\n');
    const header = 'Year,Crop,Production (kt),Area (ha),Yield (t/ha)\n';
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morocco-${selectedCrop}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToCSV}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
        darkMode
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-morocco-green hover:bg-green-700 text-white'
      } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>{t('export.button')}</span>
    </button>
  );
};

export default ExportButton;
