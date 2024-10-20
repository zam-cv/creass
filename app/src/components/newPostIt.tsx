import React from "react";

interface NewPostItProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function NewPostIt({ onClick }: NewPostItProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-48 h-48 rounded-lg flex justify-center items-center bg-newPostIt border-4 border-dashed border-black"
    >
      <span className="text-5xl text-black">+</span>
    </div>
  );
}
