'use client';

import { useState, useEffect } from 'react';
import {
  Loader2, 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Video, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle,
  Send,
  LifeBuoy,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function HelpPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
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
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'compress', name: 'Compression', icon: Video },
    { id: 'captions', name: 'Captions', icon: FileText },
    { id: 'posts', name: 'Social Posts', icon: MessageCircle },
    { id: 'resize', name: 'Image Resize', icon: Zap },
  ];

  const faqs = [
    {
      id: 1,
      category: 'compress',
      question: 'What video formats are supported?',
      answer: 'We support MP4, MOV, AVI, WebM, and MKV formats. Maximum file size is 500MB for free users and 5GB for Pro users.'
    },
    {
      id: 2,
      category: 'compress',
      question: 'Does compression reduce visual quality?',
      answer: 'Our smart compression algorithm is "visually lossless", meaning it removes redundant data that the human eye can\'t see, reducing file size by up to 80% while keeping the image crisp.'
    },
    {
      id: 3,
      category: 'captions',
      question: 'Which languages can be auto-detected?',
      answer: 'We currently support automatic detection for English, Spanish, French, German, Italian, Portuguese, Japanese, and 20+ other major languages.'
    },
    {
      id: 4,
      category: 'captions',
      question: 'Can I edit captions after generation?',
      answer: 'Yes. Currently, we burn captions directly into the video, but we are rolling out an interactive editor next week that lets you tweak text before rendering.'
    },
    {
      id: 5,
      category: 'posts',
      question: 'How does the AI know my brand voice?',
      answer: 'The AI analyzes the visual style, pacing, and audio of your video to match the tone. You can also provide custom instructions in the settings panel.'
    },
    {
      id: 6,
      category: 'resize',
      question: 'Does resizing crop my images?',
      answer: 'Yes, we use "Smart Crop" technology to keep the most important subject (like a person or product) centered when converting landscape images to vertical formats.'
    },
    {
      id: 7,
      category: 'all',
      question: 'Is my uploaded data secure?',
      answer: 'Absolutely. All files are processed in secure, ephemeral containers and are permanently deleted from our servers 24 hours after processing.'
    },
  ];

  // Static content cards instead of blog links
  const quickTips = [
    {
      title: 'Smart Compression',
      description: 'For best results, upload raw footage directly from your camera. Avoid re-compressing already compressed files.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    {
      title: 'Caption Accuracy',
      description: 'Ensure clear audio with minimal background noise to achieve 98%+ accuracy in auto-generated subtitles.',
      icon: FileText,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Viral Formats',
      description: 'Vertical videos (9:16) perform 3x better on social media. Use our Magic Resize tool to adapt content instantly.',
      icon: Smartphone, // Assuming Smartphone is imported or use Video
      color: 'text-pink-500',
      bg: 'bg-pink-50'
    },
    {
      title: 'Batch Processing',
      description: 'Pro users can upload up to 50 images at once for resizing. Great for processing event photos quickly.',
      icon: Book,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
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
    toast.success('Message sent! We will reply within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Helper component for icons if Smartphone isn't imported in main file
  const SmartphoneIcon = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );

  return (
    <div className="min-h-full font-['Inter',_sans-serif]">
      <Toaster position="top-right" />
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
           <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <LifeBuoy className="w-8 h-8 text-indigo-600" />
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
             How can we help you?
           </h1>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10">
             Search our knowledge base for answers or browse the topics below.
           </p>

           {/* Search Bar */}
           <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Ask a question (e.g., 'how to compress video')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-lg shadow-sm"
              />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* --- STATS ROW --- */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="p-3 bg-emerald-50 rounded-full mb-4">
               <CheckCircle className="w-6 h-6 text-emerald-600" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900">24/7</h3>
             <p className="text-slate-500 text-sm">System Status Operational</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="p-3 bg-blue-50 rounded-full mb-4">
               <Clock className="w-6 h-6 text-blue-600" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900">&lt; 2 Hours</h3>
             <p className="text-slate-500 text-sm">Average Support Response</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="p-3 bg-purple-50 rounded-full mb-4">
               <Book className="w-6 h-6 text-purple-600" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900">50+ Articles</h3>
             <p className="text-slate-500 text-sm">Detailed Documentation</p>
          </div>
        </div>

        {/* --- PRO TIPS (Static Content) --- */}
        <div>
          <div className="flex items-center gap-2 mb-6">
             <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
             <h2 className="text-xl font-bold text-slate-900">Pro Tips & Best Practices</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {quickTips.map((tip, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all cursor-default">
                <div className="flex items-start gap-4">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tip.bg}`}>
                      <tip.icon className={`w-5 h-5 ${tip.color}`} />
                   </div>
                   <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{tip.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {tip.description}
                      </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="grid lg:grid-cols-12 gap-8">
           {/* Sidebar Filters */}
           <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                   <button
                     key={cat.id}
                     onClick={() => setActiveCategory(cat.id)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                       activeCategory === cat.id 
                         ? 'bg-indigo-50 text-indigo-700' 
                         : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                     }`}
                   >
                      <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {cat.name}
                   </button>
                ))}
              </div>
           </div>

           {/* FAQ List */}
           <div className="lg:col-span-9">
              <div className="space-y-4">
                 {filteredFaqs.length > 0 ? (
                   filteredFaqs.map((faq) => (
                      <div key={faq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
                         <button
                           onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                           className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                         >
                            <span className={`font-semibold text-sm md:text-base ${expandedFaq === faq.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                              {faq.question}
                            </span>
                            {expandedFaq === faq.id ? (
                               <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0 ml-4" />
                            ) : (
                               <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />
                            )}
                         </button>
                         {expandedFaq === faq.id && (
                            <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50/0 animate-in fade-in slide-in-from-top-1">
                               <div className="h-px w-full bg-slate-100 mb-4" />
                               {faq.answer}
                            </div>
                         )}
                      </div>
                   ))
                 ) : (
                   <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500">No answers found for "{searchQuery}"</p>
                      <button onClick={() => {setSearchQuery(''); setActiveCategory('all')}} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">
                         Clear filters
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* --- CONTACT FORM --- */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
           {/* Decor bg */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

           <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                 <p className="text-slate-300 leading-relaxed mb-8">
                    Our support team is ready to assist you. Send us a message detailing your issue, and we will get back to you as soon as possible.
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-300">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                       <span className="text-sm">Support Team is Online</span>
                    </div>
                    <div className="text-sm text-slate-400">
                       Email: <a href="#" className="text-white hover:underline">support@nexuscreate.com</a>
                    </div>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Name</label>
                       <input 
                         required
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                         placeholder="Jane Doe"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email</label>
                       <input 
                         type="email"
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                         placeholder="jane@example.com"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Subject</label>
                    <input 
                       required
                       value={formData.subject}
                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
                       className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                       placeholder="I need help with..."
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Message</label>
                    <textarea 
                       required
                       rows={4}
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                       placeholder="Describe your issue in detail..."
                    />
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                 >
                    <Send className="w-4 h-4" /> Send Message
                 </button>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}