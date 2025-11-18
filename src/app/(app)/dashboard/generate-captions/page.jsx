"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileVideo,
  Video,
  Loader2,
  X,
  AlertCircle,
  Home,
  Clock,
} from "lucide-react";

import { Toaster, toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function GenerateCaptionsPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);

  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);

  const [isQueued, setIsQueued] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Cloudinary Upload Success
  const handleUploadSuccess = (result) => {
    if (result.event === "success") {
      const info = result.info;

      setCloudinaryUrl(info.secure_url);
      setPublicId(info.public_id);
      setOriginalSize(info.bytes);

      setIsQueued(false);
      setError(null);

      toast.success("Video uploaded successfully!");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
  };

  // Generate Captions (Queue)
  const handleGenerateCaptions = async () => {
    if (!publicId) return toast.error("Upload a video first!");

    setError(null);

    try {
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId,
          cloudinaryUrl,
          originalSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to enqueue job");
      }

      toast.success("Your caption job has been queued!");

      // Queue UI
      setIsQueued(true);

    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleReset = () => {
    setCloudinaryUrl(null);
    setPublicId(null);
    setOriginalSize(0);

    setIsQueued(false);
    setError(null);

    toast.success("Reset done!");
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-amber-50 min-h-screen">
      <Toaster />
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mr-4">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Generate Captions
            </h1>
            <p className="text-gray-600">AI-powered captions with Queue Processing</p>
          </div>
        </div>

        {/* UPLOAD AREA */}
        {!cloudinaryUrl && (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-pink-400 hover:bg-pink-50/50 transition-all cursor-pointer">
            <CldUploadWidget
              uploadPreset="Projects"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <div onClick={() => open()}>
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Click to upload video
                  </h3>
                  <p className="text-gray-600">
                    MP4, MOV, AVI, WebM (Max 500MB)
                  </p>
                </div>
              )}
            </CldUploadWidget>
          </div>
        )}

        {/* MAIN CONTENT */}
        {cloudinaryUrl && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

            {/* TOP BAR */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <FileVideo className="w-6 h-6 text-pink-500" />
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
                disabled={isQueued}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Video Preview */}
            {!isQueued && (
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

            {/* QUEUE PROCESSING UI */}
            {isQueued && (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Your captions are being generated…
                </h2>

                <p className="text-gray-600 mb-6">
                  You can safely leave this page.  
                  The result will appear in your Dashboard once completed.
                </p>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </button>

                <div className="mt-6 flex justify-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Processing typically takes a few seconds to 2 minutes</span>
                </div>
              </div>
            )}

            {/* GENERATE BUTTON */}
            {!isQueued && (
              <button
                onClick={handleGenerateCaptions}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Generate Captions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
