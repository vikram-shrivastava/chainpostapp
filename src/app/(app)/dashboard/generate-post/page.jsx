'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, X, Check, Loader2, FileVideo, Image as ImageIcon, Copy, Sparkles, MessageSquare } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function GeneratePostPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [usePrevious, setUsePrevious] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [generatedPosts, setGeneratedPosts] = useState({});
  const [copiedPlatform, setCopiedPlatform] = useState(null);
  const fileInputRef = useRef(null);

  const [hasPreviousMedia] = useState(true);
  const previousMedia = {
    name: 'my-video.mp4',
    type: 'video',
    size: 15728640
  };

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-50 border-blue-200 text-blue-700', activeColor: 'bg-blue-500 text-white', maxLength: 3000 },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-pink-50 border-pink-200 text-pink-700', activeColor: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white', maxLength: 2200 },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-50 border-sky-200 text-sky-700', activeColor: 'bg-sky-500 text-white', maxLength: 280 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      setMediaPreview(URL.createObjectURL(file));
      setIsComplete(false);
      setUsePrevious(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      setMediaPreview(URL.createObjectURL(file));
      setIsComplete(false);
      setUsePrevious(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUsePrevious = () => {
    setSelectedFile(previousMedia);
    setFileType(previousMedia.type);
    setUsePrevious(true);
    setMediaPreview(null);
    setIsComplete(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('platform', 'all');
    formData.append('fileName', selectedFile.name);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        toast.error('Post generation failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      setGeneratedPosts(data.generatedPost); // data.generatedPost is already an object from backend
      setIsComplete(true);
      toast.success('Posts generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while generating posts.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (platformId) => {
    const postText = generatedPosts[platformId]?.[`post_text_${platformId}`];
    if (postText) {
      navigator.clipboard.writeText(postText);
      setCopiedPlatform(platformId);
      toast.success(`${platformId} post copied to clipboard!`);
      setTimeout(() => setCopiedPlatform(null), 2000);
    }
  };

  const handleDownloadAll = () => {
    let content = '';
    platforms.forEach(platform => {
      const postText = generatedPosts[platform.id]?.[`post_text_${platform.id}`];
      if (postText) {
        content += `=== ${platform.name.toUpperCase()} ===\n\n${postText}\n\n\n`;
      }
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-media-posts-${selectedFile?.name || 'media'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('All posts downloaded!');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileType(null);
    setIsProcessing(false);
    setIsComplete(false);
    setGeneratedPosts({});
    setUsePrevious(false);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast('Reset done!', { description: 'You can upload a new file now.' });
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-full">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Generate Post</h1>
              <p className="text-gray-600 mt-1">AI-powered social media content for all platforms</p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        {!selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop your media here or click to browse</h3>
            <p className="text-gray-600 mb-4">Supports Images (JPG, PNG) and Videos (MP4, MOV, AVI)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium">
              Select Media File
            </button>
          </div>
        )}

        {/* Processing & Generated Posts */}
        {selectedFile && (
          <div className="space-y-6">

            {/* Media Info & Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col space-y-4">

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {fileType === 'video' ? <FileVideo className="w-6 h-6 text-purple-500" /> : <ImageIcon className="w-6 h-6 text-purple-500" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-600">{usePrevious ? 'Using previously uploaded media' : `Size: ${formatFileSize(selectedFile.size)}`}</p>
                    </div>
                  </div>
                  <button onClick={handleReset} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {mediaPreview && !usePrevious && (
                  <div className="mb-6">
                    {fileType === 'video' ? (
                      <video src={mediaPreview} controls className="w-full rounded-lg bg-black" style={{ maxHeight: '400px' }} />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="w-full rounded-lg object-contain bg-gray-100" style={{ maxHeight: '400px' }} />
                    )}
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center space-x-3 py-6">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    <span className="text-lg font-medium text-gray-700">Generating posts with AI...</span>
                  </div>
                )}

                {!isProcessing && !isComplete && (
                  <button
                    onClick={handleGenerate}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Posts for All Platforms</span>
                  </button>
                )}

              </div>
            </div>

            {/* Generated Posts */}
            {isComplete && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-1">Posts Generated Successfully!</h4>
                    <p className="text-sm text-green-700">Your social media posts are ready for all platforms</p>
                  </div>
                </div>

                {/* Platform Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {platforms.map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${selectedPlatform === platform.id ? platform.activeColor : platform.color + ' border'}`}
                        >
                          {platform.icon} {platform.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    {platforms.map(platform => selectedPlatform === platform.id && (
                      <div key={platform.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-800">{platform.name} Post</h3>
                          </div>
                          <span className="text-sm text-gray-600">
                            {generatedPosts[platform.id]?.[`post_text_${platform.id}`]?.length || 0} / {platform.maxLength} characters
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {generatedPosts[platform.id]?.[`post_text_${platform.id}`]}
                          </pre>
                        </div>

                        <button
                          onClick={() => handleCopy(platform.id)}
                          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-sm font-medium ${copiedPlatform === platform.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {copiedPlatform === platform.id ? (
                            <>
                              <Check className="w-5 h-5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              <span>Copy {platform.name} Post</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDownloadAll}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium"
                >
                  <Download className="w-5 h-5" />
                  <span>Download All Posts</span>
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
