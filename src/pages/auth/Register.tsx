import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlerRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = e.target;
    const name = formData.name.value;
    const email = formData.email.value;
    const password = formData.password.value;

    const registerData = {
      name,
      email,
      password,
    };

    try {
      const response = await axiosInstance.post("/auth/register", registerData);

      if (response.data.success || response.status === 201) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error.response?.data?.error);
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handlerRegister}
        className=" max-w-85 w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-xs border border-app-gray/15"
      >
        <h2 className="text-xl font-bold mb-9 text-center ">
          Create an Account.
        </h2>

        {/* Name Input */}
        <div className="flex items-center my-2 border bg-app-brand/5 border-app-gray/15 rounded gap-2 pl-3">
          <FiUser className="text-lg " />
          <input
            className="w-full outline-none bg-transparent py-2.5 "
            type="text"
            name="name"
            placeholder="Full Name"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center my-2 border bg-app-brand/5 border-app-gray/15 rounded gap-2 pl-3">
          <FiMail className="text-lg " />
          <input
            className="w-full outline-none bg-transparent py-2.5 "
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center mt-2 mb-4 border bg-app-brand/5  border-app-gray/15 rounded gap-2 pl-3">
          <FiLock className="text-lg " />
          <input
            className="w-full outline-none bg-transparent py-2.5 "
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full mb-3 bg-app-brand  hover:opacity-90 transition py-2.5 rounded text-app-secondary font-medium cursor-pointer"
        >
          {loading ? "Registering..." : "Sing-up"}
        </button>

        <p className="text-center mt-4 /80">
          Already have an account?{" "}
          <Link to="/login" className="text-app-brand  underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
