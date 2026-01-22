require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debugConstraints() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing env vars');
        return;
    }

    const supabase = createClient(url, key);

    console.log('Fetching constraints for transactions table...');

    // We can't query information_schema easily via PostgREST unless exposed.
    // Instead, let's try to insert dummy rows with different Types to see what succeeds.

    const typesToTest = ['credit', 'CREDIT', 'deposit', 'DEPOSIT', 'income', 'INCOME'];

    for (const type of typesToTest) {
        console.log(`Testing Type: ${type}`);
        // We need a valid user and wallet ID. 
        // Let's first fetch a user.
        const { data: users } = await supabase.from('users').select('id').limit(1);
        if (!users || users.length === 0) {
            console.log('No users found to test with.');
            return;
        }
        const userId = users[0].id;

        // Fetch wallet
        const { data: wallets } = await supabase.from('wallets').select('id').eq('user_id', userId).limit(1);
        if (!wallets || wallets.length === 0) {
            console.log('No wallets found.');
            return;
        }
        const walletId = wallets[0].id;

        const { error } = await supabase.from('transactions').insert({
            user_id: userId,
            wallet_id: walletId,
            amount: 1,
            type: type, // Testing this
            source: 'UPI',
            status: 'PENDING'
        });

        if (error) {
            console.log(`❌ Type '${type}' failed: ${error.message}`);
        } else {
            console.log(`✅ Type '${type}' SUCCEEDED!`);
            // Cleanup
            // await supabase.from('transactions').delete().match({ amount: 1, type: type });
        }
    }
}

debugConstraints();
