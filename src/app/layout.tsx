import type { Metadata } from "next";

import "./globals.css";
import "react-international-phone/style.css";

import { Inter } from "next/font/google";
import NextAuthProvider from "@/components/provider/NextAuth";
import { Toaster } from "@/components/ui/toaster";
import TanstackQueryClientProvider from "@/components/provider/TanstackQueryClient";
import { Provider as RollbarProvider } from "@rollbar/react";
import { clientConfig } from "@/lib/rollbar";
import { GoogleAnalytics } from '@next/third-parties/google'

const InterSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Welcome to Umoja",
  description: "Join our family of verified designers who are increasing their Profitability by Optimising their Productivity",
};

export default function RootLayout({ children }: LayoutProps) {  
  return (
    <RollbarProvider config={clientConfig}>
      <html lang="en">
        <body className={`${InterSans.className}  antialiased`}>
          <NextAuthProvider>
            <TanstackQueryClientProvider>
              {children}
              <Toaster />
            </TanstackQueryClientProvider>
          </NextAuthProvider>
        </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG_ID ?? ''} />
      </html>
    </RollbarProvider>
  );
}
