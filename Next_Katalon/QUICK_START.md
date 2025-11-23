# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- pip (Python package manager)

## Installation Steps

### 1. Install Node.js Dependencies

```bash
cd Analyzer_Katalon/Next_Katalon
npm install
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install fastapi uvicorn
```

## Running the Application

### Step 1: Start the Python API Server

Open a terminal and run:

```bash
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"
python3 api_server.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Note:** Make sure you're in the `Next_Katalon` directory when running the API server.

### Step 2: Start the Next.js Frontend

Open another terminal and run:

```bash
cd Analyzer_Katalon/Next_Katalon
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## Using the Application

1. **Enter Project Path**: Type the full path to your Katalon Studio project directory
   - Example: `/Users/christopherscharer/Katalon Studio/onboarding`
   
2. **Click Analyze**: The application will load and analyze your project

3. **Explore Tabs**:
   - **Overview**: See summary statistics and coverage charts
   - **Test Cases**: Browse and search test cases
   - **Test Suites**: View test suite configurations
   - **Keywords**: Explore custom keywords
   - **Object Repository**: Browse test objects

## Troubleshooting

### API Server Not Running
- Make sure the Python API server is running on port 8000
- Check for any error messages in the terminal

### Cannot Connect to API
- Verify `NEXT_PUBLIC_API_URL` is set correctly (default: http://localhost:8000)
- Check if port 8000 is available

### Project Path Issues
- Use absolute paths (full path from root)
- On Windows, use forward slashes or double backslashes
- Make sure the path points to a valid Katalon Studio project directory

## Building for Production

```bash
npm run build
npm start
```

The production build will be available on port 3000 (or the port specified in your environment).

