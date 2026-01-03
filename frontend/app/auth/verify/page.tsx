"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifyPage() {
    const router = useRouter()
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [phone, setPhone] = useState("")

    useEffect(() => {
        const storedPhone = localStorage.getItem("demo_phone")
        if (storedPhone) {
            setPhone(storedPhone)
        } else {
            router.push("/auth/login")
        }
    }, [router])

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Verify OTP</CardTitle>
                    <CardDescription>
                        We've sent a code to <span className="font-medium text-foreground">+91 {phone}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="0 0 0 0 0 0"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                className="text-center text-2xl tracking-[1em] font-mono h-14"
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading || otp.length < 6}>
                            {isLoading ? "Verifying..." : "Verify & Continue"}
                        </Button>
                        <div className="text-center">
                            <button type="button" className="text-sm text-primary hover:underline">
                                Resend OTP
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
