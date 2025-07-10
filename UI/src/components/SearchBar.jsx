import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  return (
    <form
      className="join"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
      }}
    >
      <div>
        <label className="input join-item">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
            placeholder="Search"
          />
        </label>
      </div>
      <button className="btn btn-neutral join-item">
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
