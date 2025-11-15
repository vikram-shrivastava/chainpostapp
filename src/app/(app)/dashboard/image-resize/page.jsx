"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Maximize2,
  Download,
  X,
  Check,
  Loader2,
  Image,
  Smartphone,
  Monitor,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Trash2,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Toaster, toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";

export default function ImageResizePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // uploaded images from Cloudinary
  // each item: { secure_url, public_id, bytes, original_filename, format, width?, height? }
  const [uploadedImages, setUploadedImages] = useState([]);

  // UI / process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // selected platform presets
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // resized images result
  // structure: { [imagePublicId_or_filename]: { [platformId]: { url, width, height, platformName } } }
  const [resizedImages, setResizedImages] = useState({});

  const fileInputRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // platform presets (same as your list)
  const platformPresets = [
    { id: "instagram-post", name: "Instagram Post", icon: Instagram, width: 1080, height: 1080, ratio: "1:1", color: "bg-gradient-to-br from-purple-500 to-pink-500", category: "Social Media" },
    { id: "instagram-story", name: "Instagram Story", icon: Instagram, width: 1080, height: 1920, ratio: "9:16", color: "bg-gradient-to-br from-purple-500 to-pink-500", category: "Social Media" },
    { id: "facebook-post", name: "Facebook Post", icon: Facebook, width: 1200, height: 630, ratio: "1.91:1", color: "bg-blue-600", category: "Social Media" },
    { id: "facebook-cover", name: "Facebook Cover", icon: Facebook, width: 820, height: 312, ratio: "2.63:1", color: "bg-blue-600", category: "Social Media" },
    { id: "twitter-post", name: "Twitter Post", icon: Twitter, width: 1200, height: 675, ratio: "16:9", color: "bg-sky-500", category: "Social Media" },
    { id: "twitter-header", name: "Twitter Header", icon: Twitter, width: 1500, height: 500, ratio: "3:1", color: "bg-sky-500", category: "Social Media" },
    { id: "linkedin-post", name: "LinkedIn Post", icon: Linkedin, width: 1200, height: 627, ratio: "1.91:1", color: "bg-blue-700", category: "Social Media" },
    { id: "linkedin-banner", name: "LinkedIn Banner", icon: Linkedin, width: 1584, height: 396, ratio: "4:1", color: "bg-blue-700", category: "Social Media" },
    { id: "youtube-thumbnail", name: "YouTube Thumbnail", icon: Youtube, width: 1280, height: 720, ratio: "16:9", color: "bg-red-600", category: "Video" },
    { id: "youtube-banner", name: "YouTube Banner", icon: Youtube, width: 2560, height: 1440, ratio: "16:9", color: "bg-red-600", category: "Video" },
    { id: "desktop-wallpaper", name: "Desktop Wallpaper", icon: Monitor, width: 1920, height: 1080, ratio: "16:9", color: "bg-gray-700", category: "Wallpaper" },
    { id: "mobile-wallpaper", name: "Mobile Wallpaper", icon: Smartphone, width: 1080, height: 1920, ratio: "9:16", color: "bg-gray-700", category: "Wallpaper" },
  ];

  // grouped by category for UI
  const groupedPlatforms = platformPresets.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Handler for cloudinary widget success – supports multiple uploads by receiving events per file
  const handleUploadSuccess = (result) => {
    // result.event === "success" for each uploaded file
    if (result?.event === "success") {
      const info = result.info;
      // append image
      setUploadedImages((prev) => {
        // avoid duplicates by public_id
        if (prev.find((p) => p.public_id === info.public_id)) return prev;
        return [
          ...prev,
          {
            secure_url: info.secure_url,
            public_id: info.public_id,
            bytes: info.bytes,
            original_filename: info.original_filename || info.public_id,
            format: info.format,
            width: info.width,
            height: info.height,
          },
        ];
      });
      toast.success("Uploaded " + (info.original_filename || info.public_id));
      setIsComplete(false);
      setProgress(0);
      setResizedImages({});
    }
  };

  // remove single uploaded image
  const removeUploadedImage = (publicId) => {
    setUploadedImages((prev) => prev.filter((p) => p.public_id !== publicId));
    setResizedImages((prev) => {
      const copy = { ...prev };
      delete copy[publicId];
      return copy;
    });
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => (prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Resize function: iterate uploadedImages × selectedPlatforms
  const handleResize = async () => {
    if (!uploadedImages.length) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (!selectedPlatforms.length) {
      toast.error("Select one or more platforms to resize for.");
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    const result = {};

    try {
      // simple progress calculation
      const totalTasks = uploadedImages.length * selectedPlatforms.length;
      let completed = 0;

      for (const img of uploadedImages) {
        const key = img.public_id || img.original_filename;
        result[key] = {};

        for (const platformId of selectedPlatforms) {
          const preset = platformPresets.find((p) => p.id === platformId);
          if (!preset) continue;

          // send publicId to backend (so backend can fetch from Cloudinary) -- backend expected to return resizedUrl
          const body = {
            publicId: img.public_id,
            cloudinaryUrl: img.secure_url,
            width: preset.width,
            height: preset.height,
            fileName: `${img.original_filename}.${img.format}`,
          };

          const resp = await fetch("/api/image-resize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const data = await resp.json();

          if (!resp.ok) {
            console.error("Resize failed for", img.public_id, platformId, data);
            // continue but do not stop all
            completed++;
            setProgress(Math.round((completed / totalTasks) * 100));
            continue;
          }

          // expect data.resizedUrl
          result[key][platformId] = {
            url: data.resizedUrl,
            width: preset.width,
            height: preset.height,
            platformName: preset.name,
            name: img.original_filename || key,
          };

          completed++;
          setProgress(Math.round((completed / totalTasks) * 100));
        }
      }

      setResizedImages(result);
      setIsComplete(true);
      toast.success("Resizing completed!");
    } catch (err) {
      console.error("handleResize error:", err);
      toast.error("Something went wrong while resizing.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
    }
  };

  // download a single resized image
  const handleDownloadSingle = async (imageKey, platformId) => {
    const img = resizedImages[imageKey]?.[platformId];
    if (!img) {
      toast.error("Image not found");
      return;
    }

    toast.loading("Downloading...");
    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      const fileName = `${img.name}_${img.platformName}_${img.width}x${img.height}.jpg`;
      saveAs(blob, fileName);
      toast.dismiss();
      toast.success("Downloaded");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Download failed");
    }
  };

  // download all resized images as a ZIP
  const handleDownloadAll = async () => {
    const entries = Object.entries(resizedImages);
    if (!entries.length) {
      toast.error("No resized images to download");
      return;
    }

    toast.loading("Preparing ZIP...");
    const zip = new JSZip();
    const folder = zip.folder("Resized_Images");

    try {
      for (const [imageKey, platforms] of entries) {
        for (const [platformId, img] of Object.entries(platforms)) {
          const r = await fetch(img.url);
          if (!r.ok) throw new Error("Failed to fetch " + img.url);
          const blob = await r.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const fileName = `${img.name}_${img.platformName}_${img.width}x${img.height}.jpg`;
          folder.file(fileName, arrayBuffer);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "Resized_Images.zip");
      toast.dismiss();
      toast.success("ZIP ready");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to prepare ZIP");
    }
  };

  const handleReset = () => {
    setUploadedImages([]);
    setSelectedPlatforms([]);
    setResizedImages({});
    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
    toast.success("Reset done");
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 min-h-screen">
      <Toaster />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mr-4">
            <Maximize2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Image Resize</h1>
            <p className="text-gray-600 mt-1">Upload images and resize them for multiple platforms</p>
          </div>
        </div>

        {/* Upload area */}
        <div className="mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/50 transition-all">
            <CldUploadWidget
              uploadPreset="Projects"
              onSuccess={handleUploadSuccess}
              options={{ multiple: true, resourceType: "image" }}
              ref={widgetRef}
            >
              {({ open }) => (
                <div className="space-y-3">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-teal-500" />
                  </div>
                  <button
                    onClick={() => open()}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow"
                  >
                    Upload images (multiple)
                  </button>
                  <p className="text-sm text-gray-600 mt-2">Supports JPG, PNG, WebP. Upload multiple images at once.</p>
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* uploaded previews */}
          {uploadedImages.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((img) => (
                <div key={img.public_id} className="bg-white rounded-lg border overflow-hidden relative">
                  <img src={img.secure_url} alt={img.public_id} className="w-full h-44 object-cover" />
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-800 font-medium">{img.original_filename}.{img.format}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(img.bytes)}</div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => removeUploadedImage(img.public_id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
                      >
                        <Trash2 className="inline w-4 h-4 mr-2" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* main area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: actions / results */}
          <div>
            {/* summary / controls */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Selected Images</h3>
                  <p className="text-sm text-gray-600">
                    {uploadedImages.length} image{uploadedImages.length !== 1 ? "s" : ""} uploaded
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleReset}
                    className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">
                  Pick platforms to resize for and click <strong>Resize</strong>.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResize}
                    disabled={isProcessing || uploadedImages.length === 0 || selectedPlatforms.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Resizing...</span> : "Resize Images"}
                  </button>

                  <div className="ml-2 text-sm text-gray-600">
                    {progress > 0 && <span>Progress: {progress}%</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Results/Resized grid */}
            {isComplete && Object.keys(resizedImages).length > 0 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Resize Complete</div>
                    <div className="text-sm text-green-700">Download individual images or all as a ZIP.</div>
                  </div>
                </div>

                {/* show each image's resized outputs */}
                {Object.entries(resizedImages).map(([imageKey, platforms]) => (
                  <div key={imageKey} className="bg-white rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-gray-800">{imageKey}</div>
                      <div className="text-sm text-gray-500">{Object.keys(platforms).length} sizes</div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(platforms).map(([platformId, info]) => (
                        <div key={platformId} className="border rounded-md overflow-hidden">
                          <img src={info.url} alt={info.platformName} className="w-full h-36 object-cover" />
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">{info.platformName}</div>
                              <div className="text-xs text-gray-500">{info.width}×{info.height}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleDownloadSingle(imageKey, platformId)} className="flex-1 px-3 py-2 bg-teal-50 text-teal-700 rounded-md text-sm hover:bg-teal-100">
                                <Download className="inline w-4 h-4 mr-2" /> Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <button onClick={handleDownloadAll} className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg">
                    <Download className="inline w-4 h-4 mr-2" /> Download All as ZIP
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Platform selection */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Select Platforms</h3>
            <p className="text-sm text-gray-600 mb-4">Choose one or more targets to produce resized images for.</p>

            <div className="max-h-[520px] overflow-y-auto space-y-6">
              {Object.entries(groupedPlatforms).map(([category, platforms]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {platforms.map((platform) => {
                      const selected = selectedPlatforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${selected ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                              <platform.icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-800">{platform.name}</div>
                              <div className="text-xs text-gray-600">{platform.width} × {platform.height} ({platform.ratio})</div>
                            </div>
                          </div>

                          {selected && (
                            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
