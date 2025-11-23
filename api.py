"""
API wrapper for frontend integration.

This module provides a simple API interface that can be used with
Flask, FastAPI, or other web frameworks.
"""

import json
from typing import Dict, Any, Optional
from .analyzer import KatalonProjectAnalyzer
from .statistics import ProjectStatistics


class KatalonAnalyzerAPI:
    """
    API wrapper for Katalon Project Analyzer.
    
    This class provides a clean interface for frontend applications
    to interact with the analyzer.
    """
    
    def __init__(self, project_path: str):
        """
        Initialize the API with a project path.
        
        Args:
            project_path: Path to the Katalon Studio project
        """
        self.analyzer = KatalonProjectAnalyzer(project_path)
        self.analyzer.analyze()
        self.stats = self.analyzer.get_statistics()
    
    def get_project_info(self) -> Dict[str, Any]:
        """
        Get basic project information.
        
        Returns:
            Dictionary with project info
        """
        return {
            'project_name': self.analyzer.project_name,
            'project_path': self.analyzer.project_path
        }
    
    def get_summary(self) -> Dict[str, Any]:
        """
        Get project summary statistics.
        
        Returns:
            Dictionary with summary statistics
        """
        return self.stats.get_summary()
    
    def get_test_cases(self, limit: Optional[int] = None, offset: int = 0) -> Dict[str, Any]:
        """
        Get all test cases with pagination support.
        
        Args:
            limit: Maximum number of results to return
            offset: Number of results to skip
        
        Returns:
            Dictionary with test cases and metadata
        """
        test_cases = list(self.analyzer.get_test_cases().values())
        total = len(test_cases)
        
        if limit:
            test_cases = test_cases[offset:offset + limit]
        else:
            test_cases = test_cases[offset:]
        
        return {
            'total': total,
            'limit': limit,
            'offset': offset,
            'test_cases': test_cases
        }
    
    def get_test_suites(self, limit: Optional[int] = None, offset: int = 0) -> Dict[str, Any]:
        """
        Get all test suites with pagination support.
        
        Args:
            limit: Maximum number of results to return
            offset: Number of results to skip
        
        Returns:
            Dictionary with test suites and metadata
        """
        test_suites = list(self.analyzer.get_test_suites().values())
        total = len(test_suites)
        
        if limit:
            test_suites = test_suites[offset:offset + limit]
        else:
            test_suites = test_suites[offset:]
        
        return {
            'total': total,
            'limit': limit,
            'offset': offset,
            'test_suites': test_suites
        }
    
    def get_keywords(self, limit: Optional[int] = None, offset: int = 0) -> Dict[str, Any]:
        """
        Get all keywords with pagination support.
        
        Args:
            limit: Maximum number of results to return
            offset: Number of results to skip
        
        Returns:
            Dictionary with keywords and metadata
        """
        keywords = list(self.analyzer.get_keywords().values())
        total = len(keywords)
        
        if limit:
            keywords = keywords[offset:offset + limit]
        else:
            keywords = keywords[offset:]
        
        return {
            'total': total,
            'limit': limit,
            'offset': offset,
            'keywords': keywords
        }
    
    def get_object_repository(self, limit: Optional[int] = None, offset: int = 0) -> Dict[str, Any]:
        """
        Get all object repository items with pagination support.
        
        Args:
            limit: Maximum number of results to return
            offset: Number of results to skip
        
        Returns:
            Dictionary with object repository items and metadata
        """
        objects = list(self.analyzer.get_object_repository().values())
        total = len(objects)
        
        if limit:
            objects = objects[offset:offset + limit]
        else:
            objects = objects[offset:]
        
        return {
            'total': total,
            'limit': limit,
            'offset': offset,
            'objects': objects
        }
    
    def get_profiles(self) -> Dict[str, Any]:
        """
        Get all profiles.
        
        Returns:
            Dictionary with profiles
        """
        return {
            'profiles': list(self.analyzer.get_profiles().values())
        }
    
    def get_coverage_analysis(self) -> Dict[str, Any]:
        """
        Get coverage analysis.
        
        Returns:
            Dictionary with coverage metrics
        """
        return {
            'test_case_coverage': self.stats.get_test_case_coverage(),
            'object_repository_usage': self.stats.get_object_repository_usage(),
            'keyword_usage': self.stats.get_keyword_usage()
        }
    
    def get_analysis(self) -> Dict[str, Any]:
        """
        Get all analysis data.
        
        Returns:
            Dictionary with all analysis results
        """
        return {
            'test_suite_analysis': self.stats.get_test_suite_analysis(),
            'import_analysis': self.stats.get_import_analysis()
        }
    
    def search_test_cases(self, query: str) -> Dict[str, Any]:
        """
        Search test cases.
        
        Args:
            query: Search query string
        
        Returns:
            Dictionary with search results
        """
        results = self.analyzer.search_test_cases(query)
        return {
            'query': query,
            'count': len(results),
            'results': results
        }
    
    def search_keywords(self, query: str) -> Dict[str, Any]:
        """
        Search keywords.
        
        Args:
            query: Search query string
        
        Returns:
            Dictionary with search results
        """
        results = self.analyzer.search_keywords(query)
        return {
            'query': query,
            'count': len(results),
            'results': results
        }
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """
        Get all data needed for a dashboard view.
        
        Returns:
            Dictionary with dashboard data
        """
        return {
            'project_info': self.get_project_info(),
            'summary': self.get_summary(),
            'coverage': self.get_coverage_analysis(),
            'analysis': self.get_analysis()
        }
    
    def export_all(self) -> Dict[str, Any]:
        """
        Export all project data.
        
        Returns:
            Dictionary with all project data
        """
        return {
            'project_info': self.get_project_info(),
            'summary': self.get_summary(),
            'test_cases': list(self.analyzer.get_test_cases().values()),
            'test_suites': list(self.analyzer.get_test_suites().values()),
            'keywords': list(self.analyzer.get_keywords().values()),
            'object_repository': list(self.analyzer.get_object_repository().values()),
            'profiles': list(self.analyzer.get_profiles().values()),
            'scripts': list(self.analyzer.get_scripts().values()),
            'coverage': self.get_coverage_analysis(),
            'analysis': self.get_analysis()
        }
    
    def to_json(self, data: Dict[str, Any]) -> str:
        """
        Convert data dictionary to JSON string.
        
        Args:
            data: Data dictionary
        
        Returns:
            JSON string
        """
        return json.dumps(data, indent=2)


# Example Flask/FastAPI usage:
"""
# Flask example:
from flask import Flask, jsonify
from Analyzer_Katalon.api import KatalonAnalyzerAPI

app = Flask(__name__)
api = KatalonAnalyzerAPI("/path/to/project")

@app.route('/api/summary')
def summary():
    return jsonify(api.get_summary())

@app.route('/api/test-cases')
def test_cases():
    limit = request.args.get('limit', type=int)
    offset = request.args.get('offset', 0, type=int)
    return jsonify(api.get_test_cases(limit=limit, offset=offset))

@app.route('/api/dashboard')
def dashboard():
    return jsonify(api.get_dashboard_data())

# FastAPI example:
from fastapi import FastAPI
from Analyzer_Katalon.api import KatalonAnalyzerAPI

app = FastAPI()
api = KatalonAnalyzerAPI("/path/to/project")

@app.get("/api/summary")
async def summary():
    return api.get_summary()

@app.get("/api/test-cases")
async def test_cases(limit: int = None, offset: int = 0):
    return api.get_test_cases(limit=limit, offset=offset)

@app.get("/api/dashboard")
async def dashboard():
    return api.get_dashboard_data()
"""

