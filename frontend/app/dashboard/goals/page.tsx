import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { Target, Clock, AlertCircle } from "lucide-react"

export default function GoalsPage() {
    const goals = [
        { title: "Trip to Goa", target: 20000, current: 8500, percent: 42, color: "bg-blue-500", status: "On Track", daysLeft: 45 },
        { title: "New Laptop", target: 80000, current: 12000, percent: 15, color: "bg-purple-500", status: "Behind", daysLeft: 120 },
        { title: "Emergency Fund", target: 50000, current: 45000, percent: 90, color: "bg-green-500", status: "Almost There", daysLeft: 10 },
        { title: "Bike Downpayment", target: 30000, current: 5000, percent: 16, color: "bg-orange-500", status: "At Risk", daysLeft: 20 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Goals</h2>
                    <p className="text-muted-foreground">Manage your savings targets and track progress.</p>
                </div>
                <CreateGoalDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal, i) => (
                    <Card key={i} className="flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg bg-opacity-10 ${goal.color.replace('bg-', 'bg-').replace('500', '100')}`}>
                                    <Target className={`h-6 w-6 ${goal.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${goal.status === 'On Track' || goal.status === 'Almost There' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {goal.status}
                                </span>
                            </div>
                            <CardTitle className="pt-4 text-xl">{goal.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-bold">{goal.percent}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full ${goal.color}`} style={{ width: `${goal.percent}%` }} />
                                </div>

                                <div className="flex justify-between items-center text-sm pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Current</span>
                                        <span className="font-bold text-lg">₹{goal.current}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs text-muted-foreground">Target</span>
                                        <span className="font-bold text-lg text-muted-foreground">₹{goal.target}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                                    <Clock className="h-3 w-3" />
                                    {goal.daysLeft} days remaining
                                </div>

                                <div className="pt-2">
                                    <PaymentModal />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Placeholder */}
                <Card className="flex flex-col items-center justify-center border-dashed text-center min-h-[350px]">
                    <div className="p-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                            <PlusIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Create New Goal</h3>
                        <p className="text-sm text-muted-foreground mb-6">Start saving for something new properly.</p>
                        <CreateGoalDialog />
                    </div>
                </Card>
            </div>
        </div>
    )
}

function PlusIcon(props: any) {
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
