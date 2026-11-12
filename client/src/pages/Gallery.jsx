import React, { useState } from 'react';
import { Image as ImageIcon, X, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Initial gallery photos (sample event memories)
  const initialPhotos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      caption: 'মিলনমেলার মনোরম ভেন্যু ও স্বাগত জমায়েত — হোটেল সৈকত',
      category: 'ভেন্যু ও প্রস্তুতি'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      caption: 'বন্ধুত্বের পুনর্মিলনী ও স্মৃতিচারণ পর্ব',
      category: 'সৌহার্দ্য পর্ব'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      caption: 'শিশুদের জন্য ইসলামিক কুইজ প্রতিযোগিতা কক্ষ',
      category: 'কুইজ প্রতিযোগিতা'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      caption: 'সিআরবি ও সবুজ প্রকৃতির মাঝে পারিবারিক আড্ডা',
      category: 'সিআরবি ভ্রমণ'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      caption: 'পতেঙ্গা সমুদ্রসৈকত পরিদর্শনের স্মরণীয় বিকেল',
      category: 'পতেঙ্গা সৈকত'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
      caption: 'বার্ষিক সাধারণ সভা ও বিজয়ীদের মাঝে স্মারক পুরস্কার বিতরণ',
      category: 'পুরস্কার বিতরণ'
    }
  ];

  return (
    <div className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <ImageIcon className="w-4 h-4" />
            <span>স্মৃতির অ্যালবাম</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
            ইভেন্ট ফটো গ্যালারি
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            আল উয়ূন পরিষদ বার্ষিক পারিবারিক মিলনমেলা–২০২৬ এর আনন্দঘন ও স্মরণীয় মুহূর্তসমূহের স্থিরচিত্র।
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {initialPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedImage(photo)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-emerald-900 flex items-center justify-center shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-gold-400 text-xs px-2.5 py-1 rounded-full font-medium">
                  {photo.category}
                </div>
              </div>

              <div className="p-5 flex-grow flex items-center">
                <p className="text-slate-800 font-medium text-sm leading-snug">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Notice for 2026 Event Uploads */}
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center text-sm text-emerald-900 max-w-2xl mx-auto">
          ১২ ডিসেম্বর ২০২৬-এর মিলনমেলা চলাকালীন এবং সমাপ্তির পর মূল ইভেন্টের আলোকচিত্রসমূহ অ্যাডমিন কর্তৃক নিয়মিত গ্যালারিতে প্রকাশ করা হবে।
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="p-5 bg-white">
                <div className="text-xs text-gold-700 font-semibold mb-1">{selectedImage.category}</div>
                <h3 className="text-base font-bold text-slate-900">{selectedImage.caption}</h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
