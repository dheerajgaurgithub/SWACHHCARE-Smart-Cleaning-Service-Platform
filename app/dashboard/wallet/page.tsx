"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, TrendingUp, Gift, Share2, Copy, CheckCircle2 } from "lucide-react"

export default function WalletPage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [addAmount, setAddAmount] = useState("")

  const walletData = {
    balance: 500,
    totalAdded: 2500,
    totalUsed: 2000,
    referralCredits: 200,
  }

  const referralCode = "RAJ2024SWACHHCARE"

  const transactions = [
    {
      id: 1,
      type: "credit",
      description: "Welcome Bonus",
      amount: 200,
      date: "Dec 1, 2024",
      expiryDate: "Mar 1, 2025",
    },
    {
      id: 2,
      type: "used",
      description: "Used in booking ORD123",
      amount: -150,
      date: "Dec 10, 2024",
    },
    {
      id: 3,
      type: "credit",
      description: "Referral bonus from friend",
      amount: 100,
      date: "Dec 12, 2024",
      expiryDate: "Jun 12, 2025",
    },
    {
      id: 4,
      type: "credit",
      description: "Birthday offer",
      amount: 250,
      date: "Dec 15, 2024",
      expiryDate: "Dec 31, 2024",
    },
    {
      id: 5,
      type: "used",
      description: "Applied coupon SAVE50",
      amount: -250,
      date: "Dec 18, 2024",
    },
  ]

  const referrals = [
    {
      id: 1,
      name: "Priya Singh",
      status: "Completed",
      reward: 200,
      joinedDate: "Dec 5, 2024",
    },
    {
      id: 2,
      name: "Amit Patel",
      status: "Pending",
      reward: 0,
      joinedDate: "Dec 18, 2024",
    },
  ]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Wallet & Credits</h1>
        <p className="text-muted-foreground">Manage your wallet balance and referral credits</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-2">Wallet Balance</p>
              <h2 className="text-5xl font-bold text-primary">₹{walletData.balance}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {walletData.referralCredits > 0 && `₹${walletData.referralCredits} from referrals`}
              </p>
            </div>
            <Wallet className="w-20 h-20 text-primary opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Added</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{walletData.totalAdded}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Used</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{walletData.totalUsed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Credits</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{walletData.referralCredits}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="referral">Referrals</TabsTrigger>
          <TabsTrigger value="addMoney">Add Money</TabsTrigger>
        </TabsList>

        {/* Transaction History */}
        <TabsContent value="transactions" className="space-y-4">
          {transactions.map((txn) => (
            <Card key={txn.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">{txn.date}</p>
                    {txn.expiryDate && <p className="text-xs text-yellow-600 mt-1">Expires: {txn.expiryDate}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {txn.type === "credit" ? "+" : ""}₹{Math.abs(txn.amount)}
                    </p>
                    <Badge variant={txn.type === "credit" ? "secondary" : "outline"}>
                      {txn.type === "credit" ? "Added" : "Used"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Referrals */}
        <TabsContent value="referral" className="space-y-6">
          {/* Referral Code */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Code
              </CardTitle>
              <CardDescription>Share this code with friends and earn ₹100 for each referral</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-white dark:bg-background p-3 rounded-lg border font-mono font-bold text-center">
                  {referralCode}
                </div>
                <Button onClick={handleCopyCode} variant="outline">
                  {copiedCode ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Button className="w-full bg-transparent" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on WhatsApp
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referral List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Track your successful referrals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{ref.name}</p>
                    <p className="text-sm text-muted-foreground">Joined {ref.joinedDate}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={ref.status === "Completed" ? "default" : "outline"}
                      className={ref.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {ref.status}
                    </Badge>
                    {ref.reward > 0 && <p className="font-bold text-green-600 mt-1">+₹{ref.reward}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold">Share your code</p>
                  <p className="text-sm text-muted-foreground">Share your referral code with friends</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold">They sign up</p>
                  <p className="text-sm text-muted-foreground">Your friend registers using your code</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold">They book a service</p>
                  <p className="text-sm text-muted-foreground">Your friend books their first service</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-semibold">You earn ₹100</p>
                  <p className="text-sm text-muted-foreground">Bonus is added to your wallet instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Money */}
        <TabsContent value="addMoney" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Money to Wallet</CardTitle>
              <CardDescription>Recharge your wallet for faster bookings and exclusive offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Add Options */}
              <div>
                <p className="font-semibold mb-3">Quick Add</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setAddAmount(amount.toString())}
                      className={addAmount === amount.toString() ? "ring-2 ring-primary" : ""}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-semibold mb-2">Custom Amount</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="pl-8"
                      min="50"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum: ₹50</p>
              </div>

              {/* Offer Banner */}
              <Alert className="bg-green-50 border-green-200">
                <Gift className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Add ₹500 or more and get 5% bonus!</AlertDescription>
              </Alert>

              {/* Payment Method */}
              <div>
                <p className="font-semibold mb-3">Payment Method</p>
                <div className="space-y-2">
                  {["Credit/Debit Card", "UPI", "Net Banking", "Google Pay"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <input type="radio" name="payment" defaultChecked={method === "UPI"} />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" disabled={!addAmount || Number.parseFloat(addAmount) < 50}>
                Add ₹{addAmount || "0"} to Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
