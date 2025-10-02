#!/usr/bin/env python3
"""
Security Audit Script for PersonalDevPage
Checks for common security vulnerabilities and best practices
"""

import os
import re
import json
from typing import Dict, List, Any

def check_html_security() -> Dict[str, Any]:
    """Check HTML for security vulnerabilities."""
    results = {
        'status': 'success',
        'issues': [],
        'warnings': [],
        'checks_passed': 0,
        'total_checks': 0
    }
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Check for dangerous HTML patterns
        security_checks = [
            {
                'name': 'No inline script execution',
                'pattern': r'javascript:',
                'type': 'critical'
            },
            {
                'name': 'No eval() usage',
                'pattern': r'eval\s*\(',
                'type': 'critical'
            },
            {
                'name': 'External links have security attributes',
                'pattern': r'target="_blank"(?![^>]*rel="[^"]*noopener)',
                'type': 'warning'
            }
        ]
        
        for check in security_checks:
            results['total_checks'] += 1
            matches = re.findall(check['pattern'], html_content, re.IGNORECASE)
            
            if matches:
                message = f"{check['name']}: Found {len(matches)} potential issues"
                if check['type'] == 'critical':
                    results['issues'].append(message)
                else:
                    results['warnings'].append(message)
            else:
                results['checks_passed'] += 1
                print(f"✅ {check['name']}")
        
        # Check for proper security headers in meta tags
        security_headers = [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options'
        ]
        
        for header in security_headers:
            results['total_checks'] += 1
            if header.lower() in html_content.lower():
                results['checks_passed'] += 1
                print(f"✅ {header} meta tag found")
            else:
                results['warnings'].append(f"Consider adding {header} meta tag for enhanced security")
        
        # Check external links for security
        external_links = re.findall(r'href="https?://[^"]*"[^>]*target="_blank"', html_content)
        secure_links = re.findall(r'href="https?://[^"]*"[^>]*target="_blank"[^>]*rel="[^"]*noopener[^"]*"', html_content)
        
        results['total_checks'] += 1
        if len(external_links) > 0:
            if len(secure_links) == len(external_links):
                results['checks_passed'] += 1
                print(f"✅ All {len(external_links)} external links have proper security attributes")
            else:
                results['warnings'].append(f"{len(external_links) - len(secure_links)} external links missing 'rel=noopener' attribute")
        else:
            results['checks_passed'] += 1
            print("✅ No external links to validate")
            
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error reading HTML file: {str(e)}")
    
    return results

def check_javascript_security() -> Dict[str, Any]:
    """Check JavaScript for security vulnerabilities."""
    results = {
        'status': 'success',
        'issues': [],
        'warnings': [],
        'checks_passed': 0,
        'total_checks': 0
    }
    
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # Check for dangerous JavaScript patterns
        security_checks = [
            {
                'name': 'No eval() usage',
                'pattern': r'eval\s*\(',
                'type': 'critical'
            },
            {
                'name': 'No innerHTML with user input',
                'pattern': r'\.innerHTML\s*=\s*[^"\']*(?:input|param|query|user)',
                'type': 'critical'
            },
            {
                'name': 'No document.write usage',
                'pattern': r'document\.write\s*\(',
                'type': 'warning'
            },
            {
                'name': 'No setTimeout with string',
                'pattern': r'setTimeout\s*\(\s*["\']',
                'type': 'warning'
            }
        ]
        
        for check in security_checks:
            results['total_checks'] += 1
            matches = re.findall(check['pattern'], js_content, re.IGNORECASE)
            
            if matches:
                message = f"{check['name']}: Found {len(matches)} potential issues"
                if check['type'] == 'critical':
                    results['issues'].append(message)
                else:
                    results['warnings'].append(message)
            else:
                results['checks_passed'] += 1
                print(f"✅ {check['name']}")
        
        # Check for input sanitization
        results['total_checks'] += 1
        if 'sanitizeText' in js_content and 'replace(/[<>&"\']/g' in js_content:
            results['checks_passed'] += 1
            print("✅ Input sanitization function found")
        else:
            results['warnings'].append("Consider adding input sanitization functions")
        
        # Check for proper error handling
        results['total_checks'] += 1
        error_handling_patterns = ['try {', 'catch (', '.catch(']
        if any(pattern in js_content for pattern in error_handling_patterns):
            results['checks_passed'] += 1
            print("✅ Error handling implemented")
        else:
            results['warnings'].append("Consider adding more comprehensive error handling")
        
        # Check for API security
        results['total_checks'] += 1
        if 'fetch(' in js_content:
            # Check if fetch calls include proper headers
            if 'headers:' in js_content or 'Accept:' in js_content:
                results['checks_passed'] += 1
                print("✅ API calls include proper headers")
            else:
                results['warnings'].append("API calls should include proper headers")
        else:
            results['checks_passed'] += 1
            print("✅ No fetch calls to validate")
            
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error reading JavaScript file: {str(e)}")
    
    return results

