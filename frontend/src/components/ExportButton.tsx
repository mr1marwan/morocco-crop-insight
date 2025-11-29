import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import jsPDF from 'jspdf';

interface ExportButtonProps {
  data: any[];
  selectedCrop: string;
}

const ExportButton = ({ data, selectedCrop }: ExportButtonProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportToCSV = () => {
    const csv = data.map(d =>
      `${d.year},${d.crop_fr},${d.production_kt},${d.area_ha || 'N/A'},${d.yield_tha || 'N/A'}`
    ).join('\n');
    const header = 'Year,Crop,Production (kt),Area (ha),Yield (t/ha)\n';
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morocco-${selectedCrop}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const jsonData = {
      crop: selectedCrop,
      exportDate: new Date().toISOString(),
      data: data
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morocco-${selectedCrop}-data.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Morocco Crop Insight - ${selectedCrop}`, 20, 20);

    // Subtitle
    doc.setFontSize(12);
    doc.text(`Production Data Report`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 37);

    // Table headers
    doc.setFontSize(10);
    const headers = ['Year', 'Crop', 'Production (kt)', 'Area (ha)', 'Yield (t/ha)'];
    let y = 50;

    // Draw header row
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, 20 + (i * 35), y);
    });

    // Draw data rows
    doc.setFont('helvetica', 'normal');
    data.forEach((row) => {
      y += 7;
      if (y > 270) { // New page if needed
        doc.addPage();
        y = 20;
      }
      doc.text(String(row.year), 20, y);
      doc.text(row.crop_fr || selectedCrop, 55, y);
      doc.text(String(row.production_kt.toFixed(1)), 90, y);
      doc.text(row.area_ha ? String(row.area_ha) : 'N/A', 125, y);
      doc.text(row.yield_tha ? String(row.yield_tha.toFixed(2)) : 'N/A', 160, y);
    });

    doc.save(`morocco-${selectedCrop}-data.pdf`);
    setIsOpen(false);
  };

  const exportFormats = [
    { name: 'CSV', icon: '📊', action: exportToCSV, label: t('export.csv') },
    { name: 'JSON', icon: '{ }', action: exportToJSON, label: t('export.json') },
    { name: 'PDF', icon: '📄', action: exportToPDF, label: t('export.pdf') }
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {exportFormats.map((format, index) => (
            <button
              key={format.name}
              onClick={format.action}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-200 ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${
                index === exportFormats.length - 1 ? 'rounded-b-lg' : ''
              } ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-xl">{format.icon}</span>
              <div>
                <div className="font-semibold">{format.label}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {format.name} format
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
