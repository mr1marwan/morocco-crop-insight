# 🌾 Morocco Crop Insight

> **An interactive agricultural analytics platform** providing comprehensive crop production insights for Morocco, featuring real-time data visualization, comparative analysis, and multi-format exports.

![Morocco Crop Insight](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Data Sources](#-data-sources)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Morocco Crop Insight is a full-stack web application that transforms raw agricultural data into actionable insights. Built with modern web technologies, it provides farmers, researchers, and policymakers with powerful tools to analyze crop production trends across Morocco from 2013-2023.

### Key Highlights

- **Interactive Dashboards**: Real-time visualization of crop production data
- **Regional Analysis**: Geographic insights with interactive maps
- **Comparative Tools**: Side-by-side analysis of up to 4 crops
- **Multi-language Support**: Full English and French translations
- **Dark Mode**: Eye-friendly theme switching
- **Data Export**: Download reports in CSV, JSON, or PDF formats

---

## ✨ Features

### 📊 Core Analytics

- **KPI Cards**: At-a-glance metrics including:
  - Total production across selected years
  - Average annual production
  - Growth rate (first year vs. last year)
  - Top producing region with values

- **Interactive Charts**:
  - Production evolution line chart
  - Top 5 crops bar chart
  - Crop distribution pie chart
  - Multi-crop comparison chart

- **Regional Map**: Leaflet-powered interactive map showing cereal production by region

### 🔍 Advanced Features

- **Year Range Filter**: Custom date range selection (2013-2023)
- **Comparison Mode**: Toggle to compare multiple crops on a single timeline
- **Search & Sort**: Interactive data table with:
  - Real-time search across all columns
  - Click-to-sort on any column
  - Pagination (10 rows per page)
  - Custom formatting for different data types

- **Multi-Format Export**:
  - **CSV**: Spreadsheet-compatible format
  - **JSON**: Structured data with metadata
  - **PDF**: Professional reports with auto-pagination

### 🎨 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme persistence across sessions
- **Bilingual Interface**: Switch between English and French
- **Smooth Animations**: Polished transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool |
| Tailwind CSS | 4.1.17 | Styling |
| Recharts | 3.5.1 | Data visualization |
| Leaflet | 1.9.4 | Interactive maps |
| React Leaflet | 5.0.0 | React bindings for Leaflet |
| Axios | 1.13.2 | HTTP client |
| jsPDF | Latest | PDF generation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.x | Backend language |
| FastAPI | 0.115+ | REST API framework |
| Uvicorn | Latest | ASGI server |
| Pandas | Latest | Data processing |
| CORS Middleware | Built-in | Cross-origin requests |

### Development Tools

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 📁 Project Structure

```
morocco-crop-insight/
├── frontend/                      # React + TypeScript frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ComparisonChart.tsx
│   │   │   ├── ComparisonModeToggle.tsx
│   │   │   ├── CropDistributionPieChart.tsx
│   │   │   ├── CropSelector.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── KPICards.tsx
│   │   │   ├── MultiCropSelector.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProductionLineChart.tsx
│   │   │   ├── RegionalMap.tsx
│   │   │   ├── TopCropsBarChart.tsx
│   │   │   └── YearRangeFilter.tsx
│   │   ├── contexts/            # React contexts
│   │   │   ├── LanguageContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── App.tsx              # Main application
│   │   ├── index.css            # Global styles
│   │   └── main.tsx             # Entry point
│   ├── public/
│   │   └── data/
│   │       └── raw/
│   │           └── Morocco-Regions.geojson
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                      # FastAPI backend
│   ├── main.py                  # API server
│   └── requirements.txt         # Python dependencies
├── data/                        # Data files
│   ├── raw/                     # Source data
│   └── processed/               # Cleaned data
├── scripts/                     # Data processing scripts
│   └── extract_regional_cereals_FINAL.py
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/mr1marwan/morocco-crop-insight.git
cd morocco-crop-insight
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

## 💻 Usage

### Running the Application

**Terminal 1 - Start Backend Server:**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

**Terminal 2 - Start Frontend Development Server:**

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:5173` (or next available port)

### Building for Production

```bash
# Frontend production build
cd frontend
npm run build

# Preview production build
npm run preview
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Get National Crop Data
```http
GET /national
```

**Response:**
```json
[
  {
    "year": 2023,
    "crop_en": "Wheat",
    "crop_fr": "Blé",
    "production_kt": 1234.5,
    "area_ha": 500000,
    "yield_tha": 2.47
  }
]
```

#### 2. Get Regional Data
```http
GET /regional
```

**Response:**
```json
[
  {
    "region": "Casablanca-Settat",
    "production_2023_kt": 2500
  }
]
```

#### 3. Get Available Crops
```http
GET /crops
```

**Response:**
```json
[
  {
    "en": "Wheat",
    "fr": "Blé"
  },
  {
    "en": "Barley",
    "fr": "Orge"
  }
]
```

#### 4. API Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Morocco Crop Insight API"
}
```

---

## 📊 Data Sources

### Primary Sources

1. **FAO (Food and Agriculture Organization)**
   - National crop production statistics
   - Years covered: 2013-2023
   - Crops: Wheat, Barley, Maize, Olives, Tomatoes, Oranges, and more

2. **Regional Agricultural Data**
   - Morocco Ministry of Agriculture
   - Cereal production by region (2022-2023)
   - 12 administrative regions

3. **Geographic Data**
   - GeoJSON boundaries for Morocco regions
   - Administrative divisions (Level 1)

### Data Processing

The `scripts/` directory contains Python scripts for:
- Cleaning and normalizing raw data
- Converting between formats
- Aggregating regional statistics
- Validating data consistency

---

## 🎨 Customization

### Changing Theme Colors

Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'morocco-green': '#006400', // Change primary color
      },
    },
  },
}
```

### Adding New Languages

1. Edit `frontend/src/contexts/LanguageContext.tsx`
2. Add translations to the `translations` object
3. Update the `Language` type

### Adding New Crops

1. Add data to backend CSV files in `data/processed/`
2. Restart the FastAPI server
3. The frontend will automatically detect new crops

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its benefits
3. Provide mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for all new code
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Backend server won't start**
```bash
# Solution: Check if port 8000 is in use
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

