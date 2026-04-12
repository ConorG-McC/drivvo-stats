import "./globals.css";
import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vehicle Health Dashboard",
  description: "A dashboard to track the health of your vehicle",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivoBlack.variable} ${space.variable}`}>
        {children}
      </body>
    </html>
  );
}

