import { useRef, useState } from "react";
import api from "../../api/AxiosApi";

function UploadFile({ parentFolder, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Reset input value so selecting same file again triggers onChange
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadFiles = async () => {
    setUploading(true);
    const progress = {};

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("parentFolder", parentFolder);

      try {
        await api.post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            progress[file.name] = percent;
            setUploadProgress({ ...progress });
          },
        });

        progress[file.name] = 100;
        setUploadProgress({ ...progress });
      } catch (error) {
        console.error("Upload failed:", file.name, error);
        progress[file.name] = 0;
        setUploadProgress({ ...progress });
      }
    }

    setUploading(false);
    setFiles([]);
    setUploadProgress({});
    onSuccess();

    // Optionally close modal after upload
    document.getElementById("upload_modal").close();
  };

  const handleCloseModal = () => {
    setFiles([]);
    setUploadProgress({});
  };

  return (
    <>
      <button
        className="btn btn-neutral"
        onClick={() => document.getElementById("upload_modal").showModal()}
      >
        Upload File
      </button>

      <dialog id="upload_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-xl text-center mb-4">Upload Files</h3>

          <div
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer bg-base-200 hover:bg-base-300 transition"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current.click()}
          >
            <p className="text-gray-600 font-medium">
              Drag & Drop files here or click to select
            </p>
            <input
              type="file"
              multiple
              hidden
              ref={inputRef}
              onChange={handleFileSelect}
            />
          </div>

          <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="border p-2 rounded shadow-sm">
                <p className="text-sm font-medium">{file.name}</p>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded transition-all duration-300"
                    style={{
                      width: `${uploadProgress[file.name] || 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">
                  {uploadProgress[file.name] || 0}%
                </p>
              </div>
            ))}
          </div>

          <div className="modal-action flex justify-between mt-6">
            <button
              className="btn btn-success"
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <form method="dialog">
              <button className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UploadFile;
