import { useState, useEffect } from "react";
import TextField from "./ui/Textfield";
import PostIt from "./PostIt";
import Draggable from "react-draggable";
import { useTheme } from "../contexts/ThemeContext";
import TreeProvider from "../contexts/TreeContext";
import * as WebSocketTauri from "@tauri-apps/plugin-websocket";

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

let nextNodeId = Number(localStorage.getItem("nextNodeId") || 1);

const BoardContent: React.FC = () => {
  const [postitPositions, setPostitPositions] = useState<PostitPosition[]>([]);
  const [messageSent, setMessageSent] = useState(false);
  const { theme } = useTheme();
  const [isHome, setIsHome] = useState<boolean>(true);
  const [projectTitle, setProjectTitle] = useState("Cre-As");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [treeData, setTreeData] = useState<Node | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [ws, setWs] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const predefinedConfigurations = [
    [
      { x: 100, y: 100 },
      { x: 300, y: 300 },
      { x: 800, y: 50 },
      { x: 900, y: 450 },
      { x: 1200, y: 100 },
    ],
    [
      { x: 150, y: 250 },
      { x: 1300, y: 50 },
      { x: 1200, y: 450 },
      { x: 300, y: 10 },
      { x: 650, y: 500 },
    ],
    [
      { x: 200, y: 50 },
      { x: 1250, y: 350 },
      { x: 100, y: 350 },
      { x: 600, y: 450 },
      { x: 1300, y: 10 },
    ],
    [
      { x: 50, y: 100 },
      { x: 850, y: 450 },
      { x: 900, y: 10 },
      { x: 1400, y: 250 },
      { x: 300, y: 400 },
    ],
    [
      { x: 100, y: 50 },
      { x: 600, y: 10 },
      { x: 1250, y: 350 },
      { x: 1300, y: 20 },
      { x: 150, y: 450 },
    ],
    [
      { x: 20, y: 20 },
      { x: 600, y: 40 },
      { x: 1000, y: 450 },
      { x: 1300, y: 100 },
      { x: 250, y: 450 },
    ],
    [
      { x: 50, y: 100 },
      { x: 400, y: 350 },
      { x: 1250, y: 200 },
      { x: 700, y: 50 },
      { x: 100, y: 400 },
    ],
    [
      { x: 150, y: 50 },
      { x: 1400, y: 30 },
      { x: 900, y: 450 },
      { x: 650, y: 0 },
      { x: 300, y: 450 },
    ],
    [
      { x: 50, y: 300 },
      { x: 700, y: 30 },
      { x: 1300, y: 150 },
      { x: 200, y: 10 },
      { x: 600, y: 450 },
    ],
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
      } else {
        if (ws && isConnected) {
          const payload = {
            prompt: message,
            user_context: [],
            results: "",
            context: "",
          };
          ws.send(JSON.stringify(payload));
        }
      }
    }
  };

  const connectToWebSocket = async () => {
    try {
      const socket = new WebSocket("ws://172.21.1.107:80/ws");
      socket.addEventListener("open", () => {
        console.log("WebSocket conectado");
        setWs(socket);
        setIsConnected(true);
      });
      socket.addEventListener("message", (event: any) => {
        const data = event.data;
        const postItTexts = data.split("%");
        const loadedTree = localStorage.getItem("tree");
        if (loadedTree) {
          const currentTree = JSON.parse(loadedTree);
          const addChildrenToNode = (node: Node) => {
            if (node.id === selectedNodeId) {
              postItTexts.forEach((text: string) => {
                const childNode: Node = {
                  id: nextNodeId++,
                  context: text.trim(),
                  children: [],
                };
                localStorage.setItem("nextNodeId", String(nextNodeId));
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
          setMessageSent(true);
          generatePostitPositions();
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
    if (!isDragging) {
      setProjectTitle(postItText);
      setPostitPositions([]);
      setSelectedNodeId(nodeId);
    }
  };

  useEffect(() => {
    connectToWebSocket();
  }, []);

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
              onStart={() => setIsDragging(true)}
              onStop={() => setIsDragging(false)}
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
