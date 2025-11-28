import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import regionalData from '../data/processed/regional_cereals_2023.json';

const crops = [
  { en: 'Wheat', fr: 'Blé', color: '#8B4513' },
  { en: 'Barley', fr: 'Orge', color: '#DAA520' },
  { en: 'Olives', fr: 'Olives', color: '#6B8E23' },
  { en: 'Tomatoes', fr: 'Tomates', color: '#DC143C' },
];

const COLORS = ['#006400', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0'];

function App() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [faoData, setFaoData] = useState<any[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Load GeoJSON and FAO data
    Promise.all([
      fetch('/data/raw/Morocco-Regions.geojson').then(res => res.json()),
      fetch('/data/processed/fao_national_clean.csv').then(res => res.text())
    ]).then(([geoJson, csvText]) => {
      setGeoJsonData(geoJson);

      // Parse CSV manually
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return {
          year: parseInt(values[0]),
          crop_en: values[1],
          crop_fr: values[2],
          production_kt: parseFloat(values[3]),
          area_ha: parseFloat(values[4]),
          yield_tha: parseFloat(values[5])
        };
      });
      setFaoData(data);

      // Load regional data
      const map: Record<string, number> = {};
      regionalData.forEach((d: any) => (map[d.region] = d.production_2023_kt));
      setDataMap(map);
    }).catch(err => console.error('Error loading data:', err));
  }, []);

  // Memoized data for charts
  const cropChartData = useMemo(() => {
    return faoData.filter(d => d.crop_en === selectedCrop).sort((a, b) => a.year - b.year);
  }, [faoData, selectedCrop]);

  const top2023 = useMemo(() => {
    return faoData
      .filter(d => d.year === 2023)
      .map(d => ({ name: d.crop_fr, value: Math.round(d.production_kt) }))
      .sort((a, b) => b.value - a.value);
  }, [faoData]);

  const getColor = (v: number) => {
    return v > 1400 ? '#006400' :
           v > 900  ? '#238b45' :
           v > 600  ? '#41ab5d' :
           v > 150  ? '#74c476' :
           v > 70   ? '#a1d99b' :
           v > 5    ? '#c7e9c0' :
           v > 0    ? '#e5f5e0' : '#f7fcf5';
  };

  const style = (f: any) => ({
    fillColor: getColor(dataMap[f.properties.nom_region] || 0),
    weight: 2.5,
    color: 'white',
    fillOpacity: 0.8
  });

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.nom_region;
    const value = dataMap[name] || 0;
    layer.bindPopup(`<b>${name}</b><br/>${value.toLocaleString()} k tonnes de céréales (2022-2023)`);
  };

  if (!geoJsonData || faoData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center text-morocco-green my-8">
          Morocco Crop Insight 2025
        </h1>

        {/* Crop Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {crops.map(crop => (
            <button
              key={crop.en}
              onClick={() => setSelectedCrop(crop.en)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedCrop === crop.en
                  ? 'bg-morocco-green text-white'
                  : 'bg-white text-gray-700 shadow hover:shadow-lg'
              }`}
            >
              {crop.fr}
            </button>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">Évolution {crops.find(c => c.en === selectedCrop)?.fr}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cropChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)} kt`} />
                <Line
                  type="monotone"
                  dataKey="production_kt"
                  stroke={crops.find(c => c.en === selectedCrop)?.color}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">Top cultures 2023</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={top2023.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} fontSize={11} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#006400" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">Répartition 2023</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={top2023}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value} kt`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={11}
                >
                  {top2023.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <h2 className="text-xl font-bold text-center py-3 bg-morocco-green text-white">
            Production céréalière par région – 2022/2023 (HCP)
          </h2>
          <MapContainer center={[32, -7]} zoom={6} style={{ height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON
              key={JSON.stringify(dataMap)}
              data={geoJsonData}
              style={style}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>

        <footer className="text-center mt-8 text-gray-600">
          Données : HCP Maroc • FAO • Ministère de l'Agriculture | Marouane AIT HAMMOU © 2025
        </footer>
      </div>
    </div>
  );
}

export default App;
