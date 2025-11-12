'use client';

import { useState, useEffect } from 'react';
import {Loader2, HelpCircle, Search, Book, MessageCircle, Mail, Video, ChevronDown, ChevronUp, ExternalLink, FileText, Zap, Clock, CheckCircle } from 'lucide-react';

export default function HelpPage() {

  const [isPageLoading, setIsPageLoading] = useState(true); // Loader for initial mount
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

    useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'compress', name: 'Video Compression', icon: Video },
    { id: 'captions', name: 'Captions', icon: FileText },
    { id: 'posts', name: 'Social Posts', icon: MessageCircle },
    { id: 'resize', name: 'Image Resize', icon: Zap },
  ];

  const faqs = [
    {
      id: 1,
      category: 'compress',
      question: 'What video formats are supported for compression?',
      answer: 'We support MP4, MOV, AVI, WebM, and MKV formats. Maximum file size is 500MB for free users and 5GB for Pro users.'
    },
    {
      id: 2,
      category: 'compress',
      question: 'Will video compression reduce quality?',
      answer: 'Our AI-powered compression maintains high quality while reducing file size by up to 60%. You can choose between different quality presets based on your needs.'
    },
    {
      id: 3,
      category: 'captions',
      question: 'What languages are supported for caption generation?',
      answer: 'We currently support English, Spanish, French, German, Italian, Portuguese, and Japanese. More languages are being added regularly.'
    },
    {
      id: 4,
      category: 'captions',
      question: 'How accurate are the auto-generated captions?',
      answer: 'Our AI achieves 90-95% accuracy for clear audio. We recommend reviewing and editing captions before publishing for best results.'
    },
    {
      id: 5,
      category: 'posts',
      question: 'Can I customize the generated social media posts?',
      answer: 'Yes! All generated content can be edited before copying or downloading. You can adjust the tone, length, and style to match your brand voice.'
    },
    {
      id: 6,
      category: 'posts',
      question: 'Which social media platforms are supported?',
      answer: 'We generate optimized content for LinkedIn, Instagram, Twitter, Facebook, and TikTok, with platform-specific formatting and hashtags.'
    },
    {
      id: 7,
      category: 'resize',
      question: 'What image formats can I resize?',
      answer: 'We support JPG, PNG, WebP, and GIF formats. Maximum file size is 10MB.'
    },
    {
      id: 8,
      category: 'resize',
      question: 'Will resizing affect image quality?',
      answer: 'We use smart algorithms to maintain image quality while resizing. Images are optimized for each platform\'s specifications.'
    },
    {
      id: 9,
      category: 'all',
      question: 'How do I upgrade to Pro?',
      answer: 'Go to Settings > Billing and click "Upgrade Plan". Choose the Pro plan and complete the payment process.'
    },
    {
      id: 10,
      category: 'all',
      question: 'Is my data secure?',
      answer: 'Yes! All uploads are encrypted and automatically deleted after 24 hours. We never share your data with third parties.'
    },
  ];

  const quickGuides = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      duration: '5 min read',
      link: '#'
    },
    {
      title: 'Video Compression Guide',
      description: 'Best practices for compressing videos',
      duration: '8 min read',
      link: '#'
    },
    {
      title: 'Creating Perfect Captions',
      description: 'Tips for generating accurate subtitles',
      duration: '6 min read',
      link: '#'
    },
    {
      title: 'Social Media Content Strategy',
      description: 'Maximize engagement with AI posts',
      duration: '10 min read',
      link: '#'
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support ticket submitted! We\'ll respond within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };


    if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">How can we help?</h1>
          <p className="text-gray-600 text-lg">Search for answers or browse our help topics</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">24/7</p>
            <p className="text-sm text-gray-600">Support Available</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">&lt;2h</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">50+</p>
            <p className="text-sm text-gray-600">Help Articles</p>
          </div>
        </div>

        {/* Quick Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quickGuides.map((guide, index) => (
              <a
                key={index}
                href={guide.link}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {guide.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {guide.duration}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-left">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found. Try different keywords or browse all topics.</p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Still need help?</h2>
              <p className="text-gray-600">Send us a message and we'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm font-medium"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Or reach us directly</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:support@yourbrand.com" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Mail className="w-4 h-4" />
                  <span>support@yourbrand.com</span>
                </a>
                <span className="hidden sm:block text-gray-300">•</span>
                <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Join Our Community</h2>
          <p className="mb-6 opacity-90">Connect with other users, share tips, and get help from the community</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Join Discord
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors font-medium">
              Visit Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}