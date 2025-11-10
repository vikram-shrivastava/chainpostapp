"use client";
import { useState, useEffect } from "react";
import { Camera, User, Mail, AtSign, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SkipOnboardingModal from "@/components/skipModal";
export default function OnboardingPage() {
  // Simulated user data - replace with useUser() from Clerk
  const router = useRouter();
  const [user] = useState({
    primaryEmailAddress: { emailAddress: "user@example.com" },
    fullName: "John Doe",
    username: "",
  });
  const userDetails=useUser()
  console.log("User Details:",userDetails);
  const [fullName, setFullName] = useState(userDetails?.fullName || "");
  const [username, setUsername] = useState(userDetails?.username || "");
  const [email, setEmail]=useState(userDetails?.user?.primaryEmailAddress.emailAddress || "");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    setEmail(userDetails?.user?.primaryEmailAddress.emailAddress);
  }, [userDetails]);
  


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
    // Simulate API call
    const formData = new FormData();
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      console.error("Failed to submit onboarding data",response);
      setIsSubmitting(false);
      return;
    }
    if(response.message==="Onboarding successful" || response.status===200){
      setIsSubmitting(false);
      router.push("/dashboard");
    }
  };


  const progressPercentage = currentStep === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 2
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Let's personalize your experience with a few details
            </p>
          </div>

          <div onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 cursor-pointer shadow-lg transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Upload a profile photo (optional)
                  </p>
                </div>

                {/* Email (Read-only) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={ userDetails?.user?.primaryEmailAddress.emailAddress  || ""}
                      readOnly
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Verified
                  </p>
                </div>

                {/* Full Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!fullName.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    Next Step
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Username */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800" />
                    <input
                      type="text"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      required
                      className="w-full pl-11 pr-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Only lowercase letters, numbers, and underscores
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !username.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Completing...
                      </>
                    ) : (
                      "Complete Profile"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Skip Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={()=>{setSkipped(true)}}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>

        {skipped && (
          <SkipOnboardingModal
            onClose={() => setSkipped(false)}
            onConfirm={() => router.push("/dashboard")}
          />
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is secure and will only be used to personalize your experience
        </p>
      </div>
    </div>
  );
}