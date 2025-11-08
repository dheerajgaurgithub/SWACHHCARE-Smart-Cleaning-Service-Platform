export default function Privacy() {
  return (
    <div className="bg-white dark:bg-slate-900 smooth-transition">
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 dark:from-emerald-950 to-blue-50 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: November 2024</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {[
            {
              title: "1. Information Collection",
              content:
                "SwachhCare collects information you provide directly, such as when you create an account, place an order, or contact support. This may include name, email, phone number, location, and payment information.",
            },
            {
              title: "2. Use of Information",
              content:
                "We use collected information to provide, maintain, and improve services, process transactions, send service-related announcements, respond to inquiries, and personalize your experience.",
            },
            {
              title: "3. Data Protection",
              content:
                "SwachhCare implements appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
            },
            {
              title: "4. Cookies and Tracking",
              content:
                "We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.",
            },
            {
              title: "5. Third-Party Sharing",
              content:
                "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist in operating our website, subject to confidentiality agreements.",
            },
            {
              title: "6. Your Rights",
              content:
                "You have the right to access, correct, or delete your personal information. You can manage your preferences through your account dashboard.",
            },
            {
              title: "7. Children's Privacy",
              content:
                "SwachhCare does not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete it promptly.",
            },
            {
              title: "8. Changes to Policy",
              content:
                "SwachhCare may update this privacy policy. We will notify you of significant changes by posting the new policy on our website.",
            },
            {
              title: "9. Contact Us",
              content: "If you have questions about this privacy policy, please contact us at privacy@swachhcare.com",
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
