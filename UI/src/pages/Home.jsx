import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate, useParams } from "react-router-dom";

// Components
import Folder from "../components/Folder/Folder.jsx";
import UploadFile from "../components/File/UploadFile.jsx";
import File from "../components/File/File.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Breadcrumb from "../components/mini_components/Breadcrumb.jsx";
import SearchBar from "../components/SearchBar.jsx";

// Icons
import { FcEmptyTrash } from "react-icons/fc";

// Axios instance
import api from "../api/AxiosApi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const params = useParams();

  // Determine current folder ID from URL or user's root folder
  const folderId = params.folderId || user?.rootFolder;

  // State for folders, files, loading, error, search mode, breadcrumbs, and create modal visibility
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch folders for the current folder ID
  const getFolders = useCallback(async () => {
    if (!folderId) return;

    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/folder/${folderId}`);
      setFolders(res.data);
    } catch (error) {
      console.error("Error fetching folders:", error.message);
      setError("Failed to load folder.");
      navigate("/404");
    } finally {
      setLoading(false);
    }
  }, [folderId, navigate]);

  // Fetch files for the current folder ID
  const getFiles = useCallback(async () => {
    if (!folderId) return;

    try {
      const res = await api.get(`/file/all/${folderId}`);
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files.");
    }
  }, [folderId]);

  // Search folders and files by query
  const searchItems = useCallback(
    async (searchQuery) => {
      if (!user || !searchQuery) return;

      setLoading(true);
      setIsSearching(true);

      try {
        const resFolder = await api.get(`/folder/search/${searchQuery}`);
        const resFile = await api.get(`/file/search/${searchQuery}`);

        setFolders(resFolder.data);
        setFiles(resFile.data);
      } catch (error) {
        console.error("Error searching items:", error);
        setError("Failed to search items.");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Effect to load folders and files or perform search based on URL and user state
  useEffect(() => {
    if (!user) return;

    const path = window.location.pathname.split("/")[1];
    if (path === "search" && params.searchQuery) {
      setIsSearching(true);
      searchItems(params.searchQuery);
    } else {
      setIsSearching(false);
      getFolders();
      getFiles();
    }
  }, [getFolders, getFiles, user, params.searchQuery, searchItems]);

  // Initialize breadcrumbs on mount
  useEffect(() => {
    setBreadcrumbs([{ folderName: "Home", folderId: "" }]);
  }, []);

  // Create a new folder inside the current folder
  const createFolder = async (name) => {
    try {
      await api.post(
        "/folder/create",
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

  // If user is not authenticated, prompt login message
  if (!user) {
    return (
      <div
        style={{ height: "calc(100vh - 4rem)" }}
        className="p-6 bg-base-200 flex justify-center items-center"
      >
        <h1 className="text-3xl text-center font-bold">
          Login to access your drive
        </h1>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "calc(100vh - 4rem)" }}
      className="p-6 bg-base-200"
    >
      <div className="container mx-auto">
        {/* Controls: Search, Upload, Create Folder */}
        <div className="flex flex-col md:flex-row gap-2 justify-between mb-6">
          <SearchBar />
          <div className="flex gap-2">
            <UploadFile parentFolder={folderId} onSuccess={getFiles} />
            <button
              className="btn btn-neutral"
              onClick={() => setShowCreateModal(true)}
            >
              Create Folder
            </button>
          </div>
        </div>

        <hr className="mb-4 opacity-30" />

        {/* Breadcrumb navigation */}
        <div className="flex mb-4">
          <Breadcrumb
            breadcrumbs={breadcrumbs}
            setBreadcrumbs={setBreadcrumbs}
          />
          {loading && (
            <div className="text-right">
              <span className="loading loading-bars loading-xl"></span>
            </div>
          )}
        </div>

        {/* Display folders and files or empty state */}
        <div className="flex flex-col gap-2">
          {isSearching
            ? folders.length === 0 &&
              files.length === 0 && (
                <div className="flex flex-col text-9xl justify-center items-center">
                  <FcEmptyTrash />
                  <h1 className="text-xl">No Results Found</h1>
                </div>
              )
            : !loading &&
              folders.length === 0 &&
              files.length === 0 && (
                <div className="flex flex-col text-9xl justify-center items-center">
                  <FcEmptyTrash />
                  <h1 className="text-xl">Folder is Empty</h1>
                </div>
              )}
          {folders.map((item) => (
            <Folder
              key={item._id}
              item={item}
              type="folder"
              setBreadcrumbs={setBreadcrumbs}
              onRename={getFolders}
              onDelete={getFolders}
            />
          ))}
          {files.map((item) => (
            <File
              key={item._id}
              item={item}
              onRename={getFiles}
              onDelete={getFiles}
            />
          ))}
        </div>
      </div>

      {/* Modal to create new folder */}
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
