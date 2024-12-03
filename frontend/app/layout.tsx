import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { EnvironmentStoreProvider } from "@/components/context";
import Layout from "@/components/layout";
import { WalletProvider } from "@/components/providers/wallet-provider";
import OCConnectProvider from "@/components/providers/occonnect-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EnvironmentStoreProvider>
      <html lang="en">
        <body className="bg-[#2c6cc3]">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <OCConnectProvider>
              <WalletProvider>
                <Toaster />
                <Layout>{children}</Layout>
              </WalletProvider>
            </OCConnectProvider>
          </ThemeProvider>
        </body>
      </html>
    </EnvironmentStoreProvider>
  );
}