import type { Metadata } from "next";
import { Suspense } from "react";
import { Black_Han_Sans, Gothic_A1 } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";

const blackHanSans = Black_Han_Sans({
  variable: "--font-display",
  preload: false,
  weight: "400",
  display: "swap",
});

const gothicA1 = Gothic_A1({
  variable: "--font-sans",
  preload: false,
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinema - 영화 & TV 탐색",
  description: "TMDB 기반 영화와 TV 프로그램 탐색 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${blackHanSans.variable} ${gothicA1.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <QueryProvider>
          <Suspense>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
