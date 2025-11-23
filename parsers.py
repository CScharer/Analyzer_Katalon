"""
Parsers for Katalon Studio project components.
"""

import os
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Any
from .utils import (
    parse_xml_file,
    extract_text_from_element,
    extract_all_text_from_element,
    read_groovy_file,
    extract_keywords_from_groovy,
    extract_imports_from_groovy,
    extract_test_object_calls,
    extract_test_case_calls,
    extract_custom_keyword_calls,
    get_relative_path
)


class TestCaseParser:
    """Parser for Katalon Studio test case files (.tc)."""
    
    @staticmethod
    def parse(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a test case file.
        
        Args:
            file_path: Path to the .tc file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with test case information
        """
        root = parse_xml_file(file_path)
        if root is None:
            return {}
        
        test_case = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'name': extract_text_from_element(root, 'name'),
            'description': extract_text_from_element(root, 'description'),
            'tag': extract_text_from_element(root, 'tag'),
            'comment': extract_text_from_element(root, 'comment'),
            'record_option': extract_text_from_element(root, 'recordOption'),
            'guid': extract_text_from_element(root, 'testCaseGuid'),
        }
        
        return test_case


class TestSuiteParser:
    """Parser for Katalon Studio test suite files (.ts and .groovy)."""
    
    @staticmethod
    def parse_ts(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a test suite XML file (.ts).
        
        Args:
            file_path: Path to the .ts file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with test suite information
        """
        root = parse_xml_file(file_path)
        if root is None:
            return {}
        
        test_suite = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'name': extract_text_from_element(root, 'name'),
            'description': extract_text_from_element(root, 'description'),
            'tag': extract_text_from_element(root, 'tag'),
            'is_rerun': extract_text_from_element(root, 'isRerun', 'false').lower() == 'true',
            'mail_recipient': extract_text_from_element(root, 'mailRecipient'),
            'number_of_rerun': int(extract_text_from_element(root, 'numberOfRerun', '0')),
            'page_load_timeout': int(extract_text_from_element(root, 'pageLoadTimeout', '30')),
            'page_load_timeout_default': extract_text_from_element(root, 'pageLoadTimeoutDefault', 'true').lower() == 'true',
            'rerun_failed_test_cases_only': extract_text_from_element(root, 'rerunFailedTestCasesOnly', 'false').lower() == 'true',
            'rerun_immediately': extract_text_from_element(root, 'rerunImmediately', 'true').lower() == 'true',
            'guid': extract_text_from_element(root, 'testSuiteGuid'),
            'test_cases': []
        }
        
        # Extract test case links
        for test_case_link in root.findall('testCaseLink'):
            test_case_info = {
                'guid': extract_text_from_element(test_case_link, 'guid'),
                'is_reuse_driver': extract_text_from_element(test_case_link, 'isReuseDriver', 'false').lower() == 'true',
                'is_run': extract_text_from_element(test_case_link, 'isRun', 'true').lower() == 'true',
                'test_case_id': extract_text_from_element(test_case_link, 'testCaseId'),
                'using_data_binding': extract_text_from_element(test_case_link, 'usingDataBindingAtTestSuiteLevel', 'false').lower() == 'true',
            }
            test_suite['test_cases'].append(test_case_info)
        
        return test_suite
    
    @staticmethod
    def parse_groovy(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a test suite Groovy file (.groovy).
        
        Args:
            file_path: Path to the .groovy file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with test suite information
        """
        content = read_groovy_file(file_path)
        if not content:
            return {}
        
        test_suite = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'content': content,
            'imports': extract_imports_from_groovy(content),
            'test_object_calls': extract_test_object_calls(content),
            'test_case_calls': extract_test_case_calls(content),
            'custom_keyword_calls': extract_custom_keyword_calls(content),
            'has_setup': '@SetUp' in content,
            'has_teardown': '@TearDown' in content,
            'has_setup_test_case': '@SetupTestCase' in content,
            'has_teardown_test_case': '@TearDownTestCase' in content,
        }
        
        return test_suite


class KeywordParser:
    """Parser for Katalon Studio keyword files (.groovy)."""
    
    @staticmethod
    def parse(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a keyword file.
        
        Args:
            file_path: Path to the .groovy keyword file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with keyword information
        """
        content = read_groovy_file(file_path)
        if not content:
            return {}
        
        # Extract package name
        package_match = None
        import re
        package_pattern = r'^package\s+(\S+)'
        for line in content.split('\n'):
            match = re.match(package_pattern, line.strip())
            if match:
                package_match = match.group(1)
                break
        
        keywords = extract_keywords_from_groovy(content)
        
        keyword_file = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'package': package_match or '',
            'content': content,
            'keywords': keywords,
            'imports': extract_imports_from_groovy(content),
            'test_object_calls': extract_test_object_calls(content),
            'test_case_calls': extract_test_case_calls(content),
        }
        
        return keyword_file


