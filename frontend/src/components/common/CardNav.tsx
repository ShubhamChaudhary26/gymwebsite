// components/ui/navbar-updated.tsx
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
import { useState, useEffect, useRef } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function NavbarDemo() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Products", link: "/products" },
    { name: "Trainers", link: "/trainers" },
    { name: "Blog", link: "/blog" },
    { name: "Contact Us", link: "/contact" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    } catch (error) {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <div className="w-full fixed top-0 left-0 z-[1000]">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="hidden lg:flex">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Circle Button */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#A2CD04] 
                               hover:border-[#8EBF03] transition-all duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A2CD04] to-[#8EBF03] 
                                  flex items-center justify-center hover:scale-110 transition-all duration-300
                                  hover:shadow-lg hover:shadow-[#A2CD04]/30">
                      <span className="text-black font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {/* Mini Dropdown - Only Profile & Logout */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 
                                rounded-lg shadow-2xl overflow-hidden animate-slideDown">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white 
                               hover:bg-[#A2CD04]/10 transition-colors duration-200"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 
                               hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200
                               border-t border-gray-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavbarButton variant="secondary">
                  <Link href="/login">Login</Link>
                </NavbarButton>
                <NavbarButton variant="primary">
                  <Link href="/register">Register</Link>
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation - UPDATED: No profile circle */}
        <MobileNav className="lg:hidden">
          <MobileNavHeader>
            <NavbarLogo />
            {/* REMOVED profile circle - Only hamburger toggle */}
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

            <div className="flex w-full flex-col gap-4 mt-4 pt-4 border-t border-gray-800">
              {user ? (
                <>
                  {/* Profile info in hamburger menu */}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-[#A2CD04]/10 border border-[#A2CD04]/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#A2CD04]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A2CD04] to-[#8EBF03] 
                                      flex items-center justify-center">
                          <span className="text-black font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-[#A2CD04] text-xs">View Profile →</p>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-400 text-center py-2 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/login");
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/register");
                    }}
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

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}