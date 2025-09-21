// app/layout.tsx
import "./globals.css";
import { Raleway } from "next/font/google";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "3D Print",
  description: "Web app for managing 3D printing queue",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${raleway.className} bg-[var(--background)] min-h-screen flex`}
      >
        <Sidebar />
        <main className="lg:ml-64 p-4 w-full mt-16 lg:mt-0">
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
      </body>
    </html>
  );
}