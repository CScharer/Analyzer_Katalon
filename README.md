# Katalon Studio Project Analyzer

A Python package for analyzing Katalon Studio automation projects. This package provides comprehensive analysis capabilities for test cases, test suites, keywords, object repository, profiles, and scripts.

## Features

- **Test Case Analysis**: Parse and analyze all test cases (.tc files)
- **Test Suite Analysis**: Parse test suites (.ts and .groovy files) and their configurations
- **Keyword Analysis**: Extract and analyze custom keywords with usage tracking
- **Object Repository Analysis**: Parse object repository files and track usage
- **Profile Analysis**: Analyze execution profiles and global variables
- **Script Analysis**: Analyze test scripts and their dependencies
- **Statistics**: Comprehensive statistics and coverage analysis
- **Search Capabilities**: Search test cases and keywords by name or description

## Installation

No external dependencies required. This package uses only Python standard library.

## Usage

### Basic Usage

```python
from Analyzer_Katalon import KatalonProjectAnalyzer

# Initialize analyzer with project path
analyzer = KatalonProjectAnalyzer("/path/to/katalon/project")

# Analyze the project
analyzer.analyze()

# Get statistics
stats = analyzer.get_statistics()
summary = stats.get_summary()
print(f"Total test cases: {summary['test_cases']['total']}")
print(f"Total test suites: {summary['test_suites']['total']}")
```

### Get Project Statistics

```python
stats = analyzer.get_statistics()

# Get summary
summary = stats.get_summary()

# Get test case coverage
coverage = stats.get_test_case_coverage()
print(f"Test case coverage: {coverage['coverage_percentage']:.2f}%")

# Get keyword usage
keyword_usage = stats.get_keyword_usage()
print(f"Total keywords: {keyword_usage['total_keywords']}")
print(f"Unused keywords: {len(keyword_usage['unused_keywords'])}")

# Get object repository usage
obj_usage = stats.get_object_repository_usage()
print(f"Object repository coverage: {obj_usage['coverage_percentage']:.2f}%")
```

### Search Functionality

```python
# Search test cases
results = analyzer.search_test_cases("Add Record")
for test_case in results:
    print(f"Found: {test_case['name']}")

# Search keywords
keyword_results = analyzer.search_keywords("populate")
for result in keyword_results:
    print(f"Keyword: {result['keyword']['name']}")
    print(f"File: {result['file']['relative_path']}")
```

### Access Parsed Data

```python
# Get all test cases
test_cases = analyzer.get_test_cases()
for path, test_case in test_cases.items():
    print(f"{test_case['name']}: {test_case['description']}")

# Get all keywords
keywords = analyzer.get_keywords()
for path, kw_file in keywords.items():
    print(f"Package: {kw_file['package']}")
    for kw in kw_file['keywords']:
        print(f"  - {kw['name']}")

# Get object repository
objects = analyzer.get_object_repository()
for path, obj in objects.items():
    print(f"{obj['name']}: {obj['element_type']}")
```

### Export Data

```python
# Export all data to dictionary
data = analyzer.export_to_dict()
# Can be serialized to JSON for frontend use
import json
json_data = json.dumps(data, indent=2)
```

## API Reference

### KatalonProjectAnalyzer

Main class for project analysis.

#### Methods

- `analyze()`: Analyze the entire project
- `get_statistics()`: Get ProjectStatistics instance
- `get_test_cases()`: Get all parsed test cases
- `get_test_suites()`: Get all parsed test suites
- `get_keywords()`: Get all parsed keywords
- `get_object_repository()`: Get all parsed object repository items
- `get_profiles()`: Get all parsed profiles
- `get_scripts()`: Get all parsed scripts
- `search_test_cases(query)`: Search test cases
- `search_keywords(query)`: Search keywords
- `get_test_case_by_name(name)`: Get test case by name
- `get_keyword_by_name(name)`: Get keyword by name
- `export_to_dict()`: Export all data to dictionary

### ProjectStatistics

Statistics and analysis class.

#### Methods

- `get_summary()`: Get project summary statistics
- `get_test_case_coverage()`: Analyze test case coverage
- `get_keyword_usage()`: Analyze keyword usage
- `get_object_repository_usage()`: Analyze object repository usage
- `get_import_analysis()`: Analyze imports
- `get_test_suite_analysis()`: Analyze test suite configurations

## Example: Frontend Integration

```python
from Analyzer_Katalon import KatalonProjectAnalyzer
import json

def analyze_project(project_path):
    analyzer = KatalonProjectAnalyzer(project_path)
    analyzer.analyze()
    
    stats = analyzer.get_statistics()
    
    # Prepare data for frontend
    frontend_data = {
        'project_name': analyzer.project_name,
        'summary': stats.get_summary(),
        'coverage': stats.get_test_case_coverage(),
        'keyword_usage': stats.get_keyword_usage(),
        'object_usage': stats.get_object_repository_usage(),
        'test_suite_analysis': stats.get_test_suite_analysis(),
        'test_cases': list(analyzer.get_test_cases().values()),
        'test_suites': list(analyzer.get_test_suites().values()),
        'keywords': list(analyzer.get_keywords().values()),
        'object_repository': list(analyzer.get_object_repository().values()),
        'profiles': list(analyzer.get_profiles().values())
    }
    
    return json.dumps(frontend_data, indent=2)

# Use with different projects
project1_data = analyze_project("/path/to/project1")
project2_data = analyze_project("/path/to/project2")
```

## Project Structure

```
Analyzer_Katalon/
├── __init__.py          # Package initialization
├── analyzer.py          # Main analyzer class
├── parsers.py           # Component parsers
├── statistics.py        # Statistics and analysis
├── utils.py             # Utility functions
├── requirements.txt     # Dependencies (none required)
└── README.md           # This file
```

## Supported File Types

- **Test Cases**: `.tc` files (XML)
- **Test Suites**: `.ts` files (XML) and `.groovy` files
- **Keywords**: `.groovy` files in Keywords directory
- **Object Repository**: `.rs` files (XML)
- **Profiles**: `.glbl` files (XML)
- **Scripts**: `.groovy` files in Scripts directory

## License

This package is provided as-is for use with Katalon Studio projects.

