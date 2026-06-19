import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locke Capital AI",
  description: "The AI-powered financial operating system for wealth builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
