// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FolderNotFound404 from "./pages/FolderNotFound404";
import AboutMe from "./pages/AboutMe";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/folder" element={<Home />} />
          <Route path="/folder/:folderId" element={<Home />} />
          <Route path="/search/:searchQuery" element={<Home />} />
          <Route path="/404" element={<FolderNotFound404 />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutMe" element={<AboutMe />} />
      </Routes>
    </Router>
  );
};

export default App;
