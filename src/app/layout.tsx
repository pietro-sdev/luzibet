import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "LuizBet",
  description: "A sua bet premiada!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased bg-black`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
