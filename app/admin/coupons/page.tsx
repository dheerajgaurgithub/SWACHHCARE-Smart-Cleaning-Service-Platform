"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tag, Plus, Edit, Trash2, Eye } from "lucide-react"

export default function AdminCouponsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const activeCoupons = [
    {
      id: 1,
      code: "WELCOME20",
      description: "20% off on first booking",
      discountType: "Percentage",
      discountValue: 20,
      minAmount: 500,
      maxUses: 1000,
      usedCount: 342,
      startDate: "Dec 1, 2024",
      endDate: "Dec 31, 2024",
      status: "Active",
    },
    {
      id: 2,
      code: "SAVE50",
      description: "₹50 flat discount",
      discountType: "Flat",
      discountValue: 50,
      minAmount: 0,
      maxUses: 5000,
      usedCount: 1250,
      startDate: "Dec 1, 2024",
      endDate: "Dec 31, 2024",
      status: "Active",
    },
    {
      id: 3,
      code: "REFER10",
      description: "10% referral discount",
      discountType: "Percentage",
      discountValue: 10,
      minAmount: 0,
      maxUses: "Unlimited",
      usedCount: 3450,
      startDate: "Nov 15, 2024",
      endDate: "Jan 31, 2025",
      status: "Active",
    },
  ]

  const expiredCoupons = [
    {
      id: 4,
      code: "DIWALI50",
      description: "₹50 off Diwali special",
      discountType: "Flat",
      discountValue: 50,
      endDate: "Nov 15, 2024",
      usedCount: 2100,
      status: "Expired",
    },
    {
      id: 5,
      code: "NEWUSER100",
      description: "₹100 bonus credit",
      discountType: "Flat",
      discountValue: 100,
      endDate: "Oct 31, 2024",
      usedCount: 890,
      status: "Expired",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Offers & Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Create Coupon Form */}
      {showCreateForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Coupon Code</label>
                <Input placeholder="e.g., SUMMER20" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Description</label>
                <Input placeholder="e.g., 20% off summer special" className="mt-1" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Discount Type</label>
                <select className="w-full mt-1 p-2 border rounded-lg bg-background">
                  <option>Percentage (%)</option>
                  <option>Flat (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Discount Value</label>
                <Input placeholder="e.g., 20" type="number" className="mt-1" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Minimum Order Amount</label>
                <Input placeholder="e.g., 500" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Max Uses</label>
                <Input placeholder="e.g., 1000" type="number" className="mt-1" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Valid From</label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Valid Till</label>
                <Input type="date" className="mt-1" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Create Coupon</Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activeCoupons.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredCoupons.length})</TabsTrigger>
        </TabsList>

        {/* Active Coupons */}
        <TabsContent value="active" className="space-y-4">
          {activeCoupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{coupon.code}</CardTitle>
                      <CardDescription>{coupon.description}</CardDescription>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-bold">
                      {coupon.discountType === "Flat" ? "₹" : ""}
                      {coupon.discountValue}
                      {coupon.discountType === "Percentage" ? "%" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min. Amount</p>
                    <p className="font-semibold">₹{coupon.minAmount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usage</p>
                    <p className="font-semibold">
                      {coupon.usedCount} / {coupon.maxUses === "Unlimited" ? "∞" : coupon.maxUses}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Validity</p>
                    <p className="font-semibold">{coupon.startDate}</p>
                    <p className="text-xs text-muted-foreground">to {coupon.endDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Expired Coupons */}
        <TabsContent value="expired" className="space-y-4">
          {expiredCoupons.map((coupon) => (
            <Card key={coupon.id} className="border-gray-300 opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Tag className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{coupon.code}</CardTitle>
                      <CardDescription>{coupon.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Expired</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground">
                  Expired on {coupon.endDate} • {coupon.usedCount} total uses
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
