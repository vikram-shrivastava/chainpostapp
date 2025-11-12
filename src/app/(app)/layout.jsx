'use client';

import { useState } from 'react';
import { Menu, Bell, Search, CircleArrowLeft, CircleArrowRight, ChevronLeft,ChevronRight, Video, Type, FileText, Maximize2, Settings, HelpCircle, LayoutDashboard, Zap, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const router = useRouter();
  const sidebarTools = [
    { name: 'Compress Video', icon: Video, href: '/dashboard/compress-video' },
    { name: 'Generate Captions', icon: Type, href: '/dashboard/generate-captions' },
    { name: 'Generate Post', icon: FileText, href: '/dashboard/generate-post' },
    { name: 'Image Resize', icon: Maximize2, href: '/dashboard/image-resize' },
  ];
  const handleRoute=()=>{
    router.push("/account")
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
       <>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 84 : 256 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed md:static inset-y-0 left-0 z-40 flex flex-col border-r border-gray-200 bg-white overflow-hidden"
      >
        {/* Logo Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" />
            </div>

            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  key="chainpost"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="ml-3 text-xl font-semibold text-gray-800 whitespace-nowrap"
                >
                  ChainPost
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content: Dashboard + Tools + Bottom Icons */}
        <div
          className={`flex-1 flex flex-col ${
            sidebarCollapsed ? "justify-center items-center" : ""
          } px-3 py-2 overflow-y-auto`}
        >
          {/* Dashboard */}
          <Link href="/dashboard" className="w-full mb-4">
            <button
              className={`w-full flex items-center justify-center md:justify-start px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.4 }}
                    className="ml-2 font-medium"
                  >
                    Dashboard
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </Link>

          {/* Tools Section */}
          <nav className="flex-1 w-full">
            {/* Tools Label */}
            <p
              className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center md:text-left ${
                sidebarCollapsed ? "hidden" : ""
              }`}
            >
              Tools
            </p>

            {sidebarTools.map((tool, index) => (
              <Link href={tool.href} key={index} className="w-full mb-2">
                <button
                  className="w-full flex items-center px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title={sidebarCollapsed ? tool.name : ""}
                >
                  <tool.icon className="w-5 h-5" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.4 }}
                        className="ml-3 text-sm font-medium"
                      >
                        {tool.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div
            className={`mt-auto flex flex-col space-y-1 w-full ${
              sidebarCollapsed ? "items-center" : ""
            }`}
          >
            <Link href="/dashboard/settings" className="w-full">
              <button
                className="w-full flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                title={sidebarCollapsed ? "Settings" : ""}
              >
                <Settings className="w-5 h-5" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.4 }}
                      className="ml-3 text-sm"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Link>

            <Link href="/dashboard/help" className="w-full">
              <button
                className="w-full flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                title={sidebarCollapsed ? "Help" : ""}
              >
                <HelpCircle className="w-5 h-5" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                      className="ml-3 text-sm"
                    >
                      Help
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Floating Collapse Button */}
      <motion.button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        initial={false}
        animate={{
          left: sidebarCollapsed ? 72 : 248,
          rotate: sidebarCollapsed ? 360 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-20 z-50 bg-white border border-gray-200 shadow-md rounded-full p-2 text-gray-700 hover:bg-gray-100 transition"
      >
        {sidebarCollapsed ? (
          <CircleArrowRight className="w-5 h-5" />
        ) : (
          <CircleArrowLeft className="w-5 h-5" />
        )}
      </motion.button>
    </>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search designs, folders and uploads"
                className="w-full pl-10 pr-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100" title='notifications'>
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" title='User Account'>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center" onClick={()=>handleRoute()}>
                <User/>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Children from page.jsx */}
        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}