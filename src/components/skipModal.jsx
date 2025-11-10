"use client";

import React from "react";

export default function SkipOnboardingModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-blue-500 rounded-2xl shadow-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          Skip Onboarding?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You have chosen to skip the onboarding process.  
          You can complete your profile later from your account settings.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
