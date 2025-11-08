"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/50 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Professional Cleaning Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground text-balance">
              Your Home. <span className="text-primary">Clean & Fresh</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Professional cleaning, laundry, and car wash services. Trusted by thousands of happy customers. Book now
              and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/register" className="flex items-center gap-2">
                  Book Service <ArrowRight size={20} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl" />
            <div className="text-center relative z-10">
              <div className="text-6xl mb-4">🧹</div>
              <p className="text-foreground font-semibold">Fresh & Clean</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
