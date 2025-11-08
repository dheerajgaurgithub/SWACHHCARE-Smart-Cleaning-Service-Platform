import Link from "next/link"
import { CheckCircle } from "lucide-react"

const services = [
  {
    id: "cleaning",
    name: "Home Cleaning",
    icon: "🏠",
    description: "Professional home cleaning services",
    price: "From ₹599",
    features: ["Deep cleaning", "Weekly/Monthly plans", "Eco-friendly products", "Trained professionals"],
  },
  {
    id: "carwash",
    name: "Car Washing",
    icon: "🚗",
    description: "Complete car care and detailing",
    price: "From ₹299",
    features: ["Interior & exterior", "Engine cleaning", "Polishing", "Quick service"],
  },
  {
    id: "laundry",
    name: "Laundry Service",
    icon: "👕",
    description: "Professional laundry with premium care",
    price: "From ₹49/kg",
    features: ["Washing & ironing", "Delicate care", "Fast delivery", "Stain removal"],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600">Professional cleaning and household services at your convenience</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg smooth-transition"
              >
                <div className="p-8 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-emerald-600 text-lg font-bold">{service.price}</p>
                </div>

                <div className="p-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Features:</h3>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/signup"
                    className="block w-full text-center py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 smooth-transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Book Service", desc: "Select service, date & time" },
              { step: "2", title: "Confirm Booking", desc: "Review and pay securely" },
              { step: "3", title: "Get Matched", desc: "Get assigned verified worker" },
              { step: "4", title: "Service Complete", desc: "Rate and review service" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
