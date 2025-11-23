"""
Example web API implementations for frontend integration.

This file shows how to use the KatalonAnalyzerAPI with Flask or FastAPI.
Uncomment the framework you want to use.
"""

# ============================================================================
# Flask Example
# ============================================================================
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from Analyzer_Katalon.api import KatalonAnalyzerAPI
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Store analyzer instances (in production, use a proper cache/store)
analyzers = {}

def get_analyzer(project_path: str):
    '''Get or create analyzer for a project path.'''
    if project_path not in analyzers:
        analyzers[project_path] = KatalonAnalyzerAPI(project_path)
    return analyzers[project_path]

@app.route('/api/projects/<path:project_path>/summary', methods=['GET'])
def get_summary(project_path):
    '''Get project summary.'''
    try:
        analyzer = get_analyzer(project_path)
        return jsonify(analyzer.get_summary())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<path:project_path>/test-cases', methods=['GET'])
def get_test_cases(project_path):
    '''Get test cases with pagination.'''
    try:
        analyzer = get_analyzer(project_path)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', 0, type=int)
        return jsonify(analyzer.get_test_cases(limit=limit, offset=offset))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<path:project_path>/dashboard', methods=['GET'])
def get_dashboard(project_path):
    '''Get dashboard data.'''
    try:
        analyzer = get_analyzer(project_path)
        return jsonify(analyzer.get_dashboard_data())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<path:project_path>/search/test-cases', methods=['GET'])
def search_test_cases(project_path):
    '''Search test cases.'''
    try:
        analyzer = get_analyzer(project_path)
        query = request.args.get('q', '')
        return jsonify(analyzer.search_test_cases(query))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""

# ============================================================================
# FastAPI Example
# ============================================================================
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from Analyzer_Katalon.api import KatalonAnalyzerAPI
from typing import Optional

app = FastAPI(title="Katalon Studio Project Analyzer API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store analyzer instances (in production, use Redis or similar)
analyzers = {}

def get_analyzer(project_path: str):
    '''Get or create analyzer for a project path.'''
    if project_path not in analyzers:
        try:
            analyzers[project_path] = KatalonAnalyzerAPI(project_path)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error loading project: {str(e)}")
    return analyzers[project_path]

@app.get("/api/projects/{project_path:path}/summary")
async def get_summary(project_path: str):
    '''Get project summary.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_summary()

@app.get("/api/projects/{project_path:path}/test-cases")
async def get_test_cases(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    '''Get test cases with pagination.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_cases(limit=limit, offset=offset)

@app.get("/api/projects/{project_path:path}/test-suites")
async def get_test_suites(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    '''Get test suites with pagination.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_suites(limit=limit, offset=offset)

@app.get("/api/projects/{project_path:path}/keywords")
async def get_keywords(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    '''Get keywords with pagination.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_keywords(limit=limit, offset=offset)

@app.get("/api/projects/{project_path:path}/object-repository")
async def get_object_repository(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    '''Get object repository items with pagination.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_object_repository(limit=limit, offset=offset)

@app.get("/api/projects/{project_path:path}/profiles")
async def get_profiles(project_path: str):
    '''Get all profiles.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_profiles()

@app.get("/api/projects/{project_path:path}/coverage")
async def get_coverage(project_path: str):
    '''Get coverage analysis.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_coverage_analysis()

@app.get("/api/projects/{project_path:path}/dashboard")
async def get_dashboard(project_path: str):
    '''Get dashboard data.'''
    analyzer = get_analyzer(project_path)
    return analyzer.get_dashboard_data()

@app.get("/api/projects/{project_path:path}/search/test-cases")
async def search_test_cases(project_path: str, q: str = Query(..., min_length=1)):
    '''Search test cases.'''
    analyzer = get_analyzer(project_path)
    return analyzer.search_test_cases(q)

@app.get("/api/projects/{project_path:path}/search/keywords")
async def search_keywords(project_path: str, q: str = Query(..., min_length=1)):
    '''Search keywords.'''
    analyzer = get_analyzer(project_path)
    return analyzer.search_keywords(q)

@app.get("/api/projects/{project_path:path}/export")
async def export_all(project_path: str):
    '''Export all project data.'''
    analyzer = get_analyzer(project_path)
    return analyzer.export_all()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""

# ============================================================================
# Simple HTTP Server Example (Python 3 only, no dependencies)
# ============================================================================
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from Analyzer_Katalon.api import KatalonAnalyzerAPI

class AnalyzerHandler(BaseHTTPRequestHandler):
    analyzers = {}
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        query_params = parse_qs(parsed_path.query)
        
        if len(path_parts) < 3 or path_parts[0] != 'api' or path_parts[1] != 'projects':
            self.send_error(404)
            return
        
        project_path = '/'.join(path_parts[2:])
        
        try:
            if project_path not in self.analyzers:
                self.analyzers[project_path] = KatalonAnalyzerAPI(project_path)
            
            analyzer = self.analyzers[project_path]
            
            # Route handling
            if path_parts[-1] == 'summary':
                data = analyzer.get_summary()
            elif path_parts[-1] == 'dashboard':
                data = analyzer.get_dashboard_data()
            elif path_parts[-1] == 'test-cases':
                limit = int(query_params.get('limit', [None])[0]) if 'limit' in query_params else None
                offset = int(query_params.get('offset', ['0'])[0])
                data = analyzer.get_test_cases(limit=limit, offset=offset)
            else:
                self.send_error(404)
                return
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), AnalyzerHandler)
    print("Server running on http://localhost:8000")
    server.serve_forever()
"""

print("""
This file contains example implementations for web APIs.
Uncomment the framework you want to use:

1. Flask - Simple and easy to use
2. FastAPI - Modern, fast, with automatic API documentation
3. Simple HTTP Server - No dependencies, Python standard library only

To use:
1. Uncomment the desired framework section
2. Install dependencies if needed (Flask: pip install flask flask-cors, FastAPI: pip install fastapi uvicorn)
3. Run the script
4. Access the API from your frontend
""")

