import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ComparisonChartProps {
  data: any[];
  selectedCrops: string[];
  cropColors: Record<string, string>;
  crops: Array<{ en: string; fr: string }>;
}

const ComparisonChart = ({ data, selectedCrops, cropColors, crops }: ComparisonChartProps) => {
  const { darkMode } = useTheme();
  const { t, language } = useLanguage();

  // Transform data for multi-line chart
  const chartData = (() => {
    const years = [...new Set(data.map(d => d.year))].sort();
    return years.map(year => {
      const yearData: any = { year };
      selectedCrops.forEach(cropEn => {
        const cropData = data.find(d => d.year === year && d.crop_en === cropEn);
        yearData[cropEn] = cropData?.production_kt || 0;
      });
      return yearData;
    });
  })();

  const getCropName = (cropEn: string) => {
    const crop = crops.find(c => c.en === cropEn);
    return crop ? (language === 'en' ? crop.en : crop.fr) : cropEn;
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl col-span-full`}>
      <h3 className={`text-lg font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {t('comparison.chartTitle')}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="year"
            fontSize={12}
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
          />
          <YAxis
            fontSize={12}
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            label={{
              value: t('charts.productionKt'),
              angle: -90,
              position: 'insideLeft',
              style: { fill: darkMode ? '#9ca3af' : '#6b7280' }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : 'white',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: darkMode ? 'white' : 'black'
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} kt`,
              getCropName(name)
            ]}
          />
          <Legend
            formatter={(value) => getCropName(value)}
            wrapperStyle={{
              paddingTop: '20px',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}
          />
          {selectedCrops.map((cropEn, index) => (
            <Line
              key={cropEn}
              type="monotone"
              dataKey={cropEn}
              stroke={cropColors[cropEn] || `hsl(${index * 60}, 70%, 50%)`}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
