import React, { useState, useEffect } from "react";
import { LayoutGrid, Network  } from "lucide-react";
import MyProjects from "./MyProjects";
import Board from "../components/Board";
import CloseButton from "../components/ui/CloseButton";
import ThemeSwitch from "../components/ui/ThemeSwitch";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import TreeComponent from "../components/TreePath";

const HomeContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const storedProject = localStorage.getItem("selectedProject");
    if (storedProject) {
      setSelectedProject(storedProject);
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenTree = () => {    
    setIsTreeOpen(true);
  }

    const handleCloseTree = () => {
        setIsTreeOpen(false);
}


  return (
    <div
      className={`${
        theme === "dark" ? "bg-darkMode text-black" : "bg-white text-black"
      }`}
    >
      <header className="h-[8vh]">
        <div className="flex justify-between items-center">
          <div className="order-first pl-5 pt-3">
            <div className="flex items-center justify-center space-x-2">
                <LayoutGrid
                size={35}
                onClick={handleOpenModal}
                className="cursor-pointer"
                color={theme === "dark" ? "white" : "black"}
                /> 
                <Network 
                size = {35}
                onClick={handleOpenTree}
                className="cursor-pointer"
                color={theme === "dark" ? "white" : "black"}
                    />
            </div>

          </div>
          <div className="flex items-center justify-center mt-2">
            <h1
              className={`text-2xl font-handlee ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {selectedProject ? selectedProject : "Home"}
            </h1>
          </div>
          <div className="order-last pr-5 pt-3">
            
            <ThemeSwitch />
          </div>
        </div>
      </header>
      <main>
        <div className="flex items-center justify-center min-h-[92vh]">
          <Board />
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`relative ${
              theme === "dark" ? "bg-darkMode" : "bg-gray-300"
            } p-10 rounded-lg`}
          >
            <CloseButton onClick={handleCloseModal} />
            <MyProjects />
          </div>
        </div>
      )}
      {isTreeOpen && (
        <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`relative ${
              theme === "dark" ? "bg-darkMode" : "bg-gray-300"
            } p-10 rounded-lg w-3/4 h-3/4`}
          >
            <CloseButton onClick={handleCloseTree} />
            <TreeComponent />
          </div>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
};

export default Home;
