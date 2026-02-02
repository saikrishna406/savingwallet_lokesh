const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export interface Badge {
    slug: string;
    name: string;
    description: string;
    icon: string;
    earned_at?: string;
}

export interface GamificationStatus {
    streak: number;
    lastContribution?: string;
    badges: Badge[];
}

export const GamificationService = {
    getStatus: async (token: string): Promise<GamificationStatus> => {
        const res = await fetch(`${BASE_URL}/gamification/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch gamification status');
        }

        return await res.json();
    }
};
