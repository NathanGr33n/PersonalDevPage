#!/usr/bin/env python3
"""
Feature Validation Script for PersonalDevPage
Tests all new features and generates a comprehensive report
"""

import os
import sys
import json
import re
import time
from pathlib import Path
from typing import Dict, List, Any

def validate_file_structure() -> Dict[str, Any]:
    """Validate that all required files exist and are properly structured."""
    required_files = [
        'index.html',
        'styles.css',
        'script.js',
        'analytics.js',
        'README.md',
        'favicon.ico'
    ]
    
    results = {
        'status': 'success',
        'issues': [],
        'files_checked': 0,
        'files_found': 0
    }
    
    for file_path in required_files:
        results['files_checked'] += 1
        if os.path.exists(file_path):
            results['files_found'] += 1
            print(f"✅ Found: {file_path}")
        else:
            results['issues'].append(f"Missing required file: {file_path}")
            results['status'] = 'warning'
            print(f"❌ Missing: {file_path}")
    
    return results

def validate_html_structure() -> Dict[str, Any]:
    """Validate HTML structure and new modal elements."""
    results = {
        'status': 'success',
        'issues': [],
        'modals_found': 0,
        'github_section_found': False,
        'project_metrics_found': False
    }
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Check for modal elements
        modal_patterns = [
            r'id="case-study-modal"',
            r'id="blog-modal"',
            r'class="modal-overlay"',
            r'class="modal-container"'
        ]
        
        for pattern in modal_patterns:
            if re.search(pattern, html_content):
                results['modals_found'] += 1
        
        # Check for GitHub integration section
        if 'github-stats' in html_content:
            results['github_section_found'] = True
            print("✅ GitHub integration section found")
        else:
            results['issues'].append("GitHub integration section not found")
        
        # Check for project metrics
        if 'project-metrics' in html_content:
            results['project_metrics_found'] = True
            print("✅ Project metrics elements found")
        else:
            results['issues'].append("Project metrics elements not found")
            
        print(f"✅ Found {results['modals_found']} modal-related elements")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error reading HTML file: {str(e)}")
    
    return results

def validate_javascript_functions() -> Dict[str, Any]:
    """Validate JavaScript functions and new feature implementations."""
    results = {
        'status': 'success',
        'issues': [],
        'functions_found': 0,
        'case_study_functions': 0,
        'github_functions': 0
    }
    
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # Check for case study functions
        case_study_functions = [
            'openCaseStudy',
            'closeCaseStudy',
            'getCaseStudyData',
            'showBlogModal',
            'closeBlogModal',
            'getBlogData'
        ]
        
        for func in case_study_functions:
            if f'function {func}' in js_content or f'{func} =' in js_content:
                results['case_study_functions'] += 1
                results['functions_found'] += 1
        
        # Check for GitHub integration functions
        github_functions = [
            'initializeGitHubIntegration',
            'fetchGitHubData',
            'updateGitHubStats',
            'updateRecentActivity',
            'updateLanguagesChart'
        ]
        
        for func in github_functions:
            if f'function {func}' in js_content or f'{func} =' in js_content:
                results['github_functions'] += 1
                results['functions_found'] += 1
        
        # Check for downloadResume function
        if 'function downloadResume' in js_content:
            results['functions_found'] += 1
            print("✅ Resume download function found")
        else:
            results['issues'].append("Resume download function not found")
        
        print(f"✅ Found {results['case_study_functions']} case study functions")
        print(f"✅ Found {results['github_functions']} GitHub integration functions")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error reading JavaScript file: {str(e)}")
    
    return results

