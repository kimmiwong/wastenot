import { useState } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import wastenot from "../assets/WasteNotLogo.png";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Login() {
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setError("");
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    const res = await fetch(`${apiHost}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await refreshUser();
      navigate("/Home");
    } else {
      const err = await res.json();
      setError(err.detail || "Login failed");
    }
  }

  // Signup form submit handler
  async function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setError("");
    const username = formData.get("username");
    const password = formData.get("password");
    const password2 = formData.get("password2");
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    const data = { username, password };
    const res = await fetch(`${apiHost}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await refreshUser();
      navigate("/Home");
    } else {
      const err = await res.json();
      setError(err.detail || "Signup failed");
    }
  }

  return (
    <div className="container">
      <div className="login-panel">
        <img src={wastenot} alt="WasteNot Logo" className="logo" />
        <h1 className="title">Welcome to WasteNot</h1>

        {showSignup ? (
          <form className="login-form" onSubmit={handleSignup}>
            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input id="username" name="username" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input id="password" name="password" type="password" required />
            </div>
            <div className="input-group">
              <label htmlFor="password2" className="label-multiline">
                Confirm
                Password:
              </label>
              <input id="password2" name="password2" type="password" required />
            </div>
            <button type="submit" className="login-btn">
              Sign Up
            </button>
            {error && (
              <div style={{ color: "red", whiteSpace: "pre-line" }}>
                {error}
              </div>
            )}
            <p className="signup-text">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowSignup(false);
                }}
                className="toggle-link"
              >
                Login
              </button>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input id="username" name="username" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input id="password" name="password" type="password" required />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {error && (
              <div style={{ color: "red", whiteSpace: "pre-line" }}>
                {error}
              </div>
            )}

            <p className="signup-text">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowSignup(true);
                }}
                className="toggle-link"
              >
                Sign up here
              </button>
            </p>
          </form>
        )}
      </div>

      <div className="visual-panel">
        <h1>An app to reduce food waste in every kitchen</h1>
      </div>
    </div>
  );
}
