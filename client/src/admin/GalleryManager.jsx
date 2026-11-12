import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    imageUrl: '',
    caption: '',
    category: 'মিলনমেলা স্মৃতি',
    isPublished: true
  });
  const [message, setMessage] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/gallery');
      if (res.data.success) {
        setPhotos(res.data.data);
      }
    } catch {
      // Mock for dev
      setPhotos([
        {
          _id: 'g1',
          imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          caption: 'হোটেল সৈকত সংবর্ধনা ভেন্যু',
          category: 'ভেন্যু ও প্রস্তুতি',
          isPublished: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.imageUrl.trim()) {
      alert('ছবির URL প্রদান করুন।');
      return;
    }

    try {
      await api.post('/admin/gallery', newPhoto);
      setMessage('ছবি সফলভাবে গ্যালারিতে যুক্ত হয়েছে।');
      setShowAddModal(false);
      setNewPhoto({ imageUrl: '', caption: '', category: 'মিলনমেলা স্মৃতি', isPublished: true });
      fetchGallery();
    } catch (err) {
      alert(err.message || 'যুক্ত করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      setMessage('ছবি মুছে ফেলা হয়েছে।');
      fetchGallery();
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ইভেন্ট ফটো গ্যালারি ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500">মিলনমেলার স্থিরচিত্র আপলোড ও প্রকাশ নিয়ন্ত্রণ</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-sm bg-emerald-800 hover:bg-emerald-900 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-1.5" /> নতুন ছবি যুক্ত করুন
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs">
          {message}
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center">
            <span className="loading loading-spinner text-emerald-800"></span>
          </div>
        ) : photos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            গ্যালারিতে কোনো ছবি যুক্ত করা হয়নি।
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo._id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    className="p-1.5 bg-black/60 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="ছবি ডিলিট করুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {photo.category}
                </span>
                <p className="text-xs text-slate-800 font-medium line-clamp-2 pt-1">
                  {photo.caption || 'ক্যাপশনবিহীন ছবি'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">নতুন ফটো যুক্ত করুন</h2>
            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">ছবির ইমেজ URL / Firebase Storage Link *</label>
                <input
                  type="url"
                  value={newPhoto.imageUrl}
                  onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ক্যাপশন / বিবরণ</label>
                <input
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  placeholder="যেমন: সৈকত মিলনায়তনে বন্ধুদের স্মৃতিচারণ"
                  className="input input-bordered input-sm w-full"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ক্যাটাগরি</label>
                <select
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="মিলনমেলা স্মৃতি">মিলনমেলা স্মৃতি</option>
                  <option value="ভেন্যু ও প্রস্তুতি">ভেন্যু ও প্রস্তুতি</option>
                  <option value="সিআরবি ভ্রমণ">সিআরবি ভ্রমণ</option>
                  <option value="পতেঙ্গা সৈকত">পতেঙ্গা সৈকত</option>
                  <option value="পুরস্কার বিতরণ">পুরস্কার বিতরণ</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-xs btn-ghost">বাতিল</button>
                <button type="submit" className="btn btn-xs btn-primary bg-emerald-800 text-white font-bold">ছবি প্রকাশ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
