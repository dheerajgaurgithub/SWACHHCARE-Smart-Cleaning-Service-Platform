"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const packages = [
  {
    name: "Basic",
    price: "₹499",
    description: "Perfect for one-time cleaning",
    features: ["2-hour session", "Basic cleaning supplies", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹999",
    description: "Most popular choice",
    features: ["4-hour session", "Premium cleaning supplies", "24/7 priority support", "Monthly discount (10%)"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "₹1,999",
    description: "Complete care solution",
    features: ["8-hour session", "Eco-friendly products", "Dedicated manager", "Free add-ons", "20% monthly discount"],
    highlighted: false,
  },
]

export default function Packages() {
  return (
    <section id="packages" className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Affordable Packages</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`transition-transform hover:scale-105 ${
                pkg.highlighted ? "border-primary shadow-lg md:scale-105" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={pkg.highlighted ? "default" : "outline"} asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
