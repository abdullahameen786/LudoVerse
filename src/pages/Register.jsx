import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignup}
          className="mt-4 w-full rounded-xl border py-3"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;