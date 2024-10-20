import { useState, useEffect } from "react";
import TreeComponent from "../components/TreePath";
import { useTheme } from "../contexts/ThemeContext";

export default function TreePathWindow() {
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const { theme } = useTheme();

  const handleOpenTree = () => {
    setIsTreeOpen(true);
  };

  const handleCloseTree = () => {
    setIsTreeOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-auto">
      <div
        className={`${
          theme === "dark" ? "bg-darkMode text-white" : "bg-gray-300 text-black"
        } rounded-lg`}
      >
        <h1 className="text-center text-3xl font-handlee mb-6">Tree</h1>
        <div>
          <TreeComponent />
        </div>
      </div>
      {isTreeOpen}
    </div>
  );
}
