"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react"

export default function AdminPayoutsPage() {
  const [approvingPayoutId, setApprovingPayoutId] = useState<string | null>(null)

  const pendingPayouts = [
    {
      id: "P001",
      worker: "Raj Kumar",
      workerId: "W001",
      amount: 3000,
      requestedDate: "Today, 2:30 PM",
      method: "Bank Transfer",
      accountLast4: "5678",
      earningsBreakdown: {
        totalEarnings: 3500,
        commission: 500,
        netAmount: 3000,
      },
    },
    {
      id: "P002",
      worker: "Priya Singh",
      workerId: "W002",
      amount: 2500,
      requestedDate: "Today, 1:15 PM",
      method: "UPI",
      accountLast4: "9876",
      earningsBreakdown: {
        totalEarnings: 2900,
        commission: 400,
        netAmount: 2500,
      },
    },
  ]

  const approvedPayouts = [
    {
      id: "P003",
      worker: "Amit Patel",
      amount: 4500,
      approvedDate: "Yesterday, 10:30 AM",
      approvedBy: "Admin User",
      status: "Transferred",
    },
    {
      id: "P004",
      worker: "Kavita Sharma",
      amount: 3800,
      approvedDate: "Dec 15, 3:00 PM",
      approvedBy: "Admin User",
      status: "Transferred",
    },
  ]

  const rejectedPayouts = [
    {
      id: "P005",
      worker: "Vikram Kumar",
      amount: 5000,
      rejectedDate: "Dec 14",
      reason: "Insufficient earnings verified. Discrepancy in transaction records.",
      status: "Rejected",
    },
  ]

  const handleApprovePayout = (payoutId: string) => {
    setApprovingPayoutId(payoutId)
    setTimeout(() => {
      alert("Payout approved successfully! Transfer initiated.")
      setApprovingPayoutId(null)
    }, 1500)
  }

  const handleRejectPayout = (payoutId: string) => {
    if (confirm("Are you sure you want to reject this payout request?")) {
      alert("Payout rejected. Worker will be notified with reason.")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Salary & Payouts</h1>
        <p className="text-muted-foreground">Review and approve worker payout requests</p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{pendingPayouts.length} requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,500</div>
            <p className="text-xs text-muted-foreground">3 transfers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Disbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹156,800</div>
            <p className="text-xs text-muted-foreground">December</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending ({pendingPayouts.length})
            {pendingPayouts.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedPayouts.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedPayouts.length})</TabsTrigger>
        </TabsList>

        {/* Pending Payouts - Require Approval */}
        <TabsContent value="pending" className="space-y-4">
          {pendingPayouts.map((payout) => (
            <Card key={payout.id} className="border-yellow-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{payout.worker}</CardTitle>
                    <CardDescription>
                      {payout.id} • Requested {payout.requestedDate}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Earnings Breakdown */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-semibold mb-3">Earnings Breakdown</p>
                  <div className="flex justify-between text-sm">
                    <span>Total Earnings</span>
                    <span>₹{payout.earningsBreakdown.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Commission (10%)</span>
                    <span>-₹{payout.earningsBreakdown.commission.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Net Amount</span>
                    <span className="text-primary">₹{payout.earningsBreakdown.netAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payout Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p className="font-semibold">{payout.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account</p>
                    <p className="font-semibold">**** {payout.accountLast4}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleRejectPayout(payout.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleApprovePayout(payout.id)}
                    disabled={approvingPayoutId === payout.id}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {approvingPayoutId === payout.id ? "Approving..." : "Approve & Transfer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Approved Payouts */}
        <TabsContent value="approved" className="space-y-4">
          {approvedPayouts.map((payout) => (
            <Card key={payout.id} className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{payout.worker}</p>
                    <p className="text-sm text-muted-foreground">
                      Approved {payout.approvedDate} by {payout.approvedBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{payout.amount.toLocaleString()}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                      {payout.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Rejected Payouts */}
        <TabsContent value="rejected" className="space-y-4">
          {rejectedPayouts.map((payout) => (
            <Card key={payout.id} className="border-red-200 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{payout.worker}</p>
                    <p className="text-sm text-muted-foreground">Rejected {payout.rejectedDate}</p>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
                <Alert className="bg-red-100 border-red-300">
                  <AlertDescription className="text-red-800">
                    <strong>Reason:</strong> {payout.reason}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
