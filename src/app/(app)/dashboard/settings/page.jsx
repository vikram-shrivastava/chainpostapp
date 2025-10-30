'use client';

import { useState } from 'react';
import { Settings, User, Bell, Moon, Sun, Monitor, Globe, Shield, Trash2, LogOut, Camera, Save, HardDrive, Database, CreditCard, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    email: true,
    features: true,
    weekly: false,
  });
  const [autoSave, setAutoSave] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'storage', name: 'Storage', icon: HardDrive },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  const themeOptions = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
  ];

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      alert('Signing out...');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? This action cannot be undone!')) {
      alert('Account deletion requested...');
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-2 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                  
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-200">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Profile Photo</h3>
                      <p className="text-sm text-gray-600 mb-2">JPG, PNG or GIF. Max size 2MB</p>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Upload new photo
                      </button>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue="johndoe"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
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
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Theme Selection */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Appearance</h2>
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
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option.icon className="w-8 h-8 mb-2 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Language & Region</h2>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Display Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-all ${
                          language === lang.code
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-save */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Editor Settings</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Auto-save projects</p>
                      <p className="text-sm text-gray-600">Automatically save your work every 2 minutes</p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        autoSave ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          autoSave ? 'transform translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">Email notifications</p>
                      <p className="text-sm text-gray-600">Receive important updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.email ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.email ? 'transform translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">New features</p>
                      <p className="text-sm text-gray-600">Get notified about new features and updates</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, features: !notifications.features})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.features ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.features ? 'transform translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Weekly summary</p>
                      <p className="text-sm text-gray-600">Receive a weekly report of your activity</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, weekly: !notifications.weekly})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications.weekly ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.weekly ? 'transform translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Storage Usage</h2>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>2.5 GB of 10 GB used</span>
                      <span>25%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gray-700 to-gray-900" style={{ width: '25%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-800">1.2 GB</p>
                      <p className="text-sm text-gray-600">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-800">0.8 GB</p>
                      <p className="text-sm text-gray-600">Images</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-800">0.5 GB</p>
                      <p className="text-sm text-gray-600">Other</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Storage</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">Clear cache</span>
                      </div>
                      <span className="text-sm text-gray-600">256 MB</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">Delete old projects</span>
                      </div>
                      <span className="text-sm text-gray-600">12 items</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Plan</h2>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-80">Your Plan</p>
                        <h3 className="text-2xl font-bold">Pro</h3>
                      </div>
                      <Zap className="w-8 h-8" />
                    </div>
                    <p className="text-3xl font-bold mb-1">$29<span className="text-lg font-normal opacity-80">/month</span></p>
                    <p className="text-sm opacity-80">Renews on December 1, 2025</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Unlimited video compression</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>AI caption generation</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>10 GB storage</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Priority support</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Upgrade Plan
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">•••• 4242</p>
                        <p className="text-sm text-gray-600">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Edit
                    </button>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    + Add payment method
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end space-x-3">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
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