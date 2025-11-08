import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  icon: string
  title: string
  description: string
  price: string
}

export default function ServiceCard({ icon, title, description, price }: ServiceCardProps) {
  return (
    <div className="group p-8 bg-white border border-gray-200 rounded-xl hover:shadow-xl smooth-transition cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-emerald-600">{price}</span>
        <ArrowRight size={20} className="text-gray-400 group-hover:text-emerald-600 smooth-transition" />
      </div>
    </div>
  )
}
