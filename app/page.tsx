import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import ServiceCard from "@/components/home/service-card"
import PricingCard from "@/components/home/pricing-card"

export default function Home() {
  const services = [
    {
      icon: "🏠",
      title: "Home Cleaning",
      description: "Professional deep cleaning for your living spaces",
      price: "From ₹599",
    },
    {
      icon: "🚗",
      title: "Car Washing",
      description: "Complete car care and detailing services",
      price: "From ₹299",
    },
    {
      icon: "👕",
      title: "Laundry Service",
      description: "Professional laundry with premium care",
      price: "From ₹49/kg",
    },
  ]

  const packages = [
    {
      name: "Basic",
      price: 999,
      services: ["Home Cleaning"],
      features: ["Monthly Service", "Professional Team", "Eco-friendly Products"],
      popular: false,
    },
    {
      name: "Silver",
      price: 1499,
      services: ["Cleaning", "Laundry"],
      features: ["Monthly Service", "Professional Team", "10% Discount", "Priority Support"],
      popular: true,
    },
    {
      name: "Gold",
      price: 1999,
      services: ["Cleaning", "Car Wash", "Laundry"],
      features: ["Monthly Service", "Professional Team", "15% Discount", "Priority Support"],
      popular: false,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Cleaning Services at Your Doorstep
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with verified professionals for home cleaning, car washing, and laundry services. Affordable,
                reliable, and eco-friendly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 smooth-transition flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 smooth-transition"
                >
                  Browse Services
                </Link>
              </div>
            </div>
            <div className="bg-gradient-primary rounded-2xl h-96 flex items-center justify-center text-white text-center">
              <div className="space-y-4">
                <div className="text-6xl">✨</div>
                <p className="text-2xl font-semibold">Professional Cleaning</p>
                <p className="text-emerald-100">Trusted by thousands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <PricingCard key={idx} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why Choose SwachhCare?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Verified Workers", desc: "All professionals verified and background checked" },
              { title: "Affordable Pricing", desc: "Competitive rates with transparent billing" },
              { title: "Eco-Friendly", desc: "Sustainable products and practices" },
              { title: "24/7 Support", desc: "Dedicated customer support team" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg smooth-transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Check className="text-emerald-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
