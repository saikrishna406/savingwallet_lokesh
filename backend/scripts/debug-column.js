require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debugColumnType() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(url, key);

    console.log('Checking column type for "transactions.type"...');

    // Attempt to insert a value that definitely fails casting to Enum but passes Text (if no constraint)
    // Actually, let's just inspect one row and print typeof
    const { data, error } = await supabase.from('transactions').select('type').limit(1);

    if (error) {
        console.log('Error selecting:', error.message);
    } else if (data.length > 0) {
        console.log('Sample Row Type Value:', data[0].type);
        console.log('JS Type:', typeof data[0].type);
    } else {
        console.log('No rows found.');
    }

    // Try to run a raw query via rpc if we had one, but we don't for generic sql.
    // We can try to infer from an error message by filtering with an integer?
    // "operator does not exist: <type> = integer"

    const { error: typeError } = await supabase.from('transactions').select('*').eq('type', 123);
    if (typeError) {
        console.log('Type inference error:', typeError.message);
    }
}

debugColumnType();
