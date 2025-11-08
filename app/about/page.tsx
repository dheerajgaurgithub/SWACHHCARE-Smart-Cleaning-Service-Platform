import Link from "next/link"
import { CheckCircle, Users, Zap, Heart, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 smooth-transition">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 dark:from-emerald-950 to-blue-50 dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About SwachhCare</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            We're revolutionizing the cleaning and household services industry by connecting customers with verified,
            professional workers.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-emerald-600 dark:to-blue-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-white">
            {[
              { icon: Users, label: "Active Users", value: "50K+" },
              { icon: Award, label: "Services Completed", value: "100K+" },
              { icon: Heart, label: "Satisfaction Rate", value: "98%" },
              { icon: TrendingUp, label: "Partner Workers", value: "5K+" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Quality Service",
                desc: "Providing exceptional cleaning and household services with verified, professional workers.",
              },
              {
                icon: Users,
                title: "Fair Employment",
                desc: "Creating dignified employment opportunities for thousands of workers across the country.",
              },
              {
                icon: Zap,
                title: "Innovation",
                desc: "Leveraging technology to make services accessible, affordable, and efficient.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-emerald-500/20 smooth-transition"
              >
                <item.icon className="text-emerald-600 dark:text-emerald-400 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Why Choose SwachhCare?</h2>
          <div className="space-y-4">
            {[
              "Verified and background-checked professionals",
              "Transparent pricing with no hidden charges",
              "Eco-friendly cleaning products",
              "24/7 customer support",
              "Flexible scheduling and cancellation",
              "Secure payment options",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={24} />
                <span className="text-lg text-gray-900 dark:text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Clean Living?</h2>
          <p className="text-lg text-emerald-100 mb-8">Join thousands of satisfied customers</p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 smooth-transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
