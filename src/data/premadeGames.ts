export interface PremadeGame {
  id: string;
  title: string;
  genre: "Adventure/RPG" | "Retro/Action" | "Strategy/Board" | "Word/Puzzle" | "Casual";
  description: string;
  conceptsDemonstrated: string[];
  howItWorks: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  code: string;
}

export const PREMADE_GAMES: PremadeGame[] = [
  {
    id: "pacman-classic",
    title: "Pac-Man Maze Classic",
    genre: "Retro/Action",
    description: "Classic grid maze game. Evade ghosts and clean up the pellets.",
    conceptsDemonstrated: [
      "Grid array navigation logic",
      "Symmetric maze mapping",
      "Collision check vectors",
      "Simple ghost tracking algorithm"
    ],
    howItWorks: "Maintains a two-dimensional grid representing the maze boundaries. Monitors coordinates for Pac-Man and ghosts. Updates ghost coordinates at regular intervals toward Pac-Man, checking for overlap collision.",
    icon: "pacman",
    difficulty: "Intermediate",
    code: `# Pac-Man Classic Game
# A grid-based turn-based Pac-Man maze game.
import random
import json

def emit_state(pacman, ghosts, pellets, score, gameOver=False, won=False):
    print("__STATE__:" + json.dumps({
        "pacman": pacman,
        "ghosts": ghosts,
        "pellets": pellets,
        "score": score,
        "gameOver": gameOver,
        "won": won
    }))

def main():
    grid_dim = 9
    pacman = [4, 5]
    ghosts = [[1, 1], [7, 1]]
    pellets = [[2, 2], [2, 6], [6, 2], [6, 6], [1, 4], [7, 4], [4, 1], [4, 7]]
    score = 0
    
    print("Pac-Man Classic initialized. Use Arrow keys to navigate.")
    emit_state(pacman, ghosts, pellets, score)
    
    while len(pellets) > 0:
        move = input("Move (W, A, S, D): ").strip().upper()
        dx, dy = 0, 0
        if move == "W": dy = -1
        elif move == "S": dy = 1
        elif move == "A": dx = -1
        elif move == "D": dx = 1
        else: continue
        
        # Update Pacman position
        new_x = max(0, min(grid_dim - 1, pacman[0] + dx))
        new_y = max(0, min(grid_dim - 1, pacman[1] + dy))
        pacman = [new_x, new_y]
        
        # Check pellet consumption
        if pacman in pellets:
            pellets.remove(pacman)
            score += 10
            
        # Move ghosts
        for i in range(len(ghosts)):
            gx, gy = ghosts[i]
            g_dx = random.choice([-1, 0, 1])
            g_dy = random.choice([-1, 0, 1]) if g_dx == 0 else 0
            ghosts[i] = [max(0, min(grid_dim - 1, gx + g_dx)), max(0, min(grid_dim - 1, gy + g_dy))]
            
        # Check collision
        if pacman in ghosts:
            emit_state(pacman, ghosts, pellets, score, gameOver=True)
            print("Game Over!")
            return
            
        emit_state(pacman, ghosts, pellets, score)
        
    emit_state(pacman, ghosts, pellets, score, won=True)
    print("You Won!")

if __name__ == "__main__":
    main()
`
  },
  {
    id: "snake-ascii",
    title: "ChompSnake Classic",
    genre: "Retro/Action",
    description: "Classic grid snake game where snake grows longer upon consuming fruits.",
    conceptsDemonstrated: [
      "Queue data structures",
      "Grid index verification",
      "Collision check math",
      "Dynamic interval state loops"
    ],
    howItWorks: "Monitors snake segments as an array of coordinate tuples. Triggers speed thresholds and grows segment size if food coordinate coordinates overlap the head coordinate.",
    icon: "snake",
    difficulty: "Beginner",
    code: `# ChompSnake: Classic Python Turn-Based Snake
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
    width, height = 10, 10
    snake = [(4, 4), (4, 5), (4, 6)]
    food = (2, 2)
    score = 0
    
    print("ChompSnake initialized. Send movements.")
    emit_state(snake, food, score)
    
    while True:
        move = input("Enter direction (W, A, S, D) or Q: ").strip().upper()
        if move == "Q":
            print("Quit Game.")
            break
            
        dx, dy = 0, 0
        if move == "W": dy = -1
        elif move == "S": dy = 1
        elif move == "A": dx = -1
        elif move == "D": dx = 1
        else: continue
            
        head_x, head_y = snake[0]
        new_head = (head_x + dx, head_y + dy)
        
        # Wall collision
        if new_head[0] < 0 or new_head[0] >= width or new_head[1] < 0 or new_head[1] >= height:
            emit_state(snake, food, score, gameOver=True, cause="wall")
            break
            
        # Self collision
        if new_head in snake[:-1]:
            emit_state(snake, food, score, gameOver=True, cause="tail")
            break
            
        snake.insert(0, new_head)
        
        if new_head == food:
            score += 10
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
    id: "tictactoe-ai",
    title: "Tic-Tac-Toe Minimax AI",
    genre: "Strategy/Board",
    description: "Classic Tic-Tac-Toe featuring an unbeatable artificial intelligence player.",
    conceptsDemonstrated: [
      "Minimax decision trees",
      "State assessment scoring",
      "Control line arrays",
      "Grid boundaries"
    ],
    howItWorks: "Searches all possible moves recursively to output perfect actions, applying weight checks to secure maximum defensive position.",
    icon: "tictactoe",
    difficulty: "Advanced",
    code: `# Tic-Tac-Toe Classic with Minimax AI
import math
import json

def check_winner(board):
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] != " ":
            return board[i][0]
        if board[0][i] == board[1][i] == board[2][i] != " ":
            return board[0][i]
            
    if board[0][0] == board[1][1] == board[2][2] != " ":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != " ":
        return board[0][2]
        
    for r in board:
        if " " in r:
            return None
    return "Draw"

def minimax(board, depth, is_maximizing):
    result = check_winner(board)
    if result == "O": return 10 - depth
    if result == "X": return depth - 10
    if result == "Draw": return 0
        
    if is_maximizing:
        best_score = -math.inf
        for r in range(3):
            for c in range(3):
                if board[r][c] == " ":
                    board[r][c] = "O"
                    score = minimax(board, depth + 1, False)
                    board[r][c] = " "
                    best_score = max(score, best_score)
        return best_score
    else:
        best_score = math.inf
        for r in range(3):
            for c in range(3):
                if board[r][c] == " ":
                    board[r][c] = "X"
                    score = minimax(board, depth + 1, True)
                    board[r][c] = " "
                    best_score = min(score, best_score)
        return best_score

def get_best_ai_move(board):
    best_score = -math.inf
    move = (-1, -1)
    for r in range(3):
        for c in range(3):
            if board[r][c] == " ":
                board[r][c] = "O"
                score = minimax(board, 0, False)
                board[r][c] = " "
                if score > best_score:
                    best_score = score
                    move = (r, c)
    return move

def emit_state(board, player_turn=True):
    print("__STATE__:" + json.dumps({
        "board": board,
        "player_turn": player_turn,
        "winner": check_winner(board)
    }))

def main():
    board = [[" " for _ in range(3)] for _ in range(3)]
    emit_state(board, player_turn=True)
    
    while check_winner(board) is None:
        try:
            coords = input("Your Move (row col, e.g. 1 1): ").strip().split()
            if len(coords) != 2: continue
            r, c = int(coords[0]), int(coords[1])
            if board[r][c] != " ": continue
                
            board[r][c] = "X"
            emit_state(board, player_turn=False)
            
            if check_winner(board) is not None: break
                
            ai_r, ai_c = get_best_ai_move(board)
            if ai_r != -1:
                board[ai_r][ai_c] = "O"
                
            emit_state(board, player_turn=True)
        except Exception:
            continue
            
    emit_state(board, player_turn=True)

if __name__ == "__main__":
    main()
`
  },
  {
    id: "hangman",
    title: "Hangman Word Classic",
    genre: "Word/Puzzle",
    description: "Classic word-guessing game with category selection and gallows.",
    conceptsDemonstrated: [
      "Guessed character sets",
      "Database list selection",
      "State evaluation and loops",
      "Dynamic character verification"
    ],
    howItWorks: "Picks a random target word. Deducts attempts for incorrect guesses, showing target blanks and letters guessed.",
    icon: "hangman",
    difficulty: "Beginner",
    code: `# Hangman Word Classic Game
import random
import json

WORDS_DB = {
    "Programming": ["PYTHON", "COMPILER", "ALGORITHM", "VARIABLE", "FUNCTION", "DATABASE"],
    "Astronomy": ["PLANET", "STAR", "GALAXY", "NEBULA", "GRAVITY", "ASTRONAUT"],
    "Dessert": ["MILKSHAKE", "CHOCOLATE", "COOKIE", "CUPCAKE"]
}

def emit_state(guessed_letters, incorrect_guesses, max_lives, word_display, secret_word, category, gameOver=False, won=False):
    print("__STATE__:" + json.dumps({
        "guessedLetters": list(guessed_letters),
        "incorrectGuesses": incorrect_guesses,
        "maxLives": max_lives,
        "wordDisplay": word_display,
        "secretWord": secret_word if (gameOver or won) else "",
        "category": category,
        "gameOver": gameOver,
        "won": won
    }))

def main():
    categories = list(WORDS_DB.keys())
    selected_category = categories[0]
    secret_word = random.choice(WORDS_DB[selected_category])
    guessed_letters = set()
    incorrect_guesses = 0
    max_lives = 6
    
    word_display = ["_" for _ in secret_word]
    emit_state(guessed_letters, incorrect_guesses, max_lives, word_display, secret_word, selected_category)
    
    while incorrect_guesses < max_lives:
        word_display = [letter if letter in guessed_letters else "_" for letter in secret_word]
        
        if "_" not in word_display:
            emit_state(guessed_letters, incorrect_guesses, max_lives, word_display, secret_word, selected_category, won=True)
            return
            
        guess = input("Guess a letter: ").strip().upper()
        if not guess.isalpha() or len(guess) != 1 or guess in guessed_letters:
            continue
            
        guessed_letters.add(guess)
        if guess not in secret_word:
            incorrect_guesses += 1
            
        word_display = [letter if letter in guessed_letters else "_" for letter in secret_word]
        
        has_won = "_" not in word_display
        has_lost = incorrect_guesses >= max_lives
        
        emit_state(guessed_letters, incorrect_guesses, max_lives, word_display, secret_word, selected_category, gameOver=has_lost, won=has_won)

if __name__ == "__main__":
    main()
`
  }
];
