import "./globals.css";
import Footer from "@/components/common/Footer";
import { NavbarDemo } from "@/components/common/CardNav";
import { LoaderFourDemo } from "@/components/common/Loader"; 
// ya phir LoaderFourDemo use karo

export const metadata = {
  title: "Veltrix | Gym Website",
  description: "Sculpt Your Body, Elevate Your Spirit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <NavbarDemo />
        {/* <LoaderFourDemo />   */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
