import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Award, Image, UserCheck, Phone, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'মূল পাতা', path: '/' },
    { name: 'ইভেন্ট বিবরণ', path: '/event-details' },
    { name: 'রেজিস্ট্রেশন', path: '/registration' },
    { name: 'রেজিস্ট্রেশন স্ট্যাটাস', path: '/registration-status' },
    { name: 'কুইজ প্রতিযোগিতা', path: '/quiz' },
    { name: 'কুইজ ফলাফল', path: '/quiz-results' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Event Title */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="w-12 h-12 rounded-full bg-emerald-900 border-2 border-gold-500 flex items-center justify-center text-gold-400 font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              আউ
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                আল উয়ূন পরিষদ
              </div>
              <div className="text-xs sm:text-sm font-medium text-gold-700">
                বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Registration CTA button on desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/registration"
              className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white border-none shadow-md hover:shadow-lg transition-all"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-emerald-900 hover:bg-emerald-50 focus:outline-none"
              aria-label="মেনু খুলুন"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 shadow-xl px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              to="/registration"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary w-full bg-emerald-800 hover:bg-emerald-900 text-white border-none shadow"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
