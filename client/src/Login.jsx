
import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onLogin(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">C</div>
          <div>
            <h1>CampusCare</h1>
            <p>SMART CAMPUS MAINTENANCE</p>
          </div>
        </div>

        <h2>Welcome back</h2>
        <p className="login-subtitle">
          Sign in to manage and track your campus maintenance issues.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">{error}</p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to CampusCare"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="login-link"
            onClick={onShowRegister}
          >
            Register
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
