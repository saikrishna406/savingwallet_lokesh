import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PaymentModal } from "@/components/dashboard/payment-modal"
import { Wallet, ArrowDownLeft, ArrowUpRight, History } from "lucide-react"

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
                <p className="text-muted-foreground">Manage your virtual wallet and payment methods.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Wallet Card */}
                <Card className="bg-primary text-primary-foreground border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-6 w-6" />
                            Virtual Balance
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/80">
                            Funds available to allocate or withdraw
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold mb-6">₹450.00</div>
                        <div className="flex gap-4">
                            <div className="bg-background/20 rounded-lg p-2 flex-1 text-center backdrop-blur-sm cursor-pointer hover:bg-background/30 transition">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="bg-green-400/20 p-1 rounded-full">
                                        <ArrowDownLeft className="h-4 w-4 text-green-300" />
                                    </div>
                                    <span className="font-medium text-sm">Add Money</span>
                                </div>
                            </div>
                            <div className="bg-background/20 rounded-lg p-2 flex-1 text-center backdrop-blur-sm cursor-pointer hover:bg-background/30 transition">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="bg-red-400/20 p-1 rounded-full">
                                        <ArrowUpRight className="h-4 w-4 text-red-200" />
                                    </div>
                                    <span className="font-medium text-sm">Withdraw</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Linked Accounts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Linked UPI IDs</CardTitle>
                        <CardDescription>Accounts linked for auto-pay and seamless transfers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                    <span className="font-bold text-xs">GPay</span>
                                </div>
                                <div>
                                    <p className="font-medium">9876543210@oki...</p>
                                    <p className="text-xs text-muted-foreground">Primary • Verified</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Remove</Button>
                        </div>
                        <Button variant="dashed" className="w-full border-dashed" size="lg">
                            + Link New UPI ID
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        <CardTitle>Transaction History</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-0">
                        {[
                            { id: "TX123", desc: "Added to Wallet", date: "Today, 10:30 AM", amount: "+ ₹500.00", status: "Success" },
                            { id: "TX122", desc: "Goal Deposit (Goa)", date: "Yesterday", amount: "- ₹100.00", status: "Success" },
                            { id: "TX121", desc: "Withdrawal to Bank", date: "22 Oct, 2024", amount: "- ₹1000.00", status: "Processing" },
                            { id: "TX120", desc: "Auto-Pay Failed", date: "20 Oct, 2024", amount: "₹50.00", status: "Failed" },
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 hover:bg-muted/50 px-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.status === 'Success' ? 'bg-green-100 text-green-600' :
                                            tx.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {tx.amount.startsWith('+') ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{tx.desc}</p>
                                        <p className="text-xs text-muted-foreground">{tx.date} • {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600' :
                                            tx.status === 'Failed' ? 'text-muted-foreground line-through' : 'text-foreground'
                                        }`}>{tx.amount}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
