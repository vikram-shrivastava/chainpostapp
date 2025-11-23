'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, 
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
  AlertCircle,
  ChevronLeft,
  Share2,
  MoreVertical,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  // New imports for the update
  Copy,
  Check,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

// --- Helper Components ---

function StatCard({ icon: Icon, label, value, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600", 
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    slate: "bg-slate-100 text-slate-600"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.slate}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      {action}
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

export default function ProjectPage() {
  const { projectid } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State to handle copy feedback (stores the key of the copied item)
  const [copyStatus, setCopyStatus] = useState(null);

  useEffect(() => {
    if (!projectid) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/getProjectbyid?id=${projectid}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Project not found`);
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

  // Helper function to handle copying text
  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus(key);
    setTimeout(() => setCopyStatus(null), 2000); // Reset after 2 seconds
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-lg font-medium text-slate-600">Loading Project Details...</h2>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-500 mb-8">{error || "The project you are looking for does not exist or has been deleted."}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    type,
    compressedUrl,
    fileName = 'Untitled Project',
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

  // Configuration for dynamic UI based on project type
  const typeConfig = {
    videoCompression: { 
      icon: FileVideo, 
      label: 'Video Compression', 
      accent: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    videoCaption: { 
      icon: Captions, 
      label: 'Auto Captions', 
      accent: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    generatePost: { 
      icon: Sparkles, 
      label: 'AI Post Generator', 
      accent: 'text-purple-600', 
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    imageResize: { 
      icon: Maximize2, 
      label: 'Magic Resize', 
      accent: 'text-pink-600', 
      bg: 'bg-pink-50',
      border: 'border-pink-100'
    }
  };

  const config = typeConfig[type] || { icon: FileText, label: type, accent: 'text-slate-600', bg: 'bg-slate-50' };
  const TypeIcon = config.icon;

  return (
    <div className="min-h-full font-['Inter',_sans-serif] pb-12">
      
      {/* --- BREADCRUMB & HEADER --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          
          <div className="flex items-start gap-6">
            {/* Thumbnail */}
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Project thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Title & Meta */}
            <div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 ${config.bg} ${config.accent}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {config.label}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{projectTitle || fileName}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(createdAt).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Last updated {new Date(updatedAt).toLocaleDateString()}
                  </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex shadow-sm">
                <Share2 className="w-4 h-4" />
                Share
             </button>
             <button className="px-3 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                <MoreVertical className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS GRID */}
          <div className="grid sm:grid-cols-2 gap-4">
            {fileSizeMB && (
              <StatCard 
                icon={HardDrive} 
                label="Original Size" 
                value={formatMB(fileSizeMB)} 
                color="slate"
              />
            )}
            {compressedSizeMB && (
              <StatCard 
                icon={Download} 
                label="Optimized Size" 
                value={formatMB(compressedSizeMB)} 
                color="emerald"
              />
            )}
            {duration && (
              <StatCard 
                icon={Clock} 
                label="Duration" 
                value={formatSeconds(duration)} 
                color="blue"
              />
            )}
            {format && (
              <StatCard 
                icon={FileText} 
                label="Format" 
                value={format.toUpperCase()} 
                color="amber"
              />
            )}
          </div>

          {/* DETAILS CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 min-h-[400px]">
            
            {/* Video Compression Layout */}
            {type === 'videoCompression' && (
              <>
                <SectionHeader icon={FileVideo} title="Compression Result" />
                <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                         <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Compression Successful</h3>
                      <p className="text-slate-500 mb-6">
                        Reduced by {Math.round(((fileSizeMB - compressedSizeMB) / fileSizeMB) * 100)}%
                      </p>
                      
                      {compressedUrl ? (
                        <div className="flex justify-center">
                          <a 
                            href={compressedUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                          >
                            <Download className="w-5 h-5" /> Download Optimized Video
                          </a>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm">File preview unavailable</p>
                      )}
                   </div>
                </div>
              </>
            )}

            {/* Video Captions Layout */}
            {type === 'videoCaption' && (
              <>
                <SectionHeader icon={Captions} title="Transcript & Captions" action={
                   <button 
                    onClick={() => copyToClipboard(generatedCaptions, 'transcript')}
                    className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline"
                   >
                      {copyStatus === 'transcript' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copyStatus === 'transcript' ? 'Copied!' : 'Copy Text'}
                   </button>
                } />
                <div className="relative">
                   {generatedCaptions ? (
                     <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 max-h-[500px] overflow-y-auto">
                       <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm">
                         {generatedCaptions}
                       </pre>
                     </div>
                   ) : (
                     <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       No captions generated for this project.
                     </div>
                   )}
                </div>
              </>
            )}

            {/* Post Generator Layout - UPDATED SECTION */}
            {type === 'generatePost' && (
              <>
                <SectionHeader icon={Sparkles} title="AI Generated Content" />
                <div className="space-y-6">
                   {generatedPostText ? (
                     <div className="grid gap-6">
                        
                        {/* Twitter / X Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                           <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                 <Twitter className="w-4 h-4 text-sky-500" />
                                 <span>Twitter / X</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(generatedPostText.twitter?.post_text_twitter, 'twitter')}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors"
                              >
                                {copyStatus === 'twitter' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copyStatus === 'twitter' ? 'Copied!' : 'Copy'}
                              </button>
                           </div>
                           <div className="p-5 bg-white">
                              <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                {generatedPostText.twitter?.post_text_twitter || "No text generated."}
                              </p>
                           </div>
                        </div>

                        {/* Instagram Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                           <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                 <Instagram className="w-4 h-4 text-pink-600" />
                                 <span>Instagram</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(generatedPostText.instagram?.post_text_instagram, 'instagram')}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors"
                              >
                                {copyStatus === 'instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copyStatus === 'instagram' ? 'Copied!' : 'Copy'}
                              </button>
                           </div>
                           <div className="p-5 bg-white">
                              <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                {generatedPostText.instagram?.post_text_instagram || "No text generated."}
                              </p>
                           </div>
                        </div>

                        {/* LinkedIn Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                           <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                 <Linkedin className="w-4 h-4 text-blue-700" />
                                 <span>LinkedIn</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(generatedPostText.linkedin?.post_text_linkedin, 'linkedin')}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors"
                              >
                                {copyStatus === 'linkedin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copyStatus === 'linkedin' ? 'Copied!' : 'Copy'}
                              </button>
                           </div>
                           <div className="p-5 bg-white">
                              <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                {generatedPostText.linkedin?.post_text_linkedin || "No text generated."}
                              </p>
                           </div>
                        </div>

                     </div>
                   ) : (
                     <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       Content generation pending or failed.
                     </div>
                   )}
                </div>
              </>
            )}

            {/* Image Resize Layout */}
            {type === 'imageResize' && (
              <>
                <SectionHeader icon={ImageIcon} title="Resized Assets" />
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
                   {compressedUrl ? (
                      <div className="space-y-6">
                         <img src={compressedUrl} alt="Resized" className="max-h-[300px] mx-auto rounded-lg shadow-sm border border-slate-200" />
                         <a 
                           href={compressedUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                         >
                           <Download className="w-4 h-4" /> Download Image
                         </a>
                      </div>
                   ) : (
                      <p className="text-slate-400">Image not available</p>
                   )}
                </div>
              </>
            )}

          </div>
        </div>

        {/* --- RIGHT COLUMN: METADATA SIDEBAR --- */}
        <div className="space-y-6">
           
           {/* Project Info Card */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">File Information</h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-xs text-slate-500 mb-1">File Name</p>
                    <p className="text-sm font-medium text-slate-900 break-all">{fileName}</p>
                 </div>
                 <div className="h-px w-full bg-slate-100" />
                 <div>
                    <p className="text-xs text-slate-500 mb-1">Project ID</p>
                    <p className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">{projectid}</p>
                 </div>
                 <div className="h-px w-full bg-slate-100" />
                 <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Completed
                    </span>
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2">Need changes?</h3>
                 <p className="text-slate-300 text-sm mb-6">Start a new project using this file as a base.</p>
                 <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                   Start New Project <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
           </div>

        </div>

      </div>
    </div>
  );
}