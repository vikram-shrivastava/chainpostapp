"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Monitor,
  Globe,
  Shield,
  Trash2,
  LogOut,
  Camera,
  Save,
  HardDrive,
  Database,
  CreditCard,
  Zap,
  User,
  Loader2,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isPageLoading, setIsPageLoading] = useState(true); // Loader for initial mount
  const [activeTab, setActiveTab] = useState("preferences");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    email: true,
    features: true,
    weekly: false,
  });
  const [autoSave, setAutoSave] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const { signOut } = useClerk();
  const user = useUser();
  const router = useRouter();

  const tabs = [
    { id: "preferences", name: "Preferences", icon: Settings },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "storage", name: "Storage", icon: HardDrive },
    { id: "billing", name: "Billing", icon: CreditCard },
  ];

  const themeOptions = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
  ];

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/settings", {
        preferences: { theme, language, autosave: autoSave },
        notifications: {
          emailNotifications: notifications.email,
          newFeatures: notifications.features,
          weeklySummary: notifications.weekly,
        },
      });

      // Axios doesn't have res.ok; it throws for non-2xx responses
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/settings");
        const data = res.data;

        // Update state with fetched data
        setTheme(data.preferences?.theme || "light");
        setLanguage(data.preferences?.language || "en");
        setAutoSave(data.preferences?.autosave ?? true);
        setNotifications({
          email: data.notifications?.emailNotifications ?? true,
          features: data.notifications?.newFeatures ?? true,
          weekly: data.notifications?.weeklySummary ?? false,
        });
      } catch (err) {
        console.error("Error loading settings:", err);
        toast.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure? This action cannot be undone!")) {
      alert("Account deletion requested...");
    }
    setShowDeleteConfirm(false);
  };

  const handleManageAccount = () => {
    router.push("/account");
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                  Settings
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Manage your preferences and account options
                </p>
              </div>
            </div>

            {/* Moved Manage Account Button here */}
            <button
              onClick={handleManageAccount}
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
            >
              <User className="w-4 h-4 mr-2" />
              Manage Account
            </button>
          </div>

          {/* Horizontal Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-2 flex overflow-x-auto scrollbar-hide mb-8 shadow-sm sm:shadow-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all mr-2 last:mr-0 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* --- Tab Content --- */}
          <div className="space-y-6">
            {activeTab === "preferences" && (
              <>
                {/* Theme */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Appearance
                  </h2>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                          theme === option.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <option.icon className="w-8 h-8 mb-2 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Language & Region
                  </h2>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Display Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center space-x-3  p-3 border-2 rounded-lg transition-all ${
                          language === lang.code
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl text-black">{lang.flag}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-save */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Editor Settings
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        Auto-save projects
                      </p>
                      <p className="text-sm text-gray-600">
                        Automatically save your work every 2 minutes
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        autoSave ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          autoSave ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Keep notifications, storage, billing unchanged (same code as before) */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {/* Email notifications */}
                  <div className="flex items-start justify-between pb-6 border-b border-gray-200">
                    <div className="pr-4">
                      <p className="font-medium text-gray-800">
                        Email notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive important updates via email
                      </p>
                    </div>
                    <button
                      aria-pressed={notifications.email}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          email: !prev.email,
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.email ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.email ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* New features */}
                  <div className="flex items-start justify-between pb-6 border-b border-gray-200">
                    <div className="pr-4">
                      <p className="font-medium text-gray-800">New features</p>
                      <p className="text-sm text-gray-600">
                        Get notified about new features and updates
                      </p>
                    </div>
                    <button
                      aria-pressed={notifications.features}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          features: !prev.features,
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.features ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.features ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Weekly summary */}
                  <div className="flex items-start justify-between">
                    <div className="pr-4">
                      <p className="font-medium text-gray-800">
                        Weekly summary
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive a weekly report of your activity
                      </p>
                    </div>
                    <button
                      aria-pressed={notifications.weekly}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          weekly: !prev.weekly,
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.weekly ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.weekly ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "storage" && (
              <div className="space-y-6">
                {" "}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {" "}
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {" "}
                    Storage Usage{" "}
                  </h2>{" "}
                  <div className="mb-4">
                    {" "}
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      {" "}
                      <span>2.5 GB of 10 GB used</span> <span>25%</span>{" "}
                    </div>{" "}
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      {" "}
                      <div
                        className="h-full bg-gradient-to-r from-gray-700 to-gray-900"
                        style={{ width: "25%" }}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {" "}
                    <div className="text-center">
                      {" "}
                      <p className="text-2xl font-semibold text-gray-800">
                        {" "}
                        1.2 GB{" "}
                      </p>{" "}
                      <p className="text-sm text-gray-600">Videos</p>{" "}
                    </div>{" "}
                    <div className="text-center">
                      {" "}
                      <p className="text-2xl font-semibold text-gray-800">
                        {" "}
                        0.8 GB{" "}
                      </p>{" "}
                      <p className="text-sm text-gray-600">Images</p>{" "}
                    </div>{" "}
                    <div className="text-center">
                      {" "}
                      <p className="text-2xl font-semibold text-gray-800">
                        {" "}
                        0.5 GB{" "}
                      </p>{" "}
                      <p className="text-sm text-gray-600">Other</p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {" "}
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {" "}
                    Manage Storage{" "}
                  </h2>{" "}
                  <div className="space-y-3">
                    {" "}
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      {" "}
                      <div className="flex items-center space-x-3">
                        {" "}
                        <Database className="w-5 h-5 text-gray-600" />{" "}
                        <span className="font-medium text-gray-800">
                          {" "}
                          Clear cache{" "}
                        </span>{" "}
                      </div>{" "}
                      <span className="text-sm text-gray-600">256 MB</span>{" "}
                    </button>{" "}
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      {" "}
                      <div className="flex items-center space-x-3">
                        {" "}
                        <Trash2 className="w-5 h-5 text-gray-600" />{" "}
                        <span className="font-medium text-gray-800">
                          {" "}
                          Delete old projects{" "}
                        </span>{" "}
                      </div>{" "}
                      <span className="text-sm text-gray-600">
                        12 items
                      </span>{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}
            {activeTab === "billing" && (
              <div className="space-y-6">
                {" "}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {" "}
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {" "}
                    Current Plan{" "}
                  </h2>{" "}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-6 text-white mb-6">
                    {" "}
                    <div className="flex items-center justify-between mb-4">
                      {" "}
                      <div>
                        {" "}
                        <p className="text-sm opacity-80">Your Plan</p>{" "}
                        <h3 className="text-2xl font-bold">Pro</h3>{" "}
                      </div>{" "}
                      <Zap className="w-8 h-8" />{" "}
                    </div>{" "}
                    <p className="text-3xl font-bold mb-1">
                      {" "}
                      $29{" "}
                      <span className="text-lg font-normal opacity-80">
                        {" "}
                        /month{" "}
                      </span>{" "}
                    </p>{" "}
                    <p className="text-sm opacity-80">
                      {" "}
                      Renews on December 1, 2025{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    {" "}
                    <div className="flex items-center">
                      {" "}
                      <span className="mr-2">✓</span>{" "}
                      <span>Unlimited video compression</span>{" "}
                    </div>{" "}
                    <div className="flex items-center">
                      {" "}
                      <span className="mr-2">✓</span>{" "}
                      <span>AI caption generation</span>{" "}
                    </div>{" "}
                    <div className="flex items-center">
                      {" "}
                      <span className="mr-2">✓</span> <span>10 GB storage</span>{" "}
                    </div>{" "}
                    <div className="flex items-center">
                      {" "}
                      <span className="mr-2">✓</span>{" "}
                      <span>Priority support</span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    {" "}
                    Upgrade Plan{" "}
                  </button>{" "}
                </div>{" "}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {" "}
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    {" "}
                    Payment Method{" "}
                  </h2>{" "}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                    {" "}
                    <div className="flex items-center space-x-4">
                      {" "}
                      <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                        {" "}
                        VISA{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <p className="font-medium text-gray-800">
                          •••• 4242
                        </p>{" "}
                        <p className="text-sm text-gray-600">Expires 12/25</p>{" "}
                      </div>{" "}
                    </div>{" "}
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      {" "}
                      Edit{" "}
                    </button>{" "}
                  </div>{" "}
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {" "}
                    + Add payment method{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3 mt-8">
            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              {loading ? <span>Saving...</span> : <span>Save Changes</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">
          These actions are permanent and cannot be undone
        </p>
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal (unchanged) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
