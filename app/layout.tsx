import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { ChatbotProvider } from "@/providers/chatbot-provider";
import { QueryProviders } from "@/providers/query-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Street",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ChatbotProvider>{children}</ChatbotProvider>
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
