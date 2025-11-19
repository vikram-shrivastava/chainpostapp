"use client";

import { useState, useEffect } from "react";
import { 
  Camera, 
  User, 
  Mail, 
  AtSign, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronLeft, 
  Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SkipOnboardingModal from "@/components/skipModal";
import { Toaster, toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skipped, setSkipped] = useState(false);

  // Sync with Clerk data once loaded
  useEffect(() => {
    if (isLoaded && clerkUser) {
      setFullName(clerkUser.fullName || "");
      setUsername(clerkUser.username || "");
      setEmail(clerkUser.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, clerkUser]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit onboarding data");
      }

      // Assuming success logic handles redirects or messages
      toast.success("Profile setup complete!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Profile Picture", description: "Add a photo so your team can recognize you." },
    { id: 2, title: "Personal Details", description: "Let's get to know you a bit better." }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/5 skew-y-3 origin-top-left pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to NexusCreate</h1>
          <p className="text-slate-500 mt-2 text-sm">Set up your workspace in less than a minute.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                    step.id <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit}>
              
              {/* --- STEP 1: PHOTO --- */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Upload your photo</h2>
                    <p className="text-slate-500 text-sm mt-1">This will be displayed on your profile.</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer">
                      <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden transition-all group-hover:shadow-xl group-hover:ring-4 ring-indigo-50">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-slate-300" />
                        )}
                      </div>
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-indigo-700 transition-transform hover:scale-105"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setPhoto(null) || setPhotoPreview(null)}
                      className="text-xs text-slate-400 font-medium mt-4 hover:text-red-500 transition-colors"
                    >
                      Remove photo
                    </button>
                  </div>

                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full mt-3 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}

              {/* --- STEP 2: DETAILS --- */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Your Details</h2>
                    <p className="text-slate-500 text-sm mt-1">How should we address you?</p>
                  </div>

                  <div className="space-y-5">
                    {/* Read Only Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm focus:outline-none cursor-not-allowed"
                        />
                        <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="johndoe"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                        Only lowercase letters, numbers, and underscores.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-3.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !fullName || !username}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Setting up...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer Skip */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setSkipped(true)}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            I'll do this later
          </button>
        </div>

      </div>

      {/* Skip Modal */}
      {skipped && (
        <SkipOnboardingModal
          onClose={() => setSkipped(false)}
          onConfirm={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
}