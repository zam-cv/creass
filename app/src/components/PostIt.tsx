interface PostItProps {
  title: string;
  onClick?: () => void;
}

const PostIt: React.FC<PostItProps> = ({ title, onClick }) => {
  return (
    <div
      className="w-48 h-48 bg-postIt rounded-lg shadow-lg cursor-pointer flex items-center justify-center"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};

export default PostIt;
