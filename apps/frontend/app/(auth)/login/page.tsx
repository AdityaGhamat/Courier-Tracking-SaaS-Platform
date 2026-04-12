// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/auth-context";
import { authApi } from "../../../lib/api";
import type { AuthResponse } from "../../../types";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setServerError("");
    try {
      const res = (await authApi.login(data)) as {
        data: AuthResponse;
        message: string;
      };
      setUser(res.data.user);

      // Role-based redirect
      const role = res.data.user.role;
      if (role === "super_admin") router.push("/super-admin");
      else if (role === "delivery_agent") router.push("/agent");
      else router.push("/dashboard");
    } catch (err: any) {
      setServerError(err?.message ?? "Invalid email or password");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#fd761a" />
            <path
              d="M8 18 L18 8 L28 18 L28 28 L8 28 Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="20" r="4" fill="white" />
          </svg>
          <span
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-title-md)",
              color: "var(--color-primary)",
            }}
          >
            LogisticsEngine
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline-sm)",
            color: "var(--color-on-surface)",
            letterSpacing: "-0.015em",
          }}
        >
          Welcome back
        </h2>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Sign in to your workspace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Server error */}
        {serverError && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
              fontSize: "var(--text-body-md)",
            }}
          >
            {serverError}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block font-medium uppercase tracking-wider"
            style={{
              fontSize: "var(--text-label-md)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@yourcompany.com"
            {...register("email")}
            className="w-full px-4 py-3 rounded-lg outline-none transition-all"
            style={{
              backgroundColor: "var(--color-surface-low)",
              color: "var(--color-on-surface)",
              fontSize: "var(--text-body-md)",
              border: errors.email
                ? "1.5px solid var(--color-error)"
                : "1.5px solid transparent",
            }}
            onFocus={(e) => {
              if (!errors.email)
                e.currentTarget.style.borderColor =
                  "var(--color-secondary-container)";
            }}
            onBlur={(e) => {
              if (!errors.email)
                e.currentTarget.style.borderColor = "transparent";
            }}
          />
          {errors.email && (
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-error)",
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block font-medium uppercase tracking-wider"
            style={{
              fontSize: "var(--text-label-md)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "var(--color-surface-low)",
                color: "var(--color-on-surface)",
                fontSize: "var(--text-body-md)",
                border: errors.password
                  ? "1.5px solid var(--color-error)"
                  : "1.5px solid transparent",
              }}
              onFocus={(e) => {
                if (!errors.password)
                  e.currentTarget.style.borderColor =
                    "var(--color-secondary-container)";
              }}
              onBlur={(e) => {
                if (!errors.password)
                  e.currentTarget.style.borderColor = "transparent";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
              style={{ color: "var(--color-on-surface-variant)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-error)",
              }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-kinetic w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-body-md)",
            marginTop: "0.5rem",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer links */}
      <div className="space-y-4">
        <div
          className="relative flex items-center gap-4"
          style={{ color: "var(--color-outline-variant)" }}
        >
          <div
            className="flex-1 h-px"
            style={{
              backgroundColor: "var(--color-outline-variant)",
              opacity: 0.4,
            }}
          />
          <span style={{ fontSize: "var(--text-label-md)" }}>OR</span>
          <div
            className="flex-1 h-px"
            style={{
              backgroundColor: "var(--color-outline-variant)",
              opacity: 0.4,
            }}
          />
        </div>

        <p
          className="text-center"
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          New courier company?{" "}
          <Link
            href="/register"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-secondary-container)" }}
          >
            Create a workspace
          </Link>
        </p>

        <p
          className="text-center"
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Customer tracking your package?{" "}
          <Link
            href="/register-customer"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-secondary-container)" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
