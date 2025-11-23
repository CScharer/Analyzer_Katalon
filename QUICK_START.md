# Quick Start Guide

## Installation

No installation required! This package uses only Python standard library.

## Basic Usage

```python
from Analyzer_Katalon import KatalonProjectAnalyzer

# Initialize with your project path
analyzer = KatalonProjectAnalyzer("/path/to/your/katalon/project")

# Analyze the project
analyzer.analyze()

# Get statistics
stats = analyzer.get_statistics()
summary = stats.get_summary()

print(f"Test Cases: {summary['test_cases']['total']}")
print(f"Test Suites: {summary['test_suites']['total']}")
```

## Using with Multiple Projects

```python
from Analyzer_Katalon import KatalonProjectAnalyzer

projects = [
    "/path/to/project1",
    "/path/to/project2",
    "/path/to/project3"
]

results = {}
for project_path in projects:
    analyzer = KatalonProjectAnalyzer(project_path)
    analyzer.analyze()
    stats = analyzer.get_statistics()
    results[project_path] = {
        'summary': stats.get_summary(),
        'coverage': stats.get_test_case_coverage()
    }
```

## Frontend Integration

### Option 1: Direct Python Script

```python
from Analyzer_Katalon.api import KatalonAnalyzerAPI
import json

# Initialize API
api = KatalonAnalyzerAPI("/path/to/project")

# Get data for frontend
dashboard_data = api.get_dashboard_data()

# Export as JSON
json_output = json.dumps(dashboard_data, indent=2)
print(json_output)
```

### Option 2: Web API (Flask/FastAPI)

See `web_api_example.py` for complete examples.

**Flask:**
```bash
pip install flask flask-cors
# Uncomment Flask section in web_api_example.py
python web_api_example.py
```

**FastAPI:**
```bash
pip install fastapi uvicorn
# Uncomment FastAPI section in web_api_example.py
python web_api_example.py
```

## Available Data

- **Test Cases**: All `.tc` files with metadata
- **Test Suites**: All `.ts` and `.groovy` test suite files
- **Keywords**: Custom keywords with usage tracking
- **Object Repository**: All test objects with selectors
- **Profiles**: Execution profiles and global variables
- **Scripts**: Test scripts with dependencies

## Key Features

1. **Statistics**: Comprehensive project statistics
2. **Coverage Analysis**: Test case and object repository coverage
3. **Usage Tracking**: Keyword and object usage across the project
4. **Search**: Search test cases and keywords
5. **Export**: Export all data as JSON for frontend consumption

## Example Output

```python
stats = analyzer.get_statistics()

# Summary
summary = stats.get_summary()
# Returns: test cases, test suites, keywords, objects, profiles counts

# Coverage
coverage = stats.get_test_case_coverage()
# Returns: total, used, unused, coverage percentage

# Keyword Usage
kw_usage = stats.get_keyword_usage()
# Returns: total, used, unused keywords, most used keywords

# Object Repository Usage
obj_usage = stats.get_object_repository_usage()
# Returns: total, used, unused objects, coverage percentage
```

## API Methods

### KatalonProjectAnalyzer
- `analyze()` - Analyze the project
- `get_statistics()` - Get statistics instance
- `search_test_cases(query)` - Search test cases
- `search_keywords(query)` - Search keywords
- `export_to_dict()` - Export all data

### KatalonAnalyzerAPI
- `get_summary()` - Project summary
- `get_test_cases(limit, offset)` - Paginated test cases
- `get_dashboard_data()` - All dashboard data
- `get_coverage_analysis()` - Coverage metrics
- `export_all()` - Export everything

## Next Steps

1. Run `example_usage.py` to see it in action
2. Check `README.md` for detailed documentation
3. Review `web_api_example.py` for frontend integration
4. Customize the API endpoints for your needs

