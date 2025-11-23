"""
Example usage of the Katalon Studio Project Analyzer.

This script demonstrates how to use the analyzer with different projects.
"""

import json
import sys
from pathlib import Path

# Add the parent directory to the path to import the package
sys.path.insert(0, str(Path(__file__).parent.parent))

from Analyzer_Katalon.analyzer import KatalonProjectAnalyzer


def analyze_project(project_path: str, output_json: bool = False):
    """
    Analyze a Katalon Studio project and display results.
    
    Args:
        project_path: Path to the Katalon Studio project
        output_json: If True, output results as JSON
    """
    print(f"\n{'='*60}")
    print(f"Analyzing Project: {project_path}")
    print(f"{'='*60}\n")
    
    try:
        # Initialize and analyze
        analyzer = KatalonProjectAnalyzer(project_path)
        analyzer.analyze()
        
        # Get statistics
        stats = analyzer.get_statistics()
        
        # Get summary
        summary = stats.get_summary()
        
        if output_json:
            # Output as JSON
            data = {
                'project_name': analyzer.project_name,
                'project_path': analyzer.project_path,
                'summary': summary,
                'test_case_coverage': stats.get_test_case_coverage(),
                'keyword_usage': stats.get_keyword_usage(),
                'object_repository_usage': stats.get_object_repository_usage(),
                'test_suite_analysis': stats.get_test_suite_analysis(),
                'import_analysis': stats.get_import_analysis()
            }
            print(json.dumps(data, indent=2))
        else:
            # Print formatted summary
            print("PROJECT SUMMARY")
            print("-" * 60)
            print(f"Test Cases: {summary['test_cases']['total']}")
            print(f"Test Suites: {summary['test_suites']['total']}")
            print(f"Keywords: {summary['keywords']['total_keywords']} in {summary['keywords']['total_files']} files")
            print(f"Object Repository Items: {summary['object_repository']['total']}")
            print(f"Profiles: {summary['profiles']['total']}")
            print(f"Scripts: {summary['scripts']['total']}")
            
            # Test case coverage
            coverage = stats.get_test_case_coverage()
            print(f"\nTEST CASE COVERAGE")
            print("-" * 60)
            print(f"Total Test Cases: {coverage['total_test_cases']}")
            print(f"Used in Suites: {coverage['used_in_suites']}")
            print(f"Unused: {coverage['unused']}")
            print(f"Coverage: {coverage['coverage_percentage']:.2f}%")
            
            # Keyword usage
            kw_usage = stats.get_keyword_usage()
            print(f"\nKEYWORD USAGE")
            print("-" * 60)
            print(f"Total Keywords: {kw_usage['total_keywords']}")
            print(f"Used Keywords: {kw_usage['used_keywords']}")
            print(f"Unused Keywords: {len(kw_usage['unused_keywords'])}")
            if kw_usage['most_used']:
                print("\nMost Used Keywords:")
                for kw, count in list(kw_usage['most_used'].items())[:5]:
                    print(f"  - {kw}: {count} times")
            
            # Object repository usage
            obj_usage = stats.get_object_repository_usage()
            print(f"\nOBJECT REPOSITORY USAGE")
            print("-" * 60)
            print(f"Total Objects: {obj_usage['total_objects']}")
            print(f"Used Objects: {obj_usage['used_objects']}")
            print(f"Unused Objects: {obj_usage['unused_objects']}")
            print(f"Coverage: {obj_usage['coverage_percentage']:.2f}%")
            
            # Test suite analysis
            suite_analysis = stats.get_test_suite_analysis()
            print(f"\nTEST SUITE ANALYSIS")
            print("-" * 60)
            print(f"Total Suites: {suite_analysis['total_suites']}")
            print(f"Suites with Rerun: {suite_analysis['suites_with_rerun']}")
            print(f"Suites with Data Binding: {suite_analysis['suites_with_data_binding']}")
            print(f"Suites with Setup: {suite_analysis['suites_with_setup']}")
            print(f"Suites with Teardown: {suite_analysis['suites_with_teardown']}")
            print(f"Average Test Cases per Suite: {suite_analysis['average_test_cases_per_suite']:.2f}")
        
        return analyzer, stats
        
    except Exception as e:
        print(f"Error analyzing project: {e}")
        import traceback
        traceback.print_exc()
        return None, None


def search_example(analyzer: KatalonProjectAnalyzer):
    """Example of search functionality."""
    print(f"\n{'='*60}")
    print("SEARCH EXAMPLES")
    print(f"{'='*60}\n")
    
    # Search test cases
    print("Searching for test cases containing 'Add':")
    results = analyzer.search_test_cases("Add")
    for test_case in results[:5]:  # Show first 5
        print(f"  - {test_case['name']}: {test_case['description']}")
    
    # Search keywords
    print("\nSearching for keywords containing 'populate':")
    kw_results = analyzer.search_keywords("populate")
    for result in kw_results[:5]:  # Show first 5
        print(f"  - {result['keyword']['name']} in {result['file']['relative_path']}")


def export_for_frontend(analyzer: KatalonProjectAnalyzer, output_file: str = None):
    """
    Export project data in a format suitable for frontend consumption.
    
    Args:
        analyzer: KatalonProjectAnalyzer instance
        output_file: Optional file path to save JSON output
    """
    stats = analyzer.get_statistics()
    
    frontend_data = {
        'project_name': analyzer.project_name,
        'project_path': analyzer.project_path,
        'summary': stats.get_summary(),
        'coverage': stats.get_test_case_coverage(),
        'keyword_usage': stats.get_keyword_usage(),
        'object_usage': stats.get_object_repository_usage(),
        'test_suite_analysis': stats.get_test_suite_analysis(),
        'import_analysis': stats.get_import_analysis(),
        'test_cases': list(analyzer.get_test_cases().values()),
        'test_suites': list(analyzer.get_test_suites().values()),
        'keywords': list(analyzer.get_keywords().values()),
        'object_repository': list(analyzer.get_object_repository().values()),
        'profiles': list(analyzer.get_profiles().values()),
        'scripts': list(analyzer.get_scripts().values())
    }
    
    json_output = json.dumps(frontend_data, indent=2)
    
    if output_file:
        with open(output_file, 'w') as f:
            f.write(json_output)
        print(f"\nData exported to: {output_file}")
    else:
        print(json_output)
    
    return json_output


if __name__ == "__main__":
    # Example: Analyze the current project
    import os
    
    # Get the project path (parent of Analyzer_Katalon directory)
    current_dir = Path(__file__).parent
    project_path = current_dir.parent
    
    if len(sys.argv) > 1:
        project_path = sys.argv[1]
    
    # Analyze the project
    analyzer, stats = analyze_project(str(project_path))
    
    if analyzer:
        # Show search examples
        search_example(analyzer)
        
        # Export for frontend (optional)
        if len(sys.argv) > 2 and sys.argv[2] == '--export':
            output_file = sys.argv[3] if len(sys.argv) > 3 else 'project_analysis.json'
            export_for_frontend(analyzer, output_file)

