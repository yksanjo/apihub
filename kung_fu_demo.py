#!/usr/bin/env python3
"""
Kung Fu Fighters ASCII Animation Demo
Simplified version showing two stick figure fighters with basic animation
"""

import os
import sys
import time
import random
import signal

class SimpleFighter:
    """A simple stick figure fighter"""
    
    def __init__(self, name, side, color):
        self.name = name
        self.side = side  # 'left' or 'right'
        self.color = color
        self.reset = '\033[0m'
        
        # Position
        self.x = 20 if side == 'left' else 60
        self.y = 15
        
        # Animation state
        self.stance = "ready"
        self.frame_index = 0
        self.move_timer = 0
        
        # Create frames
        self.frames = self._create_frames()
    
    def _create_frames(self):
        """Create ASCII art frames"""
        frames = {
            "ready": [
                ["   O   ",
                 "  /|\\  ",
                 "  / \\  "]
            ],
            "punch": [
                ["   O   ",
                 "  /|-> ",
                 "  / \\  "],
                ["   O   ",
                 "  /|\\  ",
                 "  / \\  "]
            ],
            "kick": [
                ["   O   ",
                 "  /|\\  ",
                 "  / -| "],
                ["   O   ",
                 "  /|\\  ",
                 "  / \\  "]
            ],
            "block": [
                ["   O   ",
                 "  /|\\  ",
                 "  / \\  "]
            ]
        }
        
        # Mirror for right side
        if self.side == 'right':
            mirrored = {}
            for move, frame_list in frames.items():
                mirrored_list = []
                for frame in frame_list:
                    mirrored_frame = []
                    for line in frame:
                        mirrored_line = line.replace('/', '\\').replace('\\', '/').replace('->', '<-')
                        mirrored_frame.append(mirrored_line)
                    mirrored_list.append(mirrored_frame)
                mirrored[move] = mirrored_list
            return mirrored
        
        return frames
    
    def perform_move(self, move):
        """Perform a move"""
        if move in self.frames:
            self.stance = move
            self.move_timer = len(self.frames[move])
            return True
        return False
    
    def update(self):
        """Update fighter state"""
        if self.move_timer > 0:
            self.move_timer -= 1
            if self.move_timer == 0:
                self.stance = "ready"
    
    def get_frame(self):
        """Get current frame"""
        if self.stance in self.frames:
            frames = self.frames[self.stance]
            current_idx = len(frames) - self.move_timer if self.move_timer > 0 else 0
            return frames[current_idx % len(frames)]
        return self.frames["ready"][0]

