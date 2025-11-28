import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CropSelector from './components/CropSelector';
import ExportButton from './components/ExportButton';
import ProductionLineChart from './components/ProductionLineChart';
import TopCropsBarChart from './components/TopCropsBarChart';
import CropDistributionPieChart from './components/CropDistributionPieChart';
import RegionalMap from './components/RegionalMap';

const cropColors: Record<string, string> = {
  'Wheat': '#8B4513',
  'Barley': '#DAA520',
  'Olives': '#6B8E23',
  'Tomatoes': '#DC143C'
};

function DashboardContent() {
  const { darkMode } = useTheme();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [faoData, setFaoData] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .filter(d => d.crop_en === selectedCrop)
      .sort((a, b) => a.year - b.year);
  }, [faoData, selectedCrop]);

  const top2023 = useMemo(() => {
    return faoData
      .filter(d => d.year === 2023)
      .map(d => ({ name: d.crop_fr, value: Math.round(d.production_kt) }))
      .sort((a, b) => b.value - a.value);
  }, [faoData]);

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

      <main className="max-w-7xl mx-auto px-12 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Agricultural Analytics Dashboard
              </h2>
              <p className={`mt-2 text-sm sm:text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Comprehensive crop production insights from 2013-2023
              </p>
            </div>
            <ExportButton data={cropChartData} selectedCrop={selectedCrop} />
          </div>
        </div>

        {/* Crop Selector */}
        <CropSelector
          crops={crops}
          selectedCrop={selectedCrop}
          onSelectCrop={setSelectedCrop}
        />

        {/* Charts Grid */}
        <div id="analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ProductionLineChart
            data={cropChartData}
            cropName={crops.find(c => c.en === selectedCrop)?.fr || selectedCrop}
            color={cropColors[selectedCrop] || '#006400'}
          />
          <TopCropsBarChart data={top2023} />
          <CropDistributionPieChart data={top2023} />
        </div>

        {/* Map */}
        <RegionalMap geoJsonData={geoJsonData} dataMap={dataMap} />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}

export default App;
