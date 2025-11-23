"""
Statistics and analysis for Katalon Studio projects.
"""

from typing import Dict, List, Any, Set, Optional
from collections import Counter, defaultdict


class ProjectStatistics:
    """Calculate statistics and analysis for a Katalon Studio project."""
    
    def __init__(self, analyzer):
        """
        Initialize with a KatalonProjectAnalyzer instance.
        
        Args:
            analyzer: KatalonProjectAnalyzer instance
        """
        self.analyzer = analyzer
    
    def get_summary(self) -> Dict[str, Any]:
        """
        Get a summary of project statistics.
        
        Returns:
            Dictionary with summary statistics
        """
        return {
            'test_cases': {
                'total': len(self.analyzer.test_cases),
                'by_folder': self._count_by_folder(self.analyzer.test_cases)
            },
            'test_suites': {
                'total': len(self.analyzer.test_suites),
                'by_folder': self._count_by_folder(self.analyzer.test_suites)
            },
            'keywords': {
                'total_files': len(self.analyzer.keywords),
                'total_keywords': sum(len(k.get('keywords', [])) for k in self.analyzer.keywords.values()),
                'by_folder': self._count_by_folder(self.analyzer.keywords)
            },
            'object_repository': {
                'total': len(self.analyzer.object_repository),
                'by_folder': self._count_by_folder(self.analyzer.object_repository),
                'by_type': self._count_object_types()
            },
            'profiles': {
                'total': len(self.analyzer.profiles),
                'default_profile': self._get_default_profile(),
                'total_variables': sum(len(p.get('global_variables', [])) for p in self.analyzer.profiles.values())
            },
            'scripts': {
                'total': len(self.analyzer.scripts),
                'by_folder': self._count_by_folder(self.analyzer.scripts)
            }
        }
    
    def get_test_case_coverage(self) -> Dict[str, Any]:
        """
        Analyze test case coverage in test suites.
        
        Returns:
            Dictionary with coverage analysis
        """
        all_test_case_ids = set()
        used_test_case_ids = set()
        
        for test_case in self.analyzer.test_cases.values():
            all_test_case_ids.add(test_case.get('relative_path', ''))
        
        for test_suite in self.analyzer.test_suites.values():
            if 'test_cases' in test_suite:
                for tc_link in test_suite['test_cases']:
                    test_case_id = tc_link.get('test_case_id', '')
                    if test_case_id:
                        used_test_case_ids.add(test_case_id)
        
        unused = all_test_case_ids - used_test_case_ids
        
        return {
            'total_test_cases': len(all_test_case_ids),
            'used_in_suites': len(used_test_case_ids),
            'unused': len(unused),
            'coverage_percentage': (len(used_test_case_ids) / len(all_test_case_ids) * 100) if all_test_case_ids else 0,
            'unused_test_cases': list(unused)
        }
    
    def get_keyword_usage(self) -> Dict[str, Any]:
        """
        Analyze keyword usage across the project.
        
        Returns:
            Dictionary with keyword usage analysis
        """
        keyword_usage = Counter()
        keyword_definitions = {}
        
        # Collect keyword definitions
        for kw_file in self.analyzer.keywords.values():
            package = kw_file.get('package', '')
            for kw in kw_file.get('keywords', []):
                kw_name = kw.get('name', '')
                full_name = f"{package}.{kw_name}" if package else kw_name
                keyword_definitions[full_name] = kw_file.get('relative_path', '')
        
        # Count usage in scripts and test suites
        for script in self.analyzer.scripts.values():
            for custom_kw in script.get('custom_keyword_calls', []):
                keyword_usage[custom_kw] += 1
        
        for test_suite in self.analyzer.test_suites.values():
            for custom_kw in test_suite.get('custom_keyword_calls', []):
                keyword_usage[custom_kw] += 1
        
        # Find unused keywords
        unused_keywords = []
        for kw_name, kw_file in keyword_definitions.items():
            if kw_name not in keyword_usage:
                unused_keywords.append({
                    'name': kw_name,
                    'file': kw_file
                })
        
        return {
            'total_keywords': len(keyword_definitions),
            'used_keywords': len([k for k in keyword_usage.keys() if k in keyword_definitions]),
            'unused_keywords': unused_keywords,
            'most_used': dict(keyword_usage.most_common(10)),
            'usage_count': dict(keyword_usage)
        }
    
    def get_object_repository_usage(self) -> Dict[str, Any]:
        """
        Analyze object repository usage.
        
        Returns:
            Dictionary with object repository usage analysis
        """
        all_objects = set()
        used_objects = set()
        
        # Collect all object paths
        for obj in self.analyzer.object_repository.values():
            relative_path = obj.get('relative_path', '')
            # Convert file path to object path (e.g., "Object Repository/Page_Job Search Application/input_EMail.rs" -> "Page_Job Search Application/input_EMail")
            if 'Object Repository' in relative_path:
                obj_path = relative_path.replace('Object Repository/', '').replace('.rs', '')
                all_objects.add(obj_path)
        
        # Find usage in scripts and test suites
        for script in self.analyzer.scripts.values():
            for obj_call in script.get('test_object_calls', []):
                used_objects.add(obj_call)
        
        for test_suite in self.analyzer.test_suites.values():
            for obj_call in test_suite.get('test_object_calls', []):
                used_objects.add(obj_call)
        
        unused = all_objects - used_objects
        
        return {
            'total_objects': len(all_objects),
            'used_objects': len(used_objects),
            'unused_objects': len(unused),
            'coverage_percentage': (len(used_objects) / len(all_objects) * 100) if all_objects else 0,
            'unused_object_paths': list(unused)
        }
    
    def get_import_analysis(self) -> Dict[str, Any]:
        """
        Analyze imports across the project.
        
        Returns:
            Dictionary with import analysis
        """
        all_imports = Counter()
        
        for script in self.analyzer.scripts.values():
            for imp in script.get('imports', []):
                all_imports[imp] += 1
        
        for test_suite in self.analyzer.test_suites.values():
            for imp in test_suite.get('imports', []):
                all_imports[imp] += 1
        
        for kw_file in self.analyzer.keywords.values():
            for imp in kw_file.get('imports', []):
                all_imports[imp] += 1
        
        return {
            'total_unique_imports': len(all_imports),
            'most_common_imports': dict(all_imports.most_common(20)),
            'all_imports': dict(all_imports)
        }
    
    def get_test_suite_analysis(self) -> Dict[str, Any]:
        """
        Analyze test suite configurations.
        
        Returns:
            Dictionary with test suite analysis
        """
        suites_with_rerun = 0
        suites_with_data_binding = 0
        total_test_cases_in_suites = 0
        suites_with_setup = 0
        suites_with_teardown = 0
        
        for test_suite in self.analyzer.test_suites.values():
            if test_suite.get('is_rerun', False):
                suites_with_rerun += 1
            if test_suite.get('has_setup', False):
                suites_with_setup += 1
            if test_suite.get('has_teardown', False):
                suites_with_teardown += 1
            if 'test_cases' in test_suite:
                for tc_link in test_suite['test_cases']:
                    if tc_link.get('using_data_binding', False):
                        suites_with_data_binding += 1
                        break
                total_test_cases_in_suites += len(test_suite['test_cases'])
        
        return {
            'total_suites': len(self.analyzer.test_suites),
            'suites_with_rerun': suites_with_rerun,
            'suites_with_data_binding': suites_with_data_binding,
            'suites_with_setup': suites_with_setup,
            'suites_with_teardown': suites_with_teardown,
            'total_test_cases_in_suites': total_test_cases_in_suites,
            'average_test_cases_per_suite': total_test_cases_in_suites / len(self.analyzer.test_suites) if self.analyzer.test_suites else 0
        }
    
    def _count_by_folder(self, items: Dict[str, Any]) -> Dict[str, int]:
        """Count items by folder."""
        folder_counts = Counter()
        for item in items.values():
            relative_path = item.get('relative_path', '')
            if '/' in relative_path:
                folder = relative_path.split('/')[0]
                folder_counts[folder] += 1
            else:
                folder_counts['root'] += 1
        return dict(folder_counts)
    
    def _count_object_types(self) -> Dict[str, int]:
        """Count object repository items by type."""
        type_counts = Counter()
        for obj in self.analyzer.object_repository.values():
            obj_type = obj.get('element_type', 'Unknown')
            type_counts[obj_type] += 1
        return dict(type_counts)
    
    def _get_default_profile(self) -> Optional[str]:
        """Get the default profile name."""
        for profile in self.analyzer.profiles.values():
            if profile.get('is_default', False):
                return profile.get('name', '')
        return None

