import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from 'next/font/google';
import { AppProvider } from "../contexts/AppContext";
import { WalletProvider } from "../contexts/wallet-context";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Stellar Run Club",
  description: "Onde a corrida encontra a comunidade real",
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          <AppProvider>
            <WalletProvider>
              {/* Container com largura de mobile no desktop, responsivo no mobile */}
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
