// @ts-check
import { useState } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8000";

/**
 * Login page component. Handles login form submission and updates user context.
 * @returns {import('react').ReactElement}
 */
export default function Login() {
  // Local state for error messages.
  const [error, setError] = useState("");
  // useUser provides refreshUser to update user context after login.
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  /**
   * Handles login form submission using React 19's form action pattern.
   * @param {FormData} formData
   * @returns {Promise<void>}
   */
  async function handleLogin(formData) {
    setError("");
    // Prepare login data from form fields.
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    // Call the backend login endpoint. 'credentials: "include"' sends cookies for session auth.
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      // On success, update user context and redirect to home.
      await refreshUser();
      navigate("/");
    } else {
      // On error, show error message from backend.
      const err = await res.json();
      setError(err.detail || "Login failed");
    }
  }

  return (
    <main>
      <h1>Login</h1>
      {/* Form uses React 19's action pattern for submission. */}
      <form action={handleLogin}>
        <label>
          Username:
          <input name="username" required />
        </label>
        <br />
        <label>
          Password:
          <input name="password" type="password" required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {/* Show error message if login fails. */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Add navigation links for users who need to sign up or forgot their password. */}
      Don't have an account? <Link to="/signup">Sign up here</Link>
    </main>
  );
}
