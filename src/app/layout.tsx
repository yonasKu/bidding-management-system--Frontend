import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, type Locale } from "@/i18n";

export const metadata: Metadata = {
  title: "Ethiopian Bidding System",
  description: "Transparent procurement for Ethiopia – publish tenders, submit bids, and evaluate results.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default to English for initial wiring; we'll add cookie/route detection later
  const locale: Locale = 'en';
  const messages = await getMessages(locale);

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
