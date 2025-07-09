import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate, useParams, Link } from "react-router-dom";

// my components
import Folder from "../components/Folder/Folder.jsx";
import UploadFile from "../components/File/UploadFile.jsx";
import File from "../components/File/File.jsx";

// icons
import { FcEmptyTrash } from "react-icons/fc";

// axios
import api from "../api/AxiosApi";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Breadcrumb from "../components/mini_components/Breadcrumb.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const params = useParams();

  // extracting folder id from prams if no prams take user root folder
  const folderId = params.folderId || user?.rootFolder;

  // State to manage fetched folder data
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  // State to track currently active folder (optional/unused here)
  const [currentFolder, setCurrentFolder] = useState(null);

  // Loading and error states for folder fetching
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Fetch data for current folder based on URL param or user's root folder.

  const getFolders = useCallback(async () => {
    if (!folderId) return;
    console.log({ breadcrumbs });

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/folder/${folderId}`);
      setFolders(res.data);
    } catch (error) {
      console.error("Error :", error.message);
      setError("Failed to load folder.");
      navigate("/404");
    } finally {
      setLoading(false);
    }
  }, [folderId, user?.rootFolder, navigate]);

  const getFiles = useCallback(async () => {
    if (!folderId) return;
    try {
      const res = await api.get(`/file/all/${folderId}`);

      setFiles(res.data);
    } catch (error) {
      setError("Failed to load Files.");
      console.error("Error fetching files:", error);
    }
  }, [folderId, user?.rootFolder]);

  // Run on component mount or when folder/user changes
  useEffect(() => {
    if (user) {
      getFolders();
      getFiles();
    }
  }, [getFolders, getFiles, user]);

  // When the component mounts, you can set initial breadcrumbs if needed
  useEffect(() => {
    setBreadcrumbs([{ folderName: "Home", folderId: "" }]);
  }, []);

  // Create a new folder in the current folder
  const createFolder = async (name) => {
    try {
      await api.post(
        `/folder/create`,
        {
          name,
          parentFolder: folderId,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      getFolders();
    } catch (err) {
      console.error("Create folder error:", err);
    }
  };

  // Redirect to login page if user is not authenticated
  if (!user) {
    return (
      <>
        <div
          style={{ height: "calc(100vh - 4rem)" }}
          className="p-6 bg-base-200 flex justify-center items-center"
        >
          <h1 className="text-3xl text-center items-center justify-center font-bold">
            Login to access your drive
          </h1>
        </div>
      </>
    );
  }

  return (
    <div
      style={{ minHeight: "calc(100vh - 4rem)" }}
      className="p-6 bg-base-200"
    >
      <div className="container mx-auto">
        {/* Header: Upload and Create Folder controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <UploadFile parentFolder={folderId} onSuccess={getFiles} />
            <button
              className="btn btn-neutral"
              onClick={() => setShowCreateModal(true)}
            >
              Create Folder
            </button>
          </div>

          {loading && (
            <div className="w-full text-right">
              <span className="loading loading-spinner text-primary "></span>
            </div>
          )}
        </div>

        <hr className="mb-4 opacity-30" />

        {/* Breadcrumbs */}
        <div className="flex mb-4">
          <Breadcrumb
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
        </div>

        {/* Drive Items: List of folders and files */}
        <div className="flex flex-col gap-2">
          {!loading && folders.length === 0 && files.length === 0 && (
            <div className="flex flex-col text-9xl justify-center items-center">
              <FcEmptyTrash />
              <h1 className="text-xl">Folder is Empty</h1>
            </div>
          )}
          {folders.map((item) => (
            <Folder
              setBreadcrumbs={setBreadcrumbs}
              key={item._id}
              item={item}
              type={"folder"}
              setCurrentFolder={setCurrentFolder}
              onRename={getFolders}
              onDelete={getFolders}
            />
          ))}

          {files.map((item) => {
            return (
              <File
                key={item._id}
                item={item}
                onRename={getFiles}
                onDelete={getFiles}
              />
            );
          })}
        </div>
      </div>
      <ConfirmModal
        mode="create"
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        onConfirm={createFolder}
      />
    </div>
  );
};

export default HomePage;
