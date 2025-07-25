import { useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import api from "../../api/AxiosApi.jsx";
import ConfirmModal from "../ConfirmModal.jsx";

// icons
import { FaRegFile } from "react-icons/fa6";
import { FaEllipsisV } from "react-icons/fa";

const File = ({ item, onRename, onDelete }) => {
  const { user } = useUser();

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:3000";
  const fullUrl = `${baseUrl}${item.url?.startsWith("/") ? "" : "/"}${item.url}`;

  const viewableTypes = ["pdf", "jpg", "jpeg", "png", "gif", "mp4", "mov", "webm"];

  const handleView = () => {
    if (viewableTypes.includes(item?.type?.toLowerCase())) {
      window.open(fullUrl, "_blank");
    } else {
      setShowViewModal(true);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(item.url, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", item.name || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const renameFile = async (id, newName) => {
    try {
      await api.put("/file/rename", { newName, id });
      onRename?.();
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/file/${id}`);
      onDelete?.();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <>
      <div
        className="relative p-4 rounded-xl hover:bg-base-300 flex items-center gap-3"
        onDoubleClick={handleView}
      >
        <div className="p-2 bg-base-200 rounded-lg">
          <FaRegFile className="text-3xl" />
        </div>

        <div className="flex flex-col flex-1">
          <h2 className="font-medium text-lg truncate">{item?.name || "Unnamed File"}</h2>
          <p className="text-sm text-gray-500">
            {item?.type?.toUpperCase()} • {formatFileSize(item?.size)}
          </p>
        </div>

        <div className="hidden sm:flex gap-2">
          <button className="btn btn-sm btn-neutral" onClick={handleView}>
            View
          </button>
          <button className="btn btn-sm btn-neutral" onClick={handleDownload}>
            Download
          </button>
          <button className="btn btn-sm btn-neutral" onClick={() => setShowRenameModal(true)}>
            Rename
          </button>
          <button className="btn btn-sm btn-error" onClick={() => setShowDeleteModal(true)}>
            Delete
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className="dropdown dropdown-end sm:hidden ml-auto">
          <div tabIndex={0} role="button" className="btn btn-sm btn-ghost text-xl">
            <FaEllipsisV />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li><button onClick={handleView}>View</button></li>
            <li><button onClick={handleDownload}>Download</button></li>
            <li><button onClick={() => setShowRenameModal(true)}>Rename</button></li>
            <li><button onClick={() => setShowDeleteModal(true)}>Delete</button></li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        type="file"
        mode="rename"
        visible={showRenameModal}
        setVisible={setShowRenameModal}
        defaultName={item?.name || ""}
        onConfirm={(newName) => renameFile(item._id, newName)}
      />

      <ConfirmModal
        type="file"
        mode="delete"
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onConfirm={() => deleteFile(item._id)}
      />

      <ConfirmModal
        mode="view-fallback"
        type="file"
        visible={showViewModal}
        setVisible={setShowViewModal}
        onConfirm={() => {
          const link = document.createElement("a");
          link.href = fullUrl;
          link.setAttribute("download", item.name);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
      />

      <hr className="my-2 opacity-10" />
    </>
  );
};

export default File;