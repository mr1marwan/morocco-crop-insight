import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import regionalData from '../data/processed/regional_cereals_2023.json';

function App() {
  const [dataMap, setDataMap] = useState({});
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Load GeoJSON first
    fetch('/data/raw/Morocco-Regions.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoJsonData(data);

        // Load production data after GeoJSON is loaded
        const map = {};
        regionalData.forEach(d => {
          map[d.region] = d.production_2023_kt;
          console.log(`Mapping: ${d.region} = ${d.production_2023_kt}`);
        });
        console.log('Data map:', map);
        setDataMap(map);
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  const getColor = (v) => {
    return v > 1400 ? '#006400' :  // Dark green: Fés-Meknés, Rabat-Salé-Kénitra
           v > 900  ? '#238b45' :  // Medium-dark green: Grand Casablanca-Settat
           v > 600  ? '#41ab5d' :  // Medium green: Tanger, Béni Mellal
           v > 150  ? '#74c476' :  // Light-medium green: Marrakech-Safi
           v > 70   ? '#a1d99b' :  // Light green: Drâa-Tafilalet, Oriental
           v > 5    ? '#c7e9c0' :  // Very light green: Souss-Massa, Guelmim
           v > 0    ? '#e5f5e0' :  // Almost white but slightly green
                      '#f7fcf5';   // White: 0 production
  };

  const style = (f) => {
    const regionName = f.properties.nom_region;
    const value = dataMap[regionName] || 0;
    const color = getColor(value);
    console.log(`Styling ${regionName}: value=${value}, color=${color}`);
    return {
      fillColor: color,
      weight: 2.5,
      color: 'white',
      fillOpacity: 0.8
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.nom_region;
    const value = dataMap[name] || 0;
    layer.bindPopup(`
      <div class="text-center font-bold">
        <div class="text-lg">${name}</div>
        <div class="text-2xl text-morocco-green mt-2">
          ${value.toLocaleString()} k tonnes
        </div>
        <div class="text-sm">céréales 2022-2023</div>
      </div>
    `);
  };

  if (!geoJsonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-morocco-green">
          Morocco Crop Insight 2025
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Production céréalière officielle par région (HCP 2022-2023)</p>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <MapContainer center={[32, -7]} zoom={6} style={{ height: "70vh" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON
              key={JSON.stringify(dataMap)}
              data={geoJsonData}
              style={style}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>

        <div className="text-center mt-6 text-gray-500">
          Données : Haut-Commissariat au Plan (HCP) & Ministère de l'Agriculture • Marouane AIT HAMMOU 2025
        </div>
      </div>
    </div>
  );
}

export default App;
