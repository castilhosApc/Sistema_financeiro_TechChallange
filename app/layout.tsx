import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./components/providers/NotificationProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Sistema Bancário - FIAP",
  description: "Sistema bancário moderno para gerenciamento de transações financeiras",
  keywords: ["banco", "transações", "finanças", "sistema bancário", "fiap"],
  authors: [{ name: "FIAP" }],
  creator: "FIAP",
  publisher: "FIAP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sistema-bancario-fiap.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sistema Bancário - FIAP",
    description: "Sistema bancário moderno para gerenciamento de transações financeiras",
    url: 'https://sistema-bancario-fiap.vercel.app',
    siteName: 'Sistema Bancário - FIAP',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sistema Bancário - FIAP",
    description: "Sistema bancário moderno para gerenciamento de transações financeiras",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#004d61" />
      </head>
      <body className={`${inter.className} antialiased transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
