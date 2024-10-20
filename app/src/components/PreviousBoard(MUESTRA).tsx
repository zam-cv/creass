import { useState, useEffect } from "react";
import TextField from "./ui/Textfield";
import PostIt from "./PostIt";
import Draggable from "react-draggable";
import { useTheme } from "../contexts/ThemeContext";
import TreeProvider, { useTree } from "../contexts/TreeContext";

interface PostitPosition {
  id: number;
  x: number;
  y: number;
}

interface Node {
  id: number;
  context: string;
  children: Node[];
}

function saveLog(message: string) {
  const logs = localStorage.getItem("logs");
  const logArray = logs ? JSON.parse(logs) : [];

  logArray.push({ message });

  localStorage.setItem("logs", JSON.stringify(logArray));

  console.log(message);
}

const BoardContent: React.FC = () => {
  const [postitPositions, setPostitPositions] = useState<PostitPosition[]>([]);
  const [messageSent, setMessageSent] = useState(false);
  const { theme } = useTheme();
  const [isHome, setIsHome] = useState<boolean>(true);
  const [projectTitle, setProjectTitle] = useState("Cre-As");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [treeData, setTreeData] = useState<Node | null>(null);

  // Información de muestra
  const sampleData = [
    "Idea 1: Improve user interface",
    "Idea 2: Implement new features",
    "Idea 3: Optimize performance",
    "Idea 4: Increase security",
    "Idea 5: Refactor old code",
  ];

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

    const positions = selectedConfiguration.map((position, index) => ({
      id: index,
      ...position,
    }));

    setPostitPositions(positions);
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      const selectedProject = localStorage.getItem("selectedProject");

      if (!selectedProject) {
        // Crear nuevo proyecto
        const storedProjects = localStorage.getItem("projects");
        const projects = storedProjects ? JSON.parse(storedProjects) : [];

        const newProjectName = message;
        const updatedProjects = [...projects, newProjectName];

        const newTreeRoot: Node = {
          id: Date.now(),
          context: newProjectName,
          children: [],
        };

        // Guardamos el nuevo árbol sin hijos por ahora
        localStorage.setItem("tree", JSON.stringify(newTreeRoot));
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        localStorage.setItem("selectedProject", newProjectName);

        setProjectTitle(newProjectName);
        setTreeData(newTreeRoot);
        setSelectedNodeId(newTreeRoot.id);
        setIsHome(false);
        setMessageSent(false);
      } else {
        // Añadir al nodo seleccionado
        const loadedTree = localStorage.getItem("tree");

        if (loadedTree) {
          const currentTree = JSON.parse(loadedTree);

          const addChildrenToNode = (node: Node) => {
            if (node.id === selectedNodeId) {
              sampleData.forEach((text, index) => {
                const childNode: Node = {
                  id: Date.now() + index + 1,
                  context: text,
                  children: [],
                };
                node.children.push(childNode);
                saveLog("Adding Post-It to node: " + text);
              });
            } else {
              node.children.forEach((child) => addChildrenToNode(child));
            }
          };

          addChildrenToNode(currentTree);
          localStorage.setItem("tree", JSON.stringify(currentTree));
          setTreeData(currentTree);
        }

        setMessageSent(true);
        generatePostitPositions();
      }
    }
  };

  const handlePostItClick = (postItText: string, nodeId: number) => {
    setProjectTitle(postItText);
    setPostitPositions([]);
    setSelectedNodeId(nodeId);
    setMessageSent(false);
  };

  // useEffect para cargar el árbol al montar el componente
  useEffect(() => {
    const storedTree = localStorage.getItem("tree");
    if (storedTree) {
      const parsedTree = JSON.parse(storedTree);
      setTreeData(parsedTree);
      if (isHome) {
        setProjectTitle(parsedTree.context);
        setSelectedNodeId(parsedTree.id);
        setIsHome(false);
      }
    }
  }, []);

  // useEffect para generar posiciones cuando cambia messageSent
  useEffect(() => {
    if (messageSent) {
      generatePostitPositions();
    }
  }, [messageSent]);

  // Función para obtener los Post-its del nodo seleccionado
  const getCurrentPostIts = () => {
    const postIts: Node[] = [];

    const findNodeById = (node: Node) => {
      if (node.id === selectedNodeId) {
        postIts.push(...node.children);
      } else {
        node.children.forEach((child) => findNodeById(child));
      }
    };

    if (treeData) {
      findNodeById(treeData);
    }

    return postIts;
  };

  return (
    <div className="relative w-full h-[92vh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl mb-4">
          <h1
            className={`font-handlee text-3xl ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {projectTitle}
          </h1>
        </div>
        <TextField onSendMessage={handleSendMessage} isHome={isHome} />
      </div>

      {messageSent &&
        postitPositions.map((position, index) => {
          const postIts = getCurrentPostIts();
          if (index >= postIts.length) return null;

          return (
            <Draggable
              key={postIts[index].id}
              defaultPosition={{ x: position.x, y: position.y }}
              bounds="parent"
            >
              <div className="absolute">
                <PostIt
                  title={postIts[index].context}
                  onClick={() =>
                    handlePostItClick(postIts[index].context, postIts[index].id)
                  }
                />
              </div>
            </Draggable>
          );
        })}
    </div>
  );
};

const Board: React.FC = () => {
  return (
    <TreeProvider>
      <BoardContent />
    </TreeProvider>
  );
};

export default Board;
