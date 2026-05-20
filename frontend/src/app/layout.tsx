import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EkoGeri — Geri Dönüşüm Yönetim Sistemi",
  description: "Topluluk tabanlı geri dönüşüm ve atık yönetim sistemi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
