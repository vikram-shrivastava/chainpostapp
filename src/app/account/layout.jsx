"use client";

import { useState, useEffect } from "react";
import { Zap, Sun, Moon, Menu, X, User, ChevronLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AccountLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();


  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 ">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center justify-center gap-4">
            <div>
              <Link href="/dashboard/settings">
                <ChevronLeft className="w-10 h-10 text-gray-600 dark:text-white hover:bg-gray-100 rounded-lg" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ChainPost
              </span>
            </div>
            </div>

            {/* Right side: Theme toggle + user */}
            <div className="hidden md:flex items-center space-x-4">

              {user ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 dark:border-slate-700">
                  <img
                    src={user.imageUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 pt-24 pb-16 px-6 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100  py-12 px-6 mt-auto text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ChainPost</span>
              </div>
              <p className="text-gray-700 mb-4">
                AI-powered content creation tools for modern creators.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4 text-black">Product</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#features" className="hover:text-gray-800 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-800 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-black">Company</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-gray-800 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-black">Legal</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-gray-800 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-gray-800 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 mb-4 md:mb-0">
              © {new Date().getFullYear()} ChainPost. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-700">
              <a href="#" className="hover:text-gray-800 transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-800 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gray-800 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
