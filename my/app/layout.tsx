import "./globals.css";
import { Inter } from "next/font/google";
import ClientNav from "./ClientNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "3D Print Queue Management",
  description: "Web app for managing 3D printing queue",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <ClientNav />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
