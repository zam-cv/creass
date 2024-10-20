interface PostItProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

const PostIt: React.FC<PostItProps> = ({ title, onClick, className }) => {
  return (
    <div
      className={`w-48 h-48 bg-postIt rounded-lg shadow-lg cursor-pointer flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <h2 className="text-black text-xl text-center font-bold font-handlee p-2">
        {title}
      </h2>
    </div>
  );
};

export default PostIt;
