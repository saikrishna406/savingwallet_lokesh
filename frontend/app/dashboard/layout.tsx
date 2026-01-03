import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <span className="font-bold text-primary">CoinJar</span>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
                <Sidebar className="fixed w-64" />
            </div>

            {/* Content */}
            <div className="flex-1 lg:pl-64">
                {/* We add padding equal to sidebar width because sidebar is fixed */}
                <div className="h-full px-4 py-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
