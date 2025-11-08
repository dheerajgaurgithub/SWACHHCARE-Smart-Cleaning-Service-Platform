"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 mt-20 smooth-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SC</span>
              </div>
              <span className="font-bold text-white">SwachhCare</span>
            </div>
            <p className="text-sm">Professional cleaning services for your home and car.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/home-cleaning" className="hover:text-emerald-500 smooth-transition">
                  Home Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/car-washing" className="hover:text-emerald-500 smooth-transition">
                  Car Washing
                </Link>
              </li>
              <li>
                <Link href="/services/laundry" className="hover:text-emerald-500 smooth-transition">
                  Laundry Service
                </Link>
              </li>
              <li>
                <Link href="/services/combo-packages" className="hover:text-emerald-500 smooth-transition">
                  Combo Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-500 smooth-transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-emerald-500 smooth-transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-500 smooth-transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-500 smooth-transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 smooth-transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 smooth-transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 smooth-transition">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-emerald-400 smooth-transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 smooth-transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-500" />
                <span>+91 95555 55555</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-500" />
                <span>support@swachhcare.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-emerald-500 mt-1" />
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p>&copy; {currentYear} SwachhCare. All rights reserved.</p>
            <p className="flex items-center gap-2 mt-4 md:mt-0">
              Made with <Heart size={16} className="text-red-500" /> for a cleaner India
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
