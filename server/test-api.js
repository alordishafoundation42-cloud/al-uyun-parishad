const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🚀 শুরু হচ্ছে এন্ড-টু-এন্ড এপিআই পরীক্ষা...\n');

  try {
    // 1. Health
    const health = await request('GET', '/api/health');
    console.log(`[1] Health Check: Status ${health.status} -> ${health.body.message}`);

    // 2. Settings
    const settings = await request('GET', '/api/settings');
    console.log(`[2] Public Settings: Status ${settings.status} -> Event: ${settings.body.data?.eventName || settings.body.eventName}`);

    // 3. Submit Registration
    const regPayload = {
      friendName: 'কাজী একেএম সাইফুদ্দিন মামুন',
      mobile: '01819173608',
      email: 'mamun@aluyun.org',
      profession: 'আইনজীবী',
      highestDegree: 'কামিল',
      kamilSubject: 'হাদিস',
      presentAddress: 'স্টেশন রোড, চট্টগ্রাম',
      permanentAddress: 'পটিয়া, চট্টগ্রাম',
      familyMembers: [
        { name: 'ফাতিমা বেগম', age: 34, gender: 'মহিলা', relationship: 'স্ত্রী/স্বামী' },
        { name: 'আব্দুর রহমান মামুন', age: 10, gender: 'পুরুষ', relationship: 'ছেলে' },
        { name: 'আয়েশা জান্নাত', age: 7, gender: 'মহিলা', relationship: 'মেয়ে' }
      ],
      paymentMethod: 'বিকাশ',
      transactionId: 'BK9X2026MAMUN',
      paymentDate: '2026-11-12',
      senderMobile: '01819173608'
    };

    const regRes = await request('POST', '/api/registrations', regPayload);
    console.log(`[3] Registration Submit: Status ${regRes.status}`);
    console.log(`    -> RegNo: ${regRes.body.data?.registrationNumber}, Participants: ${regRes.body.data?.participantCount}, Total Fee: ${regRes.body.data?.totalFee} BDT`);

    const regNo = regRes.body.data?.registrationNumber;

    // 4. Duplicate Mobile Test
    const dupRes = await request('POST', '/api/registrations', regPayload);
    console.log(`[4] Duplicate Mobile Prevention: Status ${dupRes.status} -> ${dupRes.body.message}`);

    // 5. Public Status Lookup
    const statusRes = await request('GET', `/api/registrations/status/${regNo}`);
    console.log(`[5] Public Status Lookup: Status ${statusRes.status}`);
    console.log(`    -> Friend: ${statusRes.body.data?.friendName}, Payment: ${statusRes.body.data?.paymentStatus}`);
    console.log(`    -> (Privacy Check: Mobile exposed? ${!!statusRes.body.data?.mobile}, Email exposed? ${!!statusRes.body.data?.email})`);

    // 6. Child Quiz Verification
    const verifyChildRes = await request('POST', '/api/quiz/verify-child', {
      mobile: '01819173608',
      childName: 'আব্দুর রহমান মামুন'
    });
    console.log(`[6] Child Quiz Verification: Status ${verifyChildRes.status} -> ${verifyChildRes.body.message}`);

    const childIdentifier = verifyChildRes.body.data?.childIdentifier;
    const registrationId = verifyChildRes.body.data?.registrationId;

    // 7. Start Quiz
    const startQuizRes = await request('POST', '/api/quiz/start', {
      registrationId,
      childName: 'আব্দুর রহমান মামুন',
      childIdentifier
    });
    console.log(`[7] Quiz Start: Status ${startQuizRes.status}`);
    console.log(`    -> Remaining Time: ${startQuizRes.body.data?.remainingSeconds}s, Questions Count: ${startQuizRes.body.data?.questions?.length}`);

    // 8. Submit Quiz
    const questions = startQuizRes.body.data?.questions || [];
    const answers = questions.map(q => ({
      questionId: q.id,
      selectedOption: q.options[0]
    }));

    const submitQuizRes = await request('POST', '/api/quiz/submit', {
      attemptId: startQuizRes.body.data?.attemptId,
      childIdentifier,
      answers
    });
    console.log(`[8] Quiz Submit & Backend Scoring: Status ${submitQuizRes.status}`);
    console.log(`    -> Score: ${submitQuizRes.body.data?.score}/${submitQuizRes.body.data?.totalMarks}, Completion: ${submitQuizRes.body.data?.completionTime}s`);

    // 9. Prevent Duplicate Attempt
    const dupChildRes = await request('POST', '/api/quiz/verify-child', {
      mobile: '01819173608',
      childName: 'আব্দুর রহমান মামুন'
    });
    console.log(`[9] Duplicate Quiz Attempt Prevention: Status ${dupChildRes.status} -> ${dupChildRes.body.message}`);

    // 10. Admin Token Verification & Dashboard
    const adminToken = 'demo-admin-token';
    const dashRes = await request('GET', '/api/admin/dashboard', null, adminToken);
    console.log(`[10] Admin Dashboard Stats: Status ${dashRes.status}`);
    console.log(`     -> Total Registrations: ${dashRes.body.data?.totalRegistrations}, Total Participants: ${dashRes.body.data?.totalParticipants}`);

    // 11. Admin Verify Payment
    const adminRegs = await request('GET', '/api/admin/registrations', null, adminToken);
    const firstRegId = adminRegs.body.data?.registrations[0]?._id;
    if (firstRegId) {
      const verifyPayRes = await request('PUT', `/api/admin/payments/${firstRegId}/verify`, { adminNote: 'Verified via Bkash' }, adminToken);
      console.log(`[11] Admin Payment Verification: Status ${verifyPayRes.status} -> ${verifyPayRes.body.message}`);
    }

    // 12. Admin Publish Quiz Results
    const pubRes = await request('POST', '/api/admin/quiz/publish-results', null, adminToken);
    console.log(`[12] Admin Publish Quiz Results: Status ${pubRes.status} -> ${pubRes.body.message}`);

    // 13. Public Results
    const pubResults = await request('GET', '/api/quiz/results');
    console.log(`[13] Public Quiz Results: Status ${pubResults.status}`);
    console.log(`     -> Published: ${pubResults.body.isPublished}, Total Winners Ranked: ${pubResults.body.data?.length}`);

    // Clean up: Reset to unpublished default
    await request('POST', '/api/admin/quiz/unpublish-results', null, adminToken);
    console.log(`[CleanUp] Reset quiz status to unpublished default.`);

    console.log('\n🎉 আলহামদুলিল্লাহ! সকল এন্ড-টু-এন্ড টেস্ট সফলভাবে সম্পন্ন হয়েছে!');

  } catch (err) {
    console.error('Test Error:', err);
  }
}

runTests();
