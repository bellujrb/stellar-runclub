import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from 'next/font/google';
import { AppProvider } from "../contexts/AppContext";
import { WalletProvider } from "../contexts/wallet-context";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Stellar Run Club",
  description: "Where running meets real community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AppProvider>
            <WalletProvider>
              {/* Mobile-width container on desktop, responsive on mobile */}
              <div className="flex justify-center">
                <div className="w-full">
                  {children}
                </div>
              </div>
            </WalletProvider>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
