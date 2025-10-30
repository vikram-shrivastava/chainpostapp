'use client';

import { Video, Type, FileText, Maximize2 } from 'lucide-react';

export default function DashboardPage() {
  const tools = [
    { name: 'Compress Video', icon: Video, color: 'bg-orange-50 text-orange-500', description: 'Reduce video file size' },
    { name: 'Generate Captions', icon: Type, color: 'bg-pink-50 text-pink-500', description: 'Auto-generate subtitles' },
    { name: 'Generate Post', icon: FileText, color: 'bg-purple-50 text-purple-500', description: 'Create social posts' },
    { name: 'Image Resize', icon: Maximize2, color: 'bg-teal-50 text-teal-500', description: 'Resize images easily' },
  ];

  const recentProjects = [
    { id: 1, name: 'Video Project 1', type: 'video', color: 'from-orange-100 to-orange-200' },
    { id: 2, name: 'Caption Project', type: 'caption', color: 'from-pink-100 to-pink-200' },
    { id: 3, name: 'Social Post', type: 'post', color: 'from-purple-100 to-purple-200' },
    { id: 4, name: 'Image Resize', type: 'image', color: 'from-teal-100 to-teal-200' },
  ];

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
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div className={`w-16 h-16 ${tool.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-gray-700 mb-1">{tool.name}</span>
                <span className="text-xs text-gray-500">{tool.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer"
              >
                <div className={`aspect-video bg-gradient-to-br ${project.color} rounded-lg hover:shadow-lg transition-all border border-gray-200 flex items-center justify-center mb-2`}>
                  {project.type === 'video' && <Video className="w-12 h-12 text-orange-400" />}
                  {project.type === 'caption' && <Type className="w-12 h-12 text-pink-400" />}
                  {project.type === 'post' && <FileText className="w-12 h-12 text-purple-400" />}
                  {project.type === 'image' && <Maximize2 className="w-12 h-12 text-teal-400" />}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {project.name}
                </p>
                <p className="text-xs text-gray-500">2 days ago</p>
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