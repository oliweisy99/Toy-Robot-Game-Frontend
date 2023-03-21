# Toy Robot Game

A simple Toy Robot Game implemented in JavaScript and HTML. The game consists of a 5x5 board where you can place a robot, walls, and issue commands to control the robot.

## Game Rules

The game initializes with an empty 5x5 board. When the game starts, it responds to the following user commands:

1. `PLACE_ROBOT ROW,COL,FACING`: Place a robot at a given coordinate with an initial facing direction. Accepted facing values are: NORTH, SOUTH, EAST, WEST.
2. `PLACE_WALL ROW,COL`: Place a wall at the given coordinate.
3. `REPORT`: Print out the current location and facing direction of the robot.
4. `MOVE`: Move the robot 1 space forward in the direction it is currently facing.
5. `LEFT` / `RIGHT`: Turn the robot 90 degrees to its current left or right.

## Getting Started

### Prerequisites

To run the Toy Robot Game, you'll need a modern web browser that supports JavaScript and HTML5.

### Running the Game

1. Clone the repository or download the project files.
2. Open the `index.html` file in a web browser.
3. Enter commands in the input field and click the "Execute" button to control the robot.

### Running the Tests

The test suite for the Toy Robot Game uses Jasmine. Follow these steps to set up the Jasmine testing environment and run the tests:

1. Clone the repository or download the project files.
2. Open the `unitTestPage.html` file in a web browser.
3. View the results of the tests, using all available links to find further details and refresh the page to renew.

## Contributing

If you would like to contribute to this project, please submit a pull request with your proposed changes.

