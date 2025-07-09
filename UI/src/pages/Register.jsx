import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/AxiosApi";
import { useUser } from "../context/UserContext";
import HomeButtonTop from "../components/mini_components/HomeButtonTop";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
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
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/user/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setServerMessage("Registration successful!");
      console.log("Registration response:", res.data);
    } catch (err) {
      console.error("Registration failed:", err.response);
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
        <h1 className="text-4xl font-extrabold text-center">Register</h1>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          placeholder="Name"
        />
        {errors.name && <p className="text-error text-sm">{errors.name}</p>}

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

        <label className="label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="text-error text-sm">{errors.confirmPassword}</p>
        )}

        <button
          type="submit"
          disabled={isLoading ? "disabled" : ""}
          className="btn btn-neutral mt-4 w-full"
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Register
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
          Already have an account?{" "}
          <Link className="link" to="/login">
            Login
          </Link>
        </p>
      </form>
      <HomeButtonTop />
    </div>
  );
};

export default Register;
