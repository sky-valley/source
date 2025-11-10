import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sky Valley Source",
  description: "Software distribution and updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
