#!/usr/bin/env python3
"""
Performance Audit Script for PersonalDevPage
Analyzes performance metrics and generates optimization recommendations
"""

import os
import re
import json
import gzip
import time
from pathlib import Path
from typing import Dict, List, Any, Tuple
import base64

def analyze_file_sizes() -> Dict[str, Any]:
    """Analyze file sizes and compression opportunities."""
    results = {
        'status': 'success',
        'issues': [],
        'recommendations': [],
        'total_size': 0,
        'compressed_savings': 0,
        'files_analyzed': 0
    }
    
    try:
        file_types = {
            'html': [],
            'css': [],
            'js': [],
            'images': [],
            'fonts': [],
            'other': []
        }
        
        # Analyze all files
        for root, dirs, files in os.walk('.'):
            # Skip hidden directories and git
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files:
                if file.startswith('.'):
                    continue
                    
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                results['total_size'] += file_size
                results['files_analyzed'] += 1
                
                file_ext = file.lower().split('.')[-1]
                
                file_info = {
                    'name': file,
                    'path': file_path,
                    'size': file_size,
                    'size_kb': round(file_size / 1024, 2)
                }
                
                # Categorize files
                if file_ext in ['html', 'htm']:
                    file_types['html'].append(file_info)
                elif file_ext in ['css']:
                    file_types['css'].append(file_info)
                elif file_ext in ['js']:
                    file_types['js'].append(file_info)
                elif file_ext in ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico']:
                    file_types['images'].append(file_info)
                elif file_ext in ['woff', 'woff2', 'ttf', 'otf']:
                    file_types['fonts'].append(file_info)
                else:
                    file_types['other'].append(file_info)
        
        # Analyze compression opportunities for text files
        text_extensions = ['html', 'css', 'js', 'json', 'xml', 'txt', 'md']
        
        for file_type, files in file_types.items():
            if file_type in ['html', 'css', 'js']:
                for file_info in files:
                    if os.path.exists(file_info['path']):
                        with open(file_info['path'], 'rb') as f:
                            original_data = f.read()
                            compressed_data = gzip.compress(original_data)
                            compression_ratio = len(compressed_data) / len(original_data)
                            savings = len(original_data) - len(compressed_data)
                            
                            file_info['compressed_size'] = len(compressed_data)
                            file_info['compression_ratio'] = round(compression_ratio, 3)
                            file_info['savings'] = savings
                            
                            results['compressed_savings'] += savings
        
        # Generate recommendations
        total_size_mb = results['total_size'] / (1024 * 1024)
        
        if total_size_mb > 5:
            results['recommendations'].append("Total site size is large (>5MB) - consider asset optimization")
        
        # Check individual file sizes
        large_files = []
        for file_type, files in file_types.items():
            for file_info in files:
                if file_info['size_kb'] > 500:  # Files over 500KB
                    large_files.append(file_info)
        
        if large_files:
            results['recommendations'].append(f"Found {len(large_files)} large files (>500KB) that should be optimized")
        
        results['file_breakdown'] = file_types
        results['total_size_mb'] = round(total_size_mb, 2)
        results['compressed_savings_kb'] = round(results['compressed_savings'] / 1024, 2)
        
        print(f"✅ Analyzed {results['files_analyzed']} files ({results['total_size_mb']}MB total)")
        print(f"💾 Potential gzip savings: {results['compressed_savings_kb']}KB")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error analyzing file sizes: {str(e)}")
    
    return results

