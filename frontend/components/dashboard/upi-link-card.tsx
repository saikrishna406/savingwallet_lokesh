"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons'
import { UpiService } from "@/services/upi.service"
import { useToast } from "@/hooks/use-toast"

export default function UpiLinkCard() {
    const [upiId, setUpiId] = useState("")
    const [linkedUpiId, setLinkedUpiId] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isValidFormat, setIsValidFormat] = useState(true)
    const { toast } = useToast()

    // Load existing UPI ID on mount
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) return

            const profile = await UpiService.getProfile(token)
            if (profile.upi_id) {
                setLinkedUpiId(profile.upi_id)
                setUpiId(profile.upi_id)
            }
        } catch (error) {
            console.error('Failed to load profile:', error)
        }
    }

    const handleUpiChange = (value: string) => {
        setUpiId(value)
        // Validate format in real-time
        if (value.trim()) {
            setIsValidFormat(UpiService.validateUpiFormat(value))
        } else {
            setIsValidFormat(true) // Don't show error for empty input
        }
    }

    const handleLinkUpi = async () => {
        if (!upiId.trim()) {
            toast({
                title: "Error",
                description: "Please enter a UPI ID",
                variant: "destructive"
            })
            return
        }

        if (!isValidFormat) {
            toast({
                title: "Invalid Format",
                description: "Please enter a valid UPI ID (e.g., username@paytm)",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to continue",
                    variant: "destructive"
                })
                return
            }

            await UpiService.linkUpiId(token, upiId)
            setLinkedUpiId(upiId)
            setIsEditing(false)

            toast({
                title: "Success!",
                description: "UPI ID linked successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to link UPI ID",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setUpiId(linkedUpiId || "")
        setIsValidFormat(true)
    }

    return (
        <Card className="border border-gray-100 bg-white shadow-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-black">
                        <FontAwesomeIcon icon={faCreditCard} className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-black">Payment Methods</CardTitle>
                        <CardDescription>Link your UPI ID for seamless transactions</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {linkedUpiId && !isEditing ? (
                    // Display linked UPI
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">UPI ID Linked</p>
                                <p className="text-sm text-green-700">{linkedUpiId}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </div>
                    </div>
                ) : (
                    // UPI input form
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="upi" className="text-black">
                                UPI ID
                            </Label>
                            <Input
                                id="upi"
                                placeholder="9876543210@paytm or user@ybl"
                                value={upiId}
                                onChange={(e) => handleUpiChange(e.target.value)}
                                className={`bg-gray-50 border-gray-200 text-black ${!isValidFormat ? 'border-red-500 focus-visible:ring-red-500' : ''
                                    }`}
                            />
                            {!isValidFormat && (
                                <p className="text-xs text-red-500">
                                    Invalid UPI format. Use: username@provider (e.g., 9876543210@paytm, user@ybl, john.doe@okaxis)
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                Accepts phone numbers, usernames, or email-like formats
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleLinkUpi}
                                disabled={isLoading || !isValidFormat || !upiId.trim()}
                                className="bg-gray-900 text-white hover:bg-gray-800"
                            >
                                {isLoading ? "Linking..." : linkedUpiId ? "Update UPI" : "Link UPI"}
                            </Button>
                            {isEditing && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="border-gray-200 text-black hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
