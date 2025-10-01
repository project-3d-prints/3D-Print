import { Raleway } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
