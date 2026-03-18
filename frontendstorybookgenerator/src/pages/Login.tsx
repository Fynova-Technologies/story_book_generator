import { useState } from "react";
import LoginImage from "../assets/images/ImageInLoginPage.webp";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import GoogleButton from "../components/Button/GoogleButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="flex min-h-screen w-full bg-light-bg dark:bg-dark-bg">

      {/* ── LEFT SIDE — Illustration ── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden rounded-r-3xl">
        <img
          src={LoginImage}
          alt="Storybook illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 flex flex-col bg-light-bg dark:bg-dark-bg px-8 md:px-14 xl:px-20">

        {/* Top Bar */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <button className="flex items-center gap-2 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back home
          </button>

          {/* Logo */}
          <span
            className="text-2xl text-light-text dark:text-dark-text"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Logo
          </span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto">

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-light-text dark:text-dark-text mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-light-outline dark:text-dark-text text-sm">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}

            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required={true}
                showAsterisk={true}
            />

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-light-text dark:text-dark-text">
                Password<span className="text-light-accent dark:text-dark-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-on-primary dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-outline-secondary dark:text-dark-text hover:text-light-text dark:hover:text-dark-primary transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    rememberMe
                      ? "bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary"
                      : "bg-transparent border-light-outline dark:border-dark-text"
                  }`}>
                    {rememberMe && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-light-text dark:text-dark-text">Remember me</span>
              </label>

              <button
                type="button"
                className="text-sm text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Log in Button */}

            <Button
                type = "submit"
                name = "Log in"
            /> 
            
            <GoogleButton/>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-light-outline dark:text-dark-text mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-light-text dark:text-dark-text font-semibold underline underline-offset-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Sign Up
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-light-outline-secondary dark:text-dark-text opacity-50">
            © 2025 Storyboard
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
