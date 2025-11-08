"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-12">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                SWACHHCARE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website and use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We may collect information about you in a variety of ways:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personal information you voluntarily provide (name, email, phone number, address)</li>
                <li>Payment information for service transactions</li>
                <li>Information from your device (IP address, browser type, pages visited)</li>
                <li>Location data for service delivery and optimization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use collected information for:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Processing and delivering your service requests</li>
                <li>Improving our platform and user experience</li>
                <li>Communicating with you about services and updates</li>
                <li>Fraud prevention and security purposes</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement advanced security measures to protect your personal information from unauthorized access,
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100%
                secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access, update, or delete your personal information</li>
                <li>Opt-out of promotional communications</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact us at privacy@swachhcare.com or call our support team at
                +91-1234-567890.
              </p>
            </section>

            <p className="text-sm text-muted-foreground pt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
