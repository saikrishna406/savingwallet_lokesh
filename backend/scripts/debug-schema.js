require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debugSchema() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing env vars');
        return;
    }

    console.log('Connecting to Supabase...');
    const supabase = createClient(url, key);

    console.log('Fetching one wallet to check columns...');
    const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .limit(1);

    if (error) {
        console.error('ERROR FETCHING WALLETS:', error);
    } else if (data && data.length > 0) {
        console.log('Wallet Keys:', Object.keys(data[0]));
    } else {
        console.log('No wallets found, creating a dummy one to inspect ID...');
        // We can't verify ID column existence without data or admin API.
        // But if keys are empty, it's empty.
    }
}

debugSchema();
