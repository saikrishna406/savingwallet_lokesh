"use client"

import * as React from "react"

export interface ToastProps {
    title?: string
    description?: string
    variant?: "default" | "destructive"
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function Toast({ title, description, variant = "default", open, onOpenChange }: ToastProps) {
    const [isVisible, setIsVisible] = React.useState(open)

    React.useEffect(() => {
        setIsVisible(open)
        if (open) {
            const timer = setTimeout(() => {
                setIsVisible(false)
                onOpenChange?.(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [open, onOpenChange])

    if (!isVisible) return null

    const variantStyles = variant === "destructive"
        ? "bg-red-600 text-white border-red-700"
        : "bg-white text-gray-900 border-gray-200"

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg ${variantStyles}`}
            role="alert"
        >
            {title && <div className="font-semibold mb-1">{title}</div>}
            {description && <div className="text-sm opacity-90">{description}</div>}
            <button
                onClick={() => {
                    setIsVisible(false)
                    onOpenChange?.(false)
                }}
                className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    )
}
