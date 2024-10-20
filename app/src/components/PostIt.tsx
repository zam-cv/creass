interface PostItProps {
  title: string;
  info: string;
  onClick?: () => void;
  className?: string;
}

const PostIt: React.FC<PostItProps> = ({ title, info, onClick, className }) => {
  return (
    <div
      className={`w-48 h-48 bg-postIt rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-start ${className}`}
      onClick={onClick}
    >
      {/* Title section */}
      <h2 className="text-black text-xl text-center font-bold font-handlee p-2 overflow-y-auto ">
        {title}
      </h2>

      {/* Scrollable info section */}
      <p className="text-black text-sm text-left p-2 overflow-y-auto max-h-24 w-full"></p>
    </div>
  );
};

export default PostIt;
