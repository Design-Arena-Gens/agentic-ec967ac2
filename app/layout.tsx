import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VertexHire - AI Consultancy Agent",
  description: "Intelligent recruitment consultancy agent for managing candidates and communications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
