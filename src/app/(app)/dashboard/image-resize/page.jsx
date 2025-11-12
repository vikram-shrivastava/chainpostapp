'use client';

import { useState, useRef,useEffect } from 'react';
import { Upload, Maximize2, Download, X, Check, Loader2, Image, Smartphone, Monitor, Instagram, Linkedin, Twitter, Youtube, Facebook } from 'lucide-react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function ImageResizePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [resizedImages, setResizedImages] = useState({});
  const fileInputRef = useRef(null);
  const [isPageLoading, setIsPageLoading] = useState(true); // Page loading state


  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setIsPageLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  const platformPresets = [
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      icon: Instagram,
      width: 1080,
      height: 1080,
      ratio: '1:1',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      category: 'Social Media'
    },
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      icon: Instagram,
      width: 1080,
      height: 1920,
      ratio: '9:16',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      category: 'Social Media'
    },
    {
      id: 'facebook-post',
      name: 'Facebook Post',
      icon: Facebook,
      width: 1200,
      height: 630,
      ratio: '1.91:1',
      color: 'bg-blue-600',
      category: 'Social Media'
    },
    {
      id: 'facebook-cover',
      name: 'Facebook Cover',
      icon: Facebook,
      width: 820,
      height: 312,
      ratio: '2.63:1',
      color: 'bg-blue-600',
      category: 'Social Media'
    },
    {
      id: 'twitter-post',
      name: 'Twitter Post',
      icon: Twitter,
      width: 1200,
      height: 675,
      ratio: '16:9',
      color: 'bg-sky-500',
      category: 'Social Media'
    },
    {
      id: 'twitter-header',
      name: 'Twitter Header',
      icon: Twitter,
      width: 1500,
      height: 500,
      ratio: '3:1',
      color: 'bg-sky-500',
      category: 'Social Media'
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      icon: Linkedin,
      width: 1200,
      height: 627,
      ratio: '1.91:1',
      color: 'bg-blue-700',
      category: 'Social Media'
    },
    {
      id: 'linkedin-banner',
      name: 'LinkedIn Banner',
      icon: Linkedin,
      width: 1584,
      height: 396,
      ratio: '4:1',
      color: 'bg-blue-700',
      category: 'Social Media'
    },
    {
      id: 'youtube-thumbnail',
      name: 'YouTube Thumbnail',
      icon: Youtube,
      width: 1280,
      height: 720,
      ratio: '16:9',
      color: 'bg-red-600',
      category: 'Video'
    },
    {
      id: 'youtube-banner',
      name: 'YouTube Banner',
      icon: Youtube,
      width: 2560,
      height: 1440,
      ratio: '16:9',
      color: 'bg-red-600',
      category: 'Video'
    },
    {
      id: 'desktop-wallpaper',
      name: 'Desktop Wallpaper',
      icon: Monitor,
      width: 1920,
      height: 1080,
      ratio: '16:9',
      color: 'bg-gray-700',
      category: 'Wallpaper'
    },
    {
      id: 'mobile-wallpaper',
      name: 'Mobile Wallpaper',
      icon: Smartphone,
      width: 1080,
      height: 1920,
      ratio: '9:16',
      color: 'bg-gray-700',
      category: 'Wallpaper'
    },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      // Get original dimensions
      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      
      setIsComplete(false);
      setSelectedPlatforms([]);
      setResizedImages({});
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      
      setIsComplete(false);
      setSelectedPlatforms([]);
      setResizedImages({});
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

const handleResize = async () => {
  if (selectedPlatforms.length === 0 || !selectedFile) return;

  setIsProcessing(true);

  try {
    const resized = {};

    // Loop through each platform preset
    for (const platformId of selectedPlatforms) {
      const platform = platformPresets.find(p => p.id === platformId);
      if (!platform) continue;

      // Create form data for backend request
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('width', platform.width);
      formData.append('height', platform.height);
      formData.append('fileName', selectedFile.name);

      // Send POST request to backend
      const response = await fetch('/api/image-resize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Resize failed:', data.message);
        continue;
      }

      // Store resized image info
      resized[platformId] = {
        url: data.resizedUrl,
        width: platform.width,
        height: platform.height,
        name: platform.name,
      };
    }

    setResizedImages(resized);
    setIsComplete(true);
  } catch (error) {
    console.error('Error resizing image:', error);
  } finally {
    setIsProcessing(false);
  }
};


