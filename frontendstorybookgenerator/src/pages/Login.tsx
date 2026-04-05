import { useState } from "react";
import LoginImage from "../assets/images/ImageinLoginPage.png";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import GoogleButton from "../components/Button/GoogleButton";
import { Link, useNavigate } from "react-router-dom";
import { useForm,SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, setError, setLoading } from "../store/slices/authSlice";
import { signInWithEmail,signInWithGoogle } from "../firebase/authService";
import { RootState } from "../store/store";


const Login = () => {
   type FormData = {
      email: string;
      password:string;
    };
  const {handleSubmit,register,formState:{errors,isSubmitting}} = useForm<FormData>();
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state:RootState)=>state.auth.loading);
  const error = useSelector((state:RootState)=>state.auth.error);

  const handleAuthSuccess=(user:any) => {
    dispatch(login({ userData: {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName,
      photoURL:    user.photoURL,
    }}));
    navigate("/dashboard");
  }
  const handleLogin: SubmitHandler<FormData> = async(data) => {
    // console.log(data); // fully typed!
    dispatch(setLoading(true));
    try {
      const user = await signInWithEmail(data.email, data.password);
      // console.log(user);
      handleAuthSuccess(user);
    } catch (error: any) {
      // console.log("Login error",error);
      dispatch(setError(error.message));
    }
  };

  const GoogleLogin = async() => {
     dispatch(setLoading(true));
    try{
      const user = await signInWithGoogle();
      // console.log(user.displayName,user.photoURL);
      handleAuthSuccess(user);
      navigate("/dashboard");
    }catch(error: any){
      // console.log("Google login error");
      dispatch(setError(error.message));
    }

  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg">

      {/* ── LEFT SIDE — Illustration ── */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[40%] relative overflow-hidden rounded-3xl m-3">
        <img
          src={LoginImage}
          alt="Storybook illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 flex flex-col bg-light-bg dark:bg-dark-bg px-8 md:px-10 xl:px-10 rounded-3xl my-3">

        {/* Top Bar */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <Link to='/'>
          <button className="flex items-center gap-2 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back home
          </button>
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
        <div className="flex-1 flex flex-col justify-center max-w-[480px] w-full mx-auto">

          {/* Heading */}
          <div className="items-center mb-8 mx-auto text-center">
            <h1
              className="font-heading text-4xl font-bold text-light-text dark:text-dark-text mb-2"
            >
              Welcome Back
            </h1>
            <p className="text-light-outline dark:text-dark-text text-sm">
              Enter your email and password to access your account
            </p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                            className="w-4 h-3 border-4 rounded-2xl"
                          />
                        </div>
                        <span className="text-sm text-light-text dark:text-dark-text">Remember me</span>
                      </label>

                      <div
                        className="text-sm text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                      >
                        Forgot password?
                      </div>
                    </div>
                    <Button
                        type = "submit"
                        name = {`${loading ? "Logging in..." : "Log in"}`}
                        disabled={isSubmitting || loading}
                    /> 
                   
                  <GoogleButton
                    loading={loading} 
                    onClick= {() => GoogleLogin()}
                    />
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-light-outline dark:text-dark-text mt-6">
              Don't have an account?{" "}
              <Link
                to='/signup'
                className="text-light-text dark:text-dark-text font-semibold underline underline-offset-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className=" py-6">
            <p className="font-body text-sm text-light-text dark:text-dark-text">
              © 2025 Storyboard
            </p>
          </div>

      </div>
    </div>
  );
};

export default Login;
