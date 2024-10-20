import { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import NewPostIt from "../components/newPostIt";
import CreateProjectModal from "../components/CreateProjectModal";
import { useNavigate } from "react-router-dom";

interface PostItProps {
  title: string;
  onClick?: () => void; // Definimos la prop onClick como opcional
}

export default function MyProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const navigate = useNavigate(); // Usamos navigate para redirigir al Home con el proyecto seleccionado

  useEffect(() => {
    // Cargar proyectos guardados de localStorage al cargar el componente
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
    localStorage.setItem("projects", JSON.stringify(updatedProjects)); // Guardar en localStorage
    handleCloseModal();
  };

  const handleProjectClick = (projectName: string) => {
    // Guardar el proyecto seleccionado en localStorage o en el estado global si tienes uno
    localStorage.setItem("selectedProject", projectName);
    // Navegar al home con el proyecto seleccionado
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-auto">
      <div className="bg-gray-300 p-10 rounded-lg">
        <h1 className="text-center text-3xl font-handlee mb-6">My Projects</h1>
        <div className="grid grid-cols-3 gap-20">
          <NewPostIt onClick={handleOpenModal} />
          {projects.map((project, index) => (
            <PostIt
              key={index}
              title={project}
              onClick={() => handleProjectClick(project)} // Asignamos onClick
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
