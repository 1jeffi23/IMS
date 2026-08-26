import React from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";

import { useNavigate, Link } from "react-router-dom";

import { authClient } from "@/lib/auth-client";
import AuthSidePanel from "./AuthSidePanel";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Email / Password Login
  const submit = async (data) => {
    const { data: result, error } =
      await authClient.signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }

    toast.success("Login Successful!");
    reset();

    // AuthContext/useSession will automatically get the updated session.
    navigate("/", { replace: true });
  };

  // GitHub Login
  const loginWithGithub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("GitHub login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#6D28D9] selection:text-white">
      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <AuthSidePanel/>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6D28D9] text-white">
                📦
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  InventoryPro
                </p>

                <p className="text-[10px] text-slate-500">
                  Smarter Stock Management
                </p>
              </div>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back!
              </h2>

              <p className="mt-3 text-center text-base text-slate-500">
                Sign in to pick up where you left off
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(submit)}
              className="space-y-6"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email",
                    },
                  })}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <div className="flex items-center justify-between">

                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#6D28D9] transition hover:text-[#5B21B6]"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                      message:
                        "Password must contain at least one letter and one number",
                    },
                  })}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <Button
                type="submit"
                className="h-12 w-full cursor-pointer bg-[#6D28D9] text-base font-semibold text-white hover:bg-[#5B21B6]"
              >
                Login
              </Button>

              {/* =================================================
                  SIGN UP
              ================================================== */}

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-[#6D28D9] transition hover:text-[#5B21B6]"
                >
                  Sign Up
                </Link>
              </p>

              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div className="flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-300" />

                <span className="text-sm text-slate-500">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-300" />

              </div>

              {/* =================================================
                  GITHUB LOGIN
              ================================================== */}

              <button
                type="button"
                onClick={loginWithGithub}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >

                {/* GitHub Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>

                Continue with GitHub

              </button>

              {/* Footer */}
              <p className="pt-3 text-center text-xs text-slate-400">
                Your inventory, sales and business data — all together.
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;