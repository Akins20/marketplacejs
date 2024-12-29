import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navgation/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
// import Breadcrumbs from "@/components/BreadCrumbs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Marketplace",
  description:
    "A marketplace that provides all your needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Navbar />
        <div className="md:ml-14 max-[760px]:text-black">
          {children}
          <Script
            src="https://js.paystack.co/v2/inline.js"
            strategy="lazyOnload"
          />
          <Footer />
        </div>
      </body>
    </html>
  );
}
