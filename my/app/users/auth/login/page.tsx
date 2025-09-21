"use client";

import { useState } from "react";
import { login } from "../../../../lib/api";
import { useAuthStore } from "../../../../lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(username, password);
      const token = response.access_token || response.token;
      const role = response.role || response.user?.role;

      if (token && role) {
        setAuth({ token, role, username });
        toast.success("Вход выполнен!");
        router.push("/dashboard");
      } else {
        toast.error("Неожиданный ответ сервера");
      }
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      toast.error("Не удалось войти в аккаунт");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-cyan-800">
            ЗD Print
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-center text-cyan-900">
            Авторизация
          </h2>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Введите имя пользователя"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Введите пароль"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>

            <div className="text-center">
              <Link
                href="/users/auth/register"
                className="text-cyan-600 hover:text-cyan-800 text-sm"
              >
                Нет аккаунта? Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
