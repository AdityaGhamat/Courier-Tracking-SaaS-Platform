"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Shield } from "lucide-react";
import { authApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Matches backend registerAgentSchema EXACTLY:
// name: string min2
// email: string email
// password: string min8
// NOTE: phone is NOT in the backend schema — removed

interface CreateAgentForm {
  name: string;
  email: string;
  password: string;
}

const EMPTY: CreateAgentForm = { name: "", email: "", password: "" };
const inputCls =
  "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 text-sm";

export function CreateAgentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAgentForm>(EMPTY);

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(EMPTY);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // POST /auth/register-agent with { name, email, password }
      await authApi.registerAgent({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      handleOpenChange(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to register agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 font-semibold text-white border-none"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
          <UserPlus size={15} /> Add Agent
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden sm:max-w-[420px] gap-0 rounded-xl border-slate-200">
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <UserPlus size={18} className="text-indigo-300" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-base leading-tight m-0 p-0">
              Register Delivery Agent
            </DialogTitle>
            <p className="text-indigo-300 text-xs mt-0.5">
              Creates a login account with the agent role
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Info banner */}
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <Shield size={14} className="text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-700">
                The agent will log in with this email & password and get the{" "}
                <strong>delivery_agent</strong> role automatically.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                name="name"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={set}
                required
                minLength={2}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Email Address <span className="text-red-400">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={set}
                required
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Password <span className="text-red-400">*</span>
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={set}
                required
                minLength={8}
                className={inputCls}
              />
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 font-semibold text-white border-none"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
            >
              <UserPlus size={14} />
              {loading ? "Registering…" : "Register Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
