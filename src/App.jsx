import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Snake } from './components/Snake';
import { Food } from './components/Food';
import { DIRECTION, BOARD_WIDTH, BOARD_HEIGHT, RATIO } from './constants';

const GameBoard = ({ width, height, children }) => (
  <div className="board" style={{ width, height }}>
    {children}
  </div>
);

function generateFood() {
  const left = Math.floor(Math.random() * (100 / RATIO));
  const top = Math.floor(Math.random() * (100 / RATIO));
  return [left, top];
}

function App() {
  const [dir, setDir] = useState(DIRECTION.RIGHT);
  const [snake, setSnake] = useState([
    [1, 1],
    [2, 1],
  ]);
  // TODO: add scoring system later
  // const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [food, setFood] = useState(generateFood);
  const timerId = useRef();

  function onSnakeOutOfBounds() {
    const tail = snake.at(-1);
    if (
      tail[0] >= Math.floor(100 / RATIO) ||
      tail[1] >= Math.floor(100 / RATIO) ||
      tail[0] < 0 ||
      tail[1] < 0
    ) {
      alert('Game over');
      gameOver();
    }
  }

  // reset the game once it's over to prevent out-of-boundary screen
  function gameOver() {
    clearInterval(timerId.current);
    setSnake([
      [1, 1],
      [2, 1],
    ]);
    setSpeed(100);
    setDir(DIRECTION.RIGHT);
  }

  function onSnakeEats() {
    // assuming the snake moves to the right, the moment it touches the food (after moveSnake was invoked):
    // [H,x,x,T,x] -> [x,H,x,x,T]
    // a new node needs to be added to the head but its value doesn't matter,
    // because whatever the value is, it will be discarded in the next move.
    const tail = snake.at(-1);
    if (tail[0] === food[0] && tail[1] === food[1]) {
      const snakeCopy = [...snake];
      snakeCopy.unshift([]);
      setSnake(snakeCopy);
      setFood(generateFood());
    }
  }

  function onSnakeCollapsed() {
    const snakeCopy = [...snake];
    let tail = snakeCopy.at(-1);
    snakeCopy.pop(); // exclude the tail
    snakeCopy.forEach((dot) => {
      if (tail[0] == dot[0] && tail[1] == dot[1]) {
        gameOver();
      }
    });
  }

  function moveSnake() {
    const snakeCopy = [...snake];
    let tail = snakeCopy.at(-1);
    const [left, top] = tail;

    switch (dir) {
      case DIRECTION.RIGHT:
        tail = [left + 1, top];
        break;
      case DIRECTION.LEFT:
        tail = [left - 1, top];
        break;
      case DIRECTION.UP:
        tail = [left, top - 1];
        break;
      case DIRECTION.DOWN:
        tail = [left, top + 1];
        break;
      default:
        throw new Error('No such direction!');
    }
    // based on the snake's rendering sequence [H,x,x,T,x] -> [x,H,x,x,T] (move to right)
    snakeCopy.push(tail);
    snakeCopy.shift();

    setSnake(snakeCopy);
  }

  useEffect(() => {
    timerId.current = setInterval(moveSnake, speed);
    return () => clearInterval(timerId.current);
    // `snake`, `dir` are important dependencies to prevent stale states from being used in `moveSnake()`
  }, [snake, dir, speed, gameOver]);

  useEffect(() => {
    onSnakeEats();
    onSnakeOutOfBounds();
    onSnakeCollapsed();
  }, [snake]);

  useEffect(() => {
    function onKeydown(e) {
      switch (e.key) {
        case 'ArrowDown':
          setDir(DIRECTION.DOWN);
          break;
        case 'ArrowUp':
          setDir(DIRECTION.UP);
          break;
        case 'ArrowLeft':
          setDir(DIRECTION.LEFT);
          break;
        case 'ArrowRight':
          setDir(DIRECTION.RIGHT);
          break;
        default:
          return;
      }
    }

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  return (
    <GameBoard width={BOARD_WIDTH} height={BOARD_HEIGHT}>
      <Snake body={snake} />
      <Food pos={food} />
    </GameBoard>
  );
}

export default App;
