#!/usr/bin/env python3
"""
Complete Portfolio Analysis Pipeline
Runs the full analysis and generates all outputs
"""

import json
import os
from datetime import datetime
from collections import Counter, defaultdict
from typing import Dict, List


def load_existing_data():
    """Load data from existing github_repos_categorized.json"""
    data_files = [
        "github_repos_categorized.json",
        "github_repos_inventory.json"
    ]
    
    for file in data_files:
        if os.path.exists(file):
            print(f"📂 Loading existing data from {file}...")
            with open(file, "r", encoding="utf-8") as f:
                return json.load(f)
    
    return None


def analyze_portfolio(repos_data: List[Dict]) -> Dict:
    """Generate comprehensive portfolio analysis"""
    
    print("\n🔬 Analyzing portfolio data...")
    
    username = repos_data[0].get('full_name', '').split('/')[0] if repos_data else 'developer'
    
    # Calculate insights
    total_repos = len(repos_data)
    active_repos = [r for r in repos_data if r.get('days_since_update', 365) < 180]
    fork_repos = [r for r in repos_data if r.get('is_fork', False)]
    archived_repos = [r for r in repos_data if r.get('is_archived', False)]
    
    health_pct = (len(active_repos) / total_repos * 100) if total_repos else 0
    
    # Language analysis
    all_langs = []
    for repo in repos_data:
        lang = repo.get('primary_language', '')
        if lang and lang != 'Unknown':
            all_langs.append(lang)
        # Also check all_languages field
        all_langs_field = repo.get('all_languages', '').split(', ')
        all_langs.extend([l.strip() for l in all_langs_field if l.strip() and l.strip() != 'Unknown'])
    
    lang_counter = Counter(all_langs)
    
    # Category analysis
    categories = Counter([r.get('category', 'Uncategorized') for r in repos_data])
    
    # Calculate showcase scores
    for repo in repos_data:
        score = 0
        stars = repo.get('stars', 0)
        days = repo.get('days_since_update', 365)
        
        if days < 30: score += 20
        elif days < 90: score += 10
        elif days < 180: score += 5
        
        score += min(stars * 2, 30)
        if repo.get('description'): score += 10
        if not repo.get('is_fork'): score += 15
        if repo.get('homepage'): score += 10
        
        repo['showcase_score'] = min(100, score)
    
    # Sort by showcase score
    showcase_repos = sorted(
        [r for r in repos_data if not r.get('is_fork') and not r.get('is_archived')],
        key=lambda x: x.get('showcase_score', 0),
        reverse=True
    )[:10]
    
    # Calculate yearly trends
    yearly_data = defaultdict(lambda: {"count": 0, "languages": Counter(), "categories": Counter()})
    
    for repo in repos_data:
        created = repo.get('created_at', '')
        if created:
            year = created[:4]
            yearly_data[year]["count"] += 1
            lang = repo.get('primary_language', '')
            if lang:
                yearly_data[year]["languages"][lang] += 1
            cat = repo.get('category', 'Uncategorized')
            if cat != 'Uncategorized':
                yearly_data[year]["categories"][cat] += 1
    
    # Calculate total stars
    total_stars = sum(r.get('stars', 0) for r in repos_data)
    
    # Generate insights
    insights = [
        {
            "category": "Portfolio Health",
            "title": f"{len(active_repos)} of {total_repos} repositories active in last 6 months",
            "description": f"Portfolio activity rate: {health_pct:.1f}%",
            "score": health_pct,
            "recommendations": ["Consider updating or archiving old repositories"] if health_pct < 50 else []
        },
        {
            "category": "Tech Stack",
            "title": f"{len(lang_counter)} different technologies used",
            "description": f"Top: {', '.join([l for l, _ in lang_counter.most_common(3)])}",
            "score": min(100, len(lang_counter) * 10),
            "recommendations": []
        },
        {
            "category": "Project Diversity",
            "title": f"Projects span {len(categories)} categories",
            "description": f"Main areas: {', '.join([c for c, _ in categories.most_common(3)])}",
            "score": min(100, len(categories) * 20),
            "recommendations": []
        },
        {
            "category": "Community Engagement",
            "title": f"{total_stars} total stars across all projects",
            "description": f"Average {total_stars/total_repos:.1f} stars per repository",
            "score": min(100, total_stars / 2),
            "recommendations": []
        }
    ]
    
    summary = {
        "generated_at": datetime.now().isoformat(),
        "username": username,
        "total_repos": total_repos,
        "insights": insights,
        "showcase_recommendations": showcase_repos,
        "coding_trends": {k: dict(v) if isinstance(v, defaultdict) else v for k, v in yearly_data.items()},
        "language_distribution": dict(lang_counter),
        "category_distribution": dict(categories),
    }
    
    return summary


def main():
    print("=" * 60)
    print("PORTFOLIO ANALYSIS PIPELINE")
    print("=" * 60)
    
    # Load existing data
    repos_data = load_existing_data()
    
    if not repos_data:
        print("\n❌ No existing data found. Please run github_portfolio_analyzer.py first:")
        print("   python3 github_portfolio_analyzer.py")
        return
    
    print(f"   Loaded {len(repos_data)} repositories")
    
    # Analyze
    summary = analyze_portfolio(repos_data)
    
    # Save summary
    with open("portfolio_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Analysis complete! Saved to portfolio_summary.json")
    
    # Print summary
    print("\n" + "=" * 60)
    print("PORTFOLIO INSIGHTS")
    print("=" * 60)
    
    for insight in summary['insights']:
        print(f"\n📌 {insight['category']}")
        print(f"   {insight['title']}")
        if insight.get('score'):
            bar = "█" * int(insight['score'] / 10) + "░" * (10 - int(insight['score'] / 10))
            print(f"   Score: [{bar}] {insight['score']:.0f}/100")
    
    print("\n" + "=" * 60)
    print("🏆 TOP PROJECTS TO SHOWCASE")
    print("=" * 60)
    
    for i, repo in enumerate(summary['showcase_recommendations'][:5], 1):
        print(f"\n  {i}. {repo['name']} (Score: {repo.get('showcase_score', 0):.0f})")
        print(f"     ⭐ {repo['stars']} stars | 🔤 {repo.get('primary_language', 'N/A')}")
        if repo.get('description'):
            print(f"     📝 {repo['description'][:70]}...")
    
    # Generate dashboard
    print("\n" + "=" * 60)
    print("GENERATING DASHBOARD")
    print("=" * 60)
    
    os.system("python3 portfolio_dashboard_generator.py")
    
    # Generate README
    print("\n" + "=" * 60)
    print("GENERATING README")
    print("=" * 60)
    
    os.system("python3 portfolio_readme_generator.py")
    
    print("\n" + "=" * 60)
    print("COMPLETE!")
    print("=" * 60)
    print("\n📁 Generated files:")
    print("   • portfolio_summary.json - Raw analysis data")
    print("   • portfolio_dashboard.html - Visual dashboard (open in browser)")
    print("   • GENERATED_PROFILE_README.md - Full GitHub profile README")
    print("   • README_MINIMAL.md - Minimal profile README")


if __name__ == "__main__":
    main()
