import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const monarca = localFont({
  src: "../public/fonts/Monarcha-Semi-Bold.otf",
  weight: "600",
  variable: "--font-monarca",
});

export const metadata: Metadata = {
  title: "Sky Valley Ambient Computing",
  description: "Tools & Infrastructure for Software Creators",
  openGraph: {
    title: "Sky Valley Ambient Computing",
    description: "Tools & Infrastructure for Software Creators",
    siteName: "Sky Valley Ambient Computing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={monarca.variable}>{children}</body>
    </html>
  );
}
