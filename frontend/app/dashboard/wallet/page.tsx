"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faWallet,
    faArrowUp,
    faArrowDown,
    faCreditCard,
    faHistory,
    faMoneyBillWave,
    faExchangeAlt,
    faUniversity,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { WalletService } from "@/services/wallet.service"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function WalletPage() {
    const [wallet, setWallet] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('auth_token')

            if (!token) {
                setError('Please login to view wallet')
                return
            }

            const walletData = await WalletService.getWallet(token)
            setWallet(walletData)
            setError(null)
        } catch (err: any) {
            console.error('Failed to fetch wallet data:', err)
            setError(err.message || 'Failed to load wallet data')
        } finally {
            setIsLoading(false)
        }
    }

    const balance = wallet?.balance || 0
    const transactions = wallet?.transactions || []

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-600">Loading wallet...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchWalletData}>Retry</Button>
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
            <motion.div variants={item} className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your funds and transactions</p>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Wallet Card */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-gray-900 text-white border-0 overflow-hidden relative shadow-lg">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                        <CardContent className="p-8 relative">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                                    <h2 className="text-4xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <FontAwesomeIcon icon={faWallet} className="text-white/80" />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button className="bg-white text-black hover:bg-gray-100 border-0">
                                    <FontAwesomeIcon icon={faArrowUp} className="mr-2 h-4 w-4" />
                                    Add Money
                                </Button>
                                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                                    <FontAwesomeIcon icon={faArrowDown} className="mr-2 h-4 w-4" />
                                    Withdraw
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Recent Transactions Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                        <Button variant="link" size="sm" className="text-gray-500 hover:text-gray-900">View All</Button>
                    </div>

                    <Card className="border border-gray-100 bg-white">
                        <CardContent className="p-0">
                            {transactions.length === 0 ? (
                                <div className="p-8 text-center">
                                    <FontAwesomeIcon icon={faHistory} className="text-4xl text-gray-300 mb-3" />
                                    <p className="text-gray-600">No transactions yet</p>
                                    <p className="text-sm text-gray-500 mt-1">Your transaction history will appear here</p>
                                </div>
                            ) : (
                                transactions.map((tx: any, i: number) => (
                                    <div key={tx.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${i !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' || tx.type === 'credit' ? 'bg-green-50 text-green-600' :
                                                tx.type === 'withdrawal' || tx.type === 'debit' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                <FontAwesomeIcon icon={
                                                    tx.type === 'deposit' || tx.type === 'credit' ? faArrowDown :
                                                        tx.type === 'withdrawal' || tx.type === 'debit' ? faArrowUp :
                                                            faExchangeAlt
                                                } className="h-3 w-3" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{tx.description || tx.type}</p>
                                                <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${tx.type === 'deposit' || tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {tx.type === 'deposit' || tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </motion.div>
    )
}
