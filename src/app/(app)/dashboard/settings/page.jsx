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
  Check,
  AlertTriangle
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function SettingsPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
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

  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
      // Mock API call since endpoint might not exist in this context
      // const res = await axios.post("/api/settings", { ... });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating save
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings mock
  useEffect(() => {
    // Simulating fetch
    // In real app: const res = await axios.get("/api/settings");
  }, []);

  const handleDeleteAccount = () => {
    // In real app: await axios.delete('/api/user');
    toast.error("This is a demo action.");
    setShowDeleteConfirm(false);
  };

  const handleManageAccount = () => {
    router.push("/account"); // Or user.createManageAccountUrl()
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full font-['Inter',_sans-serif]">
      <Toaster position="top-right" />
      
      {/* --- HEADER --- */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 mt-1">Manage your workspace preferences and account options.</p>
          </div>
          
          <button
            onClick={handleManageAccount}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium shadow-sm text-sm"
          >
            <User className="w-4 h-4" />
            Manage Account
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR NAVIGATION (Desktop) --- */}
        <div className="lg:col-span-3">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* === PREFERENCES TAB === */}
          {activeTab === "preferences" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Theme Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                   <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                   <p className="text-sm text-slate-500">Customize how NexusCreate looks on your device.</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id)}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        theme === option.id
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-100 hover:border-slate-200 bg-slate-50"
                      }`}
                    >
                      <option.icon className={`w-6 h-6 mb-3 ${theme === option.id ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className={`text-sm font-medium ${theme === option.id ? "text-indigo-900" : "text-slate-600"}`}>
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                   <h2 className="text-lg font-semibold text-slate-900">Language & Region</h2>
                   <p className="text-sm text-slate-500">Select your preferred language for the interface.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                        language === lang.code
                          ? "border-indigo-200 bg-indigo-50 ring-1 ring-indigo-200"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium text-slate-700">{lang.name}</span>
                      </div>
                      {language === lang.code && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Settings Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-900 mb-6">Editor Settings</h2>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="font-medium text-slate-800">Auto-save projects</p>
                       <p className="text-sm text-slate-500">Automatically save your work every few seconds</p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoSave ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                 </div>
              </div>
            </div>
          )}

          {/* === NOTIFICATIONS TAB === */}
          {activeTab === "notifications" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-8">
                   <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                   <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
               </div>

               <div className="space-y-6">
                  {/* Toggle Item 1 */}
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-slate-800">Email Alerts</p>
                        <p className="text-sm text-slate-500">Receive production updates via email</p>
                     </div>
                     <button
                        onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.email ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.email ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                  </div>
                  <div className="h-px w-full bg-slate-100"></div>

                   {/* Toggle Item 2 */}
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-slate-800">Product Updates</p>
                        <p className="text-sm text-slate-500">Get notified about new features and improvements</p>
                     </div>
                     <button
                        onClick={() => setNotifications(prev => ({...prev, features: !prev.features}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.features ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.features ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                  </div>
                  <div className="h-px w-full bg-slate-100"></div>

                   {/* Toggle Item 3 */}
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-slate-800">Weekly Digest</p>
                        <p className="text-sm text-slate-500">A summary of your content performance</p>
                     </div>
                     <button
                        onClick={() => setNotifications(prev => ({...prev, weekly: !prev.weekly}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.weekly ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                  </div>
               </div>
            </div>
          )}

          {/* === STORAGE TAB === */}
          {activeTab === "storage" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="mb-6">
                     <h2 className="text-lg font-semibold text-slate-900">Storage Usage</h2>
                     <p className="text-sm text-slate-500">You have used 25% of your allocated storage.</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                     <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                        <span>2.5 GB Used</span>
                        <span>10 GB Total</span>
                     </div>
                     <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full w-[25%]" />
                     </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Videos</div>
                        <div className="text-xl font-bold text-slate-900">1.2 GB</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Images</div>
                        <div className="text-xl font-bold text-slate-900">0.8 GB</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Assets</div>
                        <div className="text-xl font-bold text-slate-900">0.5 GB</div>
                     </div>
                  </div>
               </div>

               {/* Actions */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Management</h2>
                  <div className="space-y-3">
                     <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                              <Database className="w-5 h-5" />
                           </div>
                           <span className="font-medium text-slate-700">Clear application cache</span>
                        </div>
                        <span className="text-sm text-slate-400">~256 MB</span>
                     </button>
                     <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                              <Trash2 className="w-5 h-5" />
                           </div>
                           <span className="font-medium text-slate-700">Delete archived projects</span>
                        </div>
                        <span className="text-sm text-slate-400">12 items</span>
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* === BILLING TAB === */}
          {activeTab === "billing" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Plan Card */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-6">
                     <div>
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2">Current Plan</span>
                        <h2 className="text-2xl font-bold text-slate-900">Pro Workspace</h2>
                        <p className="text-slate-500 text-sm">Renews on December 1, 2025</p>
                     </div>
                     <div className="text-right">
                        <p className="text-3xl font-bold text-slate-900">$29<span className="text-lg text-slate-400 font-normal">/mo</span></p>
                     </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                     {[
                        "Unlimited video compression",
                        "AI caption generation",
                        "10 GB cloud storage",
                        "Priority support",
                        "4K export quality",
                        "Custom branding"
                     ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                           <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                           </div>
                           {feature}
                        </div>
                     ))}
                  </div>

                  <button className="w-full py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                     Manage Subscription
                  </button>
               </div>

               {/* Payment Method */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h2>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center">
                           <span className="font-bold text-slate-400 italic">VISA</span>
                        </div>
                        <div>
                           <p className="font-medium text-slate-900">•••• 4242</p>
                           <p className="text-xs text-slate-500">Expires 12/25</p>
                        </div>
                     </div>
                     <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Edit</button>
                  </div>
               </div>
            </div>
          )}

          {/* === FOOTER ACTIONS (Visible for all tabs except Billing maybe) === */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200/50">
             <button 
               className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
               onClick={() => toast("Changes discarded")}
             >
                Cancel
             </button>
             <button 
               onClick={handleSaveSettings}
               disabled={loading}
               className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
             </button>
          </div>

          {/* === DANGER ZONE (Only visible on Preferences) === */}
          {activeTab === "preferences" && (
            <div className="mt-12 pt-8 border-t border-slate-200">
               <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4">Danger Zone</h3>
               <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                     <h4 className="font-semibold text-red-900">Delete Account</h4>
                     <p className="text-sm text-red-700/80 mt-1">Permanently remove your account and all content.</p>
                  </div>
                  <button
                     onClick={() => setShowDeleteConfirm(true)}
                     className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap"
                  >
                     Delete Account
                  </button>
               </div>
               <div className="mt-4 flex justify-end">
                  <button
                     onClick={handleSignOut}
                     className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                  >
                     <LogOut className="w-4 h-4" /> Sign out of workspace
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Account?</h3>
            <p className="text-slate-500 text-center mb-6">
              This action is permanent and cannot be undone. All your projects and data will be lost forever.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}