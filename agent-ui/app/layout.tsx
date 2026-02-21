import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ViewTickets from "@/components/ViewTickets";
import CustomerSupport from "@/components/CustomerSupport";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Customer Support AI Agent",
  description: "AI-powered customer support resolution platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans`}>
        {children}
        <CustomerSupport />
        <ViewTickets />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(13,13,22,0.95)",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </body>
    </html>
  );
}
