import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import InputField from "../components/InputField/Input";
import Button from "../components/Button/Button";
import { updatePassword } from "../services/authService";
import { RootState } from "../store/store";

// The reset email links here; Supabase reads the token from the URL and signs the user in
// (PASSWORD_RECOVERY), so a signed-in session means the link was valid.
const ResetPassword = () => {
  type FormData = {
    password: string;
    confirm: string;
  };
  const { handleSubmit, register, getValues, formState: { errors, isSubmitting } } = useForm<FormData>();
  const { status, authInitialized } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReset: SubmitHandler<FormData> = async (data) => {
    setError(null);
    try {
      await updatePassword(data.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Password update failed", err);
      setError("Couldn't update your password. Please try again, or request a new reset link.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-light-bg dark:bg-dark-bg px-8">
      <div className="max-w-[480px] w-full">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-light-text dark:text-dark-text mb-2">
            Set a new password
          </h1>
          <p className="text-light-outline dark:text-dark-text text-sm">
            Choose a new password for your account
          </p>
        </div>

        {!authInitialized ? (
          <p className="text-center text-light-text dark:text-dark-text">Loading...</p>
        ) : !status ? (
          <div className="text-center space-y-4">
            <p className="text-light-text dark:text-dark-text">
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
            <Link
              to="/login"
              className="inline-block text-light-text dark:text-dark-text font-semibold underline underline-offset-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors"
            >
              Go to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleReset)} className="space-y-5">
            <InputField
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat your new password"
              error={errors.confirm?.message}
              {...register("confirm", {
                required: "Please confirm your password",
                validate: (value) => value === getValues("password") || "Passwords don't match",
              })}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              name={isSubmitting ? "Saving..." : "Save new password"}
              disabled={isSubmitting}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
