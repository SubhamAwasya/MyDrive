import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/AxiosApi.jsx";
import { useUser } from "../../context/UserContext.jsx";
import ConfirmModal from "../ConfirmModal.jsx";

// icons
import { FaFolder } from "react-icons/fa6";
import { FaEllipsisV } from "react-icons/fa";

const Folder = ({ item, onRename, onDelete, setBreadcrumbs }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //  Double-click to open folder
  const openFolder = () => {
    navigate(`/folder/${item._id}`);
    setBreadcrumbs((prev) => [
      ...prev,
      { folderId: item._id, folderName: item.name },
    ]);
  };

  const renameFolder = async (id, newName) => {
    try {
      await api.put(
        `/folder/rename/${id}`,
        { newName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      onRename?.();
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await api.delete(`/folder/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      onDelete?.(); // Tell parent to refresh
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      <div
        className="relative p-4 rounded-xl hover:bg-base-300 flex items-center gap-3"
        onDoubleClick={openFolder}
      >
        {/* Icon */}
        <div className="p-2 bg-base-200 rounded-lg">
          <FaFolder className="text-4xl" />
        </div>
        {/* File/Folder Info */}
        <div className="flex flex-col flex-1">
          <h2 className="font-medium text-lg truncate text-wrap">
            {item?.name || "Unnamed"}
          </h2>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex gap-2 items-end justify-end">
          <button className="btn btn-sm btn-neutral" onClick={openFolder}>
            Open
          </button>
          <button
            className="btn btn-sm btn-neutral"
            onClick={() => {
              setShowRenameModal(true);
            }}
          >
            Rename
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>

        {/* Mobile menu (3-dot) */}
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
              <button onClick={openFolder}>Open</button>
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

      <>
        <ConfirmModal
          mode="rename"
          visible={showRenameModal}
          setVisible={setShowRenameModal}
          defaultName={item.name || ""}
          onConfirm={(newName) => renameFolder(item._id, newName)}
        />

        <ConfirmModal
          mode="delete"
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          onConfirm={() => deleteFolder(item._id)}
        />
      </>

      {/* Divider for list view */}
      <hr className="my-2 opacity-10" />
    </>
  );
};

export default Folder;
