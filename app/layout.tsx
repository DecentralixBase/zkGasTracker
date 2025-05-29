import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Web3 Gas Tracker | Real-time Blockchain Fees",
  description: "Track real-time gas fees across Ethereum, Arbitrum, Optimism, Base, and Polygon networks. Stay informed with alerts and trends.",
  keywords: "gas tracker, ethereum, web3, blockchain, fees, arbitrum, optimism, base, polygon",
  authors: [{ name: "Web3 Dev Portfolio" }],
  openGraph: {
    title: "Web3 Gas Tracker - Real-time Blockchain Fees",
    description: "Track gas fees across multiple networks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}