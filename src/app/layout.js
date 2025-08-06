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
          title: "Elite Finsoles",
  description: "A trusted loan platform for all your loan needs.",
  icons: {
    icon: "/icons/sansar.png", // Favicon path is now in metadata
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

