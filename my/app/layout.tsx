import "./globals.css";
import { Raleway } from "next/font/google";
import Wrapper from "./wrapper";

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
    <html lang="en">
      <body
        className={`${raleway.className} bg-[var(--background)] min-h-screen flex`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
