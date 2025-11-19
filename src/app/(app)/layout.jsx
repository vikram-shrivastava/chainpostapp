'use client';

import { useState } from 'react';
import NewProjectModal from '@/components/newProjectModal';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Type, 
  FileText, 
  Maximize2, 
  Settings, 
  HelpCircle, 
  LayoutDashboard, 
  Layers, 
  User, 
  LogOut,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {useUser} from "@clerk/nextjs";
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  const router = useRouter();
  const pathname = usePathname(); // To highlight active route
  const {user}=useUser();
  const sidebarTools = [
    { name: 'Compress Video', icon: Video, href: '/dashboard/compress-video', color: 'text-blue-600' },
    { name: 'Auto Captions', icon: Type, href: '/dashboard/generate-captions', color: 'text-indigo-600' },
    { name: 'AI Post Generator', icon: FileText, href: '/dashboard/generate-post', color: 'text-purple-600' },
    { name: 'Magic Resize', icon: Maximize2, href: '/dashboard/image-resize', color: 'text-pink-600' },
  ];


  const getInitials = (fullName) => {
  if (!fullName) return "JD";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

  const handleAccountRoute = () => {
    router.push("/account");
  };

  // Helper to check if link is active
  const isActive = (href) => pathname === href;

  return (
    <>
       {/* Font Import (Ensure consistent styling) */}
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>

      <div className="flex h-screen bg-slate-50 font-['Inter',_sans-serif] text-slate-900 overflow-hidden selection:bg-indigo-100">
        
        {/* --- SIDEBAR --- */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 80 : 260 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:flex flex-col border-r border-slate-200 bg-white z-30 relative"
        >
          {/* Logo Header */}
          <div className="h-16 flex items-center px-5 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="min-w-[32px] w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                <Layers className="w-4 h-4 text-white" />
              </div>
              
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-slate-900 whitespace-nowrap tracking-tight"
                  >
                    NexusCreate
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Collapse Button (Absolute positioned on border) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 z-40 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 p-1 rounded-full shadow-sm transition-all"
          >
             {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Content Container */}
          <div className="flex-1 flex flex-col px-3 py-6 overflow-y-auto scrollbar-none">
            
            {/* Create Button */}
            <div className="mb-8 px-1">
              <button 
              onClick={() => setIsModalOpen(true)}
                className={`flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200 transition-all ${sidebarCollapsed ? 'p-3' : 'py-3 px-4'}`}
              >
                <Plus className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-2 font-semibold">New Project</span>}
              </button>
            </div>

            <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Main Menu */}
            <div className="space-y-1 mb-8">
               {!sidebarCollapsed && (
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Overview
                </p>
               )}
               
              <Link href="/dashboard">
                <div className={`flex items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isActive('/dashboard') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-500'}`} />
                  {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">Dashboard</span>}
                </div>
              </Link>
            </div>

            {/* Tools Menu */}
            <div className="space-y-1 flex-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Creative Tools
                </p>
              )}
              
              {sidebarTools.map((tool, index) => (
                <Link href={tool.href} key={index}>
                  <div className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group cursor-pointer ${
                    isActive(tool.href)
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}>
                    <tool.icon className={`w-5 h-5 transition-colors ${isActive(tool.href) ? tool.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">{tool.name}</span>}
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-1 pt-6 border-t border-slate-100">
              <Link href="/dashboard/settings">
                <div className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <Settings className="w-5 h-5 text-slate-400" />
                  {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">Settings</span>}
                </div>
              </Link>
              <Link href="/dashboard/help">
                <div className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">Support</span>}
                </div>
              </Link>
            </div>
          </div>

          {/* User Profile Mini (Collapsed/Expanded logic) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
             <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} gap-3`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
                  {getInitials(user?.fullName)}
                </div>
                {!sidebarCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName || "John Doe"}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress || "Free Plan"}</p>
                  </div>
                )}
             </div>
          </div>
        </motion.aside>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
            
            {/* Mobile Toggle & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Breadcrumb placeholder */}
              <h1 className="text-lg font-semibold text-slate-800 hidden md:block">Dashboard</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search your projects..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-sm placeholder:text-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                   <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">⌘K</span>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <button 
                onClick={handleAccountRoute}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all"
              >
                 <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                   {getInitials(user?.fullName)}
                 </div>
                 <span className="text-sm font-medium text-slate-700 hidden md:block">Account</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
          </main>
        </div>

        {/* --- MOBILE SIDEBAR OVERLAY --- */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
              />
              
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col border-r border-slate-200 shadow-2xl md:hidden"
              >
                {/* Mobile Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">NexusCreate</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 -mr-2 text-slate-500">
                    <ChevronLeft size={20} />
                  </button>
                </div>

                {/* Mobile Sidebar Content */}
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                  <div className="mb-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-lg shadow-slate-200">
                      <Plus size={18} /> New Project
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                      <div className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                         <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                      </div>
                    </Link>
                    {sidebarTools.map((tool, idx) => (
                      <Link href={tool.href} key={idx} onClick={() => setSidebarOpen(false)}>
                        <div className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                          <tool.icon className={`w-5 h-5 mr-3 ${tool.color}`} /> {tool.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Sidebar Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={handleAccountRoute}>
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">JD</div>
                    <div>
                      <p className="font-semibold text-slate-900">John Doe</p>
                      <p className="text-xs text-slate-500">john@example.com</p>
                    </div>
                    <LogOut className="w-5 h-5 text-slate-400 ml-auto" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}