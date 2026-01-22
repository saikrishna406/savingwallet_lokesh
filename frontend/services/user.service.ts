const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export const UserService = {
    /**
     * Get user profile
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
     * Update user profile
     */
    updateProfile: async (token: string, data: any) => {
        const res = await fetch(`${API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        return await res.json();
    }
};
