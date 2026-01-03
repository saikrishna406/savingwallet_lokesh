"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, Home, LogOut, PiggyBank, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
        icon: React.ComponentType<{ className?: string }>
    }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                        "justify-start",
                        pathname === item.href && "bg-muted hover:bg-muted"
                    )}
                    asChild
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                </Button>
            ))}
        </nav>
    )
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const sidebarItems = [
        { href: "/dashboard", title: "Overview", icon: Home },
        { href: "/dashboard/goals", title: "My Goals", icon: TargetIcon },
        { href: "/dashboard/wallet", title: "Wallet", icon: Wallet },
        { href: "/dashboard/activity", title: "Activity", icon: BarChart3 },
        { href: "/dashboard/settings", title: "Settings", icon: Settings },
    ]

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-4 mb-8">
                        <PiggyBank className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-primary">CoinJar</span>
                    </div>
                    <div className="space-y-1">
                        <SidebarNav items={sidebarItems} />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 w-full px-6">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

// Temporary Icon fix
function TargetIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}
