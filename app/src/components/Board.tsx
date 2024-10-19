import { useState, useEffect } from "react";
import TextField from "./ui/Textfield";
import PostIt from "./PostIt";

interface PostitPosition {
  id: number;
  x: number;
  y: number;
}

export default function Board() {
  const [postitPositions, setPostitPositions] = useState<PostitPosition[]>([]);

  const checkCollision = (
    x: number,
    y: number,
    positions: PostitPosition[],
    textFieldArea: { x: number; y: number; width: number; height: number }
  ): boolean => {
    const postitSize = 192; // 48px * 4 (w-48 en Tailwind es 12rem, que son 192px)

    // Comprobar colisión con el TextField
    if (
      x < textFieldArea.x + textFieldArea.width &&
      x + postitSize > textFieldArea.x &&
      y < textFieldArea.y + textFieldArea.height &&
      y + postitSize > textFieldArea.y
    ) {
      return true; // Colisión con TextField
    }

    // Comprobar colisión con otros PostIts
    for (let position of positions) {
      if (
        x < position.x + postitSize &&
        x + postitSize > position.x &&
        y < position.y + postitSize &&
        y + postitSize > position.y
      ) {
        return true; // Colisión con otro PostIt
      }
    }
    return false; // No hay colisión
  };

  const generateRandomPostits = (count: number) => {
    const newPositions: PostitPosition[] = [];
    const textFieldWidth = 300; // Ancho estimado del TextField
    const textFieldHeight = 50; // Altura estimada del TextField
    const postitSize = 192; // 48px * 4 (w-48 en Tailwind es 12rem, que son 192px)
    const margin = 20; // Margen para evitar que los postits toquen los bordes

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const textFieldArea = {
      x: centerX - textFieldWidth / 2,
      y: centerY - textFieldHeight / 2,
      width: textFieldWidth,
      height: textFieldHeight,
    };

    let attempts = 0;
    const maxAttempts = 100; // Límite de intentos para evitar bucles infinitos

    for (let i = 0; i < count && attempts < maxAttempts; i++) {
      let x, y;
      let collision;
      do {
        x =
          Math.random() * (window.innerWidth - postitSize - margin * 2) +
          margin;
        y =
          Math.random() * (window.innerHeight - postitSize - margin * 2) +
          margin;
        collision = checkCollision(x, y, newPositions, textFieldArea);
        attempts++;
      } while (collision && attempts < maxAttempts);

      if (!collision) {
        newPositions.push({ id: i, x, y });
        attempts = 0; // Resetear intentos para el siguiente PostIt
      }
    }
    setPostitPositions(newPositions);
  };

  useEffect(() => {
    generateRandomPostits(5); // Genera 5 postits al cargar el componente
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl mb-4">
          <h1 className="font-handlee">CreAss</h1>
        </div>
        <TextField />
      </div>
      {postitPositions.map((position) => (
        <div
          key={position.id}
          className="absolute"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          <PostIt title="{}" />
        </div>
      ))}
    </div>
  );
}
