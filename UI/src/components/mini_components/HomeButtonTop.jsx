import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function HomeButtonTop() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="btn btn-circle btn-neutral shadow-lg fixed bottom-4 right-4 z-50 hover:scale-105 transition-transform duration-200"
      title="Go to Home"
    >
      <AiFillHome className="text-2xl" />
    </button>
  );
}

export default HomeButtonTop;
