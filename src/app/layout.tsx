import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Exporter - Slide & Zoom Effect",
  description: "Create videos with slide-in and zoom-out animations",
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