class ObjectRepositoryParser:
    """Parser for Katalon Studio object repository files (.rs)."""
    
    @staticmethod
    def parse(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse an object repository file.
        
        Args:
            file_path: Path to the .rs file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with object repository information
        """
        root = parse_xml_file(file_path)
        if root is None:
            return {}
        
        # Determine element type
        element_type = None
        if root.tag == 'WebElementEntity':
            element_type = 'WebElement'
        elif root.tag == 'WindowsElementEntity':
            element_type = 'WindowsElement'
        elif root.tag == 'MobileElementEntity':
            element_type = 'MobileElement'
        
        test_object = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'element_type': element_type,
            'name': extract_text_from_element(root, 'name'),
            'description': extract_text_from_element(root, 'description'),
            'tag': extract_text_from_element(root, 'tag'),
            'guid': extract_text_from_element(root, 'elementGuidId'),
            'selector_method': extract_text_from_element(root, 'selectorMethod'),
            'smart_locator_enabled': extract_text_from_element(root, 'smartLocatorEnabled', 'false').lower() == 'true',
            'selectors': {},
            'smart_locators': {},
            'properties': [],
            'xpaths': []
        }
        
        # Extract selectors
        selector_collection = root.find('selectorCollection')
        if selector_collection is not None:
            for entry in selector_collection.findall('entry'):
                key = extract_text_from_element(entry, 'key')
                value = extract_text_from_element(entry, 'value')
                if key and value:
                    test_object['selectors'][key] = value
        
        # Extract smart locators
        smart_locator_collection = root.find('smartLocatorCollection')
        if smart_locator_collection is not None:
            for entry in smart_locator_collection.findall('entry'):
                key = extract_text_from_element(entry, 'key')
                value = extract_text_from_element(entry, 'value')
                if key and value:
                    test_object['smart_locators'][key] = value
        
        # Extract properties
        for prop in root.findall('webElementProperties'):
            property_info = {
                'name': extract_text_from_element(prop, 'name'),
                'value': extract_text_from_element(prop, 'value'),
                'type': extract_text_from_element(prop, 'type'),
                'match_condition': extract_text_from_element(prop, 'matchCondition'),
                'is_selected': extract_text_from_element(prop, 'isSelected', 'false').lower() == 'true',
                'guid': extract_text_from_element(prop, 'webElementGuid'),
            }
            test_object['properties'].append(property_info)
        
        # Extract xpaths
        for xpath in root.findall('webElementXpaths'):
            xpath_info = {
                'name': extract_text_from_element(xpath, 'name'),
                'value': extract_text_from_element(xpath, 'value'),
                'type': extract_text_from_element(xpath, 'type'),
                'match_condition': extract_text_from_element(xpath, 'matchCondition'),
                'is_selected': extract_text_from_element(xpath, 'isSelected', 'false').lower() == 'true',
                'guid': extract_text_from_element(xpath, 'webElementGuid'),
            }
            test_object['xpaths'].append(xpath_info)
        
        return test_object


class ProfileParser:
    """Parser for Katalon Studio profile files (.glbl)."""
    
    @staticmethod
    def parse(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a profile file.
        
        Args:
            file_path: Path to the .glbl file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with profile information
        """
        root = parse_xml_file(file_path)
        if root is None:
            return {}
        
        profile = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'name': extract_text_from_element(root, 'name'),
            'description': extract_text_from_element(root, 'description'),
            'tag': extract_text_from_element(root, 'tag'),
            'is_default': extract_text_from_element(root, 'defaultProfile', 'false').lower() == 'true',
            'global_variables': []
        }
        
        # Extract global variables
        for var in root.findall('GlobalVariableEntity'):
            variable = {
                'name': extract_text_from_element(var, 'name'),
                'description': extract_text_from_element(var, 'description'),
                'value_type': extract_text_from_element(var, 'valueType'),
                'init_value': extract_text_from_element(var, 'initValue'),
                'is_protected': extract_text_from_element(var, 'protected', 'False').lower() == 'true',
            }
            profile['global_variables'].append(variable)
        
        return profile


class ScriptParser:
    """Parser for Katalon Studio script files (.groovy)."""
    
    @staticmethod
    def parse(file_path: str, project_root: str = "") -> Dict[str, Any]:
        """
        Parse a script file.
        
        Args:
            file_path: Path to the .groovy script file
            project_root: Project root directory for relative paths
        
        Returns:
            Dictionary with script information
        """
        content = read_groovy_file(file_path)
        if not content:
            return {}
        
        script = {
            'file_path': file_path,
            'relative_path': get_relative_path(file_path, project_root) if project_root else file_path,
            'content': content,
            'imports': extract_imports_from_groovy(content),
            'test_object_calls': extract_test_object_calls(content),
            'test_case_calls': extract_test_case_calls(content),
            'custom_keyword_calls': extract_custom_keyword_calls(content),
            'line_count': len(content.split('\n')),
        }
        
        return script

