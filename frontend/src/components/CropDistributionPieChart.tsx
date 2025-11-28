import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#006400', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0'];

interface CropDistributionPieChartProps {
  data: any[];
}

const CropDistributionPieChart = ({ data }: CropDistributionPieChartProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <h3 className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {t('charts.distribution')}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            fontSize={11}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : 'white',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: darkMode ? 'white' : 'black'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropDistributionPieChart;
