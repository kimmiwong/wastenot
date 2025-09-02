import { useState, useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate, Link } from "react-router-dom";
import wastenot from "../assets/WasteNotLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Login() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const signupParam = searchParams.get("signup");
  const [showSignup, setShowSignup] = useState(signupParam === "true");
  const [error, setError] = useState("");
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPassword2, setShowSignupPassword2] = useState(false);

  useEffect(() => {
    fetch(`${apiHost}/api/logout`, {
      method: "GET",
      credentials: "include",
    });
  }, []);

  useEffect(() => {
    if (location.state?.showSignup) {
      setShowSignup(true);
    }
  }, [location.state]);

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
      if (Array.isArray(err.detail)) {
        setError(err.detail[0]?.msg || "Invalid input");
      } else {
        setError(err.detail || "Login failed");
      }
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
    const security_question = formData.get("security_question");
    const security_answer = formData.get("security_answer")?.trim()
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    const data = { username, password, security_question, security_answer };
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
              <label htmlFor="username">Email:</label>
              <div className="password-wrapper">
                <input id="username" name="username" type="email" required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showSignupPassword ? "text" : "password"}
                  required
                />
                <FontAwesomeIcon
                  icon={showSignupPassword ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password2" className="label-multiline">
                Confirm Password:
              </label>
              <div className="password-wrapper">
                <input
                  id="password2"
                  name="password2"
                  type={showSignupPassword2 ? "text" : "password"}
                  required
                />
                <FontAwesomeIcon
                  icon={showSignupPassword2 ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={() => setShowSignupPassword2((prev) => !prev)}
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="security_question">Security question</label>
              <select id="security_question" name="security_question" required>
                <option value="">Select a question…</option>
                <option>What is your favorite color?</option>
                <option>What city were you born in?</option>
                <option>What is your first pet’s name?</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="security_answer">Security answer</label>
              <input id="security_answer" name="security_answer" required />
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
              <label htmlFor="username">Email:</label>
              <div className="password-wrapper">
                <input id="username" name="username" type="email" required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
            {error && (
              <div style={{ color: "red", whiteSpace: "pre-line" }}>
                {error}
              </div>
            )}
            <p> <Link to="/ResetPassword">
         Forgot Password?
        </Link></p>

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
