"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

const serviceTypes = [
  { id: "cleaning", name: "Home Cleaning", price: 599, icon: "🏠" },
  { id: "carwash", name: "Car Washing", price: 299, icon: "🚗" },
  { id: "laundry", name: "Laundry Service", price: 499, icon: "👕" },
]

export default function BookServicePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    serviceType: "",
    date: "",
    time: "",
    address: "",
    description: "",
  })
  const [selectedService, setSelectedService] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectService = (service: any) => {
    setSelectedService(service)
    setFormData({ ...formData, serviceType: service.id })
    setStep(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customerId: userId,
          price: selectedService.price,
          status: "pending",
        }),
      })

      if (res.ok) {
        router.push("/customer/bookings")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex-1 h-2 rounded-full mx-1 ${num <= step ? "bg-emerald-600" : "bg-gray-300"}`}
            ></div>
          ))}
        </div>
        <p className="text-center text-gray-600">Step {step} of 3</p>
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 smooth-transition text-left"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <p className="text-emerald-600 font-bold text-lg mt-2">₹{service.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Schedule & Details */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Schedule Your Service</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <div className="relative">
                <Clock size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Any special instructions?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Confirm Booking</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-gray-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-semibold text-gray-900">
                  {new Date(formData.date).toLocaleDateString()} at {formData.time}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold text-gray-900">{formData.address}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 text-lg">
                <span className="font-semibold">Total Price</span>
                <span className="font-bold text-emerald-600">₹{selectedService?.price}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm & Proceed to Payment"}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
