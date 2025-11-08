export default function Terms() {
  return (
    <div className="bg-white dark:bg-slate-900 smooth-transition">
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 dark:from-emerald-950 to-blue-50 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: November 2024</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content:
                "By accessing and using SwachhCare, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
            },
            {
              title: "2. Use License",
              content:
                "Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only. You may not: modify or copy the materials, use the materials for any commercial purpose, attempt to decompile or disassemble any software contained on SwachhCare.",
            },
            {
              title: "3. Disclaimer",
              content:
                "The materials on SwachhCare are provided on an 'as is' basis. SwachhCare makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including implied warranties or conditions of merchantability or fitness for a particular purpose.",
            },
            {
              title: "4. Limitations",
              content:
                "In no event shall SwachhCare or its suppliers be liable for any damages arising out of the use or inability to use the materials on SwachhCare.",
            },
            {
              title: "5. Accuracy of Materials",
              content:
                "The materials appearing on SwachhCare could include technical, typographical, or photographic errors. SwachhCare does not warrant that any materials are accurate, complete, or current.",
            },
            {
              title: "6. Links",
              content:
                "SwachhCare has not reviewed all sites linked to its website and is not responsible for the contents of any linked site. Use of any linked website is at the user's own risk.",
            },
            {
              title: "7. Modifications",
              content:
                "SwachhCare may revise these terms at any time without notice. By using this website, you agree to be bound by the current version of these terms.",
            },
            {
              title: "8. Governing Law",
              content:
                "These terms are governed by the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
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
