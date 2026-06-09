import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import { UserPreferencesProvider } from "@/shared/contexts/UserPreferencesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "开发者工具箱 - 高效便捷的开发工具集合",
  description: "集成多种实用开发工具的现代化工具集合，为开发者和创作者提供高效便捷的解决方案，包括虚拟身份生成器、密码生成器、JSON格式化等工具。",
  keywords: "开发者工具箱,开发工具,虚拟身份生成器,密码生成器,JSON格式化,开发效率",
  authors: [{ name: "ToolsBox Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#05070a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased tb-app-bg tb-text transition-colors duration-300`}
      >
        <ThemeProvider>
          <UserPreferencesProvider>
            {children}
          </UserPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
