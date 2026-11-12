const Gallery = require('../models/Gallery');

// In-memory fallback
const inMemoryGallery = [
  {
    _id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    caption: 'মিলনমেলার মনোরম ভেন্যু ও স্বাগত জমায়েত — হোটেল সৈকত',
    category: 'ভেন্যু ও প্রস্তুতি',
    isPublished: true,
    uploadedAt: new Date()
  },
  {
    _id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    caption: 'বন্ধুত্বের পুনর্মিলনী ও স্মৃতিচারণ পর্ব',
    category: 'সৌহার্দ্য পর্ব',
    isPublished: true,
    uploadedAt: new Date()
  },
  {
    _id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'পতেঙ্গা সমুদ্রসৈকত পরিদর্শনের স্মরণীয় বিকেল',
    category: 'পতেঙ্গা সৈকত',
    isPublished: true,
    uploadedAt: new Date()
  }
];

// Public: Get published images
exports.getPublicGallery = async (req, res) => {
  try {
    let images = await Gallery.find({ isPublished: true }).sort({ uploadedAt: -1 }).catch(() => null);
    if (!images || images.length === 0) {
      images = inMemoryGallery.filter(img => img.isPublished);
    }
    return res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'গ্যালারি লোড করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// Admin: Get all images
exports.getAdminGallery = async (req, res) => {
  try {
    let images = await Gallery.find().sort({ uploadedAt: -1 }).catch(() => null);
    if (!images || images.length === 0) {
      images = inMemoryGallery;
    }
    return res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'গ্যালারি লোড করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};

// Admin: Add image
exports.addGalleryImage = async (req, res) => {
  try {
    const { imageUrl, caption, category, isPublished } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'ছবির লিংক (URL) আবশ্যক।' });
    }

    const newPhoto = {
      imageUrl,
      caption: caption || '',
      category: category || 'মিলনমেলা স্মৃতি',
      isPublished: isPublished !== undefined ? isPublished : true,
      uploadedAt: new Date()
    };

    let saved;
    try {
      const g = new Gallery(newPhoto);
      saved = await g.save();
    } catch {
      newPhoto._id = 'g_' + Date.now();
      inMemoryGallery.unshift(newPhoto);
      saved = newPhoto;
    }

    return res.status(201).json({
      success: true,
      message: 'ছবি সফলভাবে গ্যালারিতে যুক্ত হয়েছে।',
      data: saved
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'ছবি যোগ করতে ব্যর্থ হয়েছে: ' + error.message
    });
  }
};

// Admin: Delete image
exports.deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndDelete(id).catch(() => {
      const idx = inMemoryGallery.findIndex(g => g._id === id);
      if (idx !== -1) inMemoryGallery.splice(idx, 1);
    });

    return res.status(200).json({
      success: true,
      message: 'ছবিটি সফলভাবে মুছে ফেলা হয়েছে।'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'ছবি ডিলিট করতে সমস্যা হয়েছে: ' + error.message
    });
  }
};
