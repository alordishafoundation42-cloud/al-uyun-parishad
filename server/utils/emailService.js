const nodemailer = require('nodemailer');

// Create transporter
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
};

// 1. Payment Confirmation Email Template
const sendPaymentConfirmationEmail = async ({ toEmail, friendName, registrationNumber, participantCount, totalFee }) => {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || '"আল উয়ূন পরিষদ" <no-reply@aluyun.org>';

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #d1fae5; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #064e3b; color: #fef08a; padding: 24px; text-align: center; border-bottom: 4px solid #ca8a04; }
        .content { padding: 32px 24px; line-height: 1.6; }
        .reg-box { background: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
        .reg-number { font-size: 28px; font-weight: bold; color: #065f46; letter-spacing: 2px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .details-table td:first-child { color: #64748b; width: 40%; }
        .details-table td:last-child { font-weight: bold; color: #0f172a; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div style="font-size: 14px; margin-bottom: 6px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <h2 style="margin: 0; font-size: 22px;">আল উয়ূন পরিষদ</h2>
          <div style="font-size: 13px; color: #fde047;">বার্ষিক মিলনমেলা–২০২৬ (সপরিবার)</div>
        </div>
        <div class="content">
          <h3 style="color: #065f46; margin-top: 0;">রেজিস্ট্রেশন ও পেমেন্ট নিশ্চিতকরণ</h3>
          <p>আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ, সম্মানিত বন্ধু <strong>${friendName}</strong>,</p>
          <p>আলহামদুলিল্লাহ! আপনার শুভেচ্ছা ফি যাচাই সম্পন্ন হয়েছে এবং মিলনমেলা–২০২৬ এ আপনার ও আপনার পরিবারের অংশগ্রহণ নিশ্চিত করা হয়েছে।</p>
          
          <div class="reg-box">
            <div style="font-size: 12px; color: #047857; text-transform: uppercase;">আপনার নিশ্চিত রেজিস্ট্রেশন নম্বর</div>
            <div class="reg-number">${registrationNumber}</div>
          </div>

          <table class="details-table">
            <tr>
              <td>মোট অংশগ্রহণকারী:</td>
              <td>${participantCount} জন</td>
            </tr>
            <tr>
              <td>জমাকৃত শুভেচ্ছা ফি:</td>
              <td>${totalFee} টাকা (যাচাইকৃত)</td>
            </tr>
            <tr>
              <td>ইভেন্টের তারিখ:</td>
              <td>১২ ডিসেম্বর ২০২৬, শনিবার (সকাল ১০:০০টা)</td>
            </tr>
            <tr>
              <td>ভেন্যু:</td>
              <td>হোটেল সৈকত, সাঙ্গু হল, স্টেশন রোড, চট্টগ্রাম</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #475569;">
            ভেন্যুতে উপস্থিতির সময় এই রেজিস্ট্রেশন নম্বরটি প্রদর্শন করতে হতে পারে। যেকোনো প্রয়োজনে সমন্বয়ক জনাব কাজী একেএম সাইফুদ্দিন মামুনের সাথে (+880 1819-173608) যোগাযোগ করুন।
          </p>
        </div>
        <div class="footer">
          © ২০২৬ আল উয়ূন পরিষদ। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </body>
    </html>
  `;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Simulation] Payment confirmation email sent to ${toEmail} for ${registrationNumber}`);
    return { success: true, simulated: true };
  }

  return await mailer.sendMail({
    from,
    to: toEmail,
    subject: `রেজিস্ট্রেশন নিশ্চিতকরণ — আল উয়ূন পরিষদ মিলনমেলা ২০২৬ (${registrationNumber})`,
    html,
  });
};

// 2. Quiz Result Notification Email Template
const sendQuizResultEmail = async ({ toEmail, fatherName, childName, score, totalMarks, rank, isTopThree }) => {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || '"আল উয়ূন পরিষদ" <no-reply@aluyun.org>';

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fed7aa; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #064e3b; color: #fef08a; padding: 24px; text-align: center; border-bottom: 4px solid #ca8a04; }
        .content { padding: 32px 24px; line-height: 1.6; }
        .score-box { background: ${isTopThree ? '#fef3c7' : '#f0fdf4'}; border: 2px solid ${isTopThree ? '#f59e0b' : '#22c55e'}; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin: 0; font-size: 22px;">আল উয়ূন পরিষদ</h2>
          <div style="font-size: 13px; color: #fde047;">শিশুদের কুইজ প্রতিযোগিতা–২০২৬ ফলাফল</div>
        </div>
        <div class="content">
          <p>আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ, সম্মানিত বন্ধু <strong>${fatherName}</strong>,</p>
          <p>আলহামদুলিল্লাহ! আপনার সন্তান <strong>${childName}</strong> মিলনমেলার বিশেষ কুইজ প্রতিযোগিতায় অংশগ্রহণ করেছিল। প্রতিযোগিতা শেষে ফলাফল আনুষ্ঠানিকভাবে প্রকাশিত হয়েছে।</p>
          
          <div class="score-box">
            <div style="font-size: 14px; color: #92400e; font-weight: bold;">
              ${isTopThree ? '🏆 অভিনন্দন! আপনার সন্তান শীর্ষ ৩ বিজয়ীর একজন!' : 'অংশগ্রহণের ফলাফল'}
            </div>
            <div style="font-size: 26px; font-weight: bold; margin: 8px 0; color: #065f46;">
              মেধা স্থান (Rank): ${rank}
            </div>
            <div style="font-size: 18px; color: #1e293b;">
              প্রাপ্ত স্কোর: ${score} / ${totalMarks}
            </div>
          </div>

          <p style="font-size: 13px; color: #475569;">
            ওয়েবসাইটের কুইজ ফলাফল পেজে পূর্ণাঙ্গ মেধা তালিকা উন্মুক্ত করা হয়েছে। আমাদের মিলনমেলাকে প্রাণবন্ত করায় আপনার পুরো পরিবারকে আন্তরিক মোবারকবাদ।
          </p>
        </div>
        <div class="footer">
          © ২০২৬ আল উয়ূন পরিষদ। বার্ষিক পারিবারিক মিলনমেলা।
        </div>
      </div>
    </body>
    </html>
  `;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Simulation] Quiz result email sent to ${toEmail} for ${childName} (Rank: ${rank})`);
    return { success: true, simulated: true };
  }

  return await mailer.sendMail({
    from,
    to: toEmail,
    subject: `কুইজ প্রতিযোগিতার ফলাফল — আল উয়ূন পরিষদ মিলনমেলা ২০২৬`,
    html,
  });
};

module.exports = {
  sendPaymentConfirmationEmail,
  sendQuizResultEmail,
};
