import { useState, useEffect } from "react";
import { MdDelete, MdErrorOutline } from "react-icons/md";

const ConfirmModal = ({
  mode = "create", // "create" | "rename" | "delete" | "view-fallback"
  type = "folder", // "folder" | "file"
  visible,
  setVisible,
  defaultName = "",
  onConfirm,
  serverMessage,
  serverError,
}) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  const close = () => setVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "view-fallback") {
      onConfirm(); // download instead of name
    } else if (mode !== "delete") {
      if (!name.trim()) return;
      onConfirm(name.trim());
    } else {
      onConfirm();
    }
    close();
  };

  const titleMap = {
    create: `Create New ${type}`,
    rename: `Rename ${type[0].toUpperCase() + type.slice(1)}`,
    delete: `Delete ${type[0].toUpperCase() + type.slice(1)}`,
    "view-fallback": `Cannot Preview ${type}`,
  };

  const confirmTextMap = {
    create: "Create",
    rename: "Rename",
    delete: "Delete",
    "view-fallback": "Download",
  };

  return (
    <dialog open={visible} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-md">
        <h3 className="font-bold text-xl text-center mb-4">{titleMap[mode]}</h3>

        {/* Input for create/rename */}
        {mode !== "delete" && mode !== "view-fallback" && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                {type[0].toUpperCase() + type.slice(1)} Name
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder={`Enter ${type} name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Warning for delete */}
        {mode === "delete" && (
          <div className="w-full flex justify-center items-center text-center">
            <MdDelete className="text-3xl mr-1" /> Are you sure you want to
            delete this {type}?
          </div>
        )}

        {/* View Fallback Warning */}
        {mode === "view-fallback" && (
          <div className="text-center text-yellow-600 flex flex-col items-center gap-2">
            <MdErrorOutline className="text-4xl" />
            <p>This file type cannot be previewed in the browser.</p>
            <p>Would you like to download it instead?</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-action mt-6">
          <form method="dialog" className="flex justify-between w-full">
            <button
              className={`btn ${
                mode === "delete" ? "btn-error" : "btn-neutral"
              }`}
              onClick={handleSubmit}
            >
              {confirmTextMap[mode]}
            </button>
            <button className="btn" onClick={close}>
              Cancel
            </button>
          </form>
        </div>

        {serverMessage && (
          <div className="alert alert-success mt-4">
            <span>{serverMessage}</span>
          </div>
        )}
        {serverError && (
          <div className="alert alert-error mt-4">
            <span>{serverError}</span>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default ConfirmModal;
