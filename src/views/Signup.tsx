import { useEffect, useState } from "react";
const LoginImage = "/assets/images/ImageinLoginPage.png";
import Logo from "../components/Navbar/Logo";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import GoogleButton from "../components/Button/GoogleButton";
import { useForm,SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login, setError, setLoading } from "../store/slices/authSlice";
import { signUpWithEmailAndPassword } from "../services/authService";
import { RootState } from "../store/store";


const Signup = () => {
   type FormData = {
      name:string;
      email: string;
      password:string;
    };
  const {handleSubmit,register,formState:{errors,isSubmitting}} = useForm<FormData>();
  const [rememberMe, setRememberMe] = useState(true)
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const loading = useSelector((state:RootState)=>state.auth.loading);
  const error = useSelector((state:RootState)=>state.auth.error);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Don't carry an error over from Login or a previous visit.
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

  const handleSignup: SubmitHandler<FormData> = async(data) => {
     dispatch(setLoading(true));
      try {
        const result = await signUpWithEmailAndPassword(data.email,data.password,rememberMe,data.name);
        if (result.needsConfirmation) setNeedsConfirmation(true);
        else handleAuthSuccess(result.user);
      } catch (error) {
        console.error("Signup failed", error);
        dispatch(setError(error instanceof Error && error.message ? error.message : "Couldn't create your account. Please try again."));
      } finally{
        dispatch(setLoading(false));
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
              Create an Account
            </h1>
            <p className="font-body text-light-text text-base md:text-xl">
              Sign up with your name, email and a password to start creating storybooks
            </p>
          </div>
          {needsConfirmation ? (
            <div className="text-center space-y-4">
              <p className="text-light-text">
                Check your email to confirm your account, then log in.
              </p>
              <Link
                to='/login'
                className="inline-block text-light-text font-semibold underline underline-offset-2 hover:text-light-primary transition-colors"
              >
                Go to log in
              </Link>
            </div>
          ) : (
          <>
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
             <InputField
                label="Name"
                type="text"
                placeholder="Enter your fullname"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                })}
              />
            {/* Email */}
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
              {/* Remember me */}
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
                    </div>
                    <Button
                        type = "submit"
                        name = {`${loading ? "Signing up..." : "Register"}`}
                        disabled={loading||isSubmitting}
                    /> 
                    <GoogleButton />
            </form>

          {/* Sign Up Link */}
          <p className="text-center font-body text-base md:text-lg text-light-text mt-8">
           Already have an account?{" "}
            <Link
              to='/login'
              className="text-light-text underline underline-offset-4 hover:text-light-primary transition-colors"
            >
              Log in
            </Link>
          </p>
          </>
          )}
        </div>

        {/* Footer */}
        <div className="py-6">
          <p className="font-body text-base text-light-text">
            © 2026 Storybook AI
          </p>
        </div>

      </div>
    </div>
  );

};


export default Signup;
