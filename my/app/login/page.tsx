"use client";
import { useState } from "react";
import { login, getCurrentUser } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";

interface LoginState {
  username: string;
  password: string;
  error: string;
}

export default function Login() {
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    error: "",
  });
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(state.username, state.password);
      const userResponse = await getCurrentUser();
      setAuth(userResponse.data);
      router.push("/jobs");
    } catch (err: any) {
      setState({
        ...state,
        error: err.response?.data?.detail || "Login failed",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
