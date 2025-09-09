"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-black text-white">
      <h1 className="text-primary text-2xl font-bold">FiTusion</h1>

      <ul className="flex gap-8">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/services">Services</Link></li>
        <li><Link href="/price">Price</Link></li>
        <li><Link href="/trainers">Trainers</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      <div className="flex gap-4">
        <button className="px-6 py-2 rounded-full bg-primary text-black font-semibold hover:opacity-80 transition">
          Contact Us
        </button>
        <button className="px-6 py-2 rounded-full border border-primary text-primary font-semibold hover:bg-primary  transition">
          <Link href={'/login'}>Login</Link>
        </button>
        <button className="px-6 py-2 rounded-full border border-primary text-primary font-semibold hover:bg-primary  transition">
          <Link href={'/register'}>Register</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
