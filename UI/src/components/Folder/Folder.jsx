import { useState } from "react";
import { FaFolder, FaRegFile } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import api from "../../api/AxiosApi.jsx";
import { useUser } from "../../context/UserContext.jsx";
import ConfirmModal from "../ConfirmModal.jsx";

const Folder = ({ item, setCurrentFolder, onRename, onDelete }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //  Double-click to open folder
  const openFolder = () => {
    setCurrentFolder(item._id);
    navigate(`/folder/${item._id}`);
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
          <h2 className="font-medium text-lg truncate max-w-[200px]">
            {item?.name || "Unnamed"}
          </h2>
        </div>

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
