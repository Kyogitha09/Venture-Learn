import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  authenticateUser,
  registerUser,
  saveSessionUser,
} from "../services/storage.js";
import { useTheme } from "../components/theme/ThemeProvider.jsx";
import {
  accountTypes,
  normalizeAllowedValue,
  validateEmail,
  validateLoginForm,
  validateRegistrationForm,
} from "../services/validation.js";

const titleWords = ["Venture", "Learn"];

export default function Landing() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    organization: "",
    role: "",
    userType: "",
    linkedinUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setResetMessage("");
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setError("");
    setResetMessage("");
    setForm((current) => ({
      ...current,
      userType: nextMode === "login" ? current.userType : current.userType || "",
    }));
  }

  function handleForgotPassword() {
    const emailError = validateEmail(form.email);

    if (emailError) {
      setResetMessage("Enter your email address first to begin password reset.");
      return;
    }

    setError("");
    setResetMessage("Secure password reset emails need Firebase Auth or a backend mail service. The current local-only login cannot send real reset emails yet.");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = form.email.trim().toLowerCase();
    const validationError =
      mode === "login"
        ? validateLoginForm(form)
        : validateRegistrationForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (mode === "register") {
      const normalizedUserType = form.userType;
      const resolvedName =
        normalizedUserType === "user"
          ? `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
          : form.name;

      const response = registerUser({
        name: resolvedName,
        firstName: form.firstName,
        lastName: form.lastName,
        email: normalizedEmail,
        organization: form.organization,
        role: form.role,
        userType: normalizedUserType,
        linkedinUrl: form.linkedinUrl,
        password: form.password,
      });

      if (!response.ok) {
        const registerErrors = {
          exists: "An account with this email already exists.",
          linkedin: "Enter a valid LinkedIn profile URL.",
          invalid: "Check the registration form and try again.",
          type: "Choose a valid account type.",
        };

        setError(registerErrors[response.reason] ?? "Could not create the account right now.");
        return;
      }

      saveSessionUser({
        ...response.user,
        mode,
      });
      setError("");
      navigate("/home");
      return;
    }

    const loginResponse = authenticateUser(normalizedEmail, form.password, form.userType);

    if (!loginResponse.ok) {
      const loginErrors = {
        invalid: "Enter a valid email and password first.",
        missing: "No account was found for this email.",
        password: "Incorrect password. Try again.",
        type: "That account type does not match this email. Choose Startup or Investor correctly.",
      };

      setError(loginErrors[loginResponse.reason] ?? "Could not sign you in right now.");
      return;
    }

    setError("");
    saveSessionUser({
      ...loginResponse.user,
      mode,
    });
    navigate("/home");
  }

  return (
    <main className="entry-page">
      <div className="ambient-orb ambient-orb--one" />
      <div className="ambient-orb ambient-orb--two" />
      <div className="entry-beam entry-beam--left" />
      <div className="entry-beam entry-beam--right" />

      <div className="entry-grid">
        <motion.section
          className="entry-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h1 className="entry-title">
            {titleWords.map((word, index) => (
              <motion.span
                key={word}
                className="entry-title-word"
                initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 + index * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="entry-description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
          >
            Smarter venture practice for social founders.
          </motion.p>
        </motion.section>

        <motion.section
          className="auth-card"
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        >
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "auth-tab is-active" : "auth-tab"}
              type="button"
              onClick={() => handleModeChange("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "auth-tab is-active" : "auth-tab"}
              type="button"
              onClick={() => handleModeChange("register")}
            >
              Register
            </button>
          </div>

          <div className="auth-copy">
            <span className="card-kicker">{mode === "login" ? "Welcome back" : "Create account"}</span>
            <h2 className="card-title">{mode === "login" ? "Sign in" : "Join VentureLearn"}</h2>
            <p className="card-copy">{mode === "login" ? "Access your workspace." : "Set up your profile."}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === "login" ? (
              <label className="field field--full-inline">
                <span>Login as</span>
                <select
                  className="select--account-type"
                  value={form.userType}
                  onChange={(event) =>
                    updateField("userType", normalizeAllowedValue(event.target.value, accountTypes, ""))
                  }
                >
                  <option value="" disabled>Select account type</option>
                  <option value="owner">Startup</option>
                  <option value="investor">Investor</option>
                  <option value="user">User</option>
                </select>
              </label>
            ) : null}

            {mode === "register" ? (
              <div className="auth-grid">
                <label className="field field--full-inline">
                  <span>Account type</span>
                  <select
                    className="select--account-type"
                    value={form.userType}
                    onChange={(event) =>
                      updateField("userType", normalizeAllowedValue(event.target.value, accountTypes, ""))
                    }
                  >
                    <option value="" disabled>Select account type</option>
                    <option value="owner">Startup</option>
                    <option value="investor">Investor</option>
                    <option value="user">User</option>
                  </select>
                </label>

                {form.userType === "user" ? (
                  <>
                    <label className="field">
                      <span>First name</span>
                      <input
                        autoComplete="given-name"
                        maxLength={40}
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        placeholder="Your first name"
                      />
                    </label>

                    <label className="field">
                      <span>Last name</span>
                      <input
                        autoComplete="family-name"
                        maxLength={40}
                        value={form.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        placeholder="Your last name"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="field">
                      <span>Full name</span>
                      <input
                        autoComplete="name"
                        maxLength={80}
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Your full name"
                      />
                    </label>

                    <label className="field">
                      <span>Role</span>
                      <input
                        autoComplete="organization-title"
                        maxLength={80}
                        value={form.role}
                        onChange={(event) => updateField("role", event.target.value)}
                        placeholder="Founder, student, operator"
                      />
                    </label>

                    <label className="field field--full-inline">
                      <span>Organization name</span>
                      <input
                        autoComplete="organization"
                        maxLength={120}
                        value={form.organization}
                        onChange={(event) => updateField("organization", event.target.value)}
                        placeholder="College, incubator, startup, fund, or team"
                      />
                    </label>
                  </>
                )}

                {form.userType === "investor" ? (
                  <label className="field field--full-inline">
                    <span>Organization's LinkedIn URL</span>
                    <input
                      type="url"
                      maxLength={200}
                      value={form.linkedinUrl}
                      onChange={(event) => updateField("linkedinUrl", event.target.value)}
                      placeholder="https://www.linkedin.com/in/your-profile"
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="name@example.com"
              />
            </label>

            <div className="auth-grid">
              <label className={mode === "login" ? "field field--full-inline" : "field"}>
                <span>Password</span>
                <input
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  maxLength={64}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Enter password"
                />
              </label>

              {mode === "register" ? (
                <label className="field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    maxLength={64}
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    placeholder="Confirm password"
                  />
                </label>
              ) : null}
            </div>

            {mode === "login" ? (
              <button className="auth-reset-link" type="button" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            ) : null}

            {error ? <p className="form-error">{error}</p> : null}
            {resetMessage ? <p className="helper-copy auth-reset-message">{resetMessage}</p> : null}

            <button className="button button--primary auth-submit" type="submit">
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
