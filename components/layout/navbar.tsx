"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, Moon, Sun, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/app/providers"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 shadow-sm border-b border-gray-200 dark:border-gray-800 smooth-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:inline">SwachhCare</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 smooth-transition"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 smooth-transition"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 smooth-transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 smooth-transition"
            >
              Contact
            </Link>

            {/* Dropdown for More */}
            <div className="relative group">
              <button className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 smooth-transition flex items-center gap-1">
                More <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible smooth-transition">
                <Link
                  href="/terms"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 smooth-transition first:rounded-t-lg"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 smooth-transition last:rounded-b-lg"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg smooth-transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/${user.role}/dashboard`}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 smooth-transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 smooth-transition"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 smooth-transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 smooth-transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-300" aria-label="Toggle theme">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 dark:text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Privacy Policy
            </Link>
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Login
                </Link>
                <Link href="/auth/signup" className="block px-4 py-2 bg-gradient-primary text-white rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
