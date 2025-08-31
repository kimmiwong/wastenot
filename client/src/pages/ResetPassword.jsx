import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [step, setStep] = useState("email");
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const apiHost = import.meta.env.VITE_API_HOST;
  const navigate = useNavigate();

  function validatePassword(pw) {
    const problems = [];
    if (pw.length < 8) problems.push("• Password must be at least 8 characters long");
    if (!/[A-Z]/.test(pw)) problems.push("• Password must contain at least one uppercase letter");
    if (!/\d/.test(pw)) problems.push("• Password must contain at least one number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) problems.push("• Password must contain at least one special character");
    return problems;
  }

  async function fetchQuestion(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!username) {
        setErr("Please enter your email.");
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiHost}/api/security-question?username=${encodeURIComponent(username)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) {
            setErr("User not found.");
        } else {
            const data = await res.json().catch(() => ({}));
            const msg = Array.isArray(data?.detail) ? data.detail[0]?.msg : (data?.detail || "Unable to fetch security question.");
            setErr(msg);
        }
        return;
      }

      const data = await res.json()
      if(!data.security_question) {
        setErr("No security question available for this account.");
        return;
      }

      setQuestion(data.security_question || "Answer your saved security question.");
      setInfo("Security question found.");
      setStep("answer");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyAnswer(e) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (!answer) { setErr("Please enter your answer."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${apiHost}/api/reset-password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, security_answer: answer }),
      });
      if (!res.ok) {
        setErr("Incorrect answer, try again.");
        return;
      }
      setInfo("Answer verified.");
      setStep("password");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitNewPassword(e) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (!newPw || !confirmPw) { setErr("Please enter and confirm your new password."); return; }
    if (newPw !== confirmPw) { setErr("Passwords do not match."); return; }
    const issues = validatePassword(newPw);
    if (issues.length) { setErr(issues.join("\n")); return; }

    setLoading(true);
    try {
      const res = await fetch(`${apiHost}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, security_answer: answer, new_password: newPw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = Array.isArray(data?.detail) ? data.detail.map(d => d.msg).join("\n") : (data?.detail || "Reset failed.");
        setErr(msg);
        return;
      }
      setInfo("Password updated successfully. Redirecting to login…");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 460, margin: "2rem auto" }}>
      <h1>Reset Password</h1>
      {err && <p style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{err}</p>}
      {info && <p style={{ color: "seagreen", whiteSpace: "pre-wrap" }}>{info}</p>}

      {step === "email" && (
        <form onSubmit={fetchQuestion} style={{ display: "grid", gap: 12 }}>
          <p>Enter your email to fetch your security question.</p>
          <label>
            Email
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Loading…" : "Get Security Question"}
          </button>
        </form>
      )}

      {step === "answer" && (
        <form onSubmit={verifyAnswer} style={{ display: "grid", gap: 12 }}>
          <label>Security Question</label>
          <div style={{ background: "#f6f6f6", padding: "8px 10px", borderRadius: 6 }}>{question}</div>
          <label>
            Your Answer
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} required />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setStep("email")} disabled={loading}>Back</button>
            <button type="submit" disabled={loading}>{loading ? "Checking…" : "Verify Answer"}</button>
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={submitNewPassword} style={{ display: "grid", gap: 12 }}>
          <label>
            New Password
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setStep("answer")} disabled={loading}>Back</button>
            <button type="submit" disabled={loading}>{loading ? "Updating…" : "Reset Password"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
