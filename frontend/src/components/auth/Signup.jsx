import React from "react";

import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "../ui/button";

import { authClient } from "../../lib/auth-client.js";

import AuthSidePanel from "./AuthSidePanel";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const { data: response, error } =
      await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        callbackURL:
          "https://ims-five-rho.vercel.app/login",
      });

    if (error) {
      toast.error(
        error.message || "Signup failed"
      );
      return;
    }

    // Existing unverified user case
    if (response?.token === null) {
      toast.error(
        "This email already exists. Please verify your email or login."
      );
      return;
    }

    toast.success("Verification email sent!");
    reset();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#6D28D9] selection:text-white">
      <div className="flex min-h-screen">

        {/* LEFT SIDE */}
        <AuthSidePanel />

        {/* RIGHT SIDE */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-lg">

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-center text-sm text-slate-500">
                Get started with your inventory workspace
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Minimum 3 characters",
                    },
                  })}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email", {
                    required:
                      "Email is required",
                    pattern: {
                      value:
                        /^\S+@\S+\.\S+$/,
                      message:
                        "Invalid email",
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...register("password", {
                    required:
                      "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Minimum 6 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                      message:
                        "Password must contain at least one letter and one number",
                    },
                  })}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="h-14 w-full cursor-pointer rounded-xl bg-[#6D28D9] text-lg font-semibold text-white hover:bg-[#5B21B6]"
              >
                Create Account
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;