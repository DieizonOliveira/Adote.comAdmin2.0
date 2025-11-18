import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Admin: Adote.Com",
  description: "Área Administrativa do Abrigo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