def validate_css_styles() -> Dict[str, Any]:
    """Validate CSS styles for new features."""
    results = {
        'status': 'success',
        'issues': [],
        'modal_styles_found': False,
        'github_styles_found': False,
        'project_metric_styles_found': False
    }
    
    try:
        with open('styles.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        # Check for modal styles
        if '.modal-overlay' in css_content and '.modal-container' in css_content:
            results['modal_styles_found'] = True
            print("✅ Modal styles found")
        else:
            results['issues'].append("Modal styles not found")
        
        # Check for GitHub styles
        if '.github-stats' in css_content and '.github-grid' in css_content:
            results['github_styles_found'] = True
            print("✅ GitHub integration styles found")
        else:
            results['issues'].append("GitHub integration styles not found")
        
        # Check for project metric styles
        if '.project-metrics' in css_content and '.metric' in css_content:
            results['project_metric_styles_found'] = True
            print("✅ Project metric styles found")
        else:
            results['issues'].append("Project metric styles not found")
            
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error reading CSS file: {str(e)}")
    
    return results

def validate_case_study_data() -> Dict[str, Any]:
    """Validate case study data completeness."""
    results = {
        'status': 'success',
        'issues': [],
        'case_studies_found': 0,
        'blog_articles_found': 0
    }
    
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # Check for case study data
        expected_case_studies = ['cli-tool', 'email-system', 'ui-framework', 'kanban-board']
        for case_study in expected_case_studies:
            if f"'{case_study}'" in js_content or f'"{case_study}"' in js_content:
                results['case_studies_found'] += 1
        
        # Check for blog article data
        expected_articles = ['fastapi-microservices', 'js-performance', 'docker-production']
        for article in expected_articles:
            if f"'{article}'" in js_content or f'"{article}"' in js_content:
                results['blog_articles_found'] += 1
        
        print(f"✅ Found {results['case_studies_found']}/{len(expected_case_studies)} case studies")
        print(f"✅ Found {results['blog_articles_found']}/{len(expected_articles)} blog articles")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error validating case study data: {str(e)}")
    
    return results

def check_accessibility_features() -> Dict[str, Any]:
    """Check accessibility features implementation."""
    results = {
        'status': 'success',
        'issues': [],
        'aria_labels_found': 0,
        'semantic_elements_found': 0
    }
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Check for ARIA labels
        aria_patterns = [
            r'aria-label="[^"]*"',
            r'aria-labelledby="[^"]*"',
            r'aria-hidden="[^"]*"',
            r'role="[^"]*"'
        ]
        
        for pattern in aria_patterns:
            matches = re.findall(pattern, html_content)
            results['aria_labels_found'] += len(matches)
        
        # Check for semantic HTML elements
        semantic_elements = ['<nav', '<main', '<section', '<article', '<header', '<footer']
        for element in semantic_elements:
            if element in html_content:
                results['semantic_elements_found'] += 1
        
        print(f"✅ Found {results['aria_labels_found']} ARIA attributes")
        print(f"✅ Found {results['semantic_elements_found']} semantic HTML elements")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error checking accessibility: {str(e)}")
    
    return results

def generate_test_report(all_results: Dict[str, Dict[str, Any]]) -> None:
    """Generate a comprehensive test report."""
    print("\n" + "="*80)
    print("🎯 FEATURE VALIDATION REPORT")
    print("="*80)
    
    total_tests = len(all_results)
    passed_tests = sum(1 for result in all_results.values() if result['status'] == 'success')
    warning_tests = sum(1 for result in all_results.values() if result['status'] == 'warning')
    failed_tests = sum(1 for result in all_results.values() if result['status'] == 'error')
    
    print(f"\n📊 TEST SUMMARY:")
    print(f"   Total Tests: {total_tests}")
    print(f"   ✅ Passed: {passed_tests}")
    print(f"   ⚠️ Warnings: {warning_tests}")
    print(f"   ❌ Failed: {failed_tests}")
    print(f"   🎯 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    print(f"\n🔍 DETAILED RESULTS:")
    
    for test_name, result in all_results.items():
        status_icon = "✅" if result['status'] == 'success' else "⚠️" if result['status'] == 'warning' else "❌"
        print(f"\n{status_icon} {test_name.replace('_', ' ').title()}:")
        
        # Print specific metrics for each test
        if test_name == 'file_structure':
            print(f"   Files Found: {result['files_found']}/{result['files_checked']}")
        elif test_name == 'html_structure':
            print(f"   Modals Found: {result['modals_found']}")
            print(f"   GitHub Section: {'Yes' if result['github_section_found'] else 'No'}")
            print(f"   Project Metrics: {'Yes' if result['project_metrics_found'] else 'No'}")
        elif test_name == 'javascript_functions':
            print(f"   Total Functions: {result['functions_found']}")
            print(f"   Case Study Functions: {result['case_study_functions']}")
            print(f"   GitHub Functions: {result['github_functions']}")
        elif test_name == 'case_study_data':
            print(f"   Case Studies: {result['case_studies_found']}/4")
            print(f"   Blog Articles: {result['blog_articles_found']}/3")
        elif test_name == 'accessibility':
            print(f"   ARIA Attributes: {result['aria_labels_found']}")
            print(f"   Semantic Elements: {result['semantic_elements_found']}")
        
        if result['issues']:
            print("   Issues:")
            for issue in result['issues']:
                print(f"     - {issue}")
    
    print(f"\n🚀 NEXT STEPS:")
    if failed_tests == 0 and warning_tests == 0:
        print("   ✨ All tests passed! Your features are ready for production.")
        print("   💡 Consider running the site in a browser for manual testing.")
    elif failed_tests == 0:
        print("   🎯 Core functionality is working with minor issues to address.")
        print("   🔧 Review warnings above and fix when convenient.")
    else:
        print("   ⚡ Critical issues found that should be addressed before deployment.")
        print("   🛠️ Focus on fixing the failed tests first.")
    
    print("\n📁 Files to test manually in browser:")
    print("   - index.html (main portfolio)")
    print("   - test_features.html (interactive test suite)")
    print("\n💡 Run: python -m http.server 8080")
    print("   Then open: http://localhost:8080/")

def main():
    """Run all validation tests."""
    print("🔍 Starting PersonalDevPage Feature Validation...")
    print("-" * 60)
    
    # Run all validation tests
    all_results = {
        'file_structure': validate_file_structure(),
        'html_structure': validate_html_structure(),
        'javascript_functions': validate_javascript_functions(),
        'css_styles': validate_css_styles(),
        'case_study_data': validate_case_study_data(),
        'accessibility': check_accessibility_features()
    }
    
    # Generate comprehensive report
    generate_test_report(all_results)
    
    # Save results to JSON file for later analysis
    with open('validation_report.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n📄 Detailed results saved to: validation_report.json")

if __name__ == "__main__":
    main()