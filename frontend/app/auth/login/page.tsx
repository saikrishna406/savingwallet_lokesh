"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            // Store phone in local storage for demo
            localStorage.setItem("demo_phone", phone)
            router.push("/auth/verify")
        }, 1000)
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
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your phone number to sign in or create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="tel"
                                placeholder="Enter 10-digit number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                pattern="[0-9]{10}"
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading || phone.length < 10}>
                            {isLoading ? "Sending OTP..." : "Get OTP"}
                        </Button>
                        <div className="text-center text-xs text-muted-foreground">
                            By continuing, you agree to our Terms and Privacy Policy.
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
