import { useEffect, useState } from "react";
const LoginImage = "/assets/images/ImageinLoginPage.png";
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
    <div className="flex h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg">

      {/* ── LEFT SIDE — Illustration ── */}
        <div className="hidden lg:block lg:w-[40%] xl:w-[40%] relative rounded-3xl m-3 overflow-hidden">
        <img
            src={LoginImage}
            alt="Storybook illustration"
            className="w-full h-full object-contain"
        />
        </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 flex flex-col bg-light-bg dark:bg-dark-bg px-8 md:px-10 xl:px-10 rounded-3xl my-3 mx-0">

        {/* Top Bar */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <Link to='/' className="flex items-center gap-2 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back home
          </Link>

          {/* Logo */}
          <span
            className="text-2xl text-light-text dark:text-dark-text items-center"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Logo
          </span>

          <div></div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-120 w-full mx-auto">

          {/* Heading */}
          <div className="items-center mb-8 mx-auto">
            <h1
              className="font-heading text-4xl font-bold text-light-text dark:text-dark-text mb-2"

            >
              Create an Account
            </h1>
            <p className="text-light-outline dark:text-dark-text text-sm">
              Sign up with your name, email and a password to start creating storybooks
            </p>
          </div>
          {needsConfirmation ? (
            <div className="text-center space-y-4">
              <p className="text-light-text dark:text-dark-text">
                Check your email to confirm your account, then log in.
              </p>
              <Link
                to='/login'
                className="inline-block text-light-text dark:text-dark-text font-semibold underline underline-offset-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
              >
                Go to log in
              </Link>
            </div>
          ) : (
          <>
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
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
                            className="w-4 h-3 border-4 rounded-2xl"
                          />
                        </div>
                        <span className="text-sm text-light-text dark:text-dark-text">Remember me</span>
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
          <p className="text-center text-sm text-light-outline dark:text-dark-text mt-6">
           Already have an account?{" "}
            <Link
              to='/login'
              className="text-light-text dark:text-dark-text font-semibold underline underline-offset-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Log in
            </Link>
          </p>
          </>
          )}
        </div>

        {/* Footer */}
        <div className="py-6">
          <p className="font-body text-sm text-light-text dark:text-dark-text">
            © 2025 Storyboard
          </p>
        </div>

      </div>
    </div>
  );

};


export default Signup;
