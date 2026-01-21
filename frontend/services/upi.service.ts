const API_URL = 'http://localhost:3002/api';

export const UpiService = {
    /**
     * Link UPI ID to user profile
     */
    linkUpiId: async (token: string, upiId: string) => {
        const res = await fetch(`${API_URL}/users/link-upi`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ upi_id: upiId })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to link UPI ID');
        }

        return await res.json();
    },

    /**
     * Get user profile (includes UPI ID if linked)
     */
    getProfile: async (token: string) => {
        const res = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch profile');
        }

        return await res.json();
    },

    /**
     * Validate UPI ID format (client-side validation)
     * Allows: username@provider where username can contain letters, numbers, dots, hyphens, underscores
     * Examples: user123@paytm, john.doe@ybl, 9876543210@paytm, test@okaxis
     */
    validateUpiFormat: (upiId: string): boolean => {
        // More flexible regex: allows numbers, dots, hyphens, underscores in both parts
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z0-9.\-_]{2,}$/;
        return upiRegex.test(upiId);
    }
};
