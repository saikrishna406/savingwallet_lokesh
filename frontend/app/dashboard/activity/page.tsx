import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Star } from "lucide-react"

export default function ActivityPage() {
    const activities = [
        { title: "Streak Master!", desc: "You hit a 7-day savings streak.", time: "2 hours ago", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100" },
        { title: "Savings Goal Reached", desc: "You reached 40% of 'Trip to Goa'.", time: "Yesterday", icon: Activity, color: "text-blue-500", bg: "bg-blue-100" },
        { title: "Nudge: Weekend Saving", desc: "Tip: Save ₹50 this weekend to stay on track.", time: "2 days ago", icon: Activity, color: "text-purple-500", bg: "bg-purple-100" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Activity & Insights</h2>
                <p className="text-muted-foreground">Your financial journey log and nudges.</p>
            </div>

            <div className="grid gap-6">
                {activities.map((item, i) => (
                    <Card key={i}>
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className={`p-3 rounded-full ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                <p className="text-xs text-muted-foreground pt-2">{item.time}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
