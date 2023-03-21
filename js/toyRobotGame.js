class ToyRobotGame {

  //Initializes a new instance of the ToyRobotGame class, creating an empty game board,
  //setting the initial state of the robot, and setting up a lookup table for directions.
  constructor(boardSize = 5) {
    this.boardSize = boardSize;
    this.board = Array.from({length: boardSize}, () => Array(boardSize).fill(null));
    this.robot = null;
  }

  //Generates the HTML table representing the game board, and assigns it to the boardElement property.
  createBoard() {
    const table = document.createElement('table');
    table.classList.add('game-board');

    // initialize the board array with null values
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = Array.from({length: this.boardSize}, () => null);
    }

    for (let i = this.boardSize - 1; i >= 0; i--) {
      const tr = document.createElement('tr');
      for (let j = 0; j < this.boardSize; j++) {
        const td = document.createElement('td');
        td.id = `cell-${i}-${j}`;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    return table;
  }


  //Updates the display of a specific cell on the game board based on its content (empty, robot, or wall).
  updateCell(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    const content = this.board[row][col];
    if (content === 'ROBOT') {
      const directionIndicator = {
        'NORTH': '⬆️',
        'EAST': '➡️',
        'SOUTH': '⬇️',
        'WEST': '⬅️'
      };
      cell.textContent = directionIndicator[this.robot.facing];
    } else if (content === 'WALL') {
      cell.textContent = '🧱';
    } else {
      cell.textContent = '';
    }
  }


  //Takes a command string as input, parses it, and calls the appropriate game function, updating the game board afterward.
  executeCommand(command) {
    if (!command || command.trim() === '') {
      return;
    }

    const [cmd, args] = command.split(' ');
    if (cmd === 'PLACE_ROBOT') {
      if (args) {
        const [row, col, facing] = args.split(',');
        this.placeRobot(parseInt(row) - 1, parseInt(col) - 1, facing);
      }
    } else if (cmd === 'PLACE_WALL') {
      if (args) {
        const [row, col] = args.split(',');
        this.placeWall(parseInt(row) - 1, parseInt(col) - 1);
      }
    } else if (cmd === 'MOVE') {
      this.move();
    } else if (cmd === 'LEFT' || cmd === 'RIGHT') {
      this.turn(cmd);
    } else if (cmd === 'REPORT') {
      const output = document.getElementById('output');
      output.textContent = this.report();
    }

    this.board.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        this.updateCell(rowIndex, colIndex);
      });
    });
  }


  //Returns an object representing the current state of the game, including the robot's position, facing direction,
  //and the positions of all walls on the board. This function is useful for saving or exporting the game state or for testing purposes.
  getGameState() {
    return {
      board: this.board,
      robot: this.robot,
    };
  }

  //Checks if a given position (row, column) on the game board is valid, meaning it is within the bounds of the
  //board and not occupied by a wall.
  //This function can be used to determine if a move or placement action is allowed before executing it.
  isValidPosition(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }


  //Places a robot at a given coordinate with an initial facing direction. If there's already a robot on the board, moves it to the new location.
  placeRobot(row, col, facing) {
    if (!this.isValidPosition(row, col) || !['NORTH', 'SOUTH', 'EAST', 'WEST'].includes(facing)) {
      return;
    }
    if (this.robot) {
      this.board[this.robot.row][this.robot.col] = null;
    }
    this.robot = {row, col, facing};
    this.board[row][col] = 'ROBOT';
  }

  //Places a wall at a given coordinate. If the target location is occupied, ignores the command.
  placeWall(row, col) {
    if (!this.isValidPosition(row, col) || this.board[row][col]) {
      return;
    }
    this.board[row][col] = 'WALL';
  }

  //Prints out the current location and facing direction of the robot.
  report() {
    if (!this.robot) {
      return null;
    }
    return `${this.robot.col +1},${this.robot.row +1},${this.robot.facing}`;
  }


  //Moves the robot one step forward in its current facing direction.
  // If the robot encounters a wall or reaches the edge of the board, it handles the situation according to the game rules (e.g., stops at the wall or wraps around to the opposite edge).
  move() {
    if (!this.robot) {
      return;
    }
    const directions = {
      'NORTH': {row: 1, col: 0},
      'EAST': {row: 0, col: 1},
      'SOUTH': {row: -1, col: 0},
      'WEST': {row: 0, col: -1}
    };
    const newRow = this.robot.row + directions[this.robot.facing].row;
    const newCol = this.robot.col + directions[this.robot.facing].col;

    if (!this.isValidPosition(newRow, newCol) || this.board[newRow][newCol] === 'WALL') {
      return;
    }

    this.board[this.robot.row][this.robot.col] = null;
    this.robot.row = newRow;
    this.robot.col = newCol;
    if (this.isValidPosition(newRow + directions[this.robot.facing].row, newCol + directions[this.robot.facing].col)) {
      this.board[newRow + directions[this.robot.facing].row][newCol + directions[this.robot.facing].col] = null;
    }
    this.board[newRow][newCol] = 'ROBOT';
  }


  //Turns the robot 90 degrees to its current left or right, depending on the clockwise parameter (true for right, false for left).
  turn(direction) {
    if (!this.robot || !['LEFT', 'RIGHT'].includes(direction)) {
    return;
  }
    const facingOrder = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = facingOrder.indexOf(this.robot.facing);
    let newIndex;

    if (direction === 'LEFT') {
      newIndex = (currentIndex - 1 + facingOrder.length) % facingOrder.length;
    } else {
      newIndex = (currentIndex + 1) % facingOrder.length;
    }

    this.robot.facing = facingOrder[newIndex];
  }
}
