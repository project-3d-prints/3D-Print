"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    console.log("ClientLayout mounting, calling checkAuth");
    checkAuth().finally(() => {
      setSessionChecked(true);
      console.log("checkAuth completed, sessionChecked=true");
    });
  }, [checkAuth]);

  useEffect(() => {
    console.log("Checking redirect:", {
      isLoading,
      isAuthenticated,
      sessionChecked,
    });
    if (sessionChecked && !isLoading && !isAuthenticated) {
      console.log("Redirecting to login: isAuthenticated=false after check");
      router.push("/users/auth/login");
    } else if (sessionChecked && isAuthenticated) {
      console.log("Session valid, no redirect");
    }
  }, [isLoading, isAuthenticated, sessionChecked, router]);

  return (
    <>
      <Sidebar />
      <main className="lg:ml-64 p-4 w-full mt-16 lg:mt-0">
        {sessionChecked && isLoading ? <LoadingSpinner /> : children}
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#4CAF50",
                color: "#FFFFFF",
              },
            },
            error: {
              style: {
                background: "#F44336",
                color: "#FFFFFF",
              },
            },
            duration: 5000,
          }}
        />
      </main>
    </>
  );
}
