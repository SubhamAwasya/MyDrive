import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; // if you want to redirect
import { formatBytes } from "../helper/utils.js";
import { FaCircleUser } from "react-icons/fa6";

function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();



  useEffect(() => {
    console.log(user);
    // Optional: Redirect to login if no user
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 flex items-center justify-center p-4" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <figure className="px-10 pt-10">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
               <FaCircleUser className="text-neutral w-full h-full" />
            </div>
          </div>
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-xl">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="w-full mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Storage Used</span>
              <span>{formatBytes(user?.driveUsedSize)} / {formatBytes(user?.driveMaxSize)}</span>
            </div>
            <progress className="progress progress-primary w-full" value={user?.driveUsedSize} max={user?.driveMaxSize}></progress>
          </div>

       
        </div>
      </div>
    </div>
  );
}

export default Profile;