import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignUpPage from "./sign-up/[[...sign-up]]/page";
import { TransactionProvider } from '@/contexts/TransactionContext';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TransactionProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <SignedOut>
              <div className="relative flex flex-col h-screen">
                <SignUpPage/>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="relative flex flex-col h-screen">
                <Navbar />
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                  {children}
                </main>
              </div>
            </SignedIn>
          </Providers>
        </TransactionProvider>
      </body>
    </html>
  );
}
