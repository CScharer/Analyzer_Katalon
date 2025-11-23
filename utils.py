"""
Utility functions for Katalon Studio project analysis.
"""

import os
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Dict, Optional, Any
import re


def find_files_by_extension(directory: str, extension: str) -> List[str]:
    """
    Find all files with a specific extension in a directory tree.
    
    Args:
        directory: Root directory to search
        extension: File extension (e.g., '.tc', '.ts', '.groovy')
    
    Returns:
        List of file paths
    """
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(extension):
                files.append(os.path.join(root, filename))
    return files


def parse_xml_file(file_path: str) -> Optional[ET.Element]:
    """
    Parse an XML file and return the root element.
    
    Args:
        file_path: Path to the XML file
    
    Returns:
        XML root element or None if parsing fails
    """
    try:
        tree = ET.parse(file_path)
        return tree.getroot()
    except ET.ParseError as e:
        print(f"Error parsing XML file {file_path}: {e}")
        return None
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None


def get_relative_path(full_path: str, project_root: str) -> str:
    """
    Get relative path from project root.
    
    Args:
        full_path: Full file path
        project_root: Project root directory
    
    Returns:
        Relative path string
    """
    try:
        return os.path.relpath(full_path, project_root)
    except ValueError:
        return full_path


def extract_text_from_element(element: ET.Element, tag: str, default: str = "") -> str:
    """
    Extract text content from an XML element by tag name.
    
    Args:
        element: XML element
        tag: Tag name to find
        default: Default value if tag not found
    
    Returns:
        Text content or default value
    """
    found = element.find(tag)
    if found is not None and found.text:
        return found.text.strip()
    return default


def extract_all_text_from_element(element: ET.Element, tag: str) -> List[str]:
    """
    Extract all text content from elements with a specific tag.
    
    Args:
        element: XML element
        tag: Tag name to find
    
    Returns:
        List of text contents
    """
    results = []
    for found in element.findall(tag):
        if found.text:
            results.append(found.text.strip())
    return results


def read_groovy_file(file_path: str) -> str:
    """
    Read a Groovy file and return its content.
    
    Args:
        file_path: Path to the Groovy file
    
    Returns:
        File content as string
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading Groovy file {file_path}: {e}")
        return ""


def extract_keywords_from_groovy(content: str) -> List[Dict[str, Any]]:
    """
    Extract keyword definitions from Groovy code.
    
    Args:
        content: Groovy file content
    
    Returns:
        List of keyword dictionaries with name, parameters, etc.
    """
    keywords = []
    # Pattern to match @Keyword annotated methods
    pattern = r'@Keyword\s+def\s+(\w+)\s*\([^)]*\)'
    matches = re.finditer(pattern, content, re.MULTILINE)
    
    for match in matches:
        keyword_name = match.group(1)
        # Try to extract parameters
        param_match = re.search(rf'def\s+{keyword_name}\s*\(([^)]*)\)', content)
        params = []
        if param_match:
            param_str = param_match.group(1)
            if param_str.strip():
                params = [p.strip().split()[0] if ' ' in p.strip() else p.strip() 
                         for p in param_str.split(',')]
        
        keywords.append({
            'name': keyword_name,
            'parameters': params
        })
    
    return keywords


def extract_imports_from_groovy(content: str) -> List[str]:
    """
    Extract import statements from Groovy code.
    
    Args:
        content: Groovy file content
    
    Returns:
        List of import statements
    """
    imports = []
    pattern = r'^import\s+(.+?)(?:\s+as\s+\w+)?$'
    for line in content.split('\n'):
        match = re.match(pattern, line.strip())
        if match:
            imports.append(match.group(1))
    return imports


def extract_test_object_calls(content: str) -> List[str]:
    """
    Extract findTestObject calls from Groovy code.
    
    Args:
        content: Groovy file content
    
    Returns:
        List of test object paths
    """
    objects = []
    pattern = r'findTestObject\(["\']([^"\']+)["\']\)'
    matches = re.finditer(pattern, content)
    for match in matches:
        objects.append(match.group(1))
    return objects


def extract_test_case_calls(content: str) -> List[str]:
    """
    Extract findTestCase calls from Groovy code.
    
    Args:
        content: Groovy file content
    
    Returns:
        List of test case paths
    """
    cases = []
    pattern = r'findTestCase\(["\']([^"\']+)["\']\)'
    matches = re.finditer(pattern, content)
    for match in matches:
        cases.append(match.group(1))
    return cases


def extract_custom_keyword_calls(content: str) -> List[str]:
    """
    Extract CustomKeywords calls from Groovy code.
    
    Args:
        content: Groovy file content
    
    Returns:
        List of custom keyword paths
    """
    keywords = []
    pattern = r"CustomKeywords\.'([^']+)'"
    matches = re.finditer(pattern, content)
    for match in matches:
        keywords.append(match.group(1))
    return keywords

