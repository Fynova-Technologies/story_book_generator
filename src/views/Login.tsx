import { useEffect, useState } from "react";
const LoginImage = "/assets/images/ImageinLoginPage.png";
import Logo from "../components/Navbar/Logo";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import GoogleButton from "../components/Button/GoogleButton";
import { Link, useNavigate } from "react-router-dom";
import { useForm,SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, setError, setLoading } from "../store/slices/authSlice";
import { sendPasswordReset, signInWithEmail } from "../services/authService";
import { RootState } from "../store/store";


const Login = () => {
   type FormData = {
      email: string;
      password:string;
    };
  const {handleSubmit,register,getValues,trigger,formState:{errors,isSubmitting}} = useForm<FormData>();
  const [rememberMe, setRememberMe] = useState(true)
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state:RootState)=>state.auth.loading);
  const error = useSelector((state:RootState)=>state.auth.error);

  // Don't carry an error over from Signup or a previous visit.
  useEffect(() => { dispatch(setError(null)); }, [dispatch]);

  const handleAuthSuccess=(user: Parameters<typeof login>[0]["userData"]) => {
    dispatch(login({ userData: {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName,
      photoURL:    user.photoURL,
    }}));
    navigate("/dashboard");
  }
  const handleLogin: SubmitHandler<FormData> = async(data) => {
    dispatch(setLoading(true));
    try {
      const user = await signInWithEmail(data.email, data.password,rememberMe);
      handleAuthSuccess(user);
    } catch (error) {
      console.error("Login failed", error);
      dispatch(setError(error instanceof Error && error.message ? error.message : "Couldn't log in. Please try again."));
    } finally{
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage(null);
    if (!getValues("email") || !(await trigger("email"))) {
      setResetMessage("Enter your email above, then click \"Forgot password?\" again.");
      return;
    }
    setSendingReset(true);
    try {
      await sendPasswordReset(getValues("email"));
      setResetMessage("If an account exists for that email, we've sent a reset link.");
    } catch (error) {
      console.error("Password reset email failed", error);
      setResetMessage("Couldn't send the reset email. Please try again in a minute.");
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="flex min-h-screen lg:h-screen w-full p-3 md:p-4 gap-4">

      {/* ── LEFT SIDE — Illustration ── */}
      <div className="hidden lg:block lg:w-[48%] shrink-0 relative overflow-hidden rounded-3xl">
        <img
          src={LoginImage}
          alt="Storybook illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 min-w-0 flex flex-col px-2 sm:px-8 xl:px-16 lg:overflow-y-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 min-h-[72px]">
          <Link to='/' className="flex items-center gap-2 text-light-text hover:text-light-primary transition-colors text-base md:text-lg font-medium">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back home
          </Link>

          {/* Logo */}
          <Logo className="text-light-text" />

          <div className="hidden sm:block w-[130px]" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-[544px] w-full mx-auto py-10">

          {/* Heading */}
          <div className="mb-10 text-center">
            <h1
              className="font-heading text-4xl md:text-5xl font-bold text-light-text mb-6"
            >
              Welcome Back
            </h1>
            <p className="font-body text-light-text text-base md:text-xl">
              Enter your email and password to access your account
            </p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
             <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />

              {/* Password */}
              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Remember me + Forgot password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(prev=>!prev)}
                            className="w-4 h-4 accent-light-primary"
                          />
                        </div>
                        <span className="font-body text-base text-light-text">Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={sendingReset}
                        className="font-body text-base text-light-text hover:text-light-primary transition-colors"
                      >
                        {sendingReset ? "Sending..." : "Forgot password?"}
                      </button>
                    </div>
                    {resetMessage && <p className="text-sm text-light-text">{resetMessage}</p>}
                    <Button
                        type = "submit"
                        name = {`${loading ? "Logging in..." : "Log in"}`}
                        disabled={isSubmitting || loading}
                    /> 
                   
                  <GoogleButton />
            </form>

            {/* Sign Up Link */}
            <p className="text-center font-body text-base md:text-lg text-light-text mt-8">
              Don't have an account?{" "}
              <Link
                to='/signup'
                className="text-light-text underline underline-offset-4 hover:text-light-primary transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="py-6">
            <p className="font-body text-sm text-light-text">
              © 2026 Storybook AI
            </p>
          </div>

      </div>
    </div>
  );
};

export default Login;
