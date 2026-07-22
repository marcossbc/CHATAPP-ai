"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email & Password Login
  const onSubmit = async (data: LoginForm) => {
    setError("");
    setSuccess("");

    
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message || "Login failed");
      return;
    }

    setSuccess("Login successful");
  };


  // Google Login
  const googleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "Google login failed");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >

        <input
          placeholder="Email"
          className="border border-gray-300 rounded-md p-2"
          type="email"
          {...register("email")}
        />


        <input
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2"
          type="password"
          {...register("password")}
        />


        <button
          className="bg-rose-500 text-white rounded-md p-2"
          type="submit"
        >
          Login
        </button>

      </form>


      <div className="my-4">
        OR
      </div>


      <button
        onClick={googleLogin}
        className="bg-blue-600 text-white rounded-md p-2 w-80 cursor:pointer"
      >
        Continue with Google
      </button>


      {error && (
        <p className="text-red-500 mt-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-500 mt-3">
          {success}
        </p>
      )}

    </div>
  );
};

export default LoginPage;