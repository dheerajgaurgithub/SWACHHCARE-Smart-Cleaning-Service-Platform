"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([0])

  const faqCategories = [
    {
      category: "General",
      questions: [
        {
          q: "What is SWACHHCARE?",
          a: "SWACHHCARE is a technology-enabled platform that connects customers with professional cleaning and service providers. We offer home cleaning, laundry, and car wash services.",
        },
        {
          q: "How does SWACHHCARE work?",
          a: "Users can book services through our app or website, select their preferred date and time, and a verified professional will arrive to provide the service.",
        },
        {
          q: "Is SWACHHCARE available in my city?",
          a: "We currently operate in 50+ major cities across India. Check our service availability by entering your location on our website.",
        },
      ],
    },
    {
      category: "Booking & Payments",
      questions: [
        {
          q: "How do I book a service?",
          a: "Sign up with your email, select your service type, choose your preferred date and time, select a package, and proceed to payment.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards, digital wallets (Paytm, Google Pay, PhonePe), and bank transfers.",
        },
        {
          q: "Can I reschedule my booking?",
          a: "Yes, you can reschedule up to 24 hours before your scheduled service at no extra charge.",
        },
        {
          q: "What's your cancellation policy?",
          a: "Cancellations up to 2 hours before service get full refunds. Cancellations between 2 hours and 24 hours incur a 20% fee.",
        },
      ],
    },
    {
      category: "Our Services",
      questions: [
        {
          q: "What cleaning products do you use?",
          a: "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets.",
        },
        {
          q: "Do you offer discounts for regular bookings?",
          a: "Yes! Monthly subscribers get 10-20% discounts depending on their package. Contact support for subscription details.",
        },
        {
          q: "Can I request a specific worker?",
          a: "Yes, if you've had a good experience with a worker, you can request them for future bookings.",
        },
        {
          q: "Are your workers insured?",
          a: "All our workers are covered under our professional liability insurance for complete peace of mind.",
        },
      ],
    },
    {
      category: "Quality & Safety",
      questions: [
        {
          q: "How are your workers verified?",
          a: "All workers undergo rigorous background checks, identity verification, and extensive training before joining SWACHHCARE.",
        },
        {
          q: "What if I'm not satisfied with the service?",
          a: "We guarantee 100% satisfaction. If you're unsatisfied, contact us within 24 hours for a re-service or full refund.",
        },
        {
          q: "Is my home safe with SWACHHCARE workers?",
          a: "Absolutely. We conduct thorough background checks, workers are tracked via GPS, and customers can rate their experience.",
        },
        {
          q: "How can I provide feedback?",
          a: "You can rate and review your experience immediately after service completion in the app. Your feedback helps us improve.",
        },
      ],
    },
    {
      category: "For Workers",
      questions: [
        {
          q: "How do I join SWACHHCARE as a service professional?",
          a: "Apply through our website, complete verification, attend training, and start earning. The process takes 3-5 days.",
        },
        {
          q: "How much can I earn?",
          a: "Earnings depend on service type and location. Most workers earn ₹30,000-₹60,000 monthly. Top performers earn more.",
        },
        {
          q: "How do I get paid?",
          a: "Payments are processed weekly to your registered bank account. You can track earnings in real-time.",
        },
        {
          q: "What benefits do workers get?",
          a: "We provide insurance coverage, training programs, performance incentives, and a supportive community.",
        },
      ],
    },
  ]

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Find answers to common questions about SWACHHCARE services, booking, payments, and more.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {faqCategories.map((category, catIdx) => (
                <div key={catIdx}>
                  <h2 className="text-3xl font-bold mb-6">{category.category}</h2>
                  <div className="space-y-3">
                    {category.questions.map((item, qIdx) => {
                      const uniqueIdx = catIdx * 100 + qIdx
                      const isOpen = openItems.includes(uniqueIdx)

                      return (
                        <Card key={qIdx} className={`cursor-pointer hover:shadow-md transition-shadow`}>
                          <div onClick={() => toggleItem(uniqueIdx)} className="p-6 flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-left">{item.q}</h3>
                            <ChevronDown
                              size={20}
                              className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                          {isOpen && (
                            <CardContent className="pb-6 pt-0">
                              <p className="text-muted-foreground text-base">{item.a}</p>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Didn't find your answer?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our support team is here to help. Get in touch with us today.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