**Issue: Frontend can't connect to backend**
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in `backend/main.py`
- Verify API_URL in `frontend/src/App.tsx`

**Issue: Map not loading**
- Check that `Morocco-Regions.geojson` exists in `frontend/public/data/raw/`
- Verify the file is valid GeoJSON
- Check browser console for errors

**Issue: Dark mode not persisting**
- Clear browser localStorage
- Check browser console for errors
- Verify ThemeContext is properly configured

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Marouane AIT HAMMOU**
- GitHub: [@mr1marwan](https://github.com/mr1marwan)
- LinkedIn: [linkedin.com/in/marouane-ait-hammou](https://www.linkedin.com/in/marouane-ait-hammou/)
- Email: marouaneaithammou3@gmail.com
- Project Link: [https://github.com/mr1marwan/morocco-crop-insight](https://github.com/mr1marwan/morocco-crop-insight)

---

## 🙏 Acknowledgments

- **FAO** for providing comprehensive agricultural statistics
- **Morocco Ministry of Agriculture** for regional production data
- **OpenStreetMap** contributors for geographic data
- **Recharts** team for excellent chart library
- **Leaflet** community for mapping tools
- All open-source contributors whose libraries made this project possible

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Weather Integration**: Add historical weather data correlation
- [ ] **Predictive Analytics**: ML models for production forecasting
- [ ] **User Accounts**: Save custom dashboards and preferences
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Real-time Updates**: WebSocket support for live data
- [ ] **Advanced Filters**: Filter by region, season, irrigation type
- [ ] **Data Validation**: User-submitted data correction system
- [ ] **API Rate Limiting**: Implement request throttling
- [ ] **GraphQL Support**: Alternative to REST API
- [ ] **Docker Support**: Containerized deployment

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Documentation](docs/)
2. Search [Existing Issues](https://github.com/mr1marwan/morocco-crop-insight/issues)
3. Create a [New Issue](https://github.com/mr1marwan/morocco-crop-insight/issues/new)
4. Contact: marouaneaithammou3@gmail.com

---

<div align="center">

**Made with ❤️ for Moroccan Agriculture**

⭐ Star this repo if you find it helpful!

</div>
