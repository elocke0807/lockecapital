import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locke Capital AI",
  description: "The AI-powered financial operating system for wealth builders.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Locke Capital",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#d4af37",
          colorBackground: "#18181b",
          colorInput: "#0c0c0c",
          colorInputForeground: "#fafafa",
          colorForeground: "#fafafa",
          colorMutedForeground: "#a1a1aa",
          colorBorder: "#27272a",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "shadow-2xl border border-[#27272a]",
        },
      }}
    >
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
