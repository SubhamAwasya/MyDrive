import { useNavigate } from "react-router-dom";

function FolderNotFound404() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-base-200 text-center px-4">
      <h1 className="text-4xl font-bold mb-2">Folder Not Found</h1>
      <p className="text-lg text-gray-500">
        The folder you are looking for doesn't exist or was deleted.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-neutral text-white rounded-lg shadow hover:bg-neutral-focus"
        onClick={() => navigate("/")}
      >
        Go Back
      </button>
    </div>
  );
}

export default FolderNotFound404;
