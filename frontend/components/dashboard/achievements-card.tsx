"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faTrophy, faFeather, faMedal } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { GamificationService, GamificationStatus } from "@/services/gamification.service"
import { Skeleton } from "@/components/ui/skeleton"

export function AchievementsCard() {
    const [status, setStatus] = useState<GamificationStatus | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem("auth_token")
                if (!token) return
                const data = await GamificationService.getStatus(token)
                setStatus(data)
            } catch (err) {
                console.error("Failed to load achievements", err)
            } finally {
                setLoading(false)
            }
        }
        fetchStatus()
    }, [])

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'fa-fire': return faFire
            case 'fa-trophy': return faTrophy
            case 'fa-feather': return faFeather
            default: return faMedal
        }
    }

    if (loading) {
        return <Skeleton className="h-[200px] w-full rounded-xl" />
    }

    return (
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-indigo-900">Achievements</CardTitle>
                    {status && status.streak > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm border border-indigo-100">
                            <FontAwesomeIcon icon={faFire} className="text-orange-500 animate-pulse" />
                            <span className="text-sm font-bold text-orange-600">{status.streak} Day Streak</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    {/* Render Earned Badges */}
                    {status?.badges?.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2 text-yellow-600">
                                <FontAwesomeIcon icon={getIcon(badge.icon)} className="text-lg" />
                            </div>
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1">{badge.name}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{badge.description}</p>
                        </div>
                    ))}

                    {/* Placeholder for empty state */}
                    {(!status?.badges || status.badges.length === 0) && (
                        <div className="col-span-3 text-center py-4 text-sm text-gray-500 italic">
                            Start saving to unlock badges!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
