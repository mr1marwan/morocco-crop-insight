import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface KPICardsProps {
  data: {
    totalProduction: number;
    averageProduction: number;
    growthRate: number;
    topRegion: { name: string; value: number };
  };
}

const KPICards = ({ data }: KPICardsProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  const cards = [
    {
      title: t('kpi.totalProduction'),
      value: `${data.totalProduction.toLocaleString()} kt`,
      icon: '📊',
      color: darkMode ? 'text-green-400' : 'text-morocco-green'
    },
    {
      title: t('kpi.averageProduction'),
      value: `${data.averageProduction.toFixed(1)} kt`,
      icon: '📈',
      color: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: t('kpi.growthRate'),
      value: `${data.growthRate > 0 ? '+' : ''}${data.growthRate.toFixed(1)}%`,
      icon: data.growthRate >= 0 ? '🔺' : '🔻',
      color: data.growthRate >= 0
        ? (darkMode ? 'text-green-400' : 'text-green-600')
        : (darkMode ? 'text-red-400' : 'text-red-600')
    },
    {
      title: t('kpi.topRegion'),
      value: data.topRegion.name,
      subtitle: `${data.topRegion.value.toLocaleString()} kt`,
      icon: '🏆',
      color: darkMode ? 'text-yellow-400' : 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className={`text-sm font-semibold ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {card.title}
            </h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div className={`text-2xl font-bold ${card.color} mb-1`}>
            {card.value}
          </div>
          {card.subtitle && (
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {card.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPICards;