def check_content_security() -> Dict[str, Any]:
    """Check content and data security."""
    results = {
        'status': 'success',
        'issues': [],
        'warnings': [],
        'checks_passed': 0,
        'total_checks': 0
    }
    
    try:
        # Check for sensitive information in files
        sensitive_patterns = [
            r'password\s*[:=]\s*["\'][^"\']*["\']',
            r'api_key\s*[:=]\s*["\'][^"\']*["\']',
            r'secret\s*[:=]\s*["\'][^"\']*["\']',
            r'token\s*[:=]\s*["\'][^"\']*["\']',
        ]
        
        files_to_check = ['index.html', 'script.js', 'styles.css']
        
        for file_path in files_to_check:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                results['total_checks'] += 1
                sensitive_found = False
                
                for pattern in sensitive_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        results['issues'].append(f"Potential sensitive data found in {file_path}: {len(matches)} matches")
                        sensitive_found = True
                        break
                
                if not sensitive_found:
                    results['checks_passed'] += 1
                    print(f"✅ No sensitive data found in {file_path}")
        
        # Check email addresses are properly formatted and not exposed
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        results['total_checks'] += 1
        # Check if email is in mailto links (acceptable) vs plain text (less secure)
        email_matches = re.findall(r'mailto:([^"\'>\s]+@[^"\'>\s]+)', html_content)
        plain_email_matches = re.findall(r'(?<!mailto:)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', html_content)
        
        if email_matches and not plain_email_matches:
            results['checks_passed'] += 1
            print("✅ Email addresses properly formatted in mailto links")
        elif plain_email_matches:
            results['warnings'].append(f"Found {len(plain_email_matches)} plain text email addresses - consider using contact forms")
        else:
            results['checks_passed'] += 1
            print("✅ No email addresses found to validate")
            
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error checking content security: {str(e)}")
    
    return results

def check_file_permissions() -> Dict[str, Any]:
    """Check file permissions and structure."""
    results = {
        'status': 'success',
        'issues': [],
        'warnings': [],
        'checks_passed': 0,
        'total_checks': 0
    }
    
    try:
        # Check for potentially dangerous files
        dangerous_extensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs']
        
        results['total_checks'] += 1
        dangerous_files = []
        
        for root, dirs, files in os.walk('.'):
            for file in files:
                if any(file.lower().endswith(ext) for ext in dangerous_extensions):
                    dangerous_files.append(os.path.join(root, file))
        
        if dangerous_files:
            results['issues'].append(f"Found potentially dangerous files: {dangerous_files}")
        else:
            results['checks_passed'] += 1
            print("✅ No dangerous file types found")
        
        # Check for hidden files that might contain sensitive data
        results['total_checks'] += 1
        sensitive_hidden_files = ['.env', '.config', '.credentials', '.secrets']
        found_sensitive = []
        
        for file in sensitive_hidden_files:
            if os.path.exists(file):
                found_sensitive.append(file)
        
        if found_sensitive:
            results['warnings'].append(f"Found sensitive hidden files: {found_sensitive}")
        else:
            results['checks_passed'] += 1
            print("✅ No sensitive hidden files found")
        
        # Check .gitignore exists and is properly configured
        results['total_checks'] += 1
        if os.path.exists('.gitignore'):
            with open('.gitignore', 'r') as f:
                gitignore_content = f.read()
            
            important_ignores = ['node_modules', '.env', '*.log', '.DS_Store']
            missing_ignores = [ignore for ignore in important_ignores if ignore not in gitignore_content]
            
            if not missing_ignores:
                results['checks_passed'] += 1
                print("✅ .gitignore properly configured")
            else:
                results['warnings'].append(f".gitignore missing important entries: {missing_ignores}")
        else:
            results['warnings'].append(".gitignore file not found")
            
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error checking file permissions: {str(e)}")
    
    return results