const handleDownloadSingle = async (platformId) => {
  try {
    const image = resizedImages[platformId];
    toast.loading("Downloading image...");

    const response = await fetch(image.url);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const fileName = `${image.name.replace(/\s+/g, "_")}_${image.width}x${image.height}.jpg`;
    saveAs(blob, fileName);

    toast.dismiss();
    toast.success(`✅ ${image.name} downloaded successfully`);
  } catch (error) {
    console.error("Download failed:", error);
    toast.dismiss();
    toast.error("❌ Failed to download image. Please try again.");
  }
};

const handleDownloadAll = async () => {
  if (!Object.keys(resizedImages).length) {
    toast.error("No images to download.");
    return;
  }

  try {
    toast.loading("Preparing ZIP file...");

    const zip = new JSZip();
    const folder = zip.folder("Resized_Images");

    for (const [platformId, image] of Object.entries(resizedImages)) {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const fileName = `${image.name.replace(/\s+/g, "_")}_${image.width}x${image.height}.jpg`;
      folder.file(fileName, arrayBuffer);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Resized_Images.zip");

    toast.dismiss();
    toast.success("🎉 All images downloaded as ZIP");
  } catch (error) {
    console.error("ZIP download failed:", error);
    toast.dismiss();
    toast.error("❌ Failed to download all images. Please try again.");
  }
};


  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setSelectedPlatforms([]);
    setResizedImages({});
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const groupedPlatforms = platformPresets.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {});


    if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 min-h-full">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Image Resize</h1>
              <p className="text-gray-600 mt-1">Resize images for any platform or device</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your image here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports JPG, PNG, WebP (Max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm font-medium">
              Select Image
            </button>
          </div>
        )}

        {/* Main Content */}
        {selectedFile && !isComplete && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Side - Image Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Original Image</h3>
                    <p className="text-sm text-gray-600">
                      {originalDimensions.width} × {originalDimensions.height} px
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-lg object-contain bg-gray-100"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Image className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-teal-700">
                      <p className="font-medium mb-1">Selected: {selectedPlatforms.length} platforms</p>
                      <p className="text-xs text-teal-600">
                        Choose platforms from the right panel to resize your image
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Platform Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1">Select Platforms</h3>
                <p className="text-sm text-gray-600">Choose one or more platforms to resize for</p>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {Object.entries(groupedPlatforms).map(([category, platforms]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                            selectedPlatforms.includes(platform.id)
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                              <platform.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-800">{platform.name}</p>
                              <p className="text-xs text-gray-600">
                                {platform.width} × {platform.height} ({platform.ratio})
                              </p>
                            </div>
                          </div>
                          {selectedPlatforms.includes(platform.id) && (
                            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resize Button */}
              {selectedPlatforms.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={handleResize}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm font-medium disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Resizing...</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-5 h-5" />
                        <span>Resize for {selectedPlatforms.length} Platform{selectedPlatforms.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {isComplete && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-1">
                  Resize Complete!
                </h4>
                <p className="text-sm text-green-700">
                  Your images have been resized for {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
              >
                Resize Another
              </button>
            </div>

            {/* Resized Images Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(resizedImages).map(([platformId, image]) => {
                const platform = platformPresets.find(p => p.id === platformId);
                return (
                  <div key={platformId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                          <platform.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{image.name}</p>
                          <p className="text-xs text-gray-600">
                            {image.width} × {image.height}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadSingle(platformId)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download All Button */}
            <button
              onClick={handleDownloadAll}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Download All as ZIP</span>
            </button>
          </div>
        )}

        {/* Tips Card */}
        {selectedFile && !isComplete && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">💡 Resize Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Select multiple platforms to batch resize your image</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Images maintain aspect ratio and quality during resize</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Perfect for social media managers and content creators</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Download all resized images as a ZIP file for convenience</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}