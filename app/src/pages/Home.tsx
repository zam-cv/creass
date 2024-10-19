import { useState } from "react";
import { Settings, LayoutGrid } from "lucide-react";
import MyProjects from "./MyProjects";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <header>
        <div className="flex justify-between">
          <div className="order-first pl-5 pt-3">
            <LayoutGrid
              size={35}
              onClick={handleOpenModal}
              className="cursor-pointer"
            />
          </div>
          <div className="order-last pr-5 pt-3">
            <Settings size={35} />
          </div>
        </div>
      </header>
      <body></body>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <MyProjects />
        </div>
      )}
    </div>
  );
}
