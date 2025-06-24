# MCTS Tic-Tac-Toe: AI-Powered Strategy Game
A browser-based tic-tac-toe game featuring an intelligent AI opponent powered by Monte Carlo Tree Search (MCTS). This project demonstrates how sophisticated AI algorithms can be translated from Python to JavaScript and run entirely in your web browser.

## How to launch 
Getting started requires only Python, which comes pre-installed on most computers. The beauty of this approach lies in its simplicity: no complex installations or dependencies are needed.
bash# Download the project files to your computer

```
# (Either clone this repository or download as ZIP)
git clone https://github.com/Ideapersie/MCTS_tictactoe.git

# Navigate to the project folder in your terminal
cd MCTS_tictactoe

# Start the local web server using Python
python -m http.server 8000

# Open your web browser and visit:
# http://localhost:8000
```

## Game Features and Learning Opportunities
The game offers two distinct modes that demonstrate different aspects of strategic thinking. **Player vs AI** mode lets you test your skills against three difficulty levels, each representing different computational budgets for the MCTS algorithm. 

- Easy mode runs 10 iterations per move and makes decisions quickly, providing a beatable opponent that helps you understand basic tic-tac-toe strategy. 
- Medium difficulty uses 30 iterations and offers balanced gameplay where good tactics can still lead to victory. 
- Hard mode runs 200 iterations and plays near-optimally, rarely making mistakes and capitalizing on any errors you make.

**Player vs Player** mode provides the classic tic-tac-toe experience, perfect for understanding the fundamental strategy before facing the AI or for sharing the game with others.
