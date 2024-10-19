import PostIt from "../components/PostIt";

function MyProjects() {
  return (
    <div className="flex justify-center items-center min-h-auto bg-gray-300 p-10 rounded-lg">
      <div>
        <h1 className="text-center text-3xl font-handlee mb-6">My Projects</h1>
        <div className="grid grid-cols-3 gap-20">
          <PostIt />
          <PostIt />
          <PostIt />
          <PostIt />
          <PostIt />
          <PostIt />
        </div>
      </div>
    </div>
  );
}

export default MyProjects;
