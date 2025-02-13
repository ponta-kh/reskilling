import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PontaNTFコミュニティ",
    description: "リスキリングのための学習プロジェクト",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <header></header>
                <main>{children}</main>
                <footer className="text-center text-gray-400 bg-green-200">
                    <small>© 2025 ponta-kh </small>
                </footer>
            </body>
        </html>
    );
}
