"use client";

import { Video, Type, FileText, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const tools = [
    {
      name: "Compress Video",
      icon: Video,
      color: "bg-orange-50 text-orange-500",
      description: "Reduce video file size",
    },
    {
      name: "Generate Captions",
      icon: Type,
      color: "bg-pink-50 text-pink-500",
      description: "Auto-generate subtitles",
    },
    {
      name: "Generate Post",
      icon: FileText,
      color: "bg-purple-50 text-purple-500",
      description: "Create social posts",
    },
    {
      name: "Image Resize",
      icon: Maximize2,
      color: "bg-teal-50 text-teal-500",
      description: "Resize images easily",
    },
  ];

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/get-projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-semibold text-gray-800 mb-6">
            What will you create today?
          </h1>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div
                  className={`w-16 h-16 ${tool.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <tool.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-gray-700 mb-1">
                  {tool.name}
                </span>
                <span className="text-xs text-gray-500">
                  {tool.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Projects
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {projects.map((project) => (
    <div
      key={project._id}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
    >
      {/* Thumbnail or Type Icon */}
      <div className="relative aspect-video overflow-hidden">
        {project.thumbnailUrl ? (
          <>
            <img
              src={project.thumbnailUrl}
              alt={project.projectTitle || "Project thumbnail"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className={`flex items-center justify-center w-full h-full ${
            project.type === "videoCompression" ? "bg-gradient-to-br from-orange-400 to-orange-600" :
            project.type === "videoCaption" ? "bg-gradient-to-br from-pink-400 to-pink-600" :
            project.type === "generatePost" ? "bg-gradient-to-br from-purple-400 to-purple-600" :
            "bg-gradient-to-br from-teal-400 to-teal-600"
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
              {project.type === "videoCompression" && (
                <Video className="relative w-16 h-16 text-white drop-shadow-lg" />
              )}
              {project.type === "videoCaption" && (
                <Type className="relative w-16 h-16 text-white drop-shadow-lg" />
              )}
              {project.type === "generatePost" && (
                <FileText className="relative w-16 h-16 text-white drop-shadow-lg" />
              )}
              {project.type === "imageResize" && (
                <Maximize2 className="relative w-16 h-16 text-white drop-shadow-lg" />
              )}
            </div>
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-opacity-90 flex items-center gap-1.5 shadow-sm ${
          project.type === "videoCompression" ? "bg-orange-50 text-orange-600" :
          project.type === "videoCaption" ? "bg-pink-50 text-pink-600" :
          project.type === "generatePost" ? "bg-purple-50 text-purple-600" :
          "bg-teal-50 text-teal-600"
        }`}>
          {project.type === "videoCompression" && <Video className="w-3 h-3" />}
          {project.type === "videoCaption" && <Type className="w-3 h-3" />}
          {project.type === "generatePost" && <FileText className="w-3 h-3" />}
          {project.type === "imageResize" && <Maximize2 className="w-3 h-3" />}
          <span>
            {project.type === "videoCompression" ? "Video Compression" :
             project.type === "videoCaption" ? "Video Caption" :
             project.type === "generatePost" ? "Generate Post" :
             "Image Resize"}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-800 truncate mb-3 group-hover:text-gray-900">
          {project.projectTitle || "Untitled Project"}
        </h3>

        {/* File metadata */}
        <div className="space-y-2 mb-3">
          {project.fileName && (
            <p className="text-xs text-gray-600 truncate">📄 {project.fileName}</p>
          )}
          {project.format && (
            <p className="text-xs text-gray-600">🎞️ Format: {project.format}</p>
          )}
          {project.fileSizeMB && (
            <p className="text-xs">
              <span className="text-gray-600">💾 Size: </span>
              <span className="font-medium text-gray-700">{project.fileSizeMB.toFixed(2)} MB</span>
              {project.compressedSizeMB && (
                <>
                  <span className="text-gray-400 mx-1">→</span>
                  <span className="font-medium text-green-600">{project.compressedSizeMB.toFixed(2)} MB</span>
                </>
              )}
            </p>
          )}
          {project.duration && (
            <p className="text-xs text-gray-600">⏱ Duration: {project.duration.toFixed(1)}s</p>
          )}
        </div>

        {/* Time info */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">📅</span>
          <p className="text-xs text-gray-500 font-medium">
            {new Date(project.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-blue-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  ))}
</div>
        </div>

        {/* Empty State for New Users */}
        <div className="mt-12 text-center p-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Ready to create something amazing?
          </h3>
          <p className="text-gray-600 mb-6">
            Choose a tool above to get started with your first project
          </p>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm font-medium">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}
