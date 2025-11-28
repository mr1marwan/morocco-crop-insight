import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CropSelector from './components/CropSelector';
import MultiCropSelector from './components/MultiCropSelector';
import ComparisonModeToggle from './components/ComparisonModeToggle';
import ComparisonChart from './components/ComparisonChart';
import ExportButton from './components/ExportButton';
import YearRangeFilter from './components/YearRangeFilter';
import KPICards from './components/KPICards';
import ProductionLineChart from './components/ProductionLineChart';
import TopCropsBarChart from './components/TopCropsBarChart';
import CropDistributionPieChart from './components/CropDistributionPieChart';
import RegionalMap from './components/RegionalMap';
import DataTable from './components/DataTable';

const cropColors: Record<string, string> = {
  'Wheat': '#8B4513',
  'Barley': '#DAA520',
  'Olives': '#6B8E23',
  'Tomatoes': '#DC143C'
};

function DashboardContent() {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [faoData, setFaoData] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMinYear, setSelectedMinYear] = useState(2013);
  const [selectedMaxYear, setSelectedMaxYear] = useState(2023);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Wheat', 'Barley']);

  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load GeoJSON locally
        const geoJsonResponse = await fetch('/data/raw/Morocco-Regions.geojson');
        const geoJson = await geoJsonResponse.json();
        setGeoJsonData(geoJson);

        // Load data from API
        const [regionalResponse, nationalResponse, cropsResponse] = await Promise.all([
          axios.get(`${API_URL}/regional`),
          axios.get(`${API_URL}/national`),
          axios.get(`${API_URL}/crops`)
        ]);

        setRegionalData(regionalResponse.data);
        setFaoData(nationalResponse.data);
        setCrops(cropsResponse.data);

        // Build regional data map
        const map: Record<string, number> = {};
        regionalResponse.data.forEach((d: any) => (map[d.region] = d.production_2023_kt));
        setDataMap(map);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cropChartData = useMemo(() => {
    return faoData
      .filter(d => d.crop_en === selectedCrop && d.year >= selectedMinYear && d.year <= selectedMaxYear)
      .sort((a, b) => a.year - b.year);
  }, [faoData, selectedCrop, selectedMinYear, selectedMaxYear]);

  const top2023 = useMemo(() => {
    // Use the latest year in the selected range instead of hardcoded 2023
    const latestYear = selectedMaxYear;
    return faoData
      .filter(d => d.year === latestYear)
      .map(d => ({ name: d.crop_fr, value: Math.round(d.production_kt) }))
      .sort((a, b) => b.value - a.value);
  }, [faoData, selectedMaxYear]);

  const comparisonData = useMemo(() => {
    return faoData
      .filter(d => selectedCrops.includes(d.crop_en) && d.year >= selectedMinYear && d.year <= selectedMaxYear)
      .sort((a, b) => a.year - b.year);
  }, [faoData, selectedCrops, selectedMinYear, selectedMaxYear]);

  const kpiData = useMemo(() => {
    const cropData = cropChartData;
    if (cropData.length === 0) {
      return {
        totalProduction: 0,
        averageProduction: 0,
        growthRate: 0,
        topRegion: { name: 'N/A', value: 0 }
      };
    }

    const totalProduction = cropData.reduce((sum, d) => sum + d.production_kt, 0);
    const averageProduction = totalProduction / cropData.length;

    // Calculate growth rate (comparing first and last year)
    const firstYear = cropData[0]?.production_kt || 0;
    const lastYear = cropData[cropData.length - 1]?.production_kt || 0;
    const growthRate = firstYear > 0 ? ((lastYear - firstYear) / firstYear) * 100 : 0;

    // Find top region for this crop from regional data
    const cropRegionalData = regionalData
      .map(r => ({ name: r.region, value: r.production_2023_kt }))
      .sort((a, b) => b.value - a.value);
    const topRegion = cropRegionalData[0] || { name: 'N/A', value: 0 };

    return {
      totalProduction: Math.round(totalProduction),
      averageProduction,
      growthRate,
      topRegion
    };
  }, [cropChartData, regionalData]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-morocco-green mx-auto mb-4"></div>
          <div className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading dashboard data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar />

      <main className="w-full">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('header.title')}
              </h2>
              <p className={`mt-2 text-sm sm:text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('header.subtitle')}
              </p>
            </div>
            <ExportButton data={cropChartData} selectedCrop={selectedCrop} />
          </div>
        </div>

        {/* Comparison Mode Toggle */}
        <ComparisonModeToggle
          comparisonMode={comparisonMode}
          onToggle={setComparisonMode}
        />

        {/* Conditional Crop Selector */}
        {comparisonMode ? (
          <MultiCropSelector
            crops={crops}
            selectedCrops={selectedCrops}
            onSelectCrops={setSelectedCrops}
          />
        ) : (
          <CropSelector
            crops={crops}
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
          />
        )}

        {/* Year Range Filter */}
        <YearRangeFilter
          minYear={2013}
          maxYear={2023}
          selectedMinYear={selectedMinYear}
          selectedMaxYear={selectedMaxYear}
          onMinYearChange={setSelectedMinYear}
          onMaxYearChange={setSelectedMaxYear}
        />

        {/* Conditional Content Based on Mode */}
        {comparisonMode ? (
          /* Comparison Mode: Show comparison chart */
          <div id="analytics" className="grid grid-cols-1 gap-6 mb-8">
            <ComparisonChart
              data={comparisonData}
              selectedCrops={selectedCrops}
              cropColors={cropColors}
              crops={crops}
            />
          </div>
        ) : (
          /* Single Crop Mode: Show KPI Cards and Charts */
          <>
            <KPICards data={kpiData} />
            <div id="analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ProductionLineChart
                data={cropChartData}
                cropName={crops.find(c => c.en === selectedCrop)?.fr || selectedCrop}
                color={cropColors[selectedCrop] || '#006400'}
              />
              <TopCropsBarChart data={top2023} year={selectedMaxYear} />
              <CropDistributionPieChart data={top2023} />
            </div>
          </>
        )}

        {/* Map */}
        <RegionalMap geoJsonData={geoJsonData} dataMap={dataMap} />

        {/* Data Table - Only show in single crop mode */}
        {!comparisonMode && (
          <div className="mt-8">
            <DataTable
              data={cropChartData}
              columns={[
                { key: 'year', label: t('charts.year'), sortable: true },
                { key: 'crop_fr', label: t('charts.crop'), sortable: true },
                {
                  key: 'production_kt',
                  label: t('charts.productionKt'),
                  sortable: true,
                  format: (val: number) => `${val.toFixed(1)} kt`
                },
                {
                  key: 'area_ha',
                  label: 'Area (ha)',
                  sortable: true,
                  format: (val: number) => val ? val.toLocaleString() : 'N/A'
                },
                {
                  key: 'yield_tha',
                  label: 'Yield (t/ha)',
                  sortable: true,
                  format: (val: number) => val ? val.toFixed(2) : 'N/A'
                }
              ]}
            />
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <DashboardContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
