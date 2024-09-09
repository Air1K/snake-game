import React, { useState, useEffect, useRef } from "react";
import SettingsModal from "../ModalStting/ModalSetting";
import appleGif from "../../assets/apple.png";
export type KeyBindings = {
  up: string;
  down: string;
  left: string;
  right: string;
};

type Point = { x: number; y: number };

const Area: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 200, y: 200 }]);
  const [food, setFood] = useState<Point>({ x: 100, y: 100 });
  const [direction, setDirection] = useState<Point[]>([{ x: 20, y: 0 }]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [keyBindings, setKeyBindings] = useState<KeyBindings>({
    up: "w",
    down: "s",
    left: "a",
    right: "d",
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isRenderSnake = useRef<boolean>(false);

  const saveResult = () => {
    console.log("result: ", score);
    //Тут отправляем пост запрос с результатом на сервер
    //Пример: axios.post("https://jsonplaceholder.typicode.com/posts", { score });
    //Также можно использовать fetch
    //Пример: fetch("https://jsonplaceholder.typicode.com/posts", { method: "POST", body: JSON.stringify({ score }) });
    //Лучше конечно отдельный сервис для отправки запрсов созлать и через него делать
    //На бэке принимеем в контроллере запрос с результатом запускаем сервис 
    //для записи в базу данных (результат можно хранить в таблице как {id, user_id, score})
  };

  const editDirection = (newDirection: Point) => {
    if(!isRenderSnake.current){
      console.log("=============1===============", "Нельзя поворачивать назад")
      // setDirection((oldDirection) => [...oldDirection, newDirection]);
    } else {
      setDirection([newDirection]);
    }
    isRenderSnake.current = false;
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    const firstDirection = direction[direction.length - 1];
    switch (e.key) {
      case keyBindings.up:
        if (firstDirection.y === 0) editDirection({ x: 0, y: -20 });
        break;
      case keyBindings.down:
        if (firstDirection.y === 0) editDirection({ x: 0, y: 20 });
        break;
      case keyBindings.left:
        if (firstDirection.x === 0) editDirection({ x: -20, y: 0 });
        break;
      case keyBindings.right:
        if (firstDirection.x === 0) editDirection({ x: 20, y: 0 });
        break;
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = appleGif;
    imageRef.current = img;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (!gameOver) {
        isRenderSnake.current = true;
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          let newHead = {
            x: newSnake[0].x + direction[0].x,
            y: newSnake[0].y + direction[0].y,
          };

          if(direction.length > 1){
            direction.shift();
          }

          if (
            newHead.x < 0 ||
            newHead.x >= 400 ||
            newHead.y < 0 ||
            newHead.y >= 400 ||
            newSnake.some(
              (segment) => segment.x === newHead.x && segment.y === newHead.y
            )
          ) {
            console.log("game over", newHead.x, newHead.y);
            setGameOver(true);
            setIsPlaying(false);
            saveResult();
            return prevSnake;
          }

          newSnake.unshift(newHead);

          if (newHead.x === food.x && newHead.y === food.y) {
            setScore((prevScore) => prevScore + 10);
            setFood({
              x: Math.floor(Math.random() * 20) * 20,
              y: Math.floor(Math.random() * 20) * 20,
            });
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, 400, 400);

      //   ctx.fillStyle = "red";
      if (imageRef.current) {
        ctx.drawImage(imageRef.current, food.x, food.y, 20, 20);
      }
      //   ctx.fillRect(food.x, food.y, 20, 20);

      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "darkgreen" : "green";
        ctx.beginPath();
        ctx.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [snake, food]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction, keyBindings]);

  const updateKeyBindings = (newBindings: KeyBindings) => {
    setKeyBindings(newBindings);
  };

  const startGame = () => {
    setSnake([{ x: 200, y: 200 }]);
    setFood({ x: 100, y: 100 });
    setDirection([{ x: 20, y: 0 }]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        style={{ border: "1px solid black" }}
      />
      <div>Score: {score}</div>
      {gameOver && <div>Game Over!</div>}

      {!isPlaying && (
        <button style={{ marginRight: "10px" }} onClick={startGame}>
          {gameOver ? "Играть заново" : "Начать"}
        </button>
      )}

      <button onClick={() => setShowSettings(true)}>
        Настройки управления
      </button>

      {showSettings && (
        <SettingsModal
          keyBindings={keyBindings}
          onClose={() => setShowSettings(false)}
          onSave={updateKeyBindings}
        />
      )}
    </div>
  );
};

export default Area;
