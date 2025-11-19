'use client';

import { useState } from 'react';
import { 
  Video, 
  Type, 
  FileText, 
  Maximize2, 
  Check, 
  ArrowRight, 
  Menu, 
  X, 
  Zap, 
  Star, 
  StarHalf, 
  Play, 
  Layers, 
  Quote 
} from 'lucide-react';

// --- Reusable Star Rating Component ---
const StarRating = ({ rating = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />);
  }
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="w-4 h-4 fill-amber-400 text-amber-400" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />);
  }

  return <div className="flex space-x-1">{stars}</div>;
};

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---- DATA ----
  const features = [
    {
      icon: Video,
      title: 'Smart Compression',
      description: 'Reduce file size by 80% without pixelation. Perfect for 4K uploads.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Type,
      title: 'Auto Captions',
      description: 'Generate subtitles in 30+ languages with 98% accuracy instantly.',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: FileText,
      title: 'AI Copywriting',
      description: 'Turn a video into a week’s worth of LinkedIn and Twitter posts.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Maximize2,
      title: 'Magic Resize',
      description: 'One click to convert landscape videos to 9:16 verticals.',
      color: 'bg-pink-50 text-pink-600'
    },
  ];

  const testimonials = [
    {
      name: "Elena R.",
      role: "Content Creator",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      quote: "I used to spend 4 hours editing captions. NexusCreate does it in 4 minutes. It's actual magic.",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Growth Lead",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      quote: "The video compression is lossless. I can't tell the difference, but my upload speeds doubled.",
      rating: 5
    },
    {
      name: "Sarah Jenkins",
      role: "Social Manager",
      image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
      quote: "The AI post generator captures my tone perfectly. This tool replaced three others in my stack.",
      rating: 4.5
    }
  ];

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>

      <div className="min-h-screen bg-white font-['Inter',_sans-serif] text-slate-900 selection:bg-indigo-100">

        {/* --- NAVBAR --- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              
              {/* New Logo & Name */}
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  NexusCreate
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Stories</a>
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
                
                <div className="h-4 w-px bg-slate-200 mx-2"></div>

                <a href="/sign-in" className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors">Log in</a>
                <a
                  href="/dashboard"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-semibold text-sm"
                >
                  Get Started
                </a>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-4 shadow-xl">
              <a href="#features" className="block text-base font-medium text-slate-600">Features</a>
              <a href="#testimonials" className="block text-base font-medium text-slate-600">Stories</a>
              <a href="#" className="block text-base font-medium text-slate-600">Log in</a>
              <a href="/dashboard" className="block w-full py-3 bg-slate-900 text-white text-center rounded-lg font-semibold">
                Get Started
              </a>
            </div>
          )}
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                v2.0 Now Live
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Your Content Workflow, <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Automated.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Stop juggling five different tools. NexusCreate brings compression, 
                captioning, and AI resizing into one seamless dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5 fill-slate-700" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* --- AUTOPLAY VIDEO MOCKUP --- */}
            <div className="relative max-w-5xl mx-auto">
              {/* Decorative blurs */}
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              
              {/* Browser Window Container */}
              <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800/50 ring-1 ring-slate-900/10">
                {/* Browser Controls */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto px-3 py-1 bg-slate-800 rounded-md text-[10px] text-slate-400 font-mono">
                    nexuscreate.app/dashboard
                  </div>
                </div>

                {/* Video Element */}
                <div className="relative aspect-video bg-slate-900">
                  {/* Sample video source (Big Buck Bunny is standard for demos) */}
                  <video 
                    className="w-full h-full object-cover opacity-90"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
                  
                  {/* Floating UI element mockup */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      AI Captioning Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Power-packed Tools
              </h2>
              <p className="text-lg text-slate-600">
                We stripped away the complexity. Everything you need to ship content faster is right here.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION (Replaced Bottom CTA) --- */}
        <section id="testimonials" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Loved by Modern Creators
              </h2>
              <p className="text-lg text-slate-600">
                Join the community of 10,000+ creators shipping faster with NexusCreate.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                  <Quote className="absolute top-8 right-8 w-8 h-8 text-slate-200 fill-slate-200" />
                  
                  <div className="flex items-center gap-1 mb-4">
                    <StarRating rating={t.rating} />
                  </div>
                  
                  <p className="text-slate-700 font-medium text-lg mb-6 leading-relaxed">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOOTER (Light Theme) --- */}
        <footer className="bg-white border-t border-slate-200 pt-16 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              
              {/* Brand Column */}
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">NexusCreate</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  The all-in-one toolkit helping creators automate the boring stuff and focus on storytelling.
                </p>
                <div className="flex gap-4">
                  {/* Social Placeholders */}
                  <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer flex items-center justify-center text-slate-600 hover:text-indigo-600">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer flex items-center justify-center text-slate-600 hover:text-indigo-600">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </div>
              </div>

              {/* Links Columns */}
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li><a href="/dashboard/compress-video" className="hover:text-indigo-600 transition-colors">Video Compress</a></li>
                  <li><a href="/dashboard/generate-captions" className="hover:text-indigo-600 transition-colors">Auto Captions</a></li>
                  <li><a href="/dashboard/image-resize" className="hover:text-indigo-600 transition-colors">Image Resize</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} NexusCreate. All rights reserved.
              </p>
              <div className="flex gap-6">
                 <span className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    All Systems Operational
                 </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}