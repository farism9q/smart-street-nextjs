import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/leaflet.css";
import { MiddleContentProvider } from "@/providers/middle-content-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MiddleContentProvider>{children}</MiddleContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
