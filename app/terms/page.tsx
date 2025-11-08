"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-12">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using SWACHHCARE's platform, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                SWACHHCARE's platform for personal, non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Service Terms</h2>
              <p className="text-muted-foreground mb-4">
                SWACHHCARE provides cleaning and service solutions subject to the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Services are provided on an "as is" basis without warranties</li>
                <li>Customers must provide accurate location and contact information</li>
                <li>Services must be used lawfully and in accordance with all applicable laws</li>
                <li>Payment must be completed before or upon service completion</li>
                <li>Customers agree to treat service professionals with respect</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on SWACHHCARE's platform are provided "as is". SWACHHCARE makes no warranties, expressed
                or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall SWACHHCARE or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on SWACHHCARE's platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
              <p className="text-muted-foreground">
                The materials appearing on SWACHHCARE's platform could include technical, typographical, or photographic
                errors. SWACHHCARE does not warrant that any of the materials on its platform are accurate, complete, or
                current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these terms, please contact us at terms@swachhcare.com or call
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
