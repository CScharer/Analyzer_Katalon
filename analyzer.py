"""
Main analyzer class for Katalon Studio projects.
"""

import os
from pathlib import Path
from typing import Dict, List, Optional, Any
from .parsers import (
    TestCaseParser,
    TestSuiteParser,
    KeywordParser,
    ObjectRepositoryParser,
    ProfileParser,
    ScriptParser
)
from .utils import find_files_by_extension
from .statistics import ProjectStatistics


class KatalonProjectAnalyzer:
    """
    Main class for analyzing Katalon Studio projects.
    
    Usage:
        analyzer = KatalonProjectAnalyzer("/path/to/project")
        analyzer.analyze()
        stats = analyzer.get_statistics()
    """
    
    def __init__(self, project_path: str):
        """
        Initialize the analyzer with a project path.
        
        Args:
            project_path: Path to the Katalon Studio project root directory
        """
        if not os.path.isdir(project_path):
            raise ValueError(f"Project path does not exist: {project_path}")
        
        self.project_path = os.path.abspath(project_path)
        self.project_name = os.path.basename(self.project_path)
        
        # Storage for parsed data
        self.test_cases: Dict[str, Dict[str, Any]] = {}
        self.test_suites: Dict[str, Dict[str, Any]] = {}
        self.keywords: Dict[str, Dict[str, Any]] = {}
        self.object_repository: Dict[str, Dict[str, Any]] = {}
        self.profiles: Dict[str, Dict[str, Any]] = {}
        self.scripts: Dict[str, Dict[str, Any]] = {}
        
        # Statistics instance
        self._statistics: Optional[ProjectStatistics] = None
    
    def analyze(self) -> None:
        """
        Analyze the entire project and populate all data structures.
        """
        print(f"Analyzing Katalon Studio project: {self.project_name}")
        
        # Analyze test cases
        print("  Analyzing test cases...")
        self._analyze_test_cases()
        
        # Analyze test suites
        print("  Analyzing test suites...")
        self._analyze_test_suites()
        
        # Analyze keywords
        print("  Analyzing keywords...")
        self._analyze_keywords()
        
        # Analyze object repository
        print("  Analyzing object repository...")
        self._analyze_object_repository()
        
        # Analyze profiles
        print("  Analyzing profiles...")
        self._analyze_profiles()
        
        # Analyze scripts
        print("  Analyzing scripts...")
        self._analyze_scripts()
        
        print("Analysis complete!")
    
    def _analyze_test_cases(self) -> None:
        """Analyze all test case files."""
        test_case_files = find_files_by_extension(self.project_path, '.tc')
        parser = TestCaseParser()
        
        for file_path in test_case_files:
            test_case = parser.parse(file_path, self.project_path)
            if test_case:
                self.test_cases[file_path] = test_case
    
    def _analyze_test_suites(self) -> None:
        """Analyze all test suite files."""
        # Parse .ts files
        ts_files = find_files_by_extension(self.project_path, '.ts')
        parser = TestSuiteParser()
        
        for file_path in ts_files:
            test_suite = parser.parse_ts(file_path, self.project_path)
            if test_suite:
                self.test_suites[file_path] = test_suite
        
        # Parse .groovy files in Test Suites directory
        test_suites_dir = os.path.join(self.project_path, 'Test Suites')
        if os.path.isdir(test_suites_dir):
            groovy_files = find_files_by_extension(test_suites_dir, '.groovy')
            for file_path in groovy_files:
                test_suite = parser.parse_groovy(file_path, self.project_path)
                if test_suite:
                    # Merge with existing .ts file if it exists
                    ts_file = file_path.replace('.groovy', '.ts')
                    if ts_file in self.test_suites:
                        self.test_suites[ts_file].update(test_suite)
                    else:
                        self.test_suites[file_path] = test_suite
    
    def _analyze_keywords(self) -> None:
        """Analyze all keyword files."""
        keywords_dir = os.path.join(self.project_path, 'Keywords')
        if not os.path.isdir(keywords_dir):
            return
        
        groovy_files = find_files_by_extension(keywords_dir, '.groovy')
        parser = KeywordParser()
        
        for file_path in groovy_files:
            keyword = parser.parse(file_path, self.project_path)
            if keyword:
                self.keywords[file_path] = keyword
    
    def _analyze_object_repository(self) -> None:
        """Analyze all object repository files."""
        object_repo_dir = os.path.join(self.project_path, 'Object Repository')
        if not os.path.isdir(object_repo_dir):
            return
        
        rs_files = find_files_by_extension(object_repo_dir, '.rs')
        parser = ObjectRepositoryParser()
        
        for file_path in rs_files:
            test_object = parser.parse(file_path, self.project_path)
            if test_object:
                self.object_repository[file_path] = test_object
    
    def _analyze_profiles(self) -> None:
        """Analyze all profile files."""
        profiles_dir = os.path.join(self.project_path, 'Profiles')
        if not os.path.isdir(profiles_dir):
            return
        
        glbl_files = find_files_by_extension(profiles_dir, '.glbl')
        parser = ProfileParser()
        
        for file_path in glbl_files:
            profile = parser.parse(file_path, self.project_path)
            if profile:
                self.profiles[file_path] = profile
    
    def _analyze_scripts(self) -> None:
        """Analyze all script files."""
        scripts_dir = os.path.join(self.project_path, 'Scripts')
        if not os.path.isdir(scripts_dir):
            return
        
        groovy_files = find_files_by_extension(scripts_dir, '.groovy')
        parser = ScriptParser()
        
        for file_path in groovy_files:
            script = parser.parse(file_path, self.project_path)
            if script:
                self.scripts[file_path] = script
    
    def get_statistics(self) -> ProjectStatistics:
        """
        Get statistics instance for the analyzed project.
        
        Returns:
            ProjectStatistics instance
        """
        if self._statistics is None:
            self._statistics = ProjectStatistics(self)
        return self._statistics
    
    def get_test_cases(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed test cases."""
        return self.test_cases
    
    def get_test_suites(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed test suites."""
        return self.test_suites
    
    def get_keywords(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed keywords."""
        return self.keywords
    
    def get_object_repository(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed object repository items."""
        return self.object_repository
    
    def get_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed profiles."""
        return self.profiles
    
    def get_scripts(self) -> Dict[str, Dict[str, Any]]:
        """Get all parsed scripts."""
        return self.scripts
    
    def search_test_cases(self, query: str) -> List[Dict[str, Any]]:
        """
        Search test cases by name or description.
        
        Args:
            query: Search query string
        
        Returns:
            List of matching test cases
        """
        query_lower = query.lower()
        results = []
        
        for test_case in self.test_cases.values():
            name = test_case.get('name', '').lower()
            description = test_case.get('description', '').lower()
            if query_lower in name or query_lower in description:
                results.append(test_case)
        
        return results
    
    def search_keywords(self, query: str) -> List[Dict[str, Any]]:
        """
        Search keywords by name.
        
        Args:
            query: Search query string
        
        Returns:
            List of matching keyword files
        """
        query_lower = query.lower()
        results = []
        
        for kw_file in self.keywords.values():
            for kw in kw_file.get('keywords', []):
                kw_name = kw.get('name', '').lower()
                if query_lower in kw_name:
                    results.append({
                        'keyword': kw,
                        'file': kw_file
                    })
        
        return results
    
    def search_test_suites(self, query: str) -> List[Dict[str, Any]]:
        """
        Search test suites by name or description.
        
        Args:
            query: Search query string
        
        Returns:
            List of matching test suites
        """
        query_lower = query.lower()
        results = []
        
        for test_suite in self.test_suites.values():
            name = test_suite.get('name', '').lower()
            description = test_suite.get('description', '').lower()
            if query_lower in name or query_lower in description:
                results.append(test_suite)
        
        return results
    
    def search_object_repository(self, query: str) -> List[Dict[str, Any]]:
        """
        Search object repository objects by name or type.
        
        Args:
            query: Search query string
        
        Returns:
            List of matching objects
        """
        query_lower = query.lower()
        results = []
        
        for obj in self.object_repository.values():
            name = obj.get('name', '').lower()
            element_type = obj.get('element_type', '').lower()
            selector_method = obj.get('selector_method', '').lower()
            if (query_lower in name or 
                query_lower in element_type or 
                query_lower in selector_method):
                results.append(obj)
        
        return results
    
    def get_test_case_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get a test case by its name.
        
        Args:
            name: Test case name
        
        Returns:
            Test case dictionary or None
        """
        for test_case in self.test_cases.values():
            if test_case.get('name') == name:
                return test_case
        return None
    
    def get_keyword_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get a keyword file containing a keyword with the given name.
        
        Args:
            name: Keyword name
        
        Returns:
            Keyword file dictionary or None
        """
        for kw_file in self.keywords.values():
            for kw in kw_file.get('keywords', []):
                if kw.get('name') == name:
                    return kw_file
        return None
    
    def export_to_dict(self) -> Dict[str, Any]:
        """
        Export all analyzed data to a dictionary.
        
        Returns:
            Dictionary containing all project data
        """
        return {
            'project_path': self.project_path,
            'project_name': self.project_name,
            'test_cases': self.test_cases,
            'test_suites': self.test_suites,
            'keywords': self.keywords,
            'object_repository': self.object_repository,
            'profiles': self.profiles,
            'scripts': self.scripts
        }

