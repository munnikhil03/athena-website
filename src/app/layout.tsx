import type { Metadata } from "next";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athena - Community Pet Search & Rescue",
  description:
    "Athena connects lost pets, the people who can help find them, and emergency veterinary care - because social media spreads the word, but it doesn't coordinate the response.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
