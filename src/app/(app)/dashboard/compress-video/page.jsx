"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Video,
  Download,
  X,
  Check,
  Loader2,
  FileVideo,
  Info,
  AlertCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";

export default function CompressVideoPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // File states
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);

  // Process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedVideoUrl, setCompressedVideoUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Cloudinary Upload Handler
  const handleUploadSuccess = (result) => {
    if (result.event === "success") {
      const info = result.info;

      setCloudinaryUrl(info.secure_url);
      setPublicId(info.public_id);
      setOriginalSize(info.bytes);

      setIsComplete(false);
      setProgress(0);
      setError(null);

      toast.success("Video uploaded successfully! Now compress it.");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleCompress = async () => {
    if (!publicId) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

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
      const response = await fetch("/api/compress-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicId: publicId,
          originalSize: originalSize
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const data = await response.json();
      setProgress(100);

      setCompressedVideoUrl(data.url);
      setCompressedSize(data.compressedSize);
      setIsComplete(true);

      toast.success("Video compressed successfully!");
    } catch (err) {
      console.error("Compression error:", err);
      setError(err.message);
      toast.error(err.message);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCloudinaryUrl(null);
    setPublicId(null);
    setCompressedVideoUrl(null);

    setOriginalSize(0);
    setCompressedSize(0);

    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
    setError(null);

    toast.success("Reset done!");
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
      <Toaster />
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Compress Video</h1>
            <p className="text-gray-600">Reduce video file size without losing quality</p>
          </div>
        </div>

        {/* UPLOAD AREA */}
        {!cloudinaryUrl && (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all cursor-pointer">
            <CldUploadWidget uploadPreset="Projects" onSuccess={handleUploadSuccess}>
              {({ open }) => (
                <div onClick={() => open()}>
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Click to upload video
                  </h3>
                  <p className="text-gray-600">MP4, MOV, AVI, WebM (Max 500MB)</p>
                </div>
              )}
            </CldUploadWidget>
          </div>
        )}

        {/* MAIN CONTENT */}
        {cloudinaryUrl && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileVideo className="w-6 h-6 text-orange-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{publicId}</h3>
                  <p className="text-sm text-gray-600">
                    Original size: {formatFileSize(originalSize)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={isProcessing}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Preview */}
            {!isComplete && (
              <video
                src={cloudinaryUrl}
                controls
                className="w-full rounded-lg bg-black mb-6"
                style={{ maxHeight: "400px" }}
              />
            )}

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* PROCESSING */}
            {isProcessing && (
              <>
                <div className="flex justify-center gap-3 py-6">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <span className="text-lg text-gray-700">Compressing...</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* COMPLETED */}
            {isComplete && (
              <>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">Compression Complete!</p>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">Compressed Preview</h4>
                <video
                  src={compressedVideoUrl}
                  controls
                  className="w-full rounded-lg bg-black mb-6"
                  style={{ maxHeight: "400px" }}
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Original Size</p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {formatFileSize(originalSize)}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Compressed Size</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {formatFileSize(compressedSize)}
                    </p>
                  </div>
                </div>

                {/* DOWNLOAD */}
                <button
                  onClick={async () => {
                    const res = await fetch(compressedVideoUrl);
                    const blob = await res.blob();
                    const a = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = "compressed-video.mp4";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed Video
                </button>
              </>
            )}

            {/* Compress Button */}
            {!isProcessing && !isComplete && (
              <button
                onClick={handleCompress}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Compress Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
