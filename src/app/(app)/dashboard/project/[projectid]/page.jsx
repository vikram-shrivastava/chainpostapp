'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Image, 
  FileText, 
  Download, 
  Clock, 
  HardDrive, 
  Calendar, 
  FileVideo,
  Captions,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';

function Field({ label, children, icon: Icon }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="text-sm text-slate-900">
        {children ?? <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}

function formatMB(v) {
  return typeof v === 'number' ? `${v.toFixed(2)} MB` : null;
}

function formatSeconds(s) {
  if (typeof s !== 'number') return null;
  const minutes = Math.floor(s / 60);
  const seconds = Math.round(s % 60);
  return `${minutes}m ${seconds}s`;
}

function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function ProjectPage() {
  const { projectid } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectid) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/getProjectbyid?id=${projectid}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Loading Project...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Error Loading Project</h2>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const {
    type,
    compressedUrl,
    fileName = 'Untitled',
    fileSizeMB,
    compressedSizeMB,
    duration,
    format,
    generatedCaptions,
    generatedPostText,
    projectTitle,
    thumbnailUrl,
    createdAt,
    updatedAt,
  } = project;

  const typeConfig = {
    videoCompression: { icon: FileVideo, label: 'Video Compression', color: 'blue' },
    videoCaption: { icon: Captions, label: 'Video Caption', color: 'purple' },
    generatePost: { icon: Sparkles, label: 'Generate Post', color: 'green' },
    imageResize: { icon: Image, label: 'Image Resize', color: 'orange' }
  };

  const config = typeConfig[type] || { icon: FileText, label: type, color: 'blue' };
  const TypeIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 shadow-md">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TypeIcon className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  config.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  config.color === 'green' ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {config.label}
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 break-words">
                {projectTitle || fileName}
              </h1>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {fileSizeMB && (
            <StatCard 
              icon={HardDrive} 
              label="Original Size" 
              value={formatMB(fileSizeMB)} 
              color="blue"
            />
          )}
          {compressedSizeMB && (
            <StatCard 
              icon={Download} 
              label="Compressed Size" 
              value={formatMB(compressedSizeMB)} 
              color="green"
            />
          )}
          {duration && (
            <StatCard 
              icon={Clock} 
              label="Duration" 
              value={formatSeconds(duration)} 
              color="purple"
            />
          )}
          {format && (
            <StatCard 
              icon={FileText} 
              label="Format" 
              value={format.toUpperCase()} 
              color="orange"
            />
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Type-specific details */}
            {type === 'videoCompression' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileVideo className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Compression Details</h2>
                </div>
                <Field label="Compressed File" icon={Download}>
                  {compressedUrl ? (
                    <a 
                      href={compressedUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Download compressed file
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Not available</span>
                  )}
                </Field>
              </div>
            )}

            {type === 'videoCaption' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Captions className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">Generated Captions</h2>
                </div>
                <Field label="Captions / Transcript">
                  {generatedCaptions ? (
                    <pre className="whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 max-h-96 overflow-y-auto">
                      {generatedCaptions}
                    </pre>
                  ) : (
                    <span className="text-slate-400">No captions generated</span>
                  )}
                </Field>
              </div>
            )}

            {type === 'generatePost' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-slate-900">Generated Content</h2>
                </div>
                <Field label="Post Text">
                  {generatedPostText ? (
                    <pre className="whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                      {generatedPostText}
                    </pre>
                  ) : (
                    <span className="text-slate-400">No post text generated</span>
                  )}
                </Field>
                <Field label="Thumbnail" icon={Image}>
                  {thumbnailUrl ? (
                    <a 
                      href={thumbnailUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Open thumbnail
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </Field>
              </div>
            )}

            {type === 'imageResize' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-slate-900">Resize Details</h2>
                </div>
                <Field label="Resized Image" icon={Download}>
                  {compressedUrl ? (
                    <a 
                      href={compressedUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Open resized image
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Not available</span>
                  )}
                </Field>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Info</h3>
              <Field label="File Name" icon={FileText}>
                {fileName}
              </Field>
              <Field label="Created On" icon={Calendar}>
                {createdAt ? new Date(createdAt).toLocaleString() : '—'}
              </Field>
              <Field label="Last Updated" icon={Clock}>
                {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
