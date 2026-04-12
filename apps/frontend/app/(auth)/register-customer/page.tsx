// src/app/(auth)/register-customer/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, PackageSearch } from "lucide-react";
import { useAuth } from "../../../context/auth-context";
import { authApi } from "../../../lib/api";
import { AuthResponse } from "../../../types";

const registerCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterCustomerForm = z.infer<typeof registerCustomerSchema>;

export default function RegisterCustomerPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCustomerForm>({
    resolver: zodResolver(registerCustomerSchema),
  });

  async function onSubmit(data: RegisterCustomerForm) {
    setServerError("");
    try {
      const res = (await authApi.registerCustomer(data)) as {
        data: AuthResponse;
      };
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err?.message ?? "Registration failed. Please try again.");
    }
  }

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: "var(--color-surface-low)",
    color: "var(--color-on-surface)",
    fontSize: "var(--text-body-md)",
    border: hasError
      ? "1.5px solid var(--color-error)"
      : "1.5px solid transparent",
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
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

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2"
          style={{ backgroundColor: "var(--color-surface-low)" }}
        >
          <PackageSearch
            size={14}
            style={{ color: "var(--color-secondary-container)" }}
          />
          <span
            className="uppercase tracking-wider font-medium"
            style={{
              fontSize: "var(--text-label-sm)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Customer
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
          Track your packages
        </h2>
        <p
          style={{
            fontSize: "var(--text-body-md)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Create an account to view your shipment history
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
              fontSize: "var(--text-body-md)",
            }}
          >
            {serverError}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block font-medium uppercase tracking-wider"
            style={{
              fontSize: "var(--text-label-md)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register("name")}
            className="w-full px-4 py-3 rounded-lg outline-none transition-all"
            style={inputStyle(!!errors.name)}
            onFocus={(e) => {
              if (!errors.name)
                e.currentTarget.style.borderColor =
                  "var(--color-secondary-container)";
            }}
            onBlur={(e) => {
              if (!errors.name)
                e.currentTarget.style.borderColor = "transparent";
            }}
          />
          {errors.name && (
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--color-error)",
              }}
            >
              {errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="jane@example.com"
            {...register("email")}
            className="w-full px-4 py-3 rounded-lg outline-none transition-all"
            style={inputStyle(!!errors.email)}
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
              placeholder="Min. 6 characters"
              {...register("password")}
              className="w-full px-4 py-3 pr-12 rounded-lg outline-none transition-all"
              style={inputStyle(!!errors.password)}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
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
              <Loader2 size={16} className="animate-spin" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p
        className="text-center"
        style={{
          fontSize: "var(--text-body-md)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--color-secondary-container)" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
