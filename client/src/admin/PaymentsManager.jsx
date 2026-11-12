import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Send, 
  AlertCircle, 
  Clock, 
  Search, 
  FileText,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export default function PaymentsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); // Default to Pending for admin action
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [rejectModalReg, setRejectModalReg] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  // Bengali number converter
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/registrations', {
        params: { paymentStatus: filter, search, limit: 50 }
      });
      if (res.data.success) {
        setRegistrations(res.data.data.registrations);
      }
    } catch {
      // Mock for dev
      setRegistrations([
        {
          _id: 'p_1',
          registrationNumber: 'AUP-2026-1002',
          friendName: 'কাজী সাইফুল ইসলাম',
          mobile: '01819123456',
          email: 'saiful@example.com',
          participantCount: 3,
          totalFee: 3000,
          paymentMethod: 'বিকাশ',
          transactionId: 'BK9X87A21',
          paymentDate: '2026-11-12',
          senderMobile: '01819123456',
          paymentStatus: 'Pending',
          registrationStatus: 'অপেক্ষমাণ',
          confirmationEmailStatus: 'Not Sent'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter, search]);

  const handleVerify = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে পেমেন্টটি সঠিকভাবে প্রাপ্ত হয়েছে? নিশ্চিত করলে স্বয়ংক্রিয়ভাবে কনফার্মেশন ইমেইল চলে যাবে।')) return;

    setActionLoading(id);
    setMessage('');
    try {
      const res = await api.put(`/admin/payments/${id}/verify`);
      setMessage(res.data.message || 'পেমেন্ট সফলভাবে যাচাইকৃত হয়েছে।');
      fetchPayments();
    } catch (err) {
      alert(err.message || 'পেমেন্ট যাচাই ব্যর্থ হয়েছে।');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalReg) return;

    setActionLoading(rejectModalReg._id);
    try {
      await api.put(`/admin/payments/${rejectModalReg._id}/reject`, {
        adminNote: rejectNote
      });
      setMessage('পেমেন্ট প্রত্যাখ্যান করা হয়েছে।');
      setRejectModalReg(null);
      setRejectNote('');
      fetchPayments();
    } catch (err) {
      alert(err.message || 'প্রত্যাখ্যান ব্যর্থ হয়েছে।');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendEmail = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.post(`/admin/emails/${id}/resend`);
      setMessage(res.data.message || 'ইমেইল সফলভাবে পুনরায় পাঠানো হয়েছে।');
      fetchPayments();
    } catch (err) {
      alert(err.message || 'ইমেইল পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">পেমেন্ট যাচাই ও ইমেইল ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500">বিকাশ ও ব্যাংক পেমেন্ট যাচাই করে অংশগ্রহণ নিশ্চিত করুন</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-900 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {['Pending', 'Verified', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === status
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status === 'Pending' && 'পেন্ডিং (অপেক্ষমাণ)'}
              {status === 'Verified' && 'যাচাইকৃত (Verified)'}
              {status === 'Rejected' && 'বাতিল (Rejected)'}
              {status === 'All' && 'সকল পেমেন্ট'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="TrxID বা নাম দিয়ে খুঁজুন..."
            className="input input-bordered input-sm w-full pl-8 bg-slate-50 focus:bg-white text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th>রেজিস্ট্রেশন নং</th>
                <th>বন্ধুর নাম ও যোগাযোগ</th>
                <th>পেমেন্ট মেথড</th>
                <th>ট্রানজ্যাকশন আইডি</th>
                <th>প্রেরক নম্বর</th>
                <th>মোট ফি</th>
                <th>পেমেন্ট অবস্থা</th>
                <th>ইমেইল নোটিফিকেশন</th>
                <th className="text-right">যাচাইকরণ অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8">
                    <span className="loading loading-spinner text-emerald-800"></span>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">
                    কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                registrations.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="font-mono font-bold text-emerald-950">
                      {p.registrationNumber}
                    </td>
                    <td>
                      <div className="font-bold text-slate-900">{p.friendName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.mobile}</div>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        p.paymentMethod === 'বিকাশ' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded">
                      {p.transactionId}
                    </td>
                    <td className="font-mono text-slate-600">{p.senderMobile}</td>
                    <td className="font-mono font-bold text-emerald-800 text-sm">
                      {toBangla(p.totalFee)} ৳
                    </td>
                    <td>
                      {p.paymentStatus === 'Verified' ? (
                        <span className="badge badge-success text-white font-bold text-[11px]">যাচাইকৃত</span>
                      ) : p.paymentStatus === 'Rejected' ? (
                        <span className="badge badge-error text-white font-bold text-[11px]">বাতিল</span>
                      ) : (
                        <span className="badge badge-warning font-bold text-[11px]">পেন্ডিং</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-1">
                        {p.confirmationEmailStatus === 'Sent' ? (
                          <span className="text-emerald-700 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> প্রেরিত
                          </span>
                        ) : p.confirmationEmailStatus === 'Failed' ? (
                          <span className="text-red-600 font-bold flex items-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" /> ব্যর্থ
                          </span>
                        ) : (
                          <span className="text-slate-400">পাঠানো হয়নি</span>
                        )}
                        {p.paymentStatus === 'Verified' && (
                          <button
                            onClick={() => handleResendEmail(p._id)}
                            disabled={actionLoading === p._id}
                            className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 ml-1"
                            title="ইমেইল পুনরায় পাঠান"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="text-right space-x-1.5">
                      {p.paymentStatus === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleVerify(p._id)}
                            disabled={actionLoading === p._id}
                            className="btn btn-xs bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                          >
                            {actionLoading === p._id ? 'যাচাই হচ্ছে...' : 'অনুমোদন করুন'}
                          </button>
                          <button
                            onClick={() => { setRejectModalReg(p); setRejectNote(''); }}
                            className="btn btn-xs bg-red-700 hover:bg-red-800 text-white"
                          >
                            বাতিল
                          </button>
                        </>
                      ) : p.paymentStatus === 'Verified' ? (
                        <span className="text-[11px] text-emerald-800 font-semibold">অনুমোদিত সম্পন্ন</span>
                      ) : (
                        <span className="text-[11px] text-red-600 font-semibold">বাতিলকৃত</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Payment Modal with Admin Note */}
      {rejectModalReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-2">পেমেন্ট প্রত্যাখ্যানের কারণ</h2>
            <p className="text-xs text-slate-600">
              রেজিস্ট্রেশন নং: <strong>{rejectModalReg.registrationNumber}</strong> ({rejectModalReg.friendName})
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">প্রত্যাখ্যানের কারণ / অভ্যন্তরীণ নোট *</label>
                <textarea
                  rows="3"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="যেমন: বিকাশ ট্রানজ্যাকশন আইডি পাওয়া যায়নি বা ফি কম এসেছে..."
                  className="textarea textarea-bordered w-full text-xs"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setRejectModalReg(null)} className="btn btn-xs btn-ghost">বন্ধ করুন</button>
                <button type="submit" className="btn btn-xs bg-red-700 text-white font-bold">প্রত্যাখ্যান নিশ্চিত করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
