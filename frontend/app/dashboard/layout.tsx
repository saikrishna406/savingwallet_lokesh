import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white">
                <span className="font-bold text-primary">CoinJar</span>
                <MobileSidebar />
            </div>

            {/* Desktop Sidebar - Fixed Position */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Content - With left margin for sidebar */}
            <div className="lg:ml-[260px] bg-gray-50 min-h-screen">
                <div className="px-8 py-6">
                    {children}
                </div>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    )
}
