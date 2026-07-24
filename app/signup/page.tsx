"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        setError(error.message || "Isdhafaangalku waa fashilmay");
        return;
      }

      setSuccess("Account-kaagu waa la abuuray! Waxaad loo leexinayaa chat-ka...");
      setTimeout(() => {
        router.push("/chat");
      }, 1500);
    } catch (err) {
      setError("Cillad ayaa dhacday, fadlan dib u muuji");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Background Decor - Gradient Orbs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-rose-100/50 border border-rose-100 p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-rose-500 text-white font-bold text-2xl shadow-lg shadow-rose-200 mb-4">
            C
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            
            <span className="text-1xl text-red-600"> Create new Account</span>
             </h2>
          <p className="text-sm text-gray-500 mt-1">
            welcome Chat App! Buuxi foomka hoose.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Magacaaga
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Amina Ali"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.name
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                }`}
                {...register("name", { required: "Magaca waa daruuri" })}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email-ka
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                }`}
                {...register("email", {
                  required: "Email-ka waa daruuri",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email sax ah geli",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password-ka
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.password
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                }`}
                {...register("password", {
                  required: "Password-ka waa daruuri",
                  minLength: {
                    value: 8,
                    message: "Ugu yaraan 8 xaraf ama tiro geli",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Samaynaya...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Account ma leedahay?{" "}
          <Link
            href="/login"
            className="font-semibold text-rose-500 hover:text-rose-600 hover:underline transition-colors"
          >
            Log in halkan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;