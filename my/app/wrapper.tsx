"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Sidebar />
      <main className="ml-64 p-4 w-full">
        {children}
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
    </SessionProvider>
  );
}