def generate_security_report(all_results: Dict[str, Dict[str, Any]]) -> None:
    """Generate comprehensive security report."""
    print("\n" + "="*80)
    print("🔒 SECURITY AUDIT REPORT")
    print("="*80)
    
    total_checks = sum(result.get('total_checks', 0) for result in all_results.values())
    passed_checks = sum(result.get('checks_passed', 0) for result in all_results.values())
    total_issues = sum(len(result.get('issues', [])) for result in all_results.values())
    total_warnings = sum(len(result.get('warnings', [])) for result in all_results.values())
    
    print(f"\n📊 SECURITY SUMMARY:")
    print(f"   Total Checks: {total_checks}")
    print(f"   ✅ Passed: {passed_checks}")
    print(f"   ❌ Critical Issues: {total_issues}")
    print(f"   ⚠️ Warnings: {total_warnings}")
    print(f"   🛡️ Security Score: {(passed_checks/total_checks)*100:.1f}%")
    
    print(f"\n🔍 DETAILED RESULTS:")
    
    for check_name, result in all_results.items():
        status_icon = "✅" if result['status'] == 'success' and not result.get('issues') else "⚠️" if result.get('issues') else "✅"
        print(f"\n{status_icon} {check_name.replace('_', ' ').title()}:")
        print(f"   Checks Passed: {result.get('checks_passed', 0)}/{result.get('total_checks', 0)}")
        
        if result.get('issues'):
            print("   🚨 Critical Issues:")
            for issue in result['issues']:
                print(f"     - {issue}")
        
        if result.get('warnings'):
            print("   ⚠️ Warnings:")
            for warning in result['warnings']:
                print(f"     - {warning}")
    
    print(f"\n🚀 SECURITY RECOMMENDATIONS:")
    if total_issues == 0:
        if total_warnings == 0:
            print("   ✨ Excellent! No security issues found.")
            print("   🛡️ Your site follows security best practices.")
        else:
            print("   🎯 No critical issues, but consider addressing warnings.")
            print("   🔧 Review warnings above for enhanced security.")
    else:
        print("   ⚡ Critical security issues found!")
        print("   🛠️ Address critical issues before deployment.")
    
    print(f"\n📋 NEXT STEPS:")
    print("   1. Review and fix any critical security issues")
    print("   2. Consider implementing Content Security Policy headers")
    print("   3. Regular security audits recommended")
    print("   4. Test with browser security tools")

def main():
    """Run comprehensive security audit."""
    print("🔒 Starting PersonalDevPage Security Audit...")
    print("-" * 60)
    
    # Run all security checks
    all_results = {
        'html_security': check_html_security(),
        'javascript_security': check_javascript_security(),
        'content_security': check_content_security(),
        'file_permissions': check_file_permissions()
    }
    
    # Generate comprehensive report
    generate_security_report(all_results)
    
    # Save results to JSON file
    with open('security_audit_report.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n📄 Detailed security audit saved to: security_audit_report.json")

if __name__ == "__main__":
    main()