describe('ToyRobotGame', () => {
  let game;

  beforeEach(() => {
    game = new ToyRobotGame();
  });

  it('should have an empty board when initialized', () => {
    const {board} = game.getGameState();
    const isEmpty = board.every(row => row.every(cell => cell === null));
    expect(isEmpty).toBe(true);
  });

  it('should place the robot on the board with a valid PLACE_ROBOT command', () => {
    game.placeRobot(1, 1, 'NORTH');
    const {board, robot} = game.getGameState();
    expect(board[1][1]).toBe('ROBOT');
    expect(robot).toEqual({row: 1, col: 1, facing: 'NORTH'});
  });

  it('should ignore invalid PLACE_ROBOT commands', () => {
    game.placeRobot(6, 1, 'NORTH');
    let {robot} = game.getGameState();
    expect(robot).toBe(null);

    game.placeRobot(1, 1, 'INVALID');
    robot = game.getGameState().robot;
    expect(robot).toBe(null);
  });

  it('should place a wall on the board with a valid PLACE_WALL command', () => {
    game.placeWall(1, 1);
    const {board} = game.getGameState();
    expect(board[1][1]).toBe('WALL');
  });

  it('should ignore invalid PLACE_WALL commands', () => {
    game.placeWall(6, 1);
    const {board} = game.getGameState();
    const hasWall = board.some(row => row.some(cell => cell === 'WALL'));
    expect(hasWall).toBe(false);
  });

  it('should move the robot with a valid MOVE command', () => {
    game.placeRobot(1, 1, 'NORTH');
    game.move();
    const {board, robot} = game.getGameState();
    expect(board[1][1]).toBe(null);
    expect(board[2][1]).toBe('ROBOT');
    expect(robot).toEqual({row: 2, col: 1, facing: 'NORTH'});
  });

  it('should turn the robot with valid LEFT and RIGHT commands', () => {
    game.placeRobot(1, 1, 'NORTH');
    game.turn('LEFT');
    let {robot} = game.getGameState();
    expect(robot.facing).toBe('WEST');

    game.turn('RIGHT');
    robot = game.getGameState().robot;
    expect(robot.facing).toBe('NORTH');
  });

  it('should ignore invalid turn commands', () => {
    game.placeRobot(1, 1, 'NORTH');
    game.turn('INVALID');
    const {robot} = game.getGameState();
    expect(robot.facing).toBe('NORTH');
    game.turn('ANOTHER_INVALID');
    expect(robot.facing).toBe('NORTH');
  });


  it('should report the robot\'s position and facing', () => {
    game.placeRobot(1, 1, 'NORTH');
    const report = game.report();
    expect(report).toBe('2,2,NORTH');
  });

  it('should not move the robot if there is a wall in front of it', () => {
    game.placeRobot(1, 1, 'NORTH');
    game.placeWall(2, 1);
    game.move();
    const {robot} = game.getGameState();
    expect(robot).toEqual({row: 1, col: 1, facing: 'NORTH'});
  });

  it('should warp the robot to the opposite side of the board when reaching an edge', () => {
    game.placeRobot(0, 0, 'SOUTH');
    game.move();
    let {robot} = game.getGameState();
    expect(robot).toEqual({row: 0, col: 0, facing: 'SOUTH'});

    game.placeRobot(4, 4, 'NORTH');
    game.move();
    robot = game.getGameState().robot;
    expect(robot).toEqual({row: 4, col: 4, facing: 'NORTH'});
  });

  it('should not move the robot when it reaches the edge and a wall is placed on the opposite side', () => {
    game.placeRobot(0, 0, 'SOUTH');
    game.placeWall(4, 0);
    game.move();
    const {robot} = game.getGameState();
    expect(robot).toEqual({row: 0, col: 0, facing: 'SOUTH'});
  });
});
