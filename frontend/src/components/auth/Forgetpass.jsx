import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";



const Forgetpass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

 const onSubmit = async (data) => {
  const { data: response, error } =
    await authClient.requestPasswordReset({
      email: data.email.trim().toLowerCase(),
      redirectTo: "https://ims-five-rho.vercel.app/reset-password",
    });

  if (error) {
    toast.error(error.message || "Something went wrong");
    return;
  }

  toast.success("Password reset email sent!");
  reset();
};

  return (
    /* Main Wrapper: Forced Theme (Light Mode Lock) */
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-white text-slate-900 selection:bg-[#6D28D9] selection:text-white">

      {/* Right Side Form Container */}
      <div className="lg:col-span-3 flex items-center justify-center bg-white px-8 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-lg">
          
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Forgot Password?
            </h2>

            <p className="mt-3 text-center text-base sm:text-lg text-slate-500">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Send Reset Link Button */}
            <Button
              type="submit"
              className="h-14 w-full rounded-xl bg-[#6D28D9] text-lg font-semibold text-white hover:bg-[#5B21B6] cursor-pointer"
            >
              Send Reset Link
            </Button>

            {/* Back to Login Button */}
            <Link to="/login" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="h-14 w-full rounded-xl border-slate-300 bg-white text-lg font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              >
                Back to Login
              </Button>
            </Link>

          </form>
        </div>
      </div>

    </div>
  );
};

export default Forgetpass;