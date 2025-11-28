import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductionLineChartProps {
  data: any[];
  cropName: string;
  color: string;
}

const ProductionLineChart = ({ data, cropName, color }: ProductionLineChartProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <h3 className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {t('charts.production')} - {cropName}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="year"
            fontSize={12}
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
          />
          <YAxis
            fontSize={12}
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : 'white',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: darkMode ? 'white' : 'black'
            }}
            formatter={(v: number) => [`${v.toFixed(1)} kt`, t('charts.productionKt')]}
          />
          <Line
            type="monotone"
            dataKey="production_kt"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionLineChart;
