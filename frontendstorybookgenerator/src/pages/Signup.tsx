import { useState } from "react";
import LoginImage from "../assets/images/ImageinLoginPage.png";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import GoogleButton from "../components/Button/GoogleButton";
import { useForm,SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";


const Signup = () => {
   type FormData = {
      name:string;
      email: string;
      password:string;
    };
  const {handleSubmit,register,formState:{errors,isSubmitting}} = useForm<FormData>();
  const [rememberMe, setRememberMe] = useState(false)
  // const [email,setEmail] = useState(null)
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const handleLogin: SubmitHandler<FormData> = (data) => {
    console.log(data); // fully typed!
      try {
        dispatch(login({userData:{name:data.name,email:data.email}}));
        navigate("/dashboard");
      } catch (error) {
        console.log("Login error");
        
      }

  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-light-on-primary dark:bg-dark-bg">

      {/* ── LEFT SIDE — Illustration ── */}
        <div className="hidden lg:block lg:w-[40%] xl:w-[40%] relative rounded-3xl m-3 overflow-hidden">
        <img
            src={LoginImage}
            alt="Storybook illustration"
            className="w-full h-full object-contain"
        />
        </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex-1 flex flex-col bg-light-on-primary dark:bg-dark-bg px-8 md:px-10 xl:px-10 rounded-3xl my-3 mx-0">

        {/* Top Bar */}
        <div className="flex items-center justify-center pt-3 pb-6">
          {/* Logo */}
          <span
            className="text-2xl text-light-text dark:text-dark-text items-center"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Logo
          </span>
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
            <p className="text-bodytext-light-outline dark:text-dark-text text-sm">
              Enter your email and password to access your account
            </p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
             <InputField
                label="Name"
                type="text"
                placeholder="Enter your fullname"
                error={errors.name?.message}
                {...register("name", {
                  required: "Email is required",
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
                        name = "Register"
                        disabled={isSubmitting}
                    /> 
                    <GoogleButton/>
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

export default Signup;
