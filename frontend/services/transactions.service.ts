const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export const TransactionsService = {
    /**
     * Get transaction history
     */
    getHistory: async (token: string) => {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            let errorMessage = 'Failed to fetch transactions';
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Ignore json parse error
            }
            throw new Error(errorMessage);
        }

        return await res.json();
    }
};
