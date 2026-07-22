"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/app/lib/auth-client";

type SignupForm = {
  email: string;
  password: string;
};

const SignupPage = () => {
  const { register, handleSubmit } = useForm<SignupForm>();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: SignupForm) => {
    setError("");
    setSuccess("");

    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.email.split("@")[0],
    });

    if (error) {
      setError(error.message || "Signup failed");
      return;
    }

    setSuccess("Account created successfully");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <input
          className="border border-gray-300 rounded-md p-2"
          type="email"
          placeholder="Email"
          {...register("email", {
            required: true,
            pattern: /^\S+@\S+$/i,
          })}
        />

        <input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            minLength: 8,
            maxLength: 128,
          })}
        />

        <button
          className="bg-rose-500 text-white rounded-md p-2"
          type="submit"
        >
          Signup
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default SignupPage;