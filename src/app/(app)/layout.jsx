'use client';

import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, Video, Type, FileText, Maximize2, Settings, HelpCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarTools = [
    { name: 'Compress Video', icon: Video, href: '/dashboard/compress-video' },
    { name: 'Generate Captions', icon: Type, href: '/dashboard/generate-captions' },
    { name: 'Generate Post', icon: FileText, href: '/dashboard/generate-post' },
    { name: 'Image Resize', icon: Maximize2, href: '/dashboard/image-resize' },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
            <span className="ml-3 text-xl font-semibold text-gray-800">YourBrand</span>
          </div>

          {/* Dashboard Button */}
          <div className="p-4">
            <Link href="/dashboard">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                <span className="font-medium">Dashboard</span>
              </button>
            </Link>
          </div>

          {/* Navigation - Tools */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Tools
              </p>
              {sidebarTools.map((tool, index) => (
                <Link href={tool.href} key={index}>
                  <button className="w-full flex items-center px-3 py-2.5 mb-1 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <tool.icon className="w-5 h-5" />
                    <span className="ml-3 text-sm font-medium">{tool.name}</span>
                  </button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom Icons */}
          <div className="p-3 border-t border-gray-200 space-y-1">
            <Link href="/dashboard/settings">
              <button className="w-full flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="ml-3 text-sm">Settings</span>
              </button>
            </Link>
            <Link href="/dashboard/help">
              <button className="w-full flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="ml-3 text-sm">Help</span>
              </button>
            </Link>
          </div>
        </div>
      </aside>

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
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Main Content Area - Children from page.jsx */}
        <main className="flex-1 overflow-y-auto">
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