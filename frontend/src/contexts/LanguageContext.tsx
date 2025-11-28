import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.title': 'Morocco Crop Insight',
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.map': 'Regional Map',

    // Page Header
    'header.title': 'Agricultural Analytics Dashboard',
    'header.subtitle': 'Comprehensive crop production insights from 2013-2023',

    // Crop Selector
    'crops.wheat': 'Wheat',
    'crops.barley': 'Barley',
    'crops.olives': 'Olives',
    'crops.tomatoes': 'Tomatoes',

    // Charts
    'charts.production': 'Production Evolution',
    'charts.topCrops': 'Top 5 Crops in 2023',
    'charts.distribution': 'Crop Distribution',
    'charts.year': 'Year',
    'charts.productionKt': 'Production (kt)',
    'charts.crop': 'Crop',

    // Map
    'map.title': 'Regional Cereal Production (2023)',
    'map.loading': 'Loading map...',

    // Export
    'export.button': 'Export Data',
    'export.csv': 'Export as CSV',
    'export.json': 'Export as JSON',
    'export.pdf': 'Export as PDF',

    // KPI Cards
    'kpi.totalProduction': 'Total Production',
    'kpi.averageProduction': 'Average Production',
    'kpi.growthRate': 'Growth Rate',
    'kpi.topRegion': 'Top Region',

    // Year Filter
    'filter.yearRange': 'Year Range Filter',
    'filter.fromYear': 'From Year',
    'filter.toYear': 'To Year',
    'filter.showingData': 'Showing data for',
    'filter.years': 'years',

    // Comparison Mode
    'comparison.title': 'Comparison Mode',
    'comparison.description': 'Compare multiple crops side-by-side',
    'comparison.chartTitle': 'Crop Production Comparison',

    // Data Table
    'table.title': 'Detailed Data Table',
    'table.search': 'Search data...',
    'table.showing': 'Showing',
    'table.of': 'of',
    'table.previous': 'Previous',
    'table.next': 'Next',

    // Footer
    'footer.about': 'About Morocco Crop Insight',
    'footer.aboutText': 'An interactive platform providing comprehensive agricultural analytics for Morocco, featuring crop production data, regional insights, and trends from 2013-2023.',
    'footer.sources': 'Data Sources',
    'footer.developer': 'Developer',
    'footer.developedBy': 'Developed by',
    'footer.rights': 'Morocco Crop Insight. All rights reserved.',
    'footer.builtWith': 'Built with React, TypeScript, Tailwind CSS & FastAPI',
  },
  fr: {
    // Navbar
    'nav.title': 'Aperçu des Cultures du Maroc',
    'nav.dashboard': 'Tableau de bord',
    'nav.analytics': 'Analytiques',
    'nav.map': 'Carte Régionale',

    // Page Header
    'header.title': 'Tableau de Bord Analytique Agricole',
    'header.subtitle': 'Aperçus complets de la production agricole de 2013-2023',

    // Crop Selector
    'crops.wheat': 'Blé',
    'crops.barley': 'Orge',
    'crops.olives': 'Olives',
    'crops.tomatoes': 'Tomates',

    // Charts
    'charts.production': 'Évolution de la Production',
    'charts.topCrops': 'Top 5 Cultures en 2023',
    'charts.distribution': 'Distribution des Cultures',
    'charts.year': 'Année',
    'charts.productionKt': 'Production (kt)',
    'charts.crop': 'Culture',

    // Map
    'map.title': 'Production Régionale de Céréales (2023)',
    'map.loading': 'Chargement de la carte...',

    // Export
    'export.button': 'Exporter les Données',
    'export.csv': 'Exporter en CSV',
    'export.json': 'Exporter en JSON',
    'export.pdf': 'Exporter en PDF',

    // KPI Cards
    'kpi.totalProduction': 'Production Totale',
    'kpi.averageProduction': 'Production Moyenne',
    'kpi.growthRate': 'Taux de Croissance',
    'kpi.topRegion': 'Région Top',

    // Year Filter
    'filter.yearRange': 'Filtre de Plage d\'Années',
    'filter.fromYear': 'Depuis l\'Année',
    'filter.toYear': 'Jusqu\'à l\'Année',
    'filter.showingData': 'Affichage des données pour',
    'filter.years': 'années',

    // Comparison Mode
    'comparison.title': 'Mode Comparaison',
    'comparison.description': 'Comparer plusieurs cultures côte à côte',
    'comparison.chartTitle': 'Comparaison de Production des Cultures',

    // Data Table
    'table.title': 'Tableau de Données Détaillé',
    'table.search': 'Rechercher des données...',
    'table.showing': 'Affichage',
    'table.of': 'de',
    'table.previous': 'Précédent',
    'table.next': 'Suivant',

    // Footer
    'footer.about': 'À Propos',
    'footer.aboutText': 'Une plateforme interactive offrant des analyses agricoles complètes pour le Maroc, avec des données de production agricole, des aperçus régionaux et des tendances de 2013 à 2023.',
    'footer.sources': 'Sources de Données',
    'footer.developer': 'Développeur',
    'footer.developedBy': 'Développé par',
    'footer.rights': 'Morocco Crop Insight. Tous droits réservés.',
    'footer.builtWith': 'Construit avec React, TypeScript, Tailwind CSS & FastAPI',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
