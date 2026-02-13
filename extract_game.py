#!/usr/bin/env python3
"""
Script to extract the HTML game from simple_game.json
"""

import json
import os
import sys

def extract_game():
    """Extract HTML game from JSON file and create game.html"""
    
    json_file = "simple_game.json"
    html_file = "game.html"
    
    # Check if JSON file exists
    if not os.path.exists(json_file):
        print(f"❌ Error: {json_file} not found!")
        print("Please make sure simple_game.json exists in the current directory.")
        return False
    
    try:
        # Read the JSON file
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract HTML content
        if 'html_content' in data:
            html_content = data['html_content']
            
            # Write HTML file
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ Successfully extracted game to {html_file}")
            print(f"📁 File size: {len(html_content)} characters")
            
            # Show game info
            print(f"\n🎮 Game Info:")
            print(f"   Name: {data.get('game', 'Unknown')}")
            print(f"   Description: {data.get('description', 'No description')}")
            print(f"\n🎯 Instructions:")
            print(f"   1. Open {html_file} in your web browser")
            print(f"   2. Guess a number between 1 and 100")
            print(f"   3. Try to find the number in as few attempts as possible!")
            
            return True
        else:
            print("❌ Error: 'html_content' not found in JSON file!")
            return False
            
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format in {json_file}")
        print(f"   Details: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def create_bash_script():
    """Create a bash script for extraction"""
    
    bash_script = """#!/bin/bash
# Extract game from JSON file

JSON_FILE="simple_game.json"
HTML_FILE="game.html"

if [ ! -f "$JSON_FILE" ]; then
    echo "❌ Error: $JSON_FILE not found!"
    exit 1
fi

# Extract using Python (if available)
if command -v python3 &> /dev/null; then
    python3 -c "
import json
import sys

try:
    with open('$JSON_FILE', 'r') as f:
        data = json.load(f)
    
    if 'html_content' in data:
        with open('$HTML_FILE', 'w') as f:
            f.write(data['html_content'])
        print('✅ Game extracted to $HTML_FILE')
    else:
        print('❌ Error: html_content not found in JSON')
        sys.exit(1)
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
"
elif command -v jq &> /dev/null; then
    # Alternative using jq
    jq -r '.html_content' "$JSON_FILE" > "$HTML_FILE"
    echo "✅ Game extracted to $HTML_FILE (using jq)"
else
    echo "❌ Error: Need either python3 or jq installed"
    echo "   Install python3: brew install python3"
    echo "   Install jq: brew install jq"
    exit 1
fi

echo ""
echo "🎮 To play the game:"
echo "   open $HTML_FILE"
echo "   or double-click $HTML_FILE in Finder"
"""

    with open("extract_game.sh", "w") as f:
        f.write(bash_script)
    
    # Make it executable
    os.chmod("extract_game.sh", 0o755)
    print("✅ Created extract_game.sh (bash script)")
    return True

def main():
    """Main function"""
    
    print("🎮 Game Extractor Tool")
    print("=" * 40)
    
    # Create extraction scripts
    print("\n📝 Creating extraction scripts...")
    
    # Create Python script
    print("   • Created extract_game.py")
    
    # Create bash script
    create_bash_script()
    
    # Extract the game
    print("\n🔄 Extracting game from JSON...")
    success = extract_game()
    
    if success:
        print("\n🎉 All done! You can now:")
        print("   1. Run: python3 extract_game.py")
        print("   2. Or run: ./extract_game.sh")
        print("   3. Then open game.html in your browser")
    else:
        print("\n⚠️  Extraction failed. Please check the error messages above.")

if __name__ == "__main__":
    main()