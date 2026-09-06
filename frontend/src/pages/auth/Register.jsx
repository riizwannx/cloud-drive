import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Cloud,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { registerUser } from "@/services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  confirmPassword: z
    .string()
    .min(
      6,
      "Please confirm your password"
    ),
}).refine(
  (data) =>
    data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [serverError, setServerError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      registerSchema
    ),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      await registerUser(
        data.name,
        data.email,
        data.password
      );

      navigate("/login");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.16),transparent_30%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-2xl shadow-indigo-950/10 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-slate-900">

        {/* Left panel */}
        <section className="hidden min-h-[650px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 p-10 text-white lg:flex">

          <div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
              <Cloud className="h-6 w-6" />
            </div>

            <div className="mt-16 max-w-sm">

              <div className="mb-5 flex items-center gap-2 text-sm font-medium text-indigo-100">
                <UserRound className="h-4 w-4" />
                Start your workspace
              </div>

              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.05em]">
                Everything you need to manage your files beautifully.
              </h2>

              <p className="mt-5 text-base leading-7 text-indigo-100">
                Create your CloudDrive workspace and keep your important files organized, accessible, and protected.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 text-sm text-indigo-100">
            <ShieldCheck className="h-5 w-5" />
            Private, secure file storage
          </div>

        </section>

        {/* Form */}
        <Card className="w-full border-0 bg-transparent shadow-none">

          <CardContent className="p-7 sm:p-10 lg:p-12">

            {/* Mobile branding */}
            <div className="mb-8">

              <div className="mb-6 flex items-center gap-3 lg:hidden">

                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                  <Cloud size={23} />
                </div>

                <span className="font-semibold">
                  CloudDrive
                </span>

              </div>

              <div className="mb-4 hidden size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 lg:flex dark:text-indigo-300">
                <UserRound className="h-5 w-5" />
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em]">
                Create your account
              </h1>

              <p className="mt-2 text-muted-foreground">
                Start organizing your files with CloudDrive.
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="space-y-5"
            >

              {/* Name */}
              <div>

                <Input
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  {...register("name")}
                  className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
                />

                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}

              </div>

              {/* Email */}
              <div>

                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register("email")}
                  className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* Password */}
              <div className="relative">

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  autoComplete="new-password"
                  {...register("password")}
                  className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 pr-12 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
                />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-2 top-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* Confirm Password */}
              <div className="relative">

                <Input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  {...register(
                    "confirmPassword"
                  )}
                  className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 pr-12 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
                />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-2 top-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {
                      errors.confirmPassword
                        .message
                    }
                  </p>
                )}

              </div>

              {/* Server error */}
              {serverError && (
                <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-center text-sm text-destructive">
                  {serverError}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>

            </form>

            {/* Login link */}
            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Sign in
              </button>
            </p>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Your files stay private and protected.
            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}