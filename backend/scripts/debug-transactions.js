require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debug() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing env vars');
        return;
    }

    console.log('Connecting to Supabase...');
    const supabase = createClient(url, key);

    console.log('Attempting to fetch transactions...');
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .limit(1);

    if (error) {
        console.error('ERROR FETCHING TRANSACTIONS:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('Success! Data:', data);
    }
}

debug();
