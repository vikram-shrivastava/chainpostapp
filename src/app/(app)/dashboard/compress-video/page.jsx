'use client';

import { useState, useRef } from 'react';
import { Upload, Video, Download, X, Check, Loader2, FileVideo, Info, AlertCircle } from 'lucide-react';

export default function CompressVideoPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [compressedVideoUrl, setCompressedVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setIsComplete(false);
      setProgress(0);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setIsComplete(false);
      setProgress(0);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    // Simulate progress for UI feedback
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('originalsize', String(selectedFile.size));
      formData.append('captionneeded', 'false'); // No captions needed for compression

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to compress video');
      }

      const data = await response.json();
      
      setProgress(100);

      // Get compressed video URL from Cloudinary
      // Cloudinary automatically compresses and optimizes the video
      const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${data.publicId}.mp4`;
      
      setCompressedVideoUrl(cloudinaryUrl);
      setCompressedSize(parseInt(data.compressedsize));
      setIsComplete(true);
      setIsProcessing(false);

    } catch (err) {
      console.error('Compression error:', err);
      setError(err.message || 'Failed to compress video. Please try again.');
      setIsProcessing(false);
      setProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = async () => {
    if (!compressedVideoUrl) return;

    try {
      // Fetch the compressed video
      const response = await fetch(compressedVideoUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}-compressed.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download video. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedVideoUrl(null);
    setError(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Compress Video</h1>
              <p className="text-gray-600 mt-1">Reduce video file size without losing quality</p>
            </div>
          </div>
        </div>
        
        {/* Upload Area */}
        {!selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your video here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports MP4, MOV, AVI, WebM (Max 500MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium">
              Select Video File
            </button>
          </div>
        )}

        {/* Processing/Result Area */}
        {selectedFile && (
          <div className="space-y-6">
            {/* Video Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileVideo className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-600">Original size: {formatFileSize(originalSize)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Video Preview */}
                {videoPreview && !isComplete && (
                  <div className="mb-6">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg bg-black"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">
                        Compression Failed
                      </h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 py-6">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                      <span className="text-lg font-medium text-gray-700">
                        Compressing your video...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {progress < 30 && 'Uploading video...'}
                      {progress >= 30 && progress < 60 && 'Analyzing video...'}
                      {progress >= 60 && progress < 90 && 'Compressing and optimizing...'}
                      {progress >= 90 && 'Finalizing compression...'}
                    </div>
                  </div>
                )}

                {/* Completion State */}
                {isComplete && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800 mb-1">
                          Compression Complete!
                        </h4>
                        <p className="text-sm text-green-700">
                          Your video has been compressed successfully
                        </p>
                      </div>
                    </div>

                    {/* Compressed Video Preview */}
                    {compressedVideoUrl && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Compressed Video Preview</h4>
                        <video
                          src={compressedVideoUrl}
                          controls
                          className="w-full rounded-lg bg-black"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    )}

                    {/* Size Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Original Size</p>
                        <p className="text-2xl font-semibold text-gray-800">
                          {formatFileSize(originalSize)}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Compressed Size</p>
                        <p className="text-2xl font-semibold text-green-600">
                          {formatFileSize(compressedSize)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <span className="font-semibold">
                          Saved {Math.round((1 - compressedSize / originalSize) * 100)}%
                        </span>{' '}
                        of the original file size
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Compressed Video</span>
                    </button>
                  </div>
                )}

                {/* Compress Button */}
                {!isProcessing && !isComplete && (
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Video className="w-5 h-5" />
                    <span>Compress Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">💡 Compression Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>AI-powered compression maintains video quality while reducing file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Best for sharing videos on social media or via email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Original video is never modified, download creates a new file</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Optimized for MP4 format with automatic quality adjustment</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}