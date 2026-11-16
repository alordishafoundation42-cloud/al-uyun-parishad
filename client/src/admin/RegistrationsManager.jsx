import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  CheckCircle, 
  Clock, 
  XCircle,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { downloadRegistrationsCSV } from '../utils/exportCsv';

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedReg, setSelectedReg] = useState(null);
  const [editReg, setEditReg] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');

  // Bengali number converter
  const toBangla = (num) => {
    const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => digits[+w]);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/registrations', {
        params: { search, paymentStatus: paymentFilter, page, limit: 15 }
      });
      if (res.data.success) {
        setRegistrations(res.data.data.registrations);
        setTotalPages(res.data.data.pages || 1);
      }
    } catch (err) {
      setRegistrations([]);
      setMessage('সার্ভার বা ডাটাবেজের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে ব্যাকএন্ড সার্ভার চালু আছে কিনা নিশ্চিত করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [search, paymentFilter, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই রেজিস্ট্রেশনটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/admin/registrations/${id}`);
      setMessage('রেজিস্ট্রেশন সফলভাবে মুছে ফেলা হয়েছে।');
      fetchRegistrations();
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে।');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/registrations/${editReg._id}`, editReg);
      setMessage('রেজিস্ট্রেশন তথ্য হালনাগাদ করা হয়েছে।');
      setEditReg(null);
      fetchRegistrations();
    } catch (err) {
      alert(err.message || 'আপডেট করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadRegistrationsCSV();
    } catch (err) {
      alert(err.message || 'CSV ফাইল ডাউনলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">রেজিস্ট্রেশন ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500">সকল নিবন্ধিত বন্ধু ও পারিবারিক সদস্যদের তালিকা</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
        >
          {exporting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              ডাউনলোড হচ্ছে...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> সম্পূর্ণ তালিকা CSV ডাউনলোড
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs">
          {message}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, মোবাইল বা রেজিস্ট্রেশন নম্বর দিয়ে খুঁজুন..."
            className="input input-bordered input-sm w-full pl-9 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="select select-bordered select-sm bg-slate-50 focus:bg-white"
          >
            <option value="All">সকল পেমেন্ট স্ট্যাটাস</option>
            <option value="Pending">পেন্ডিং (অপেক্ষমাণ)</option>
            <option value="Verified">যাচাইকৃত (Verified)</option>
            <option value="Rejected">বাতিল (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th>রেজিস্ট্রেশন নং</th>
                <th>বন্ধুর নাম</th>
                <th>মোবাইল নম্বর</th>
                <th>অংশগ্রহণকারী</th>
                <th>মোট ফি</th>
                <th>পেমেন্ট অবস্থা</th>
                <th>ইমেইল অবস্থা</th>
                <th className="text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <span className="loading loading-spinner text-emerald-800"></span>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">
                    কোনো রেজিস্ট্রেশন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50 transition-colors">
                    <td className="font-mono font-bold text-emerald-950">
                      {reg.registrationNumber}
                    </td>
                    <td className="font-semibold text-slate-900">{reg.friendName}</td>
                    <td className="font-mono text-slate-600">{reg.mobile}</td>
                    <td className="font-bold text-slate-800">{toBangla(reg.participantCount)} জন</td>
                    <td className="font-bold text-emerald-800 font-mono">{toBangla(reg.totalFee)} ৳</td>
                    <td>
                      {reg.paymentStatus === 'Verified' ? (
                        <span className="badge badge-success text-white text-xs font-bold">যাচাইকৃত</span>
                      ) : reg.paymentStatus === 'Rejected' ? (
                        <span className="badge badge-error text-white text-xs font-bold">বাতিল</span>
                      ) : (
                        <span className="badge badge-warning text-xs font-bold">পেন্ডিং</span>
                      )}
                    </td>
                    <td>
                      {reg.confirmationEmailStatus === 'Sent' ? (
                        <span className="text-xs text-emerald-700 font-semibold">প্রেরিত</span>
                      ) : reg.confirmationEmailStatus === 'Failed' ? (
                        <span className="text-xs text-red-600 font-semibold">ব্যর্থ</span>
                      ) : (
                        <span className="text-xs text-slate-400">পাঠানো হয়নি</span>
                      )}
                    </td>
                    <td className="text-right space-x-1">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="btn btn-xs btn-ghost text-slate-700 hover:bg-slate-200"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditReg(reg)}
                        className="btn btn-xs btn-ghost text-emerald-800 hover:bg-emerald-50"
                        title="সংশোধন করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reg._id)}
                        className="btn btn-xs btn-ghost text-red-600 hover:bg-red-50"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-4">
              <span className="text-xs text-slate-400 font-mono">{selectedReg.registrationNumber}</span>
              <h2 className="text-2xl font-bold text-slate-900">{selectedReg.friendName}</h2>
              <div className="text-xs text-slate-500 mt-1">পেশা: {selectedReg.profession} | শিক্ষা: {selectedReg.highestDegree} {selectedReg.kamilSubject ? `(${selectedReg.kamilSubject})` : ''}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">যোগাযোগ:</span>
                <div className="font-mono text-slate-800">{selectedReg.mobile}</div>
                <div className="text-slate-600">{selectedReg.email}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">ঠিকানা:</span>
                <div className="text-slate-800">বর্তমান: {selectedReg.presentAddress}</div>
                <div className="text-slate-600">স্থায়ী: {selectedReg.permanentAddress}</div>
              </div>
            </div>

            {/* Family Members List */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">পরিবারের অংশগ্রহণকারী সদস্যবৃন্দ ({selectedReg.familyMembers?.length || 0} জন):</h3>
              {selectedReg.familyMembers?.length > 0 ? (
                <div className="divide-y border rounded-xl overflow-hidden text-xs">
                  {selectedReg.familyMembers.map((m, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center bg-white hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-800">{m.name}</span> ({m.relationship})
                      </div>
                      <div className="text-slate-500 font-mono">
                        {toBangla(m.age)} বছর • {m.gender}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">কোনো অতিরিক্ত পারিবারিক সদস্য নেই।</p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="text-slate-700">
                  পেমেন্ট মাধ্যম: <strong className="text-emerald-950 font-bold">{selectedReg.paymentMethod}</strong>
                  {selectedReg.transactionId && ` (TrxID: ${selectedReg.transactionId})`}
                </div>
                {selectedReg.cashReceiver ? (
                  <div className="text-amber-900 font-bold mt-1 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg inline-block">
                    💵 ক্যাশ জমার গ্রহীতা: {selectedReg.cashReceiver}
                  </div>
                ) : (
                  <div className="text-slate-500 mt-0.5">প্রেরক নম্বর: {selectedReg.senderMobile || 'প্রযোজ্য নয়'}</div>
                )}
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-500">সর্বমোট ফি:</span>
                <div className="text-lg font-bold text-emerald-900 font-mono">{toBangla(selectedReg.totalFee)} টাকা</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editReg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditReg(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 border-b pb-3">তথ্য সংশোধন</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">বন্ধুর নাম</label>
                <input
                  type="text"
                  value={editReg.friendName}
                  onChange={(e) => setEditReg({ ...editReg, friendName: e.target.value })}
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">মোবাইল</label>
                  <input
                    type="text"
                    value={editReg.mobile}
                    onChange={(e) => setEditReg({ ...editReg, mobile: e.target.value })}
                    className="input input-bordered input-sm w-full"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={editReg.email}
                    onChange={(e) => setEditReg({ ...editReg, email: e.target.value })}
                    className="input input-bordered input-sm w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">পেশা</label>
                <input
                  type="text"
                  value={editReg.profession}
                  onChange={(e) => setEditReg({ ...editReg, profession: e.target.value })}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">বর্তমান ঠিকানা</label>
                <input
                  type="text"
                  value={editReg.presentAddress}
                  onChange={(e) => setEditReg({ ...editReg, presentAddress: e.target.value })}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={editReg.paymentMethod || 'বিকাশ'}
                    onChange={(e) => setEditReg({ ...editReg, paymentMethod: e.target.value })}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="বিকাশ">বিকাশ</option>
                    <option value="ব্যাংক">ব্যাংক</option>
                    <option value="হাতে হাতে / ক্যাশ">হাতে হাতে / ক্যাশ</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    {(editReg.paymentMethod?.includes('হাতে') || editReg.paymentMethod?.includes('ক্যাশ')) ? 'ক্যাশ গ্রহণকারীর নাম' : 'TrxID'}
                  </label>
                  <input
                    type="text"
                    value={(editReg.paymentMethod?.includes('হাতে') || editReg.paymentMethod?.includes('ক্যাশ')) ? (editReg.cashReceiver || '') : (editReg.transactionId || '')}
                    onChange={(e) => {
                      if (editReg.paymentMethod?.includes('হাতে') || editReg.paymentMethod?.includes('ক্যাশ')) {
                        setEditReg({ ...editReg, cashReceiver: e.target.value });
                      } else {
                        setEditReg({ ...editReg, transactionId: e.target.value });
                      }
                    }}
                    placeholder={(editReg.paymentMethod?.includes('হাতে') || editReg.paymentMethod?.includes('ক্যাশ')) ? 'ক্যাশ গ্রহীতার নাম' : 'TrxID'}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditReg(null)} className="btn btn-sm btn-ghost">বাতিল</button>
                <button type="submit" className="btn btn-sm btn-primary bg-emerald-800 text-white">সংরক্ষণ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
