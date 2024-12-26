import "./globals.scss";
import NextAuthSessionProvider from "./api/auth/[...nextauth]/providers/sessionProvider";
import { Metadata } from "next";
import MuiThemeProvider from "@/theme/provider";
import { ReduxStateProviders } from "@/redux/provider";
import { GoogleTagManager } from "@next/third-parties/google";
import CSPostHogProvider from "@/components/PostHog/PostHog";

export const metadata: Metadata = {
  title: "Skin Care",
  description: "skincare",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body suppressHydrationWarning={true}>
          <ReduxStateProviders>
            <NextAuthSessionProvider>
              <MuiThemeProvider>{children}</MuiThemeProvider>
            </NextAuthSessionProvider>
          </ReduxStateProviders>
        </body>
        <GoogleTagManager gtmId="G-0CZC9L085R" />
      </CSPostHogProvider>
    </html>
  );
}
