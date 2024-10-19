import { useState } from "react";
import PostIt from "../components/PostIt";
import NewPostIt from "../components/newPostIt";
import CreateProjectModal from "../components/CreateProjectModal";

export default function MyProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = (projectName: string) => {
    setProjects([...projects, projectName]);
  };

  return (
    <div className="flex justify-center items-center min-h-auto">
      <div className="bg-gray-300 p-10 rounded-lg">
        <h1 className="text-center text-3xl font-handlee mb-6">My Projects</h1>
        <div className="grid grid-cols-3 gap-20">
          <NewPostIt onClick={handleOpenModal} />
          {projects.map((project, index) => (
            <PostIt key={index} title={project} />
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
