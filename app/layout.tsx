import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fujiwara Creative | Premium Payment Gateway",
    template: "%s | Fujiwara Creative"
  },
  description: "Secure, fast, and scalable payment gateway integration for modern businesses.",
  keywords: ["payment gateway", "secure payment", "midtrans", "fujiwara creative", "ecommerce"],
  authors: [{ name: "Fujiwara Creative Team" }],
  openGraph: {
    title: "Fujiwara Creative | Premium Payment Gateway",
    description: "Secure, fast, and scalable payment gateway integration for modern businesses.",
    url: "https://fcg.fujiwaracreative.my.id",
    siteName: "Fujiwara Creative",
    images: [
      {
        url: "https://fcg.fujiwaracreative.my.id/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Fujiwara Creative",
              "url": "https://fcg.fujiwaracreative.my.id",
              "logo": "https://fcg.fujiwaracreative.my.id/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+62-812-3456-7890",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
