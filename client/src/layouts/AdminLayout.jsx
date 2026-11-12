import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Award, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, redirect to login
  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'ড্যাশবোর্ড সারসংক্ষেপ', path: '/admin', icon: LayoutDashboard },
    { name: 'রেজিস্ট্রেশন তালিকা', path: '/admin/registrations', icon: Users },
    { name: 'পেমেন্ট যাচাইকরণ', path: '/admin/payments', icon: CreditCard },
    { name: 'কুইজ প্রতিযোগিতা', path: '/admin/quiz', icon: Award },
    { name: 'ওয়েবসাইট সেটিংস', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-950 text-white shrink-0 border-r border-emerald-900 shadow-xl">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-emerald-900/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-900 border-2 border-gold-500 flex items-center justify-center text-gold-400 font-bold">
            আউ
          </div>
          <div>
            <div className="font-bold text-white text-base">আল উয়ূন পরিষদ</div>
            <div className="text-xs text-gold-400">অ্যাডমিন কন্ট্রোল প্যানেল</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-800 text-gold-300 font-bold shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-gold-400' : 'text-emerald-300'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-emerald-900/80 space-y-3">
          <div className="px-2">
            <span className="text-[11px] text-emerald-300 block">লগইনকৃত অ্যাডমিন:</span>
            <div className="text-xs font-semibold text-white truncate">{currentUser.email}</div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <Link
              to="/"
              target="_blank"
              className="btn btn-xs btn-outline border-emerald-700 text-emerald-200 hover:bg-emerald-900 flex-1"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> সাইট দেখুন
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-xs bg-red-800/80 hover:bg-red-900 text-white border-none"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-900 border border-gold-500 flex items-center justify-center text-gold-400 font-bold text-xs">
            আউ
          </div>
          <span className="font-bold text-sm">আল উয়ূন পরিষদ (অ্যাডমিন)</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:bg-emerald-900 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 text-white p-4 space-y-2 border-b border-emerald-900 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                isActive(item.path) ? 'bg-emerald-800 text-gold-300 font-bold' : 'text-slate-200 hover:bg-emerald-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-emerald-900 flex justify-between items-center text-xs">
            <span className="truncate max-w-[200px] text-slate-300">{currentUser.email}</span>
            <button onClick={handleLogout} className="text-red-400 hover:underline">লগআউট</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
