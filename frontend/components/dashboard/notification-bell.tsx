"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Nudge, NudgesService } from "@/services/nudges.service"
import { cn } from "@/lib/utils"

export function NotificationBell() {
    const [nudges, setNudges] = useState<Nudge[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [open, setOpen] = useState(false)

    const fetchNudges = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            if (!token) return
            const data = await NudgesService.getNudges(token)
            setNudges(data)
            setUnreadCount(data.filter(n => !n.read).length)
        } catch (err) {
            console.error("Failed to load notifications", err)
        }
    }

    useEffect(() => {
        fetchNudges()
        // Optional: Poll every 30s
        const interval = setInterval(fetchNudges, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkRead = async (id: string) => {
        try {
            const token = localStorage.getItem("auth_token")
            if (!token) return

            // Optimistic update
            setNudges(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))

            await NudgesService.markRead(token, id)
        } catch (err) {
            console.error("Failed to mark read", err)
            fetchNudges() // Revert on error
        }
    }

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            if (!token) return

            setNudges(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)

            await NudgesService.markAllRead(token)
        } catch (err) {
            console.error("Failed to mark all read", err)
            fetchNudges()
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'achievement': return 'bg-yellow-50 text-yellow-700 border-yellow-100'
            case 'milestone': return 'bg-orange-50 text-orange-700 border-orange-100'
            case 'suggestion': return 'bg-blue-50 text-blue-700 border-blue-100'
            default: return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:bg-gray-100">
                    <FontAwesomeIcon icon={faBell} className="text-gray-500 text-lg group-hover:text-gray-900 transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {nudges.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 p-4 text-center">
                            <FontAwesomeIcon icon={faCheckDouble} className="text-gray-300 text-2xl mb-2" />
                            <p className="text-sm">All caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {nudges.map((nudge) => (
                                <div
                                    key={nudge.id}
                                    className={cn(
                                        "p-4 transition-colors hover:bg-gray-50 cursor-pointer relative group",
                                        !nudge.read ? "bg-blue-50/30" : "bg-white"
                                    )}
                                    onClick={() => handleMarkRead(nudge.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn("mt-1 h-2 w-2 rounded-full flex-shrink-0", !nudge.read ? "bg-blue-500" : "bg-transparent")} />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1 border", getTypeColor(nudge.type))}>
                                                {nudge.type}
                                            </p>
                                            <p className={cn("text-sm", !nudge.read ? "text-gray-900 font-medium" : "text-gray-600")}>
                                                {nudge.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(nudge.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
