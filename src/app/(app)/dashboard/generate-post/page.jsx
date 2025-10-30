'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, X, Check, Loader2, FileVideo, Image as ImageIcon, Copy, Sparkles, MessageSquare } from 'lucide-react';

export default function GeneratePostPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [usePrevious, setUsePrevious] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [generatedPosts, setGeneratedPosts] = useState({});
  const [copiedPlatform, setCopiedPlatform] = useState(null);
  const fileInputRef = useRef(null);

  // Simulate previously uploaded media
  const [hasPreviousMedia] = useState(true);
  const previousMedia = {
    name: 'my-video.mp4',
    type: 'video',
    size: 15728640
  };

  const platforms = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      activeColor: 'bg-blue-500 text-white',
      maxLength: 3000 
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸', 
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      activeColor: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      maxLength: 2200 
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      color: 'bg-sky-50 border-sky-200 text-sky-700',
      activeColor: 'bg-sky-500 text-white',
      maxLength: 280 
    },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setIsComplete(false);
      setProgress(0);
      setUsePrevious(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setIsComplete(false);
      setProgress(0);
      setUsePrevious(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUsePrevious = () => {
    setSelectedFile(previousMedia);
    setFileType(previousMedia.type);
    setUsePrevious(true);
    setMediaPreview(null);
    setIsComplete(false);
    setProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const generateSamplePosts = () => {
    return {
      linkedin: `🚀 Excited to share our latest project!

We've been working on something truly innovative that will transform the way teams collaborate. This journey has taught us invaluable lessons about perseverance, innovation, and the power of teamwork.

Key takeaways from this experience:
✅ Always listen to user feedback
✅ Iterate quickly and often
✅ Celebrate small wins along the way

What challenges have you overcome in your recent projects? I'd love to hear your thoughts in the comments!

#Innovation #TeamWork #ProductDevelopment #TechCommunity`,
      
      instagram: `✨ New creation alert! ✨

Thrilled to finally share what we've been working on behind the scenes 🎬

The journey from concept to reality has been incredible, and I can't wait for you to experience it! 💫

Swipe to see the process 👉

What do you think? Drop your thoughts below! 👇

.
.
.
#NewProject #CreativeProcess #BehindTheScenes #Innovation #ContentCreator #CreateDaily #DigitalArt #CreativeLife #MakerMovement`,
      
      twitter: `🚀 Just launched something we've been working on for months!

The future of [your product] is here. Can't wait to hear what you think!

Check it out 👇`
    };
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsComplete(true);
          setGeneratedPosts(generateSamplePosts());
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCopy = (platform) => {
    navigator.clipboard.writeText(generatedPosts[platform]);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const handleDownloadAll = () => {
    let content = '';
    platforms.forEach(platform => {
      content += `=== ${platform.name.toUpperCase()} ===\n\n`;
      content += generatedPosts[platform.id];
      content += '\n\n\n';
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
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileType(null);
    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
    setGeneratedPosts({});
    setUsePrevious(false);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-full">
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

        {/* Previous Media Option */}
        {hasPreviousMedia && !selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {previousMedia.type === 'video' ? (
                    <FileVideo className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Use Previously Uploaded Media?
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    {previousMedia.name} ({formatFileSize(previousMedia.size)})
                  </p>
                  <p className="text-xs text-blue-600">
                    Generate social media posts for your recently uploaded {previousMedia.type}
                  </p>
                </div>
              </div>
              <button
                onClick={handleUsePrevious}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Use This {previousMedia.type === 'video' ? 'Video' : 'Image'}
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your media here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports Images (JPG, PNG) and Videos (MP4, MOV, AVI)
            </p>
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

        {/* Processing/Result Area */}
        {selectedFile && (
          <div className="space-y-6">
            {/* Media Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {fileType === 'video' ? (
                        <FileVideo className="w-6 h-6 text-purple-500" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {usePrevious ? 'Using previously uploaded media' : `Size: ${formatFileSize(selectedFile.size)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Media Preview */}
                {mediaPreview && !usePrevious && (
                  <div className="mb-6">
                    {fileType === 'video' ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full rounded-lg bg-black"
                        style={{ maxHeight: '400px' }}
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-full rounded-lg object-contain bg-gray-100"
                        style={{ maxHeight: '400px' }}
                      />
                    )}
                  </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 py-6">
                      <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                      <span className="text-lg font-medium text-gray-700">
                        Generating posts with AI...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {progress < 40 && 'Analyzing content...'}
                      {progress >= 40 && progress < 80 && 'Creating engaging posts...'}
                      {progress >= 80 && 'Optimizing for each platform...'}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
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
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-1">
                      Posts Generated Successfully!
                    </h4>
                    <p className="text-sm text-green-700">
                      Your social media posts are ready for all platforms
                    </p>
                  </div>
                </div>

                {/* Platform Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                            selectedPlatform === platform.id
                              ? platform.activeColor
                              : platform.color + ' border'
                          }`}
                        >
                          {platform.icon} {platform.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {platforms.map((platform) => (
                      selectedPlatform === platform.id && (
                        <div key={platform.id} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-5 h-5 text-gray-600" />
                              <h3 className="font-semibold text-gray-800">
                                {platform.name} Post
                              </h3>
                            </div>
                            <span className="text-sm text-gray-600">
                              {generatedPosts[platform.id]?.length} / {platform.maxLength} characters
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                              {generatedPosts[platform.id]}
                            </pre>
                          </div>

                          <button
                            onClick={() => handleCopy(platform.id)}
                            className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-sm font-medium ${
                              copiedPlatform === platform.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
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
                      )
                    ))}
                  </div>
                </div>

                {/* Download All Button */}
                <button
                  onClick={handleDownloadAll}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium"
                >
                  <Download className="w-5 h-5" />
                  <span>Download All Posts</span>
                </button>
              </div>
            )}

            {/* Tips Card */}
            {!isComplete && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  AI Post Generation Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Platform-optimized content tailored to each audience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Proper hashtags and formatting for maximum engagement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Character limits respected for each platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Professional tone with engaging call-to-actions</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}