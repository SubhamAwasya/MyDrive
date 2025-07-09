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

  const baseUrl = "http://localhost:3000"; // Or use import.meta.env.VITE_API_BASE
  const fullUrl = `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`;

  const handleView = () => {
    const viewableTypes = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "mp4",
      "mov",
      "webm",
    ];

    if (viewableTypes.includes(item.type.toLowerCase())) {
      window.open(fullUrl, "_blank");
    } else {
      setShowViewModal(true);
    }
  };

  const handleDownload = async () => {
    try {
      const filename = item.name;
      const response = await api.get(item.url, {
        responseType: "blob", // 👈 Important: treat it as a file
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Create blob and download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // 👈 Force download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Cleanup
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const renameFile = async (id, newName) => {
    try {
      await api.put(
        `/file/rename`,
        { newName, id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      onRename?.();
    } catch (err) {
      console.error("Rename file failed", err);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/file/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      onDelete?.();
    } catch (err) {
      console.error("Delete file failed", err);
    }
  };

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  return (
    <>
      <div
        className="relative p-4 rounded-xl hover:bg-base-300 flex items-center gap-3"
        onDoubleClick={handleView}
      >
        {/* Icon */}
        <div className="p-2 bg-base-200 rounded-lg">
          <FaRegFile className="text-3xl" />
        </div>

        {/* File Info */}
        <div className="flex flex-col flex-1">
          <h2 className="font-medium text-lg truncate ">
            {item?.name || "Unnamed File"}
          </h2>
          <p className="text-sm text-gray-500">
            {item?.type?.toUpperCase()} • {formatFileSize(item?.size || 0)}
          </p>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex gap-2">
          <button className="btn btn-sm btn-neutral" onClick={handleView}>
            View
          </button>
          <button className="btn btn-sm btn-neutral" onClick={handleDownload}>
            Download
          </button>
          <button
            className="btn btn-sm btn-neutral"
            onClick={() => setShowRenameModal(true)}
          >
            Rename
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>

        {/* Mobile 3-dot dropdown */}
        <div className="dropdown dropdown-end sm:hidden ml-auto">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-ghost text-xl"
          >
            <FaEllipsisV />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={handleView}>View</button>
            </li>
            <li>
              <button onClick={handleDownload}>Download</button>
            </li>
            <li>
              <button onClick={() => setShowRenameModal(true)}>Rename</button>
            </li>
            <li>
              <button onClick={() => setShowDeleteModal(true)}>Delete</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Rename & Delete Modals */}
      <ConfirmModal
        type="file"
        mode="rename"
        visible={showRenameModal}
        setVisible={setShowRenameModal}
        defaultName={item.name || ""}
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
          link.download = item.name;
          link.click();
        }}
      />

      {/* Divider */}
      <hr className="my-2 opacity-10" />
    </>
  );
};

export default File;
