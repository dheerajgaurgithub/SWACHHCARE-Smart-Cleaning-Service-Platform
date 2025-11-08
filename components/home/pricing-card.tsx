import Link from "next/link"
import { Check } from "lucide-react"

interface PricingCardProps {
  name: string
  price: number
  services: string[]
  features: string[]
  popular: boolean
}

export default function PricingCard({ name, price, services, features, popular }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl p-8 smooth-transition ${
        popular
          ? "bg-gradient-primary text-white shadow-2xl scale-105"
          : "bg-white border border-gray-200 hover:shadow-lg"
      }`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-emerald-600 px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="text-4xl font-bold mb-6">
        ₹{price}
        <span className={`text-sm font-normal ${popular ? "text-emerald-100" : "text-gray-600"}`}>/month</span>
      </div>

      <div className="mb-6 pb-6 border-b" style={{ borderColor: popular ? "rgba(255,255,255,0.2)" : undefined }}>
        <p className={popular ? "text-emerald-100" : "text-gray-600"}>{services.join(" + ")}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <Check size={20} className={popular ? "text-white" : "text-emerald-600"} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/auth/signup"
        className={`block text-center py-3 rounded-lg font-semibold smooth-transition ${
          popular ? "bg-white text-emerald-600 hover:bg-gray-100" : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}
