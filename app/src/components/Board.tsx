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

interface boardProps {
  selectedNode: number | null;
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

let nextNodeId = Number(localStorage.getItem("nextNodeId") || 1);

function BoardContent({ socket }: { socket: any }) {
  const [postitPositions, setPostitPositions] = useState<PostitPosition[]>([]);
  const [messageSent, setMessageSent] = useState(false);
  const { theme } = useTheme();
  const [isHome, setIsHome] = useState<boolean>(true);
  const [projectTitle, setProjectTitle] = useState("Cre-As");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [treeData, setTreeData] = useState<Node | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

  const modifyText = (text: string): string => {
    return text.slice(0, 5) + "...";
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      const selectedProject = localStorage.getItem("selectedProject");

      if (!selectedProject) {
        const storedProjects = localStorage.getItem("projects");
        const projects = storedProjects ? JSON.parse(storedProjects) : [];

        const newProjectName = message;
        const updatedProjects = [...projects, newProjectName];

        const newTreeRoot = {
          id: nextNodeId++,
          context: newProjectName,
          children: [],
        };
        localStorage.setItem("nextNodeId", String(nextNodeId));

        localStorage.setItem("tree", JSON.stringify(newTreeRoot));
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        localStorage.setItem("selectedProject", newProjectName);

        setProjectTitle(newProjectName);
        setTreeData(newTreeRoot);
        setSelectedNodeId(newTreeRoot.id);
        setIsHome(false);
        setMessageSent(false);
        window.location.reload();
      } else {
        console.log("2 Sending message:", message);
        if (socket && isConnected) {
          console.log("Sending message:", message);
          const payload = {
            prompt: message,
            user_context: [],
            results: "",
            context: "",
          };

          // addChildrenToNode(currentTree);
          // localStorage.setItem("tree", JSON.stringify(currentTree));
          // setTreeData(currentTree);
        }

        setMessageSent(true);
        generatePostitPositions();
      }
    }
  };

  const connectToWebSocket = async () => {
    try {
      let messageBuffer = ""; // Buffer to accumulate incoming messages

      socket.addEventListener("open", () => {
        console.log("WebSocket conectado");
        setIsConnected(true);
      });

      socket.addEventListener("message", (event: any) => {
        const data = event.data;
        messageBuffer += data; // Add incoming data to the buffer

        if (messageBuffer.includes("%")) {
          // Split buffer by '%'
          const postItTexts = messageBuffer.split("%");

          // Loop through all but the last part, as the last might be incomplete
          const loadedTree = localStorage.getItem("tree");
          if (loadedTree) {
            const currentTree = JSON.parse(loadedTree);
            const addChildrenToNode = (node: Node) => {
              if (node.id === selectedNodeId) {
                for (let i = 0; i < postItTexts.length - 1; i++) {
                  const text = postItTexts[i].trim();

                  // Split the fullText by '$' to separate title and info
                  const [title, info] = text
                    .split("$")
                    .map((str) => str.trim());

                  // Create the new Post-It node with title and info
                  const childNode: Node = {
                    id: nextNodeId++,
                    context: `${title}$${info}`, // Store both title and info in context separated by '$'
                    children: [], // No children for now
                  };

                  localStorage.setItem("nextNodeId", String(nextNodeId));
                  node.children.push(childNode);
                  saveLog(
                    `Adding Post-It to node: Title - ${title}, Info - ${info}`
                  );
                }
              } else {
                node.children.forEach((child) => addChildrenToNode(child));
              }
            };
            addChildrenToNode(currentTree);
            localStorage.setItem("tree", JSON.stringify(currentTree));
            setTreeData(currentTree);
            setMessageSent(true);
            generatePostitPositions();
          }

          messageBuffer = postItTexts[postItTexts.length - 1];
        }
      });

      socket.addEventListener("error", (error: any) => {
        console.error("WebSocket Error:", error);
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket desconectado, intentando reconectar...");
        setIsConnected(false);
        setTimeout(connectToWebSocket, 5000);
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      setTimeout(connectToWebSocket, 5000);
    }
  };

  const handlePostItClick = (postItText: string, nodeId: number) => {
    setProjectTitle(postItText);
    setPostitPositions([]);
    setSelectedNodeId(nodeId);
  };

  useEffect(() => {
    const storedTree = localStorage.getItem("tree");
    if (storedTree) {
      const parsedTree = JSON.parse(storedTree);
      setTreeData(parsedTree);
      if (isHome) {
        setSelectedNodeId(parsedTree.id);
        setIsHome(false);
      }
    }
  }, []);

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

    const storedTree = localStorage.getItem("tree");
    if (storedTree) {
      setTreeData(JSON.parse(storedTree));
    }
  }, [theme, messageSent]);

  useEffect(() => {
    if (messageSent) {
      generatePostitPositions();
    }
  }, [messageSent]);

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
                  title={postIts[index].context.split("$")[0]} // Extract title part from context
                  info={postIts[index].context.split("$")[1]} // Extract info part from context
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
}

export default function Board({ socket }: { socket: any }) {
  return (
    <TreeProvider>
      <BoardContent socket={socket} />
    </TreeProvider>
  );
}