// @ts-check
import { useState } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:8000";

/**
 * Signup page component. Handles signup form submission and updates user context.
 * @returns {import('react').ReactElement}
 */
export default function Signup() {
  // Local state for error messages.
  const [error, setError] = useState("");
  // useUser provides refreshUser to update user context after signup.
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  /**
   * Handles signup form submission using React 19's form action pattern.
   * @param {FormData} formData
   * @returns {Promise<void>}
   */
  async function handleSignup(formData) {
    setError("");
    // Prepare signup data from form fields.
    const username = formData.get("username");
    const password = formData.get("password");
    const password2 = formData.get("password2");
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    const data = {
      username,
      password,
    };
    // Call the backend signup endpoint. 'credentials: "include"' sends cookies for session auth.
    const res = await fetch(`${API_BASE}/api/signup`, {
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
      setError(err.detail || "Signup failed");
    }
  }

  return (
    <main>
      <h1>Sign Up</h1>
      {/* Form uses React 19's action pattern for submission. */}
      <form action={handleSignup}>
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
        <label>
          Confirm Password:
          <input name="password2" type="password" required />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      {/* Show error message if signup fails. */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Add navigation links for users who need to login or forgot their password. */}
      Already have an account? <Link to="/login">Login here</Link>
    </main>
  );
}
