/**
 * Upload an image file to ImgBB and return direct image URL
 */
const IMGBB_API_KEY = '6134124450fa8275bb666d0864ceb152';

export const uploadToImgBB = async (file) => {
  if (!file) throw new Error('কোনো ফাইল নির্বাচন করা হয়নি।');

  // Verify file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, JPEG, WEBP) নির্বাচন করুন।');
  }

  // Max 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট (10MB) হতে পারে।');
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.success && data.data) {
    return data.data.display_url || data.data.url;
  } else {
    throw new Error(data.error?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
  }
};
