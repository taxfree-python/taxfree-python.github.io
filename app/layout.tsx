import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { Header } from "@/components/Header";
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
  metadataBase: new URL('https://taxfree.dev'),
  title: "tax_free",
  description: "Software Engineer & Researcher at Science Tokyo",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://taxfree.dev',
    siteName: 'tax_free',
    title: 'tax_free',
    description: 'Software Engineer & Researcher at Science Tokyo',
    images: [
      {
        url: '/icon.png',
        width: 1706,
        height: 1669,
        alt: 'tax_free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@taxfree_python',
    creator: '@taxfree_python',
    title: 'tax_free',
    description: 'Software Engineer & Researcher at Science Tokyo',
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <Header />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
