'use client';

import { useState, useEffect } from 'react';
import { Video, Type, FileText, Maximize2, Check, ArrowRight, Menu, X, Zap, Star, Users, Award, Moon, Sun } from 'lucide-react';

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      localStorage.setItem('theme', initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const features = [
    {
      icon: Video,
      title: 'Video Compression',
      description: 'Compress videos up to 80% smaller while maintaining crystal-clear quality',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Type,
      title: 'Auto Captions',
      description: 'AI-powered transcription with perfect timestamps in SRT format',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: FileText,
      title: 'Post Generator',
      description: 'Generate engaging posts for LinkedIn, Instagram, and Twitter instantly',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Maximize2,
      title: 'Image Resize',
      description: 'Perfect dimensions for every social media platform automatically',
      color: 'from-teal-400 to-teal-600'
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our tools',
      features: [
        '5 video compressions/month',
        '10 caption generations/month',
        '20 posts generations/month',
        'Basic support',
        '1GB storage'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Best for content creators',
      features: [
        'Unlimited video compressions',
        'Unlimited captions',
        'Unlimited post generations',
        'Priority support',
        '10GB storage',
        'Advanced AI features',
        'Batch processing'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Video, value: '500K+', label: 'Videos Processed' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Award, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ChainPost
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                About
              </a>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-300" />}
              </button>
              <a href="/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium">
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 dark:text-white" /> : <Menu className="w-6 h-6 dark:text-white" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#features" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
                Features
              </a>
              <a href="#pricing" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
                Pricing
              </a>
              <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
                About
              </a>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5 mr-2" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
              <a href="/dashboard" className="block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-medium">
                Get Started
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-8">
              <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">✨ AI-Powered Content Tools</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
              Create Content at
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Lightning Speed
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Upload once, get everything. Compress videos, generate captions, create social posts, and resize images - all powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="/dashboard" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2">
                <span>Start Free Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful tools designed for modern content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 ${plan.highlighted ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className={`text-5xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {plan.price}
                    </span>
                    {plan.period !== 'contact us' && (
                      <span className={`text-lg ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p className={plan.highlighted ? 'text-blue-100' : 'text-gray-700 dark:text-gray-300'}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-green-500 dark:text-green-400'}`} />
                      <span className={plan.highlighted ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.highlighted 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                }`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-700 dark:text-gray-300 mt-12">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Content Workflow?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators who are already saving hours every week
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/dashboard" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg">
                Start Free Trial
              </a>
              <button className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-xl font-semibold text-lg hover:bg-white/30 transition-all border-2 border-white/50">
                Schedule Demo
              </button>
            </div>
            <p className="mt-6 text-sm opacity-80">
              ✓ No credit card required  ✓ 14-day free trial  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ChainPost</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered content creation tools for modern creators.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} ChainPost. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}