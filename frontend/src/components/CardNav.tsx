"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

export function NavbarDemo() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Products", link: "/products" },
    { name: "Trainers", link: "/trainers" },
    { name: "Blog", link: "/blog" },
    { name: "Contact Us", link: "/contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(
    null
  );

  useEffect(() => {
    // LocalStorage se user data fetch karo
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <div className="w-full fixed top-0 left-0 z-[1000]">
      <Navbar>
        {/* Desktop Navigation */}
      {/* Desktop Navigation */}
<NavBody className="hidden lg:flex">
  <NavbarLogo />
  <NavItems items={navItems} />
  <div className="flex items-center gap-2">
    {user ? (
      <div className="flex items-center gap-2">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full border-2 border-white/50"
        />
        <span className="text-white font-medium">{user.name}</span>
        <NavbarButton variant="secondary" onClick={handleLogout}>
          Logout
        </NavbarButton>
      </div>
    ) : (
      <>
        <NavbarButton variant="secondary">
          <Link href={"/login"}>Login</Link>
        </NavbarButton>
        <NavbarButton variant="primary">
          <Link href={"/register"}>Register</Link>
        </NavbarButton>
      </>
    )}
  </div>
</NavBody>

{/* Mobile Navigation */}
<MobileNav className="lg:hidden">
  <MobileNavHeader>
    <NavbarLogo />
    <MobileNavToggle
      isOpen={isMobileMenuOpen}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    />
  </MobileNavHeader>

  <MobileNavMenu
    isOpen={isMobileMenuOpen}
    onClose={() => setIsMobileMenuOpen(false)}
  >
    {navItems.map((item, idx) => (
      <Link
        key={`mobile-link-${idx}`}
        href={item.link}
        onClick={() => setIsMobileMenuOpen(false)}
        className="relative text-neutral-600 dark:text-neutral-300"
      >
        <span className="block">{item.name}</span>
      </Link>
    ))}
    <div className="flex w-full flex-col gap-4 mt-4">
      {user ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-white/50"
            />
            <span className="text-white font-medium">{user.name}</span>
          </div>
          <NavbarButton
            onClick={handleLogout}
            variant="primary"
            className="w-full"
          >
            Logout
          </NavbarButton>
        </>
      ) : (
        <>
          <NavbarButton
            onClick={() => setIsMobileMenuOpen(false)}
            variant="primary"
            className="w-full"
          >
            Login
          </NavbarButton>
          <NavbarButton
            onClick={() => setIsMobileMenuOpen(false)}
            variant="primary"
            className="w-full"
          >
            Register
          </NavbarButton>
        </>
      )}
    </div>
  </MobileNavMenu>
</MobileNav>

      </Navbar>
    </div>
  );
}
