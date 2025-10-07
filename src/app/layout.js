import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Elite Finsols",
  description: "A trusted loan platform for all your loan needs.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="P8ABy2jnjU73CVUye04wQZtXlGGZtl1A1lYwVVFcfTQ" />
      </head>
      <body
        className={`${geistSans.className} bg-gradient-to-r from-[#CEFCFF] via-[#D5F5F9] to-[#FFFFFF]`}
        style={{
          backgroundImage:
            'linear-gradient(to right, #CEFCFF 0%, #D5F5F9 9%, #FFFFFF 100%)',
        }}
      >
        {children}
      </body>
    </html>
  );
}

