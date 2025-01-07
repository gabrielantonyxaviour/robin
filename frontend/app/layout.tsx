import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { EnvironmentStoreProvider } from "@/components/context";
import Layout from "@/components/layout";
import OCConnectProvider from "@/components/providers/occonnect-provider";
import WalletProvider from "@/components/providers/wallet-provider";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
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
            <WalletProvider>
              <OCConnectProvider>
                <Toaster />
                <Layout>{children}</Layout>
              </OCConnectProvider>
            </WalletProvider>
          </ThemeProvider>
        </body>
      </html>
    </EnvironmentStoreProvider>
  );
}
