import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface TopCropsBarChartProps {
  data: any[];
}

const TopCropsBarChart = ({ data }: TopCropsBarChartProps) => {
  const { darkMode } = useTheme();

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <h3 className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Top Crops 2023
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data.slice(0, 5)}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={11}
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
          />
          <Bar
            dataKey="value"
            fill={darkMode ? '#10b981' : '#006400'}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCropsBarChart;
