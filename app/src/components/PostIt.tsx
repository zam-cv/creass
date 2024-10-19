interface PostItProps {
  title: string;
}

export default function PostIt({ title }: PostItProps) {
  return (
    <div className="w-48 h-48 bg-postIt rounded-lg flex justify-center items-center shadow-lg">
      <span className="text-center">{title}</span>
    </div>
  );
}
