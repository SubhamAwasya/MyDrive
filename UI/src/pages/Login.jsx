import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api/AxiosApi.jsx";
import HomeButtonTop from "../components/mini_components/HomeButtonTop.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useUser();

  // States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerMessage("");
    setServerError("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });

      setServerMessage("Login successful!");

      login(res.data.user, res.data.token); // Assuming `login()` stores user info/token
      navigate("/"); // Redirect to home
    } catch (err) {
      console.error("Login failed:", err);
      setServerError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base"
      >
        <h1 className="text-4xl font-extrabold text-center">Login</h1>

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          placeholder="Email"
        />
        {errors.email && <p className="text-error text-sm">{errors.email}</p>}

        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-error text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={isLoading ? "disabled" : ""}
          className="btn btn-neutral mt-4 w-full"
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Login
        </button>

        {serverMessage && (
          <p className="text-center mt-2 text-sm text-success">
            {serverMessage}
          </p>
        )}

        {serverError && (
          <p className="text-center mt-2 text-sm text-error">{serverError}</p>
        )}

        <p className="text-center mt-2">
          Don't have an account?{" "}
          <Link className="link" to="/register">
            Register
          </Link>
        </p>
      </form>
      <HomeButtonTop />
    </div>
  );
};

export default Login;
