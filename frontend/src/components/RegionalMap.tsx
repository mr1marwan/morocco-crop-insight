import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';

interface RegionalMapProps {
  geoJsonData: any;
  dataMap: Record<string, number>;
}

const RegionalMap = ({ geoJsonData, dataMap }: RegionalMapProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

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
    layer.bindPopup(`
      <div style="padding: 8px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${name}</div>
        <div style="font-size: 16px; color: #006400; font-weight: bold;">${value.toLocaleString()} kt</div>
        <div style="font-size: 12px; color: #666;">Céréales 2022-2023</div>
      </div>
    `);
  };

  return (
    <div id="map" className={`${
      darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white'
    } rounded-xl shadow-xl overflow-hidden transition-all duration-300`}>
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200'
      }`}>
        <h2 className={`text-xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t('map.title')}
        </h2>
      </div>

      <div className="relative">
        {geoJsonData && (
          <MapContainer
            center={[32, -7] as LatLngExpression}
            zoom={6}
            style={{ height: "500px" }}
            className="z-0"
          >
            <TileLayer
              url={darkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            <GeoJSON
              key={JSON.stringify(dataMap)}
              data={geoJsonData}
              // @ts-ignore - React Leaflet v5 types issue
              style={style}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default RegionalMap;
