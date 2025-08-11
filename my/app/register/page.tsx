"use client";
import { useState } from "react";
import { register } from "../../lib/api";
import { useRouter } from "next/navigation";

interface RegisterState {
  username: string;
  password: string;
  role: "student" | "teacher" | "lab_head";
  error: string;
}

export default function Register() {
  const [state, setState] = useState<RegisterState>({
    username: "",
    password: "",
    role: "student",
    error: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(state.username, state.password, state.role);
      router.push("/login");
    } catch (err: any) {
      setState({
        ...state,
        error: err.response?.data?.detail || "Registration failed",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Register</h2>
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
        <select
          value={state.role}
          onChange={(e) =>
            setState({
              ...state,
              role: e.target.value as "student" | "teacher" | "lab_head",
            })
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="lab_head">Lab Head</option>
        </select>
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Back to{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
