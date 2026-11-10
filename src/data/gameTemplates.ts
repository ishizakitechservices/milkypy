export interface GameTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  icon: string;
  hints: string[];
  starterCode: string;
}

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: "template-snake",
    name: "Classic Snake Engine",
    category: "Retro/Action",
    difficulty: "Beginner",
    description: "Modify snake movement, customize game boundaries, adjust fruit spawn rates, and add special score multipliers.",
    icon: "snake",
    hints: [
      "Try increasing the board dimensions to 20x20 in the main() function.",
      "Add a bonus fruit that awards +50 points instead of +10 points.",
      "Add a maximum speed cap or slow-motion powerups."
    ],
    starterCode: `# Classic Snake Engine Template
# Build custom mechanics like speed boosts, portals, or multi-fruit drops!
import random
import json

def emit_state(snake, food, score, gameOver=False, cause=None):
    print("__STATE__:" + json.dumps({
        "snake": snake,
        "food": food,
        "score": score,
        "gameOver": gameOver,
        "cause": cause
    }))

def main():
    width, height = 12, 12
    snake = [(5, 5), (5, 6), (5, 7)]
    food = (3, 3)
    score = 0
    
    print("Classic Snake Initialized!")
    emit_state(snake, food, score)
    
    while True:
        move = input("Enter direction (W, A, S, D) or Q: ").strip().upper()
        if move == "Q":
            print("Session ended.")
            break
            
        dx, dy = 0, 0
        if move == "W": dy = -1
        elif move == "S": dy = 1
        elif move == "A": dx = -1
        elif move == "D": dx = 1
        else: continue
            
        head_x, head_y = snake[0]
        new_head = (head_x + dx, head_y + dy)
        
        # Boundary collision check
        if new_head[0] < 0 or new_head[0] >= width or new_head[1] < 0 or new_head[1] >= height:
            emit_state(snake, food, score, gameOver=True, cause="wall")
            print("Collision with boundary!")
            break
            
        # Self collision check
        if new_head in snake[:-1]:
            emit_state(snake, food, score, gameOver=True, cause="tail")
            print("Self collision detected!")
            break
            
        snake.insert(0, new_head)
        
        # Eating food check
        if new_head == food:
            score += 10
            print(f"Fruit collected! Score is now {score}!")
            while True:
                new_food = (random.randint(0, width - 1), random.randint(0, height - 1))
                if new_food not in snake:
                    food = new_food
                    break
            emit_state(snake, food, score)
        else:
            snake.pop()
            emit_state(snake, food, score)

if __name__ == "__main__":
    main()
`
  },
  {
    id: "template-rpg",
    name: "Turn-Based Dungeon Crawler",
    category: "Turn-Based RPG",
    difficulty: "Intermediate",
    description: "Program hero classes, random monster encounters, critical hits, and consumable spell inventory.",
    icon: "sword",
    hints: [
      "Add a 'Fireball' spell that costs mana and deals guaranteed burn damage.",
      "Create a 'Boss Monster' with 200 HP and a special ultimate attack.",
      "Add an inventory system with lucky gold coins or armor upgrades."
    ],
    starterCode: `# Turn-Based Dungeon Battler Template
# Experiment with hero stats, enemy types, and special abilities!
import random
import json

class Entity:
    def __init__(self, name, hp, attack, defense):
        self.name = name
        self.max_hp = hp
        self.hp = hp
        self.attack = attack
        self.defense = defense

    def is_alive(self):
        return self.hp > 0

    def take_damage(self, raw_damage):
        mitigated = max(1, raw_damage - self.defense)
        self.hp = max(0, self.hp - mitigated)
        return mitigated

def emit_state(hero, monster, turn_log, won=False, lost=False):
    print("__STATE__:" + json.dumps({
        "heroName": hero.name,
        "heroHp": hero.hp,
        "heroMaxHp": hero.max_hp,
        "monsterName": monster.name,
        "monsterHp": monster.hp,
        "monsterMaxHp": monster.max_hp,
        "log": turn_log,
        "won": won,
        "lost": lost
    }))

def main():
    hero = Entity("Arcade Hero", hp=100, attack=18, defense=4)
    monster = Entity("Shadow Goblin", hp=75, attack=14, defense=2)
    potions = 2
    
    print(f"An ominous {monster.name} emerges from the cavern!")
    emit_state(hero, monster, f"A wild {monster.name} approaches!")

    while hero.is_alive() and monster.is_alive():
        print(f"\\n[Your HP: {hero.hp}/{hero.max_hp} | Monster HP: {monster.hp}/{monster.max_hp} | Potions: {potions}]")
        action = input("Choose Action: (1) Attack, (2) Heavy Slash, (3) Drink Potion: ").strip()
        
        # Player Turn
        if action == "1":
            dmg = random.randint(hero.attack - 3, hero.attack + 4)
            dealt = monster.take_damage(dmg)
            msg = f"You strike {monster.name} for {dealt} damage!"
        elif action == "2":
            if random.random() < 0.65:
                dmg = int(hero.attack * 1.8)
                dealt = monster.take_damage(dmg)
                msg = f"CRITICAL HIT! Heavy strike smashed {monster.name} for {dealt} damage!"
            else:
                msg = "You swung wildly and MISSED!"
        elif action == "3":
            if potions > 0:
                potions -= 1
                healed = 35
                hero.hp = min(hero.max_hp, hero.hp + healed)
                msg = f"Restored {healed} HP! ({potions} potions left)"
            else:
                msg = "Your potion pouch is empty!"
        else:
            print("Invalid command. Stand your ground!")
            continue

        # Check if monster was defeated
        if not monster.is_alive():
            emit_state(hero, monster, msg, won=True)
            print(f"Victory! You banished the {monster.name}!")
            break

        # Monster Counter-Attack
        m_dmg = random.randint(monster.attack - 2, monster.attack + 3)
        taken = hero.take_damage(m_dmg)
        msg += f" | {monster.name} retaliates for {taken} damage!"

        if not hero.is_alive():
            emit_state(hero, monster, msg, lost=True)
            print("Defeat! The darkness claims you...")
            break

        emit_state(hero, monster, msg)

if __name__ == "__main__":
    main()
`
  },
  {
    id: "template-physics",
    name: "Parabolic Cannon Ballistics",
    category: "Simulation",
    difficulty: "Intermediate",
    description: "Model Newtonian gravity, velocity vectors, atmospheric wind drag, and hit-detection tolerances.",
    icon: "target",
    hints: [
      "Try adding a random wind factor between -2.0 and +2.0.",
      "Calculate the maximum height of the parabolic arc using h = (v * sin(theta))^2 / (2 * g).",
      "Add multiple targets with varying point values."
    ],
    starterCode: `# Parabolic Cannon & Projectile Simulation
# Model real Newtonian physics equations with velocity, gravity, and launch angle!
import math
import random
import json

def emit_state(target_dist, last_dist, angle, velocity, hit=False, attempts=0):
    print("__STATE__:" + json.dumps({
        "targetDist": target_dist,
        "lastDist": last_dist,
        "angle": angle,
        "velocity": velocity,
        "hit": hit,
        "attempts": attempts
    }))

def calculate_landing_distance(velocity, angle_deg, gravity=9.81):
    rad = math.radians(angle_deg)
    # Range = (v^2 * sin(2*theta)) / g
    distance = (velocity ** 2 * math.sin(2 * rad)) / gravity
    return max(0.0, distance)

def main():
    target_dist = random.randint(60, 180)
    tolerance = 5.0
    attempts = 0
    max_attempts = 5
    
    print("Cannon Artillery Simulator Ready!")
    print(f"Target positioned at: {target_dist} meters away.")
    emit_state(target_dist, 0, 0, 0, False, attempts)
    
    while attempts < max_attempts:
        attempts += 1
        print(f"\\n[Shot #{attempts}/{max_attempts}]")
        try:
            angle_in = float(input("Launch Angle (0 - 90 degrees): "))
            velo_in = float(input("Muzzle Velocity (10 - 60 m/s): "))
        except ValueError:
            print("Please enter valid numerical parameters.")
            continue
            
        dist = calculate_landing_distance(velo_in, angle_in)
        diff = dist - target_dist
        
        print(f"Projectile landed at: {round(dist, 1)}m")
        
        if abs(diff) <= tolerance:
            emit_state(target_dist, round(dist, 1), angle_in, velo_in, hit=True, attempts=attempts)
            print(f"TARGET DESTROYED at distance {round(dist, 1)}m!")
            return
        elif diff < 0:
            print(f"FELL SHORT by {round(abs(diff), 1)} meters. Add more power or adjust angle!")
        else:
            print(f"OVERSHOT by {round(diff, 1)} meters. Reduce velocity!")
            
        emit_state(target_dist, round(dist, 1), angle_in, velo_in, hit=False, attempts=attempts)
        
    print(f"\\nMission ended. The target was at {target_dist}m.")

if __name__ == "__main__":
    main()
`
  },
  {
    id: "template-puzzle",
    name: "Code Cracker & Logic Puzzle",
    category: "Word/Puzzle",
    difficulty: "Beginner",
    description: "Write binary search helpers, hint generators, and statistical guess predictors.",
    icon: "puzzle",
    hints: [
      "Add a 'Warm / Cold' temperature check that alerts players when within 5 numbers.",
      "Add a timer or limited guess system to raise the stakes.",
      "Allow the player to play against a computer opponent that uses binary search."
    ],
    starterCode: `# Code Cracker & Mystery Logic Game
# Customize clues, secret ranges, and win streaks!
import random
import json

def emit_state(secret, guess, attempts, streak, won=False):
    print("__STATE__:" + json.dumps({
        "secret": secret if won else None,
        "guess": guess,
        "attempts": attempts,
        "streak": streak,
        "won": won
    }))

def main():
    secret = random.randint(1, 100)
    attempts = 7
    streak = 0
    
    print(f"\\nMystery number locked between 1 and 100! You have {attempts} attempts.")
    emit_state(secret, 0, attempts, streak)
    
    while attempts > 0:
        try:
            guess = int(input(f"Enter guess (Remaining: {attempts}): "))
        except ValueError:
            print("Please enter a valid integer.")
            continue
            
        attempts -= 1
        
        if guess == secret:
            streak += 1
            emit_state(secret, guess, attempts, streak, won=True)
            print(f"SOLVED! You cracked the code {secret}! Current streak: {streak}")
            return
            
        hint = "HIGHER" if guess < secret else "LOWER"
        diff = abs(guess - secret)
        if diff <= 5:
            temp = "RED HOT! You are within 5!"
        elif diff <= 15:
            temp = "WARM! Getting close!"
        else:
            temp = "COLD! Far off!"
            
        print(f"Aim {hint}! [{temp}]")
        emit_state(secret, guess, attempts, streak, won=False)
        
    print(f"Out of attempts! The code was {secret}.")

if __name__ == "__main__":
    main()
`
  }
];
