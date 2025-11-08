"use client"

import { Users, Briefcase, TrendingUp, Heart, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ImpactPage() {
  const stats = [
    {
      icon: Users,
      number: "15,000+",
      label: "Workers Employed",
      description: "Providing sustainable income to undereducated individuals",
    },
    {
      icon: TrendingUp,
      number: "₹2.5Cr+",
      label: "Total Earnings",
      description: "Distributed directly to workers annually",
    },
    {
      icon: Briefcase,
      number: "50+",
      label: "Cities Covered",
      description: "Expanding employment opportunities nationwide",
    },
    {
      icon: Heart,
      number: "100K+",
      label: "Families Supported",
      description: "Improving livelihoods across communities",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Mission Started",
      description:
        "Founded SWACHHCARE with vision to reduce unemployment by providing dignified work to undereducated people",
    },
    {
      year: "2021",
      title: "1,000 Workers",
      description: "Reached 1,000 workers across 5 cities, generating ₹50 lakhs in annual income",
    },
    {
      year: "2022",
      title: "Rapid Expansion",
      description: "Expanded to 25 cities with 5,000+ workers, providing skills training and career development",
    },
    {
      year: "2023",
      title: "10,000 Workers",
      description: "Milestone of 10,000+ workers employed with average monthly income of ₹15,000",
    },
    {
      year: "2024",
      title: "15,000+ Workers",
      description: "Serving 50+ cities with comprehensive benefits, insurance, and upskilling programs",
    },
    {
      year: "2025",
      title: "Pan-India Vision",
      description: "Building technology to empower workers and reduce unemployment nationally",
    },
  ]

  const benefits = [
    {
      title: "Income Stability",
      description: "Guaranteed minimum income with performance bonuses for dedicated workers",
    },
    {
      title: "Skills Development",
      description: "Free training programs in professional cleaning, customer service, and digital literacy",
    },
    {
      title: "Health & Insurance",
      description: "Comprehensive health insurance and accident coverage for all active workers",
    },
    {
      title: "Digital Access",
      description: "Easy-to-use app for booking management and real-time payment tracking",
    },
    {
      title: "Community Support",
      description: "Worker communities for networking, support, and career advancement",
    },
    {
      title: "Career Growth",
      description: "Clear pathways to team lead, supervisor, and management positions",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Reducing Unemployment, Creating Opportunity</h1>
          <p className="text-xl text-muted-foreground mb-8">
            SWACHHCARE empowers undereducated individuals by providing dignified, sustainable employment opportunities
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Join Our Movement
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Impact Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact Numbers</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="font-semibold mb-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-muted/50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4 leading-relaxed">
            SWACHHCARE believes that everyone deserves the opportunity to earn a dignified living. Our mission is to
            bridge the employment gap by creating meaningful work opportunities for undereducated individuals across
            India. We're not just a service platform—we're a social enterprise committed to reducing unemployment and
            empowering communities.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            By connecting skilled workers with customers who need services, we create a win-win ecosystem where workers
            gain financial stability, professional skills, and social recognition.
          </p>
        </div>

        {/* Worker Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Provide to Workers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition">
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  {idx < milestones.length - 1 && <div className="w-1 h-16 bg-border my-2" />}
                </div>
                <Card className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                    <span className="text-primary font-bold text-lg">{milestone.year}</span>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary/10 rounded-xl p-12 text-center">
          <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're looking for quality services or want to earn with us, join thousands who are already part of
            the SWACHHCARE community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Book Services
            </Button>
            <Button size="lg" variant="outline">
              Join as Worker
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
