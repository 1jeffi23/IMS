import React, { useContext } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/axios";

const Login = () => {
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = async(data) => {
   try {
    const response = await api.post('/api/auth/sign-in/email',{
    email: data.email.trim().toLowerCase(),
    password: data.password,
   })

   toast.success("Login Successfull!");
   reset();
   navigate("/");
    
   } catch (error) {
   toast.error(
    error.response?.data?.message || "Login failed"
   )
   }

   
  };

  return (
    /* Main Wrapper: Fixed theme styling added (light mode appearance forced) */
    <div className="min-h-screen  bg-white text-slate-900 selection:bg-[#6D28D9] selection:text-white">
      
      

      {/* Right Side - Form Container */}
      <div className="lg:col-span-3 flex items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-lg">
          
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back!
            </h2>

            <p className="mt-3 text-center text-base text-slate-500">
              Login to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#6D28D9] hover:text-[#5B21B6] transition"
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full bg-[#6D28D9] text-base font-semibold text-white hover:bg-[#5B21B6] cursor-pointer"
            >
              Login
            </Button>

            {/* Bottom Text */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-[#6D28D9] hover:text-[#5B21B6] transition"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;