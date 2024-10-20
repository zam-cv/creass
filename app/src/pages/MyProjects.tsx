import { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import NewPostIt from "../components/newPostIt";
import CreateProjectModal from "../components/CreateProjectModal";
import { useTheme } from "../contexts/ThemeContext";
import { Trash2 } from "lucide-react";

export default function MyProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = (projectName: string) => {
    const updatedProjects = [...projects, projectName];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    handleCloseModal();
  };

  const handleProjectClick = (projectName: string) => {
    localStorage.setItem("selectedProject", projectName);
    window.location.reload();
    handleCloseModal();
  };

  const handleDeleteClick = (projectName: string) => {
    setProjectToDelete(projectName);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      const updatedProjects = projects.filter(
        (project) => project !== projectToDelete
      );
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      localStorage.removeItem("selectedProject");
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      window.location.reload();
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="flex justify-center items-center min-h-auto">
      <div
        className={`${
          theme === "dark" ? "bg-darkMode text-white" : "bg-gray-300 text-black"
        } rounded-lg`}
      >
        <h1 className="text-center text-3xl font-handlee mb-6">Mis tableros</h1>
        <div className="grid grid-cols-3 gap-20">
          <NewPostIt onClick={handleOpenModal} />
          {projects.map((project, index) => (
            <div className="relative" key={index}>
              <Trash2
                size={20}
                className="absolute top-2 left-2 cursor-pointer text-red-500"
                onClick={() => handleDeleteClick(project)}
              />
              <PostIt
                title={project}
                onClick={() => handleProjectClick(project)}
                className="text-black"
              />
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CreateProjectModal
          onCreate={handleCreateProject}
          onClose={handleCloseModal}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`relative ${
              theme === "dark"
                ? "bg-darkMode text-white"
                : "bg-gray-300 text-black"
            } p-8 rounded-lg`}
          >
            <h2 className="text-xl mb-4">
              ¿Estás seguro que quieres eliminar este Tablero?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Sí
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
