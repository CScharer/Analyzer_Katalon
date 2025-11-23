# Katalon Studio Project Analyzer - Next.js Frontend

A professional Next.js frontend application for analyzing Katalon Studio automation projects, built with TypeScript and Bootstrap.

## Features

- 🎨 **Professional UI** - Built with Bootstrap 5 for a polished, responsive design
- 📊 **Interactive Dashboards** - Visualize project statistics and coverage metrics
- 🔍 **Search Functionality** - Search test cases and keywords
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Built with Next.js 14 for optimal performance
- 🔧 **TypeScript** - Fully typed for better development experience

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for the backend API server)
- FastAPI and uvicorn (for the Python API server)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Python dependencies for the API server:
```bash
pip install fastapi uvicorn
```

## Running the Application

### 1. Start the Python API Server

In one terminal, start the FastAPI server:

```bash
cd Analyzer_Katalon/Next_Katalon
python api_server.py
```

The API server will run on `http://localhost:8000`

### 2. Start the Next.js Frontend

In another terminal:

```bash
cd Analyzer_Katalon/Next_Katalon
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter the full path to your Katalon Studio project directory
3. Click "Analyze" to load project data
4. Explore the different tabs:
   - **Overview**: Summary statistics and coverage analysis
   - **Test Cases**: Browse and search test cases
   - **Test Suites**: View test suite configurations
   - **Keywords**: Explore custom keywords
   - **Object Repository**: Browse test objects

## Project Structure

```
Next_Katalon/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles (Bootstrap)
├── components/             # React components
│   ├── Dashboard.tsx       # Main dashboard
│   ├── ProjectSelector.tsx # Project path input
│   ├── SummaryCards.tsx    # Summary statistics cards
│   ├── CoverageSection.tsx # Coverage charts
│   ├── TestCasesSection.tsx
│   ├── TestSuitesSection.tsx
│   ├── KeywordsSection.tsx
│   └── ObjectRepositorySection.tsx
├── lib/                    # Utilities
│   └── api.ts             # API client functions
├── api_server.py          # Python FastAPI server
├── package.json           # Node.js dependencies
└── tsconfig.json           # TypeScript configuration
```

## API Configuration

The frontend communicates with the Python API server. By default, it connects to `http://localhost:8000`. 

To change the API URL, set the `NEXT_PUBLIC_API_URL` environment variable:

```bash
NEXT_PUBLIC_API_URL=http://your-api-url:8000 npm run dev
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Recharts** - Chart library
- **Axios** - HTTP client
- **FastAPI** - Python API framework

## License

This project is provided as-is for use with Katalon Studio projects.

