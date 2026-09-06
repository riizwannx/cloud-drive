import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Cloud, LockKeyhole, ShieldCheck } from "lucide-react";

import { loginUser } from "@/services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await loginUser(
        data.email,
        data.password
      );

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.16),transparent_30%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-2xl shadow-indigo-950/10 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-slate-900">
        <section className="hidden min-h-[620px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 p-10 text-white lg:flex">
          <div><div className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><Cloud className="h-6 w-6" /></div><div className="mt-16 max-w-sm"><div className="mb-5 flex items-center gap-2 text-sm font-medium text-indigo-100"><LockKeyhole className="h-4 w-4" /> Your personal workspace</div><h2 className="text-4xl font-semibold leading-tight tracking-[-0.05em]">Your files, organized and always within reach.</h2><p className="mt-5 text-base leading-7 text-indigo-100">CloudDrive keeps your important work together, secure, and simple to access.</p></div></div>
          <div className="flex items-center gap-3 text-sm text-indigo-100"><ShieldCheck className="h-5 w-5" /> Private, secure file storage</div>
        </section>
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardContent className="p-7 sm:p-10 lg:p-12">

          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3 lg:hidden"><div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white"><Cloud size={23} /></div><span className="font-semibold">CloudDrive</span></div>
            <div className="mb-4 hidden size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 lg:flex dark:text-indigo-300"><LockKeyhole className="h-5 w-5" /></div>
            <div className="hidden">
              <Cloud size={32} />
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Welcome back
            </h1>

            <p className="mt-2 text-muted-foreground">
              Sign in to continue to your CloudDrive workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 rounded-xl border-transparent bg-secondary/70 px-4 pr-12 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
                {...register("password")}
              />

              <Button variant="ghost" size="icon-sm"
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
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

            {serverError && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-center text-sm text-destructive">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form><p className="mt-8 text-center text-xs text-muted-foreground">Your files stay private and protected.</p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
