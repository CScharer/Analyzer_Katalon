"""
Katalon Studio Project Analyzer

A Python package for analyzing Katalon Studio automation projects.
"""

from .analyzer import KatalonProjectAnalyzer
from .parsers import (
    TestCaseParser,
    TestSuiteParser,
    KeywordParser,
    ObjectRepositoryParser,
    ProfileParser,
    ScriptParser
)
from .statistics import ProjectStatistics
from .api import KatalonAnalyzerAPI

__version__ = "1.0.0"
__all__ = [
    "KatalonProjectAnalyzer",
    "KatalonAnalyzerAPI",
    "TestCaseParser",
    "TestSuiteParser",
    "KeywordParser",
    "ObjectRepositoryParser",
    "ProfileParser",
    "ScriptParser",
    "ProjectStatistics"
]

