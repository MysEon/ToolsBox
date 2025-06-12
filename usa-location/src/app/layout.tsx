import type { Metadata } from "next";
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
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
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
