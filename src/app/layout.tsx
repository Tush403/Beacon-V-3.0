import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Beacon: AI Test Tool Navigator',
  description: 'AI-powered test automation tool selection by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The prompt asks for Geist Sans and to assume it's available via Google Fonts. */}
        {/* If Geist Sans is not on Google Fonts, this link might not work as expected. */}
        {/* A common practice for Geist Sans is to self-host or use specific CDNs like Vercel's. */}
        {/* For now, following the prompt's structure: */}
        <link href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
