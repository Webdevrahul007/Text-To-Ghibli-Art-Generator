import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientBody from "./ClientBody";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghibli Art Generator | Transform Text to Studio Ghibli Style Art",
  description: "Create stunning Studio Ghibli-style artwork from text descriptions using advanced AI. Turn your ideas into magical animated-style scenes.",
  keywords: ["Ghibli art generator", "ai art", "text to image", "studio ghibli", "anime art generator"],
  authors: [
    {
      name: "Ghibli Art Generator",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
