"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Zap, Home } from "lucide-react"

const services = [
  {
    icon: Home,
    title: "Home Cleaning",
    description: "Professional deep cleaning of your entire home with premium products",
    features: ["Daily cleaning", "Deep cleaning", "Monthly packages"],
  },
  {
    icon: Droplet,
    title: "Laundry Service",
    description: "Get your clothes professionally washed, dried, and ironed",
    features: ["Pick & drop", "Express service", "Stain removal"],
  },
  {
    icon: Zap,
    title: "Car Wash",
    description: "Exterior and interior car cleaning with advanced techniques",
    features: ["Exterior wash", "Interior vacuum", "Air freshening"],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of professional cleaning and service solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-secondary/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
