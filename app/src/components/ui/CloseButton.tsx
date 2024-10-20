import React from "react";
import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
      aria-label="Close"
    >
      <X size={24} />
    </button>
  );
}
