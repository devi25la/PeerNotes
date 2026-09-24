const assert = require('assert');

const baseURL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

async function testFullApplicationFlow() {
  console.log('🚀 Running Comprehensive Full-Stack Verification Tests...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing API Health Endpoint...');
    const health = await req(`${baseURL}/health`);
    assert.strictEqual(health.status, 'ok');
    console.log('   ✅ Health OK');

    // 2. Student Authentication
    console.log('2️⃣ Testing Student Login...');
    const studentLogin = await req(`${baseURL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'aarav@student.edu',
        password: 'Student@123456'
      })
    });
    assert.strictEqual(studentLogin.success, true);
    const studentToken = studentLogin.token;
    const initialCredits = studentLogin.user.credits;
    console.log(`   ✅ Student logged in. Current Credits: ${initialCredits}`);

    // 3. Admin Authentication
    console.log('3️⃣ Testing Admin Login...');
    const adminLogin = await req(`${baseURL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@peernotes.edu',
        password: 'Admin@123456'
      })
    });
    assert.strictEqual(adminLogin.success, true);
    assert.strictEqual(adminLogin.user.role, 'admin');
    const adminToken = adminLogin.token;
    console.log('   ✅ Admin authenticated with role: admin');

    // 4. Resource Discovery & Filtering
    console.log('4️⃣ Testing Resource Search & Filtering...');
    const searchRes = await req(`${baseURL}/resources?search=DBMS&category=Database%20Management`);
    assert.strictEqual(searchRes.success, true);
    assert.ok(searchRes.data.length > 0);
    const firstResource = searchRes.data[0];
    console.log(`   ✅ Found ${searchRes.data.length} resources for search="DBMS". First: "${firstResource.title}"`);

    // 5. Resource Details & Review Calculation
    console.log('5️⃣ Testing Resource Details & Reviews...');
    const detailsRes = await req(`${baseURL}/resources/${firstResource._id}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(detailsRes.success, true);
    assert.ok(detailsRes.data.averageRating >= 0);
    console.log(`   ✅ Resource Details loaded. Rating: ${detailsRes.data.averageRating}★ (${detailsRes.data.ratingCount} reviews)`);

    // 6. Bookmark Toggle
    console.log('6️⃣ Testing Bookmark System...');
    const bookmarkRes = await req(`${baseURL}/bookmarks/${firstResource._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(bookmarkRes.success, true);
    console.log(`   ✅ Bookmark toggled. IsBookmarked: ${bookmarkRes.isBookmarked}`);

    // 7. Rating & Review Upsert
    console.log('7️⃣ Testing Review & Rating System...');
    const reviewRes = await req(`${baseURL}/reviews/${firstResource._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        rating: 5,
        comment: 'Automated test review - Highly accurate diagrams and explanation!'
      })
    });
    assert.strictEqual(reviewRes.success, true);
    console.log(`   ✅ Review posted. New Average Rating: ${reviewRes.averageRating}★`);

    // 8. Download & Credit System
    console.log('8️⃣ Testing Resource Download & Credit Deduction (-1 credit)...');
    const downloadRes = await req(`${baseURL}/downloads/${firstResource._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(downloadRes.success, true);
    assert.ok(downloadRes.fileUrl);
    console.log(`   ✅ Download successful. Updated student balance: ${downloadRes.currentCredits} credits`);

    // 9. Credit Ledger Verification
    console.log('9️⃣ Testing Credit Ledger History...');
    const creditHistory = await req(`${baseURL}/credits/history`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert.strictEqual(creditHistory.success, true);
    assert.ok(creditHistory.data.length > 0);
    console.log(`   ✅ Credit ledger verified. Total entries: ${creditHistory.total}`);

    // 10. Admin Statistics & Moderation Stats
    console.log('🔟 Testing Admin Statistics & Queue...');
    const adminStats = await req(`${baseURL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminStats.success, true);
    assert.ok(adminStats.stats.totalStudents >= 10);
    assert.ok(adminStats.stats.totalResources >= 20);
    console.log(`   ✅ Admin stats verified: ${adminStats.stats.totalStudents} Students, ${adminStats.stats.totalResources} Total Resources`);

    console.log('\n======================================================');
    console.log('🎉 ALL FULL-STACK SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    process.exit(1);
  }
}

testFullApplicationFlow();
