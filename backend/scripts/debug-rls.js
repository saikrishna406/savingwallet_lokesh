require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debugRLS() {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        console.error('Missing env vars');
        return;
    }

    console.log('Connecting with Anon Key (Simulating User)...');
    // NOTE: This test will fail if we don't have a valid user token.
    // However, we can test if we can SELECT at all.
    // Actually, RLS requires a signed-in user.
    // Let's print the RLS policy definition if possible.

    // Alternative: Try to fetch with Service Role but mimic the user query EXACTLY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const admin = createClient(url, serviceKey);

    // Get a user ID to test with
    const { data: users } = await admin.auth.admin.listUsers();
    const testUser = users.users[0];

    if (!testUser) {
        console.log('No users found to test with.');
        return;
    }
    console.log('Testing with User:', testUser.email, testUser.id);

    // 1. Check if we can fetch via Admin (should work)
    const { data: adminData, error: adminError } = await admin
        .from('transactions')
        .select('*')
        .eq('user_id', testUser.id);

    if (adminError) console.error('Admin Fetch Error:', adminError);
    else console.log('Admin Fetch Success, Count:', adminData.length);

    // 2. We can't easily simulate a JWT here without signing one.
    // But if Admin fetch works, and Frontend fails, it IS 99% RLS.

    // Let's check if there are any RLS policies on the table
    // We can't query pg_policies easily via JS client without SQL function.

    console.log('Recommendation: Check RLS Policy in Dashboard');
}

debugRLS();