def analyze_html_performance() -> Dict[str, Any]:
    """Analyze HTML for performance issues."""
    results = {
        'status': 'success',
        'issues': [],
        'recommendations': [],
        'metrics': {
            'total_requests': 0,
            'blocking_resources': 0,
            'render_blocking_css': 0,
            'render_blocking_js': 0,
            'images_without_alt': 0,
            'images_without_dimensions': 0
        }
    }
    
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Count external resources
        external_css = len(re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', html_content))
        external_js = len(re.findall(r'<script[^>]*src=["\'][^"\']*["\'][^>]*>', html_content))
        images = len(re.findall(r'<img[^>]*src=["\'][^"\']*["\'][^>]*>', html_content))
        
        results['metrics']['total_requests'] = external_css + external_js + images
        results['metrics']['render_blocking_css'] = external_css
        results['metrics']['render_blocking_js'] = external_js
        
        # Check for render-blocking resources
        blocking_css = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', html_content)
        blocking_js = re.findall(r'<script[^>]*src=[^>]*(?!defer|async)[^>]*>', html_content)
        
        results['metrics']['blocking_resources'] = len(blocking_css) + len(blocking_js)
        
        # Check images for optimization
        img_tags = re.findall(r'<img[^>]*>', html_content)
        for img in img_tags:
            if 'alt=' not in img:
                results['metrics']['images_without_alt'] += 1
            if 'width=' not in img or 'height=' not in img:
                results['metrics']['images_without_dimensions'] += 1
        
        # Check for performance best practices
        if 'preconnect' not in html_content:
            results['recommendations'].append("Add DNS preconnect for external domains (fonts.googleapis.com)")
        
        if 'preload' not in html_content:
            results['recommendations'].append("Consider preloading critical resources")
        
        if results['metrics']['blocking_resources'] > 0:
            results['recommendations'].append(f"Found {results['metrics']['blocking_resources']} render-blocking resources")
        
        if results['metrics']['images_without_dimensions'] > 0:
            results['recommendations'].append(f"Add width/height attributes to {results['metrics']['images_without_dimensions']} images")
        
        # Check for critical CSS inlining opportunity
        if external_css > 0:
            results['recommendations'].append("Consider inlining critical CSS for faster initial render")
        
        print(f"✅ HTML Performance Analysis Complete")
        print(f"📊 Total requests: {results['metrics']['total_requests']}")
        print(f"⚡ Render-blocking resources: {results['metrics']['blocking_resources']}")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error analyzing HTML performance: {str(e)}")
    
    return results

def analyze_css_performance() -> Dict[str, Any]:
    """Analyze CSS for performance optimizations."""
    results = {
        'status': 'success',
        'issues': [],
        'recommendations': [],
        'metrics': {
            'total_rules': 0,
            'unused_selectors': 0,
            'redundant_properties': 0,
            'large_files': 0,
            'minification_savings': 0
        }
    }
    
    try:
        css_files = ['styles.css']
        
        for css_file in css_files:
            if os.path.exists(css_file):
                with open(css_file, 'r', encoding='utf-8') as f:
                    css_content = f.read()
                
                original_size = len(css_content)
                
                # Count CSS rules
                rules = re.findall(r'[^{}]*{[^}]*}', css_content)
                results['metrics']['total_rules'] += len(rules)
                
                # Estimate minification savings
                minified_size = len(re.sub(r'\s+', ' ', css_content).strip())
                savings = original_size - minified_size
                results['metrics']['minification_savings'] += savings
                
                # Check for large CSS files
                if original_size > 50000:  # 50KB
                    results['metrics']['large_files'] += 1
                    results['recommendations'].append(f"{css_file} is large ({round(original_size/1024, 1)}KB) - consider splitting or optimizing")
                
                # Check for unused CSS (basic detection)
                media_queries = re.findall(r'@media[^{]*{', css_content)
                if len(media_queries) > 10:
                    results['recommendations'].append("Many media queries detected - ensure they're all necessary")
                
                # Check for CSS optimization opportunities
                if '/* ' in css_content:
                    comment_chars = sum(len(match) for match in re.findall(r'/\*.*?\*/', css_content, re.DOTALL))
                    if comment_chars > 1000:
                        results['recommendations'].append("Remove CSS comments to reduce file size")
                
                print(f"✅ Analyzed {css_file}: {len(rules)} rules, {round(original_size/1024, 1)}KB")
        
        if results['metrics']['minification_savings'] > 5000:  # 5KB
            results['recommendations'].append(f"CSS minification could save ~{round(results['metrics']['minification_savings']/1024, 1)}KB")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error analyzing CSS performance: {str(e)}")
    
    return results

def analyze_js_performance() -> Dict[str, Any]:
    """Analyze JavaScript for performance issues."""
    results = {
        'status': 'success',
        'issues': [],
        'recommendations': [],
        'metrics': {
            'total_functions': 0,
            'event_listeners': 0,
            'dom_queries': 0,
            'async_operations': 0,
            'minification_savings': 0
        }
    }
    
    try:
        js_files = ['script.js', 'analytics.js']
        
        for js_file in js_files:
            if os.path.exists(js_file):
                with open(js_file, 'r', encoding='utf-8') as f:
                    js_content = f.read()
                
                original_size = len(js_content)
                
                # Count functions
                functions = re.findall(r'function\s+\w+\s*\(', js_content)
                arrow_functions = re.findall(r'\w+\s*=>\s*', js_content)
                results['metrics']['total_functions'] += len(functions) + len(arrow_functions)
                
                # Count event listeners
                event_listeners = re.findall(r'addEventListener\s*\(', js_content)
                results['metrics']['event_listeners'] += len(event_listeners)
                
                # Count DOM queries
                dom_queries = re.findall(r'document\.(querySelector|getElementById|getElementsBy)', js_content)
                results['metrics']['dom_queries'] += len(dom_queries)
                
                # Count async operations
                async_ops = re.findall(r'(fetch\s*\(|async\s+function|await\s+)', js_content)
                results['metrics']['async_operations'] += len(async_ops)
                
                # Estimate minification savings
                minified_size = len(re.sub(r'\s+', ' ', js_content).strip())
                savings = original_size - minified_size
                results['metrics']['minification_savings'] += savings
                
                # Check for performance anti-patterns
                if 'setInterval' in js_content and 'clearInterval' not in js_content:
                    results['recommendations'].append("Ensure setInterval calls are properly cleared")
                
                if js_content.count('document.querySelector') > 20:
                    results['recommendations'].append("Consider caching DOM queries for better performance")
                
                print(f"✅ Analyzed {js_file}: {len(functions)} functions, {len(event_listeners)} event listeners")
        
        if results['metrics']['minification_savings'] > 10000:  # 10KB
            results['recommendations'].append(f"JavaScript minification could save ~{round(results['metrics']['minification_savings']/1024, 1)}KB")
        
        # Check for modern JavaScript features
        if results['metrics']['async_operations'] > 0:
            print(f"✅ Found {results['metrics']['async_operations']} async operations - good for performance")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error analyzing JavaScript performance: {str(e)}")
    
    return results

def analyze_image_optimization() -> Dict[str, Any]:
    """Analyze images for optimization opportunities."""
    results = {
        'status': 'success',
        'issues': [],
        'recommendations': [],
        'metrics': {
            'total_images': 0,
            'total_size': 0,
            'webp_images': 0,
            'large_images': 0,
            'unoptimized_images': 0
        }
    }
    
    try:
        image_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico']
        
        for root, dirs, files in os.walk('./assets'):
            for file in files:
                if any(file.lower().endswith(ext) for ext in image_extensions):
                    file_path = os.path.join(root, file)
                    file_size = os.path.getsize(file_path)
                    
                    results['metrics']['total_images'] += 1
                    results['metrics']['total_size'] += file_size
                    
                    if file.lower().endswith('.webp'):
                        results['metrics']['webp_images'] += 1
                    
                    # Check for large images (>500KB)
                    if file_size > 500 * 1024:
                        results['metrics']['large_images'] += 1
                        results['recommendations'].append(f"Large image detected: {file} ({round(file_size/1024, 1)}KB)")
                    
                    # Check for non-WebP images that could be optimized
                    if file.lower().endswith(('.png', '.jpg', '.jpeg')) and file_size > 50 * 1024:
                        results['metrics']['unoptimized_images'] += 1
        
        # Generate optimization recommendations
        webp_ratio = results['metrics']['webp_images'] / max(results['metrics']['total_images'], 1)
        
        if webp_ratio < 0.5 and results['metrics']['total_images'] > 3:
            results['recommendations'].append("Consider converting more images to WebP format for better compression")
        
        if results['metrics']['large_images'] > 0:
            results['recommendations'].append(f"Optimize {results['metrics']['large_images']} large images")
        
        if results['metrics']['unoptimized_images'] > 0:
            results['recommendations'].append(f"Consider optimizing {results['metrics']['unoptimized_images']} images")
        
        total_size_mb = results['metrics']['total_size'] / (1024 * 1024)
        results['metrics']['total_size_mb'] = round(total_size_mb, 2)
        
        print(f"✅ Analyzed {results['metrics']['total_images']} images ({results['metrics']['total_size_mb']}MB total)")
        print(f"🖼️ WebP images: {results['metrics']['webp_images']}/{results['metrics']['total_images']}")
        
    except Exception as e:
        results['status'] = 'error'
        results['issues'].append(f"Error analyzing images: {str(e)}")
    
    return results

def generate_lighthouse_recommendations() -> List[str]:
    """Generate Lighthouse-style performance recommendations."""
    recommendations = [
        "🎯 Core Web Vitals Optimization:",
        "  • Largest Contentful Paint (LCP) < 2.5s",
        "  • First Input Delay (FID) < 100ms", 
        "  • Cumulative Layout Shift (CLS) < 0.1",
        "",
        "⚡ Speed Optimizations:",
        "  • Minimize render-blocking resources",
        "  • Use efficient image formats (WebP, AVIF)",
        "  • Implement lazy loading for images",
        "  • Minify CSS, JS, and HTML",
        "  • Enable gzip/brotli compression",
        "  • Use HTTP/2 server push for critical resources",
        "",
        "📱 Mobile Performance:",
        "  • Optimize for mobile-first loading",
        "  • Use responsive images with srcset",
        "  • Implement touch-friendly interactions",
        "  • Reduce third-party code impact",
        "",
        "🔧 Technical Optimizations:",
        "  • Implement service worker for caching",
        "  • Use resource hints (preload, prefetch, preconnect)",
        "  • Optimize critical rendering path",
        "  • Reduce JavaScript execution time"
    ]
    return recommendations

def create_performance_optimizations() -> None:
    """Create optimized versions of key files."""
    try:
        # Create optimized CSS (remove comments and minify)
        if os.path.exists('styles.css'):
            with open('styles.css', 'r', encoding='utf-8') as f:
                css_content = f.read()
            
            # Basic minification
            optimized_css = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
            optimized_css = re.sub(r'\s+', ' ', optimized_css).strip()
            optimized_css = optimized_css.replace(' {', '{').replace('{ ', '{')
            optimized_css = optimized_css.replace(' }', '}').replace('} ', '}')
            optimized_css = optimized_css.replace('; ', ';').replace(' ;', ';')
            
            with open('styles.min.css', 'w', encoding='utf-8') as f:
                f.write(optimized_css)
            
            original_size = len(css_content)
            minified_size = len(optimized_css)
            savings = original_size - minified_size
            
            print(f"✅ Created styles.min.css (saved {round(savings/1024, 1)}KB)")
    
    except Exception as e:
        print(f"❌ Error creating optimizations: {str(e)}")

def generate_performance_report(all_results: Dict[str, Dict[str, Any]]) -> None:
    """Generate comprehensive performance report."""
    print("\n" + "="*80)
    print("⚡ PERFORMANCE AUDIT REPORT")
    print("="*80)
    
    # Calculate overall performance score
    total_recommendations = sum(len(result.get('recommendations', [])) for result in all_results.values())
    total_issues = sum(len(result.get('issues', [])) for result in all_results.values())
    
    # Performance score (inverse of issues/recommendations)
    base_score = 100
    deduction = min(total_recommendations * 3 + total_issues * 10, 60)
    performance_score = max(base_score - deduction, 40)
    
    print(f"\n📊 PERFORMANCE SUMMARY:")
    print(f"   Performance Score: {performance_score}/100")
    print(f"   🔧 Optimization Opportunities: {total_recommendations}")
    print(f"   ❌ Critical Issues: {total_issues}")
    
    # File size summary
    if 'file_analysis' in all_results:
        file_data = all_results['file_analysis']
        print(f"   📁 Total Site Size: {file_data.get('total_size_mb', 0)}MB")
        print(f"   💾 Compression Savings: {file_data.get('compressed_savings_kb', 0)}KB")
    
    print(f"\n🔍 DETAILED ANALYSIS:")
    
    for analysis_name, result in all_results.items():
        status_icon = "✅" if result.get('status') == 'success' and not result.get('issues') else "⚠️"
        print(f"\n{status_icon} {analysis_name.replace('_', ' ').title()}:")
        
        # Display metrics
        if 'metrics' in result:
            for metric, value in result['metrics'].items():
                print(f"   {metric.replace('_', ' ').title()}: {value}")
        
        # Display recommendations
        if result.get('recommendations'):
            print("   🎯 Recommendations:")
            for rec in result['recommendations'][:3]:  # Show top 3
                print(f"     • {rec}")
        
        # Display issues
        if result.get('issues'):
            print("   ❌ Issues:")
            for issue in result['issues']:
                print(f"     • {issue}")
    
    # Lighthouse recommendations
    print(f"\n🎯 LIGHTHOUSE PERFORMANCE RECOMMENDATIONS:")
    lighthouse_recs = generate_lighthouse_recommendations()
    for rec in lighthouse_recs:
        print(f"   {rec}")
    
    # Next steps
    print(f"\n🚀 OPTIMIZATION PRIORITY:")
    if performance_score >= 80:
        print("   ✨ Great performance! Focus on fine-tuning and monitoring.")
    elif performance_score >= 60:
        print("   🎯 Good foundation. Implement key optimizations for better scores.")
    else:
        print("   ⚡ Multiple optimization opportunities. Start with critical issues.")
    
    print(f"\n📋 IMMEDIATE ACTIONS:")
    print("   1. Run Lighthouse audit in Chrome DevTools")
    print("   2. Implement image optimization (WebP conversion)")
    print("   3. Enable gzip compression on hosting platform")
    print("   4. Add resource hints (preconnect, preload)")
    print("   5. Consider implementing service worker for caching")

def main():
    """Run comprehensive performance audit."""
    print("⚡ Starting PersonalDevPage Performance Audit...")
    print("-" * 60)
    
    # Run all performance analyses
    all_results = {
        'file_analysis': analyze_file_sizes(),
        'html_performance': analyze_html_performance(),
        'css_performance': analyze_css_performance(),
        'js_performance': analyze_js_performance(),
        'image_optimization': analyze_image_optimization()
    }
    
    # Create optimizations
    print("\n🔧 Creating Performance Optimizations...")
    create_performance_optimizations()
    
    # Generate comprehensive report
    generate_performance_report(all_results)
    
    # Save results to JSON file
    with open('performance_audit_report.json', 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n📄 Detailed performance audit saved to: performance_audit_report.json")

if __name__ == "__main__":
    main()