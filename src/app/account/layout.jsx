"use client";

import { useState } from "react";
import { 
  Menu, 
  X, 
  ChevronLeft, 
  Layers, 
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',_sans-serif] text-slate-900 selection:bg-indigo-100 flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left: Logo & Back */}
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">
                  NexusCreate
                </span>
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <Link 
                href="/dashboard" 
                className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
            </div>

            {/* Right: User Profile */}
            <div className="hidden md:flex items-center gap-4">
              {isLoaded && user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-3 mb-2">
              {user?.imageUrl && (
                <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
              )}
              <div>
                <p className="font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <SignOutButton>
              <button className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </SignOutButton>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* This container is specifically styled to house the Clerk UserProfile component nicely */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex justify-center">
           {children}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
             </div>
             <span className="text-sm font-semibold text-slate-900">NexusCreate</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NexusCreate. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help</a>
          </div>
        </div>
      </footer>

    </div>
  );
}