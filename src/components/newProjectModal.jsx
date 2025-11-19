'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Type, 
  FileText, 
  Maximize2, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function NewProjectModal({ isOpen, onClose }) {
  const tools = [
    {
      id: 'compress',
      name: 'Compress Video',
      description: 'Reduce file size efficiently while maintaining quality.',
      icon: Video,
      href: '/dashboard/compress-video',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200',
      hoverBg: 'hover:bg-blue-50/50'
    },
    {
      id: 'captions',
      name: 'Auto Captions',
      description: 'Generate accurate subtitles in seconds using AI.',
      icon: Type,
      href: '/dashboard/generate-captions',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200',
      hoverBg: 'hover:bg-indigo-50/50'
    },
    {
      id: 'post',
      name: 'AI Post Generator',
      description: 'Turn media into viral posts for LinkedIn & Twitter.',
      icon: FileText,
      href: '/dashboard/generate-post',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'hover:border-purple-200',
      hoverBg: 'hover:bg-purple-50/50'
    },
    {
      id: 'resize',
      name: 'Magic Resize',
      description: 'Smartly crop and resize images for any platform.',
      icon: Maximize2,
      href: '/dashboard/image-resize',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'hover:border-pink-200',
      hoverBg: 'hover:bg-pink-50/50'
    },
  ];

  // Close modal on Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
                  <p className="text-sm text-slate-500">Select a tool to get started</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid */}
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
              {tools.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={tool.href}
                  onClick={onClose}
                  className={`group relative p-5 rounded-2xl border border-slate-200 transition-all duration-300 ${tool.border} ${tool.hoverBg} hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${tool.bg} ${tool.color}`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">Esc</kbd> to cancel
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
