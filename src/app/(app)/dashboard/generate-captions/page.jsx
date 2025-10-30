'use client';

import { useState, useRef } from 'react';
import { Upload, Type, Download, X, Check, Loader2, FileVideo, FileText, AlertCircle } from 'lucide-react';

export default function GenerateCaptionsPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [captionsPreview, setCaptionsPreview] = useState('');
  const [srtContent, setSrtContent] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
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

  const handleGenerate = async () => {
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
      formData.append('captionneeded', 'true');

      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate captions');
      }

      const data = await response.json();
      
      setProgress(100);

      // Check if captions were generated successfully
      if (data.captionsUrl) {
        // Fetch the SRT file content
        const srtResponse = await fetch(data.captionsUrl);
        const srtText = await srtResponse.text();
        
        setSrtContent(srtText);
        setCaptionsPreview(srtText);
        setIsComplete(true);
        setIsProcessing(false);
      } else if (data.transcriptionError) {
        throw new Error(data.transcriptionError);
      } else {
        throw new Error('No captions were generated');
      }

    } catch (err) {
      console.error('Caption generation error:', err);
      setError(err.message || 'Failed to generate captions. Please try again.');
      setIsProcessing(false);
      setProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleDownloadSRT = () => {
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}-captions.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
    setCaptionsPreview('');
    setSrtContent('');
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
    <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <Type className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Generate Captions</h1>
              <p className="text-gray-600 mt-1">Auto-generate subtitles for your videos</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-pink-400 hover:bg-pink-50/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-pink-500" />
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
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm font-medium">
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
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileVideo className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {formatFileSize(selectedFile.size)}
                      </p>
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
                {videoPreview && (
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
                        Caption Generation Failed
                      </h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 py-6">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                      <span className="text-lg font-medium text-gray-700">
                        Generating captions...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {progress < 30 && 'Uploading video...'}
                      {progress >= 30 && progress < 60 && 'Analyzing audio...'}
                      {progress >= 60 && progress < 90 && 'Transcribing speech...'}
                      {progress >= 90 && 'Finalizing captions...'}
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
                          Captions Generated Successfully!
                        </h4>
                        <p className="text-sm text-green-700">
                          Your subtitle file is ready to download
                        </p>
                      </div>
                    </div>

                    {/* Captions Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-pink-500" />
                          Caption Preview
                        </h4>
                        <span className="text-sm text-gray-600">SRT Format</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                          {captionsPreview}
                        </pre>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadSRT}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm font-medium"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download SRT File</span>
                    </button>
                  </div>
                )}

                {/* Generate Button */}
                {!isProcessing && !isComplete && (
                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Type className="w-5 h-5" />
                    <span>Generate Captions</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-pink-500" />
                About Caption Generation
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Captions are auto-generated using AI speech recognition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>SRT format is compatible with most video platforms and editors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Review and edit captions before publishing for best accuracy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Supports multiple languages (English, Spanish, French, and more)</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}