"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Award, Users, Target, Zap, Heart, Globe } from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "Mr. Dheeraj Gaur",
      role: "CEO & Co-Founder",
      bio: "Visionary entrepreneur with 15+ years of experience in service industry. Pioneered digital transformation in cleaning services.",
      image: "👔",
    },
    {
      name: "Priya Sharma",
      role: "COO & Co-Founder",
      bio: "Operations expert with proven track record in scaling businesses. Led team expansion to 5000+ service professionals.",
      image: "💼",
    },
    {
      name: "Rajesh Kumar",
      role: "CTO",
      bio: "Tech innovator building the future of service platforms. 10+ years in software development and AI integration.",
      image: "💻",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer Care",
      description: "We prioritize customer satisfaction above all else, ensuring premium service quality.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Continuously innovating our platform with latest technology for better experience.",
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "Empowering service professionals with tools and opportunities for growth.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Committed to delivering excellence in every service and interaction.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Using eco-friendly products and practices for environmental responsibility.",
    },
    {
      icon: Award,
      title: "Trust",
      description: "Building trust through transparency, quality, and consistent performance.",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "SWACHHCARE launched with a vision to revolutionize cleaning services",
    },
    { year: "2021", title: "1000+ Workers", description: "Expanded network to 1000 trusted service professionals" },
    { year: "2022", title: "100k+ Customers", description: "Reached 100,000 satisfied customers across major cities" },
    { year: "2023", title: "Multi-City Expansion", description: "Expanded operations to 50+ cities across India" },
    { year: "2024", title: "1M+ Services", description: "Completed 1 million+ professional cleaning services" },
    {
      year: "2025",
      title: "Global Vision",
      description: "Planning international expansion with new service categories",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">About SWACHHCARE</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Transforming the cleaning and service industry through technology, professionalism, and trust. We believe
              every home and vehicle deserves premium care.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    To make professional cleaning and service solutions accessible, affordable, and reliable for every
                    household and business in India.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    We empower service professionals while ensuring customers receive consistent, high-quality care
                    backed by technology and trust.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    To become the most trusted and innovative service platform in Asia, recognized for transforming how
                    people access professional cleaning and maintenance services.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Building a future where every service interaction is seamless, affordable, and environmentally
                    responsible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Leadership Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the visionaries driving SWACHHCARE's mission and innovation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-6xl mb-4">{member.image}</div>
                    <CardTitle className="text-2xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold text-base">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every decision and action at SWACHHCARE
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Journey & Milestones */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From a bold vision to India's leading service platform
              </p>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-24 h-24 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lg">{milestone.year}</span>
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">1M+</div>
                <p className="text-lg text-muted-foreground">Services Completed</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">500k+</div>
                <p className="text-lg text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">10k+</div>
                <p className="text-lg text-muted-foreground">Service Professionals</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">50+</div>
                <p className="text-lg text-muted-foreground">Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you need professional cleaning services or want to join our network of service professionals,
              SWACHHCARE is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register?role=customer">Book a Service</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register?role=worker">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
