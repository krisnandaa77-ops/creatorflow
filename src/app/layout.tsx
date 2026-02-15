import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "CreatorFlow | Beresin Jadwalnya, Bikin Kontennya",
  description: "Manage your creative chaos. From an integrated Idea Bank to professional PDF exports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700;0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.className} antialiased bg-[#f6f6f8] dark:bg-[#111521] text-slate-900 dark:text-white overflow-x-hidden w-full max-w-[100vw]`}>
        {children}
      </body>
    </html>
  );
}
