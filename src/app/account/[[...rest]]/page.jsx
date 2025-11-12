import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { useState, useEffect } from "react";
function page() {
  const [isPageLoading, setIsPageLoading] = useState(true); // Loader for initial mount

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <UserProfile />
    </div>
  );
}
export default page;
