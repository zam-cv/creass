import { useState } from "react";
import CloseButton from "../components/ui/CloseButton"; // Asegúrate de que el path es correcto

interface CreateProjectModalProps {
  onCreate: (projectName: string) => void;
  onClose: () => void;
}

export default function CreateProjectModal({
  onCreate,
  onClose,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreate(projectName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-gray-300 p-6 rounded-lg w-1/3">
        {/* Botón para cerrar el modal */}
        <CloseButton onClick={onClose} />

        <h2 className="text-xl mb-4 ml-1 font-handlee">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-4 py-2 pr-12 outline-none bg-textfield rounded-lg hover:shadow-lg mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-gradient-to-b from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
