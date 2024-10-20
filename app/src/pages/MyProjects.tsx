import { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import NewPostIt from "../components/newPostIt";
import CreateProjectModal from "../components/CreateProjectModal";
import { useTheme } from "../contexts/ThemeContext";

export default function MyProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
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

  return (
    <div className="flex justify-center items-center min-h-auto">
      <div
        className={`${
          theme === "dark" ? "bg-darkMode text-white" : "bg-gray-300 text-black"
        } rounded-lg`}
      >
        <h1 className="text-center text-3xl font-handlee mb-6">My Projects</h1>
        <div className="grid grid-cols-3 gap-20">
          <NewPostIt onClick={handleOpenModal} />
          {projects.map((project, index) => (
            <PostIt
              key={index}
              title={project}
              onClick={() => handleProjectClick(project)}
              className="text-black"
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CreateProjectModal
          onCreate={handleCreateProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
