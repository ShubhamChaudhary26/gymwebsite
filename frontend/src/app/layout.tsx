import "./globals.css";
import Footer from "@/components/common/Footer";
import { NavbarDemo } from "@/components/common/CardNav";
import { LoaderFourDemo } from "@/components/common/Loader";

export const metadata = {
  title: "Veltrix | Gym Website",
  description: "Sculpt Your Body, Elevate Your Spirit",
  icons: {
    icon: "/logo.jpg", // or "/favicon.png"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Agar extra meta tags chahiye to yaha add kar sakta hai */}
      </head>
      <body>
        <NavbarDemo />
        {/* <LoaderFourDemo /> */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
