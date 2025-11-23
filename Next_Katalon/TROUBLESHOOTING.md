# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Cannot find module" or Import Errors

**Solution:**
```bash
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Python API Server Won't Start

**Check if FastAPI is installed:**
```bash
python3 -m pip install fastapi uvicorn
```

**Or install from requirements:**
```bash
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"
pip3 install -r requirements.txt
```

**If you get import errors for Analyzer_Katalon:**
Make sure you're running the API server from the Next_Katalon directory, and that the parent directory structure is correct:
```
Analyzer_Katalon/
├── Next_Katalon/
│   └── api_server.py
├── __init__.py
├── analyzer.py
├── api.py
└── ...
```

### Issue 3: "Module not found: Analyzer_Katalon"

The API server needs to import from the parent directory. Make sure:
1. You're in the `Next_Katalon` directory when running `api_server.py`
2. The parent `Analyzer_Katalon` directory contains the Python modules

**Fix the import path in api_server.py if needed:**
```python
# Add this at the top of api_server.py if imports fail
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
```

### Issue 4: Port Already in Use

**Error:** `Address already in use` or `Port 8000/3000 is already in use`

**Solution:**
```bash
# Find and kill process on port 8000 (Python API)
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000 (Next.js)
lsof -ti:3000 | xargs kill -9
```

### Issue 5: Next.js Build Errors

**Clear Next.js cache:**
```bash
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"
rm -rf .next
npm run dev
```

### Issue 6: Bootstrap Not Loading

**Check if Bootstrap CSS is imported:**
- Verify `app/globals.css` contains: `@import 'bootstrap/dist/css/bootstrap.min.css';`
- Check that `BootstrapClient` component is in `app/layout.tsx`

### Issue 7: CORS Errors

If you see CORS errors in the browser console, make sure:
1. The Python API server is running on port 8000
2. The API server has CORS enabled (check `api_server.py`)
3. The frontend is trying to connect to the correct URL

### Issue 8: TypeScript Errors

**Clear TypeScript cache:**
```bash
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## Step-by-Step Fresh Start

If nothing works, try a complete fresh start:

```bash
# 1. Navigate to the project
cd "/Users/christopherscharer/Katalon Studio/onboarding/Analyzer_Katalon/Next_Katalon"

# 2. Clean everything
rm -rf node_modules .next package-lock.json

# 3. Reinstall Node dependencies
npm install

# 4. Install Python dependencies
pip3 install fastapi uvicorn

# 5. Start Python API server (in one terminal)
python3 api_server.py

# 6. Start Next.js (in another terminal)
npm run dev
```

## Checking if Services are Running

**Check Python API:**
```bash
curl http://localhost:8000/
# Should return: {"message":"Katalon Studio Project Analyzer API","version":"1.0.0"}
```

**Check Next.js:**
```bash
curl http://localhost:3000/
# Should return HTML
```

## Getting More Information

**Run Next.js with verbose output:**
```bash
DEBUG=* npm run dev
```

**Run Python API with debug:**
```bash
python3 api_server.py --log-level debug
```

## Still Having Issues?

1. Check the terminal output for specific error messages
2. Check browser console (F12) for JavaScript errors
3. Verify all file paths are correct
4. Make sure you're using the correct Python version (3.8+)
5. Make sure you're using Node.js 18+

