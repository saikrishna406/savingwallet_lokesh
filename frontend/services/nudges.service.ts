const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export interface Nudge {
    id: string;
    message: string;
    type: 'reminder' | 'achievement' | 'suggestion' | 'milestone';
    read: boolean;
    created_at: string;
}

export const NudgesService = {
    getNudges: async (token: string): Promise<Nudge[]> => {
        const res = await fetch(`${BASE_URL}/nudges`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to fetch notifications');
        return await res.json();
    },

    markRead: async (token: string, nudgeId: string) => {
        const res = await fetch(`${BASE_URL}/nudges/${nudgeId}/read`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to mark notification as read');
        return await res.json();
    },

    markAllRead: async (token: string) => {
        const res = await fetch(`${BASE_URL}/nudges/read-all`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error('Failed to mark all as read');
        return await res.json();
    }
};
