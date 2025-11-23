"""
FastAPI server for Katalon Studio Project Analyzer.

Run this server to provide API endpoints for the Next.js frontend.
Usage: python api_server.py
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
import os
from pathlib import Path
from typing import Optional

# Add the onboarding directory to path so we can import Analyzer_Katalon as a package
# Next_Katalon -> Analyzer_Katalon -> onboarding
onboarding_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(onboarding_dir))

# Now import Analyzer_Katalon as a package
from Analyzer_Katalon.api import KatalonAnalyzerAPI

app = FastAPI(
    title="Katalon Studio Project Analyzer API",
    description="API for analyzing Katalon Studio projects",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store analyzer instances (in production, use Redis or similar)
analyzers = {}


def get_analyzer(project_path: str):
    """Get or create analyzer for a project path."""
    # Normalize the path
    project_path = os.path.abspath(project_path)
    
    if project_path not in analyzers:
        try:
            analyzers[project_path] = KatalonAnalyzerAPI(project_path)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error loading project: {str(e)}"
            )
    return analyzers[project_path]


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Katalon Studio Project Analyzer API",
        "version": "1.0.0"
    }


@app.get("/api/project/summary")
async def get_summary_query(project_path: str = Query(...)):
    """Get project summary (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_summary()


@app.get("/api/project/info")
async def get_project_info_query(project_path: str = Query(...)):
    """Get project information (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_project_info()


@app.get("/api/project/dashboard")
async def get_dashboard_query(project_path: str = Query(...)):
    """Get dashboard data (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_dashboard_data()


@app.get("/api/projects/{project_path:path}/summary")
async def get_summary(project_path: str):
    """Get project summary."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_summary()


@app.get("/api/projects/{project_path:path}/info")
async def get_project_info(project_path: str):
    """Get project information."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_project_info()


@app.get("/api/projects/{project_path:path}/test-cases")
async def get_test_cases(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    """Get test cases with pagination."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_cases(limit=limit, offset=offset)


@app.get("/api/projects/{project_path:path}/test-suites")
async def get_test_suites(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    """Get test suites with pagination."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_suites(limit=limit, offset=offset)


@app.get("/api/projects/{project_path:path}/keywords")
async def get_keywords(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    """Get keywords with pagination."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_keywords(limit=limit, offset=offset)


@app.get("/api/projects/{project_path:path}/object-repository")
async def get_object_repository(
    project_path: str,
    limit: Optional[int] = Query(None),
    offset: int = Query(0, ge=0)
):
    """Get object repository items with pagination."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_object_repository(limit=limit, offset=offset)


@app.get("/api/projects/{project_path:path}/profiles")
async def get_profiles(project_path: str):
    """Get all profiles."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_profiles()


@app.get("/api/projects/{project_path:path}/coverage")
async def get_coverage(project_path: str):
    """Get coverage analysis."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_coverage_analysis()


@app.get("/api/projects/{project_path:path}/analysis")
async def get_analysis(project_path: str):
    """Get analysis data."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_analysis()


@app.get("/api/projects/{project_path:path}/dashboard")
async def get_dashboard(project_path: str):
    """Get dashboard data."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_dashboard_data()


@app.get("/api/project/test-cases")
async def get_test_cases_query(project_path: str = Query(...), limit: Optional[int] = Query(None), offset: int = Query(0, ge=0)):
    """Get test cases with pagination (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_cases(limit=limit, offset=offset)


@app.get("/api/project/test-suites")
async def get_test_suites_query(project_path: str = Query(...), limit: Optional[int] = Query(None), offset: int = Query(0, ge=0)):
    """Get test suites with pagination (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_test_suites(limit=limit, offset=offset)


@app.get("/api/project/keywords")
async def get_keywords_query(project_path: str = Query(...), limit: Optional[int] = Query(None), offset: int = Query(0, ge=0)):
    """Get keywords with pagination (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_keywords(limit=limit, offset=offset)


@app.get("/api/project/object-repository")
async def get_object_repository_query(project_path: str = Query(...), limit: Optional[int] = Query(None), offset: int = Query(0, ge=0)):
    """Get object repository (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_object_repository(limit=limit, offset=offset)


@app.get("/api/project/coverage")
async def get_coverage_query(project_path: str = Query(...)):
    """Get coverage analysis (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.get_coverage_analysis()


@app.get("/api/project/search/test-cases")
async def search_test_cases_query(project_path: str = Query(...), q: str = Query(..., min_length=1)):
    """Search test cases (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_test_cases(q)


@app.get("/api/project/search/keywords")
async def search_keywords_query(project_path: str = Query(...), q: str = Query(..., min_length=1)):
    """Search keywords (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_keywords(q)


@app.get("/api/project/search/test-suites")
async def search_test_suites_query(project_path: str = Query(...), q: str = Query(..., min_length=1)):
    """Search test suites (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_test_suites(q)


@app.get("/api/project/search/object-repository")
async def search_object_repository_query(project_path: str = Query(...), q: str = Query(..., min_length=1)):
    """Search object repository (query param version)."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_object_repository(q)


@app.get("/api/projects/{project_path:path}/search/test-cases")
async def search_test_cases(project_path: str, q: str = Query(..., min_length=1)):
    """Search test cases."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_test_cases(q)


@app.get("/api/projects/{project_path:path}/search/keywords")
async def search_keywords(project_path: str, q: str = Query(..., min_length=1)):
    """Search keywords."""
    analyzer = get_analyzer(project_path)
    return analyzer.search_keywords(q)


@app.get("/api/projects/{project_path:path}/export")
async def export_all(project_path: str):
    """Export all project data."""
    analyzer = get_analyzer(project_path)
    return analyzer.export_all()


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    print("Starting Katalon Analyzer API Server on http://localhost:8000")
    print("Make sure to start this before running the Next.js frontend")
    uvicorn.run(app, host="0.0.0.0", port=8000)

