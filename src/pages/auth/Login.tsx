import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";

import bgImage from "../../assets/image/bg-image-2.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authLoading, setAuthLoading] = useState(false)

  const handlerLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success || response.status === 200) {
        const { data: user, token } = response.data;

        login(user, token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error?.response?.data?.error);
      toast.error("Invalid email or password!");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4"
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="absolute h-72 w-72 rounded-full bg-app-brand/20 blur-3xl animate-pulse" />

      <form
        onSubmit={handlerLogin}
        className="group relative z-10 w-full max-w-80 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,170,0.15)]"
      >
        <div className="absolute inset-0 rounded-2xl border border-app-brand/20 animate-pulse" />

        <div className="absolute inset-px rounded-2xl bg-black/40 backdrop-blur-xl" />

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-app-secondary">
              Asset <span className="text-app-brand">Manager</span>
            </h1>

            <p className="mt-1 text-sm text-app-secondary/70">
              Sign in to continue
            </p>
          </div>

          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 transition-all duration-300 hover:border-app-brand/50 focus-within:border-app-brand focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-app-brand/20">
            <FiMail className="text-app-gray" />

            <input
              className="w-full bg-transparent px-2 py-2 text-white outline-none placeholder:text-app-secondary/40"
              type="email"
              name="email"
              placeholder="Email address"
              required
            />
          </div>

          <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 transition-all duration-300 hover:border-app-brand/50 focus-within:border-app-brand focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-app-brand/20">
            <FiLock className="text-app-gray" />

            <input
              className="w-full bg-transparent px-2 py-2 text-white outline-none placeholder:text-app-secondary/40"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          {/* <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-app-secondary/70 transition-colors hover:text-app-secondary">
              <input type="checkbox" className="accent-app-brand" />
              Remember me
            </label>

            <Link
              to="#"
              className="font-medium text-app-secondary/70 transition-colors hover:text-app-brand"
            >
              Forgot?
            </Link>
          </div> */}

          <button
            disabled={authLoading}
            type="submit"
            className="mt-5 w-full cursor-pointer rounded-xl bg-linear-to-r from-app-brand to-emerald-400 py-3 font-semibold text-black shadow-lg shadow-app-brand/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,170,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {authLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* <p className="mt-5 text-center text-sm text-app-secondary/70">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-app-brand transition-colors hover:text-app-brand/80"
            >
              Sign Up
            </Link>
          </p> */}

        </div>
      </form>
    </div>
  );
}