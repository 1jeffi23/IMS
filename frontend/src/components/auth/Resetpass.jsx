import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import api from "@/lib/axios";


const Resetpass = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    // Watch password for confirm password validation matching
    const newPassword = watch("password");
    const token = new URLSearchParams(window.location.search).get("token");


    const onSubmit = async (data) => {
        try {
            await api.post('/api/auth/reset-password', {
                newPassword: data.password,
                token,
            })
            toast.success("password reset successfully!");
            reset();

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Reset Failed"
            )

        }



    };

    return (
        /* Main Wrapper: Forced Theme Lock (Light Mode Appearance) */
        <div className="min-h-screen bg-white text-slate-900 selection:bg-[#6D28D9] selection:text-white">


            {/* Right Side Form Container */}
            <div className="lg:col-span-3 flex items-center justify-center bg-white px-8 py-10 sm:px-10 lg:px-16">
                <div className="w-full max-w-lg">

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Reset Password
                        </h2>

                        <p className="mt-3 text-center text-base sm:text-lg text-slate-500">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your new password"
                                {...register("password", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Minimum 6 characters",
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                                        message: "Password must contain at least one letter and one number",
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === newPassword || "Passwords do not match",
                                })}
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-rose-600">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Reset Password Button */}
                        <Button
                            type="submit"
                            className="h-14 w-full rounded-xl bg-[#6D28D9] text-lg font-semibold text-white hover:bg-[#5B21B6] cursor-pointer"
                        >
                            Reset Password
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

export default Resetpass;