import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "투자 포트폴리오 대시보드",
  description: "개인 투자 자산을 한눈에 관리합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
