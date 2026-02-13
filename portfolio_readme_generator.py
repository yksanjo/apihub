#!/usr/bin/env python3
"""
Portfolio README Generator
Generates a professional GitHub profile README based on portfolio analysis
"""

import json
import os
from datetime import datetime
from typing import Dict, List


class ReadmeGenerator:
    """Generates professional GitHub profile README"""
    
    # Language icons mapping
    LANGUAGE_ICONS = {
        'python': '🐍',
        'javascript': '⚡',
        'typescript': '🔷',
        'go': '🔹',
        'rust': '⚙️',
        'java': '☕',
        'c++': '🔧',
        'c': '🔨',
        'ruby': '💎',
        'php': '🐘',
        'swift': '🕊️',
        'kotlin': '🎯',
        'shell': '📟',
        'html': '🌐',
        'css': '🎨',
        'vue': '💚',
        'react': '⚛️',
    }
    
    def __init__(self, data_file: str = "portfolio_summary.json"):
        self.data_file = data_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict:
        """Load portfolio summary data"""
        if not os.path.exists(self.data_file):
            return {}
        
        with open(self.data_file, "r", encoding="utf-8") as f:
            return json.load(f)
    
    def generate_readme(self, output_file: str = "GENERATED_PROFILE_README.md") -> str:
        """Generate professional GitHub profile README"""
        
        readme = f"""# 👋 Hi, I'm {self.data.get('username', 'Developer')}

{self._generate_intro()}

---

## 📊 GitHub Stats

{self._generate_stats_section()}

---

## 🚀 Featured Projects

{self._generate_featured_projects()}

---

## 💻 Tech Stack

{self._generate_tech_stack()}

---

## 📈 Coding Activity

{self._generate_activity_section()}

---

{self._generate_footer()}
"""
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(readme)
        
        print(f"✅ README generated: {output_file}")
        return output_file
    
    def _generate_intro(self) -> str:
        """Generate introduction section"""
        total_repos = self.data.get('total_repos', 0)
        lang_dist = self.data.get('language_distribution', {})
        top_langs = sorted(lang_dist.items(), key=lambda x: x[1], reverse=True)[:3]
        
        lang_text = ', '.join([lang.title() for lang, _ in top_langs]) if top_langs else 'various technologies'
        
        intros = [
            f"I'm a passionate developer who loves building things with code.",
            f"I enjoy working with {lang_text} and am always exploring new technologies.",
            f"Currently maintaining {total_repos} open-source projects.",
        ]
        
        return '\n\n'.join(intros)
    
    def _generate_stats_section(self) -> str:
        """Generate stats section with badges"""
        username = self.data.get('username', '')
        
        stats = f"""<div align="center">

![Profile Views](https://komarev.com/ghpvc/?username={username}&color=6366f1&style=flat)

<img src="https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=dracula&hide_border=true&bg_color=1e1e2e&title_color=cba6f7&icon_color=89b4fa&text_color=cdd6f4" alt="GitHub Stats" />

<img src="https://github-readme-streak-stats.herokuapp.com/?user={username}&theme=dracula&hide_border=true&background=1e1e2e&stroke=cba6f7&ring=89b4fa&fire=f38ba8&currStreakNum=cdd6f4&sideNums=cdd6f4&currStreakLabel=cba6f7&sideLabels=cba6f7" alt="GitHub Streak" />

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=dracula&hide_border=true&bg_color=1e1e2e&title_color=cba6f7&text_color=cdd6f4" alt="Top Languages" />

</div>"""
        
        return stats
    
    def _generate_featured_projects(self) -> str:
        """Generate featured projects section"""
        showcase = self.data.get('showcase_recommendations', [])[:6]
        
        if not showcase:
            return "*Check back soon for featured projects!*"
        
        projects_md = []
        
        for i, repo in enumerate(showcase, 1):
            name = repo.get('name', 'Unknown')
            desc = repo.get('description', 'No description available')
            url = repo.get('url', '#')
            stars = repo.get('stars', 0)
            forks = repo.get('forks', 0)
            lang = repo.get('primary_language', '')
            lang_icon = self.LANGUAGE_ICONS.get(lang.lower(), '💻')
            
            # Create a card-style entry
            project_card = f"""### {i}. [{name}]({url})

{desc}

`{lang_icon} {lang}` ⭐ {stars} 🍴 {forks}

---"""
            projects_md.append(project_card)
        
        return '\n\n'.join(projects_md)
    
    def _generate_tech_stack(self) -> str:
        """Generate tech stack visualization"""
        lang_dist = self.data.get('language_distribution', {})
        categories = self.data.get('category_distribution', {})
        
        # Sort languages by usage
        sorted_langs = sorted(lang_dist.items(), key=lambda x: x[1], reverse=True)[:8]
        
        # Generate language badges
        lang_badges = []
        for lang, count in sorted_langs:
            icon = self.LANGUAGE_ICONS.get(lang.lower(), '•')
            lang_badges.append(f"![{lang}](https://img.shields.io/badge/-{lang}-{self._get_badge_color(lang)}?style=flat-square&logo={lang.lower()}&logoColor=white)")
        
        # Generate category section
        sorted_cats = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:5]
        cat_list = '\n'.join([f"- **{cat}**: {count} projects" for cat, count in sorted_cats])
        
        return f"""### Languages
{''.join(lang_badges)}

### Project Categories
{cat_list}
"""
    
    def _generate_activity_section(self) -> str:
        """Generate coding activity/trends section"""
        trends = self.data.get('coding_trends', {})
        
        if not trends:
            return ""
        
        # Get most active year
        sorted_years = sorted(trends.items(), key=lambda x: x[1].get('count', 0), reverse=True)
        most_active = sorted_years[0] if sorted_years else (None, {})
        
        # Calculate total activity
        total_repos = sum(y.get('count', 0) for _, y in trends.items())
        
        # Recent activity
        current_year = str(datetime.now().year)
        this_year = trends.get(current_year, {}).get('count', 0)
        
        return f"""### 📊 By The Numbers

- **{total_repos}** total repositories created
- **{this_year}** new projects this year
- Most active year: **{most_active[0]}** ({most_active[1].get('count', 0)} projects)

### 🗓️ Contribution Graph

<img src="https://github-readme-activity-graph.vercel.app/graph?username={self.data.get('username', '')}&theme=dracula&bg_color=1e1e2e&color=cdd6f4&line=89b4fa&point=cba6f7&hide_border=true" alt="Contribution Graph" />
"""
    
    def _generate_footer(self) -> str:
        """Generate footer section"""
        username = self.data.get('username', '')
        
        return f"""## 🤝 Let's Connect

<div align="center">

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/{username})

</div>

---

*This README was auto-generated based on my GitHub portfolio analysis*
"""
    
    def _get_badge_color(self, lang: str) -> str:
        """Get badge color for language"""
        colors = {
            'python': '3776ab',
            'javascript': 'f7df1e',
            'typescript': '3178c6',
            'go': '00add8',
            'rust': 'dea584',
            'java': 'b07219',
            'c++': 'f34b7d',
            'c': '555555',
            'ruby': '701516',
            'php': '4f5d95',
            'swift': 'ffac45',
            'kotlin': 'a97bff',
            'shell': '89e051',
            'html': 'e34c26',
            'css': '1572b6',
            'vue': '41b883',
            'react': '61dafb',
        }
        return colors.get(lang.lower(), '6366f1')
    
    def generate_minimal_readme(self, output_file: str = "README_MINIMAL.md") -> str:
        """Generate a minimal, clean README"""
        username = self.data.get('username', 'Developer')
        showcase = self.data.get('showcase_recommendations', [])[:3]
        
        # Build project list
        projects_list = []
        for repo in showcase:
            projects_list.append(f"- **[{repo['name']}]({repo['url']})** - {repo.get('description', 'No description')}")
        
        readme = f"""# {username}

## 🚀 Projects

{chr(10).join(projects_list) if projects_list else '_Work in progress..._'}

## 📈 Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=dark&hide_border=true)

---

*Generated with ❤️*
"""
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(readme)
        
        print(f"✅ Minimal README generated: {output_file}")
        return output_file


def main():
    generator = ReadmeGenerator()
    
    if not generator.data:
        print("❌ No portfolio data found. Run github_portfolio_analyzer.py first.")
        return
    
    print("\n📄 Generating GitHub profile READMEs...\n")
    
    # Generate full README
    generator.generate_readme("GENERATED_PROFILE_README.md")
    
    # Generate minimal README
    generator.generate_minimal_readme("README_MINIMAL.md")
    
    print("\n✨ Done! You now have two README options:")
    print("   1. GENERATED_PROFILE_README.md - Full featured profile")
    print("   2. README_MINIMAL.md - Clean and minimal")
    print("\n💡 To use: Copy the content to your profile repo (username/username)")


if __name__ == "__main__":
    main()
