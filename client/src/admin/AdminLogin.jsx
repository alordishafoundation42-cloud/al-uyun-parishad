import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('ইমেইল ও পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Back link */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-950">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> ওয়েবসাইটে ফিরে যান
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-900 border-2 border-gold-500 text-gold-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">অ্যাডমিন প্রবেশদ্বার</h1>
            <p className="text-xs text-slate-500">আল উয়ূন পরিষদ — মিলনমেলা ২০২৬ নিয়ন্ত্রণ প্যানেল</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">অনুমোদিত অ্যাডমিন ইমেইল</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aluyun.org"
                  className="input input-bordered w-full text-sm bg-slate-50 focus:bg-white pl-10"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full text-sm bg-slate-50 focus:bg-white pl-10"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary bg-emerald-800 hover:bg-emerald-900 text-white font-bold w-full text-base py-2.5 h-auto shadow"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>লগইন করুন</>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            নিরাপত্তা বিধির কারণে কেবলমাত্র পরিষদ কর্তৃক অনুমোদিত ইমেইল অ্যাকাউন্ট থেকেই অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করা যাবে।
          </div>
        </div>

      </div>
    </div>
  );
}
