import { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface DataTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    format?: (value: any) => string;
  }[];
}

const DataTable = ({ data, columns }: DataTableProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row => {
      return columns.some(col => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } rounded-xl shadow-lg transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t('table.title')}
        </h3>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('table.search')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full px-4 py-2 pl-10 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-morocco-green'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              darkMode ? 'focus:ring-green-500' : 'focus:ring-morocco-green'
            } transition-all duration-200`}
          />
          <svg
            className={`absolute left-3 top-3 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } ${column.sortable !== false ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable !== false && (
                      <span className="text-gray-400">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-150 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    {column.format
                      ? column.format(row[column.key])
                      : row[column.key] ?? 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className={`px-6 py-4 border-t flex items-center justify-between ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200'
      }`}>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('table.showing')} {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} - {Math.min(currentPage * itemsPerPage, sortedData.length)} {t('table.of')} {sortedData.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage === 1
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('table.previous')}
          </button>
          <span className={`px-3 py-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage >= totalPages
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('table.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
