"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheck,
    faClock,
    faFilter,
    faSearch,
    faTrophy,
    faMoneyBillWave,
    faBullseye,
    faSpinner,
    faHistory,
    faArrowUp,
    faArrowDown,
    faExchangeAlt
} from '@fortawesome/free-solid-svg-icons'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { WalletService } from "@/services/wallet.service"
import { GoalsService } from "@/services/goals.service"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('auth_token')

            if (!token) {
                setError('Please login to view activity')
                return
            }

            // Fetch wallet transactions and goals
            const [walletData, goalsData] = await Promise.all([
                WalletService.getWallet(token),
                GoalsService.getGoals(token)
            ])

            // Combine transactions and goals into activities
            const transactionActivities = (walletData.transactions || []).map((tx: any) => ({
                id: `tx-${tx.id}`,
                title: tx.type === 'deposit' || tx.type === 'credit' ? 'Money Added' : 'Withdrawal',
                description: tx.description || tx.type,
                time: new Date(tx.created_at).toLocaleString(),
                icon: tx.type === 'deposit' || tx.type === 'credit' ? faArrowDown : faArrowUp,
                color: tx.type === 'deposit' || tx.type === 'credit' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50',
                amount: `${tx.type === 'deposit' || tx.type === 'credit' ? '+' : '-'}₹${tx.amount.toLocaleString()}`,
                timestamp: new Date(tx.created_at).getTime()
            }))

            const goalActivities = (goalsData || []).map((goal: any) => ({
                id: `goal-${goal.id}`,
                title: 'Goal Created',
                description: `New goal '${goal.name}' started`,
                time: new Date(goal.created_at).toLocaleString(),
                icon: faBullseye,
                color: 'text-blue-600 bg-blue-50',
                amount: null,
                timestamp: new Date(goal.created_at).getTime()
            }))

            // Combine and sort by timestamp (newest first)
            const allActivities = [...transactionActivities, ...goalActivities]
                .sort((a, b) => b.timestamp - a.timestamp)

            setActivities(allActivities)
            setError(null)
        } catch (err: any) {
            console.error('Failed to fetch activities:', err)
            setError(err.message || 'Failed to load activities')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-600">Loading activities...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchActivities}>Retry</Button>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1200px]"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your financial journey and milestones</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <Input placeholder="Search activity..." className="pl-9 w-[200px] md:w-[260px] bg-white border-gray-200" />
                    </div>
                    <Button variant="outline" size="icon" className="border-gray-200 text-gray-500">
                        <FontAwesomeIcon icon={faFilter} />
                    </Button>
                </div>
            </motion.div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <motion.div variants={item}>
                        <Card className="border border-gray-100 bg-white">
                            <CardContent className="p-12 text-center">
                                <FontAwesomeIcon icon={faHistory} className="text-5xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
                                <p className="text-gray-500">Your financial activities will appear here</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    activities.map((activity) => (
                        <motion.div key={activity.id} variants={item}>
                            <Card className="border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                                        <FontAwesomeIcon icon={activity.icon} className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{activity.title}</h4>
                                        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        {activity.amount && (
                                            <p className={`font-semibold mb-1 ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                                                }`}>{activity.amount}</p>
                                        )}
                                        <p className="text-xs text-gray-400">{activity.time}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    )
}