class SimpleAnimation:
    """Simple animation controller"""
    
    def __init__(self):
        self.width = 80
        self.height = 24
        self.running = True
        
        # Create fighters
        self.fighter1 = SimpleFighter("DRAGON", "left", '\033[91m')  # Red
        self.fighter2 = SimpleFighter("TIGER", "right", '\033[94m')  # Blue
        
        # Animation state
        self.frame_count = 0
        
        # Setup signal handler
        signal.signal(signal.SIGINT, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle Ctrl+C gracefully"""
        self.running = False
        self.clear_screen()
        print("\nAnimation stopped. Goodbye!")
        sys.exit(0)
    
    def clear_screen(self):
        """Clear the terminal screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
    
    def hide_cursor(self):
        """Hide the cursor"""
        sys.stdout.write('\033[?25l')
        sys.stdout.flush()
    
    def show_cursor(self):
        """Show the cursor"""
        sys.stdout.write('\033[?25h')
        sys.stdout.flush()
    
    def set_cursor_position(self, x, y):
        """Set cursor position (1-indexed)"""
        sys.stdout.write(f'\033[{y};{x}H')
        sys.stdout.flush()
    
    def draw_border(self):
        """Draw simple border"""
        # Top border
        self.set_cursor_position(1, 1)
        sys.stdout.write("+" + "-" * (self.width - 2) + "+")
        
        # Bottom border
        self.set_cursor_position(1, self.height)
        sys.stdout.write("+" + "-" * (self.width - 2) + "+")
        
        # Side borders
        for y in range(2, self.height):
            self.set_cursor_position(1, y)
            sys.stdout.write("|")
            self.set_cursor_position(self.width, y)
            sys.stdout.write("|")
    
    def draw_fighters(self):
        """Draw both fighters"""
        # Draw fighter 1 (left)
        frame1 = self.fighter1.get_frame()
        for i, line in enumerate(frame1):
            self.set_cursor_position(self.fighter1.x - 3, self.fighter1.y + i)
            sys.stdout.write(f"{self.fighter1.color}{line}{self.fighter1.reset}")
        
        # Draw fighter 2 (right)
        frame2 = self.fighter2.get_frame()
        for i, line in enumerate(frame2):
            self.set_cursor_position(self.fighter2.x - 3, self.fighter2.y + i)
            sys.stdout.write(f"{self.fighter2.color}{line}{self.fighter2.reset}")
        
        # Draw names
        self.set_cursor_position(5, 3)
        sys.stdout.write(f"{self.fighter1.color}{self.fighter1.name}{self.fighter1.reset}")
        
        self.set_cursor_position(self.width - 10, 3)
        sys.stdout.write(f"{self.fighter2.color}{self.fighter2.name}{self.fighter2.reset}")
    
    def draw_title(self):
        """Draw title"""
        self.set_cursor_position(self.width // 2 - 10, 2)
        sys.stdout.write("\033[1;36mKUNG FU FIGHTERS DEMO\033[0m")
    
    def draw_controls(self):
        """Draw controls"""
        self.set_cursor_position(2, self.height - 2)
        sys.stdout.write("\033[90mPress Ctrl+C to exit\033[0m")
    
    def update_logic(self):
        """Update game logic"""
        # Update fighters
        self.fighter1.update()
        self.fighter2.update()
        
        # Random moves
        if self.frame_count % 20 == 0:
            moves = ["punch", "kick", "block"]
            move = random.choice(moves)
            self.fighter1.perform_move(move)
        
        if self.frame_count % 25 == 0:
            moves = ["punch", "kick", "block"]
            move = random.choice(moves)
            self.fighter2.perform_move(move)
        
        self.frame_count += 1
    
    def draw_beat_display(self):
        """Simple beat display"""
        beats = ["BOOM", "TSK", "TIK", "CLAP"]
        beat = random.choice(beats)
        
        self.set_cursor_position(self.width // 2 - 10, 8)
        sys.stdout.write(f"\033[92mBEAT: {beat:10s}\033[0m")
        
        # Simple beat pattern
        pattern = ["[X]", "[ ]", "[ ]", "[X]", "[ ]", "[ ]", "[X]", "[ ]"]
        current = self.frame_count % len(pattern)
        pattern[current] = f"[{beat[0]}]"
        
        self.set_cursor_position(self.width // 2 - 15, 10)
        sys.stdout.write(f"\033[93m{' '.join(pattern)}\033[0m")
    
    def run(self):
        """Run the animation"""
        try:
            self.clear_screen()
            self.hide_cursor()
            
            print("Starting Kung Fu Fighters Animation...")
            print("=" * 50)
            time.sleep(1)
            
            while self.running:
                self.clear_screen()
                
                # Draw everything
                self.draw_border()
                self.draw_title()
                self.draw_fighters()
                self.draw_beat_display()
                self.draw_controls()
                
                # Update frame counter
                self.set_cursor_position(2, 4)
                sys.stdout.write(f"Frame: {self.frame_count}")
                
                # Update logic
                self.update_logic()
                
                # Control frame rate
                time.sleep(0.1)
                
        except KeyboardInterrupt:
            pass
        finally:
            self.show_cursor()
            self.clear_screen()
            print("Animation complete!")
            print("\nFeatures demonstrated:")
            print("1. Two colored stick figure fighters")
            print("2. Multiple kung fu moves (punch, kick, block)")
            print("3. Mirror animation for right-side fighter")
            print("4. Simple beat display")
            print("5. Frame-based animation system")
            print("\nThis is a simplified demo. The full version includes:")
            print("- Health and energy bars")
            print("- Complex moves (spin kick, dragon punch)")
            print("- Real beat generation with patterns")
            print("- Hit detection and damage system")
            print("- Dojo background and better visuals")

def main():
    """Main function"""
    # Check terminal size
    try:
        import shutil
        width, height = shutil.get_terminal_size()
        if width < 80 or height < 24:
            print("Warning: Terminal should be at least 80x24 for best experience")
            print(f"Current size: {width}x{height}")
            time.sleep(2)
    except:
        pass
    
    # Create and run animation
    animation = SimpleAnimation()
    animation.run()

if __name__ == "__main__":
    main()