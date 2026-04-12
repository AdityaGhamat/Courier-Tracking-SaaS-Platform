import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "LogisticsEngine — Courier Tracking SaaS",
  description: "Multi-tenant courier tracking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
