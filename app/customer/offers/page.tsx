"use client"

import { useState } from "react"
import { Gift, Percent, Calendar, Copy, CheckCircle } from "lucide-react"

interface Offer {
  id: string
  title: string
  description: string
  discount: number
  code: string
  validity: string
  type: "coupon" | "combo" | "referral"
}

export default function OffersPage() {
  const [offers] = useState<Offer[]>([
    {
      id: "1",
      title: "Welcome Bonus",
      description: "Get 20% off on your first booking",
      discount: 20,
      code: "WELCOME20",
      validity: "2024-12-31",
      type: "coupon",
    },
    {
      id: "2",
      title: "Silver Package",
      description: "Cleaning + Laundry combo with 10% discount",
      discount: 10,
      code: "SILVER10",
      validity: "2024-12-31",
      type: "combo",
    },
    {
      id: "3",
      title: "Referral Reward",
      description: "Invite a friend and earn ₹100 credits",
      discount: 0,
      code: "REFER100",
      validity: "2024-12-31",
      type: "referral",
    },
  ])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Special Offers & Coupons</h1>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8">
        {["all", "coupon", "combo", "referral"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg font-medium smooth-transition capitalize ${
              type === "all" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md smooth-transition"
          >
            <div
              className={`p-6 text-white ${
                offer.type === "coupon" ? "bg-blue-600" : offer.type === "combo" ? "bg-purple-600" : "bg-emerald-600"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  {offer.type === "coupon" && <Gift size={32} />}
                  {offer.type === "combo" && <Percent size={32} />}
                  {offer.type === "referral" && <Gift size={32} />}
                </div>
                <span className="text-3xl font-bold">{offer.discount > 0 ? `${offer.discount}%` : "FREE"}</span>
              </div>
              <h3 className="text-lg font-bold">{offer.title}</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Promo Code</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-gray-900 font-mono font-semibold text-sm">
                    {offer.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="p-2 hover:bg-gray-100 rounded smooth-transition"
                  >
                    {copiedCode === offer.code ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
                <Calendar size={16} />
                <span>Valid until {new Date(offer.validity).toLocaleDateString()}</span>
              </div>

              <button className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
                Use Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
