"use client"

import { useState } from "react"
import { Check, Zap, Crown, Users, Sparkles, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const packages = [
  {
    id: 1,
    name: "Starter",
    icon: Users,
    price: "₹499",
    period: "/month",
    description: "Great for occasional cleaning",
    features: [
      "2 cleaning sessions per month",
      "Basic cleaning services",
      "Email support",
      "Worker ratings & reviews",
      "Basic scheduling",
    ],
    cta: "Get Started",
    popular: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Basic",
    icon: Users,
    price: "₹999",
    period: "/month",
    description: "Perfect for regular cleaning needs",
    features: [
      "4 cleaning sessions per month",
      "Standard cleaning services",
      "Email & chat support",
      "Worker ratings & reviews",
      "Basic scheduling",
      "Rollover up to 1 session",
    ],
    cta: "Subscribe",
    popular: false,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "Professional",
    icon: Zap,
    price: "₹1,999",
    period: "/month",
    description: "Most popular for home maintenance",
    features: [
      "12 cleaning sessions per month",
      "All basic features",
      "Priority scheduling",
      "24/7 phone & chat support",
      "Free rescheduling",
      "10% service discount",
      "Dedicated account manager",
      "Rollover up to 2 sessions",
    ],
    cta: "Subscribe Now",
    popular: true,
    color: "from-primary to-green-500",
  },
  {
    id: 4,
    name: "Premium",
    icon: Crown,
    price: "₹2,999",
    period: "/month",
    description: "Ultimate home care solution",
    features: [
      "20 cleaning sessions per month",
      "All professional features",
      "Priority support (15 min response)",
      "Free service if worker cancels",
      "Free monthly deep cleaning",
      "20% service discount",
      "Premium workers only",
      "Rollover unlimited sessions",
    ],
    cta: "Get Premium",
    popular: false,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 5,
    name: "Elite",
    icon: Crown,
    price: "₹4,999",
    period: "/month",
    description: "Unlimited premium services",
    features: [
      "Unlimited cleaning sessions",
      "All premium features",
      "VIP 24/7 support (5 min response)",
      "Free cancellation guarantee",
      "Free bi-weekly deep cleaning",
      "30% service discount",
      "Premium workers only",
      "Flexible billing & dedicated concierge",
    ],
    cta: "Get Elite",
    popular: false,
    color: "from-purple-500 to-pink-500",
  },
]

const comboPackages = [
  {
    id: 101,
    name: "Home Care Bundle",
    icon: Gift,
    price: "₹2,499",
    originalPrice: "₹3,200",
    savings: "22%",
    period: "/month",
    description: "Cleaning + Deep cleaning combo",
    services: [
      "8 regular cleaning sessions",
      "2 deep cleaning sessions",
      "Bathroom & kitchen sanitization",
      "Floor polishing (monthly)",
      "10% additional discount",
    ],
    cta: "Get Bundle",
    badge: "Save 22%",
    color: "from-teal-500 to-blue-500",
  },
  {
    id: 102,
    name: "Complete Care Bundle",
    icon: Sparkles,
    price: "₹3,999",
    originalPrice: "₹5,100",
    savings: "22%",
    period: "/month",
    description: "Premium cleaning + laundry + organizing",
    services: [
      "12 cleaning sessions",
      "4 laundry & ironing sessions",
      "2 home organization sessions",
      "Carpet & upholstery cleaning",
      "15% overall discount",
    ],
    cta: "Get Complete",
    badge: "Save 22%",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 103,
    name: "Luxury Concierge",
    icon: Crown,
    price: "₹5,999",
    originalPrice: "₹7,800",
    savings: "23%",
    period: "/month",
    description: "Ultimate all-in-one home management",
    services: [
      "16 premium cleaning sessions",
      "8 laundry & ironing sessions",
      "4 home organizing sessions",
      "2 pet care sessions",
      "Monthly deep cleaning + sanitization",
      "25% total discount + priority support",
    ],
    cta: "Get Luxury",
    badge: "Save 23%",
    color: "from-rose-500 to-pink-500",
  },
]

const comparisonFeatures = [
  "Booking Flexibility",
  "Service Cancellation",
  "Worker Selection",
  "Priority Support",
  "Discounts & Offers",
  "Monthly Sessions",
  "Quality Guarantee",
]

export default function PackagesPage() {
  const [selectedType, setSelectedType] = useState("individual")
  const [billingCycle, setBillingCycle] = useState("monthly")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-balance">Choose Your Perfect Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">Flexible packages designed for every cleaning need</p>

          {/* Package Type Toggle */}
          <div className="inline-flex gap-2 bg-muted p-1 rounded-lg mb-6">
            <button
              onClick={() => setSelectedType("individual")}
              className={`px-6 py-2 rounded transition font-medium ${
                selectedType === "individual" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-border"
              }`}
            >
              Individual Plans
            </button>
            <button
              onClick={() => setSelectedType("combo")}
              className={`px-6 py-2 rounded transition font-medium ${
                selectedType === "combo" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-border"
              }`}
            >
              Combo Bundles
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded transition font-medium ${
                billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-border"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded transition font-medium ${
                billingCycle === "annual" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-border"
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Individual Plans Section */}
        {selectedType === "individual" && (
          <>
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {packages.map((pkg) => {
                const Icon = pkg.icon
                const getPrice = () => {
                  if (billingCycle === "monthly") return pkg.price
                  const monthlyAmount = Number.parseInt(pkg.price.replace("₹", ""))
                  const yearlyAmount = Math.floor(monthlyAmount * 12 * 0.8)
                  return `₹${yearlyAmount}`
                }
                return (
                  <Card
                    key={pkg.id}
                    className={`p-6 relative transition hover:shadow-xl ${
                      pkg.popular ? "ring-2 ring-primary scale-105" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                    </div>

                    <p className="text-muted-foreground text-xs mb-3">{pkg.description}</p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold">{getPrice()}</span>
                      <span className="text-muted-foreground text-sm">{pkg.period}</span>
                    </div>

                    <Button
                      className={`w-full mb-4 text-sm ${
                        pkg.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-foreground hover:bg-border"
                      }`}
                    >
                      {pkg.cta}
                    </Button>

                    <div className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {/* Combo Bundles Section */}
        {selectedType === "combo" && (
          <>
            <div className="mb-8">
              <p className="text-center text-muted-foreground mb-8">
                Save up to 23% by bundling multiple services together
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {comboPackages.map((combo) => {
                const Icon = combo.icon
                const getPrice = () => {
                  if (billingCycle === "monthly") return combo.price
                  const monthlyAmount = Number.parseInt(combo.price.replace("₹", ""))
                  const yearlyAmount = Math.floor(monthlyAmount * 12 * 0.8)
                  return `₹${yearlyAmount}`
                }
                return (
                  <Card key={combo.id} className="p-8 relative transition hover:shadow-xl overflow-hidden">
                    <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold">
                      {combo.badge}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{combo.name}</h3>
                        <p className="text-xs text-muted-foreground">{combo.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{getPrice()}</span>
                        <span className="text-sm text-muted-foreground line-through">{combo.originalPrice}</span>
                        <span className="text-xs text-destructive font-bold">Save {combo.savings}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">{combo.period}</span>
                    </div>

                    <Button className="w-full mb-6 bg-primary text-primary-foreground hover:bg-primary/90">
                      {combo.cta}
                    </Button>

                    <div className="space-y-3 border-t pt-6">
                      <h4 className="font-bold text-sm">Includes:</h4>
                      {combo.services.map((service, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-bold">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="text-center py-4 px-4 font-bold text-sm">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium text-sm">{feature}</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="text-center py-4 px-4">
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">What if I need to cancel?</h4>
              <p className="text-sm text-muted-foreground">
                No long-term contracts. Cancel anytime with no cancellation fees.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Do unused sessions roll over?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, depending on your plan. Sessions roll over monthly with limits specified in each plan.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! First-time users get one free cleaning session with the Professional plan or higher.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">What's included in combo bundles?</h4>
              <p className="text-sm text-muted-foreground">
                Combo bundles combine multiple services at a discounted rate. See the details tab for specifics.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Can I combine individual plans?</h4>
              <p className="text-sm text-muted-foreground">
                Mix and match plans to create your perfect package with our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
