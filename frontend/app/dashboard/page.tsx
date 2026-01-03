import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Plus } from "lucide-react"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <div className="flex items-center space-x-2">
                    <CreateGoalDialog />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">₹</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,450</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">2 on track</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">₹</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹450</div>
                        <p className="text-xs text-muted-foreground">Available to withdraw</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Streak</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">🔥</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Goals */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Active Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Goal Item Mock */}
                            {[
                                { title: "Trip to Goa", target: 20000, current: 8500, percent: 42, color: "bg-blue-500" },
                                { title: "New Laptop", target: 80000, current: 12000, percent: 15, color: "bg-purple-500" },
                                { title: "Emergency Fund", target: 50000, current: 45000, percent: 90, color: "bg-green-500" },
                            ].map((goal, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{goal.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            ₹{goal.current} / ₹{goal.target}
                                        </p>
                                    </div>
                                    <div className="w-[30%] flex items-center gap-2">
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className={`h-full ${goal.color}`} style={{ width: `${goal.percent}%` }} />
                                        </div>
                                        <span className="text-xs font-bold w-8">{goal.percent}%</span>
                                    </div>
                                    <div>
                                        <PaymentModal />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardContent className="px-0 pt-4">
                            <div className="space-y-4">
                                {[
                                    { desc: "Auto-save for Goa", amount: "+ ₹100", date: "Today, 10:00 AM" },
                                    { desc: "Round-up save", amount: "+ ₹12", date: "Today, 08:30 AM" },
                                    { desc: "Weekly Auto-save", amount: "+ ₹500", date: "Yesterday" },
                                    { desc: "Withdrawal", amount: "- ₹1000", date: "Oct 22" },
                                ].map((t, x) => (
                                    <div key={x} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium">{t.desc}</p>
                                            <p className="text-xs text-muted-foreground">{t.date}</p>
                                        </div>
                                        <div className={`text-sm font-bold ${t.amount.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
                                            {t.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
