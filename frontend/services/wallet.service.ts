const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export const WalletService = {
    /**
     * Get wallet balance for the authenticated user
     */
    getWallet: async (token: string) => {
        const res = await fetch(`${API_URL}/wallet`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch wallet');
        }

        return await res.json();
    }
};
