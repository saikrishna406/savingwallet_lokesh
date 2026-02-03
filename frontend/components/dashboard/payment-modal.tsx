"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRupeeSign, faQrcode, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { motion } from "framer-motion"

import { GoalsService } from "@/services/goals.service"

interface PaymentModalProps {
    goalId?: string;
    onSuccess?: () => void;
}

export function PaymentModal({ goalId, onSuccess }: PaymentModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [step, setStep] = useState<"input" | "processing" | "success">("input")
    const [error, setError] = useState("")

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault()
        setStep("processing")
        setError("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error("Not authenticated")

            // 1. Create Order
            const { PaymentsService } = await import("@/services/payments.service") // Dynamic import to avoid cycles? No, just import top level usually.
            const order = await PaymentsService.createOrder(token, parseFloat(amount))

            // 2. Load Razorpay
            const isLoaded = await loadRazorpay()
            if (!isLoaded) throw new Error("Razorpay SDK failed to load")

            // 3. Open Options
            const options = {
                key: "rzp_test_S725ahmuTOc1mm", // Ideally from env, but user gave it directly
                amount: order.amount,
                currency: order.currency,
                name: "Saving Wallet",
                description: "Goal Contribution",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        await PaymentsService.verifyPayment(token, response)
                        setStep("success")
                        if (onSuccess) onSuccess()
                    } catch (verifyErr: any) {
                        console.error(verifyErr)
                        setError(verifyErr.message || "Payment verification failed")
                        setStep("input")
                    }
                },
                prefill: {
                    name: "User", // Can fetch from profile
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#111827"
                }
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.open()

            // Keep processing state until handler called
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Payment initialization failed")
            setStep("input")
        }
    }

    const handleDemoPay = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount")
            return
        }

        setStep("processing")
        setError("")

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error("Not authenticated")

            // Direct call to add savings without payment gateway
            if (goalId) {
                await GoalsService.addSavings(token, goalId, parseFloat(amount))
            } else {
                throw new Error("Goal ID is missing")
            }

            setStep("success")
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Demo payment failed")
            setStep("input")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                setTimeout(() => {
                    setStep("input")
                    setAmount("")
                    setError("")
                }, 300)
            }
        }}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 border-0 shadow-sm transition-all hover:scale-[1.02]">
                    <FontAwesomeIcon icon={faRupeeSign} className="mr-2 h-3.5 w-3.5" /> Save Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                {step === "input" && (
                    <form onSubmit={handlePay} className="flex flex-col h-full">
                        {/* Premium Header */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <DialogTitle className="text-xl font-bold relative z-10">Add Savings</DialogTitle>
                            <DialogDescription className="text-indigo-100 relative z-10 text-xs mt-1">
                                Secure UPI Transfer
                            </DialogDescription>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Large Input Display */}
                            <div className="relative">
                                <div className="flex items-center justify-center">
                                    <span className="text-4xl font-light text-gray-400 mr-2">₹</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        required
                                        autoFocus
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length < 8) setAmount(val);
                                        }}
                                        className="h-auto border-0 text-5xl font-bold text-gray-900 text-center p-0 focus-visible:ring-0 placeholder:text-gray-200 w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <div className="h-px w-full bg-gray-100 mt-2"></div>
                            </div>

                            {/* Quick Presets */}
                            <div className="flex justify-center gap-3">
                                {[100, 500, 1000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                                    >
                                        +₹{val}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            {/* Trust Badge */}
                            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                                <FontAwesomeIcon icon={faQrcode} />
                                <span>Secured by Razorpay</span>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-900"
                                onClick={handleDemoPay}
                            >
                                Demo
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!amount || parseFloat(amount) <= 0}
                            >
                                Pay ₹{amount || '0'}
                            </Button>
                        </div>
                    </form>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center py-12 px-6 space-y-6 text-center">
                        <div className="relative h-20 w-20">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
                            <p className="text-sm text-gray-500 mt-1">Please confirm the request in your UPI app</p>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-10 px-6 space-y-4 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-2"
                        >
                            <FontAwesomeIcon icon={faCheck} className="h-10 w-10 text-green-600" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                            <p className="text-gray-500 mt-2">₹{amount} has been added to your goal.</p>
                        </div>
                        <Button
                            onClick={() => setOpen(false)}
                            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
