const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export const PaymentsService = {
    createOrder: async (token: string, amount: number) => {
        const res = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create order');
        }

        return await res.json();
    },

    verifyPayment: async (token: string, paymentData: any) => {
        const res = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Payment verification failed');
        }

        return await res.json();
    }
};
