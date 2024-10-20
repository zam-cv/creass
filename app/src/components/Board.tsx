import { useState, useEffect } from "react";
import TextField from "./ui/Textfield";
import PostIt from "./PostIt";
import Draggable from "react-draggable";
import { useTheme } from "../contexts/ThemeContext";

interface PostitPosition {
  id: number;
  x: number;
  y: number;
}

const BoardContent: React.FC = () => {
  const [postitPositions, setPostitPositions] = useState<PostitPosition[]>([]);
  const [messageSent, setMessageSent] = useState(false);
  const { theme } = useTheme();
  const [isHome, setIsHome] = useState<boolean>(true); // Para saber si estamos en "Home"

  const predefinedConfigurations = [
    // Configuración 1
    [
      { x: 100, y: 100 },
      { x: 300, y: 300 },
      { x: 800, y: 50 },
      { x: 900, y: 450 },
      { x: 1200, y: 100 },
    ],
    // Configuración 2
    [
      { x: 150, y: 250 },
      { x: 1300, y: 50 },
      { x: 1200, y: 450 },
      { x: 300, y: 10 },
      { x: 650, y: 500 },
    ],
    // Configuración 3
    [
      { x: 200, y: 50 },
      { x: 1250, y: 350 },
      { x: 100, y: 350 },
      { x: 600, y: 450 },
      { x: 1300, y: 10 },
    ],
    // Configuración 4
    [
      { x: 50, y: 100 },
      { x: 850, y: 450 },
      { x: 900, y: 10 },
      { x: 1400, y: 250 },
      { x: 300, y: 400 },
    ],
    // Configuración 5
    [
      { x: 100, y: 50 },
      { x: 600, y: 10 },
      { x: 1250, y: 350 },
      { x: 1300, y: 20 },
      { x: 150, y: 450 },
    ],
    // Configuración 6
    [
      { x: 20, y: 20 },
      { x: 600, y: 40 },
      { x: 1000, y: 450 },
      { x: 1300, y: 100 },
      { x: 250, y: 450 },
    ],
    // Configuración 7
    [
      { x: 50, y: 100 },
      { x: 400, y: 350 },
      { x: 1250, y: 200 },
      { x: 700, y: 50 },
      { x: 100, y: 400 },
    ],
    // Configuración 8
    [
      { x: 150, y: 50 },
      { x: 1400, y: 30 },
      { x: 900, y: 450 },
      { x: 650, y: 0 },
      { x: 300, y: 450 },
    ],
    // Configuración 9
    [
      { x: 50, y: 300 },
      { x: 700, y: 30 },
      { x: 1300, y: 150 },
      { x: 200, y: 10 },
      { x: 600, y: 450 },
    ],
    // Configuración 10
    [
      { x: 150, y: 50 },
      { x: 600, y: 450 },
      { x: 1300, y: 150 },
      { x: 900, y: 0 },
      { x: 250, y: 350 },
    ],
  ];

  const generatePostitPositions = () => {
    const randomIndex = Math.floor(
      Math.random() * predefinedConfigurations.length
    );
    const selectedConfiguration = predefinedConfigurations[randomIndex];

    const postitPositions = selectedConfiguration.map((position, index) => ({
      id: index,
      ...position,
    }));

    setPostitPositions(postitPositions);
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      const selectedProject = localStorage.getItem("selectedProject");

      if (!selectedProject) {
        const storedProjects = localStorage.getItem("projects");
        const projects = storedProjects ? JSON.parse(storedProjects) : [];

        const newProjectName = message;
        const updatedProjects = [...projects, newProjectName];
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        localStorage.setItem("selectedProject", newProjectName);

        window.location.reload();
      } else {
        setMessageSent(true);
        generatePostitPositions();
      }
    }
  };

  useEffect(() => {
    const selectedProject = localStorage.getItem("selectedProject");
    if (!selectedProject) {
      setIsHome(true);
    } else {
      setIsHome(false);
    }

    if (!isHome || messageSent) {
      generatePostitPositions();
    }
  }, [theme, messageSent]);

  return (
    <div className="relative w-full h-[92vh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl mb-4">
          <h1
            className={`font-handlee text-3xl ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Cre-As
          </h1>
        </div>
        <TextField onSendMessage={handleSendMessage} isHome={isHome} />
      </div>

      {messageSent &&
        postitPositions.map((position, index) => (
          <Draggable
            key={index}
            defaultPosition={{ x: position.x, y: position.y }}
            bounds="parent"
          >
            <div className="absolute">
              <PostIt title="{}" />
            </div>
          </Draggable>
        ))}
    </div>
  );
};

export default BoardContent;
