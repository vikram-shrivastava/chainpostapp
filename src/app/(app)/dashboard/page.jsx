"use client";

import {
  Video,
  Type,
  FileText,
  Maximize2,
  HardDrive,
  File,
  Loader2,
  Plus,
  ArrowRight,
  Clock,
  MoreVertical,
  Sparkles,
  ChevronDown
} from "lucide-react";
import NewProjectModal from "@/components/newProjectModal";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  const tools = [
    {
      name: "Compress Video",
      icon: Video,
      href: "/dashboard/compress-video",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200",
      description: "Reduce file size without quality loss",
    },
    {
      name: "Auto Captions",
      icon: Type,
      href: "/dashboard/generate-captions",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
      description: "Generate subtitles automatically",
    },
    {
      name: "AI Post Generator",
      icon: FileText,
      href: "/dashboard/generate-post",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "group-hover:border-purple-200",
      description: "Create viral social media content",
    },
    {
      name: "Magic Resize",
      icon: Maximize2,
      href: "/dashboard/image-resize",
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "group-hover:border-pink-200",
      description: "Crop images for any platform",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Could not load recent projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const getProjectIcon = (type) => {
    switch(type) {
      case 'videoCompression': return Video;
      case 'videoCaption': return Type;
      case 'generatePost': return Sparkles;
      case 'imageResize': return Maximize2;
      default: return File;
    }
  };

  // Show only first N projects initially
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <div className="min-h-full font-['Inter',_sans-serif] pb-12">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                Welcome back, Creator!
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Ready to create something amazing today? Choose a tool to get started or continue with your recent projects.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 bg-white text-slate-900 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> New Project
            </button>
          </div>
          <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> 
        </div>

        {/* TOOLS GRID */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Tools</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link 
                href={tool.href} 
                key={index}
                className={`group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start h-full ${tool.border}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.bg} ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 flex-1">
                  {tool.description}
                </p>
                <div className="w-full flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Launch Tool</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RECENT PROJECTS */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Projects</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading your work...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Your creative journey starts here. Pick a tool above to create your first project!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleProjects.map((project) => {
                  const Icon = getProjectIcon(project.type);
                  return (
                    <Link 
                      key={project._id} 
                      href={`dashboard/project/${project._id}`}
                      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video relative bg-slate-100 overflow-hidden border-b border-slate-100">
                        {project.thumbnailUrl ? (
                          <>
                            <img 
                              src={project.thumbnailUrl} 
                              alt={project.projectTitle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors">
                            <Icon className="w-10 h-10 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm text-slate-700">
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {project.projectTitle || "Untitled Project"}
                          </h3>
                          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          {project.fileSizeMB && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                              <HardDrive className="w-3 h-3" />
                              {project.fileSizeMB.toFixed(1)} MB
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Toggle Down Arrow */}
              {projects.length > 4 && (
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showAllProjects ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
