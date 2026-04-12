import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/modules/core/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Courier Tracking",
  description: "SaaS Courier Tracking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
