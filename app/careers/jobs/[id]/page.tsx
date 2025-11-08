"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Share2, CheckCircle2 } from "lucide-react"

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id

  // Mock job data - would come from API in real app
  const jobDetails: Record<string, any> = {
    "1": {
      id: 1,
      title: "Senior Service Manager",
      department: "Operations",
      location: "Mumbai, Maharashtra",
      level: "Mid-Senior",
      salary: "₹8L - 12L",
      type: "Full-time",
      posted: "2 days ago",
      applicants: 24,
      description: "Lead and manage our service delivery teams across multiple regions.",
      about:
        "SWACHHCARE is building the future of service industry in India. We are revolutionizing the way services are delivered by empowering thousands of workers with opportunities and training.",
      responsibilities: [
        "Lead and manage 50+ service workers across Mumbai region",
        "Ensure quality service delivery and customer satisfaction",
        "Train and develop team members for career growth",
        "Implement operational efficiency improvements",
        "Handle escalations and customer disputes",
        "Monitor KPIs and report to leadership",
      ],
      requirements: [
        "5+ years of experience in operations or service management",
        "Proven track record of managing large teams",
        "Excellent communication and leadership skills",
        "Data-driven decision making",
        "Experience with scheduling and resource management software",
        "Familiarity with service industry (preferred)",
      ],
      benefits: [
        "Competitive salary and performance bonus",
        "Health insurance for you and your family",
        "Professional development and training",
        "Flexible work hours",
        "Career growth opportunities",
        "Inclusive and diverse workplace",
      ],
    },
    "3": {
      id: 3,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Bangalore, Karnataka",
      level: "Mid-Level",
      salary: "₹6L - 10L",
      type: "Full-time",
      posted: "3 days ago",
      applicants: 42,
      description: "Build scalable features for our platform serving 50,000+ users.",
      about:
        "Join our engineering team and help us build the technology that powers SWACHHCARE. We use modern tech stacks and follow best practices in software development.",
      responsibilities: [
        "Develop and maintain features using React and Next.js",
        "Build robust backend APIs with Node.js",
        "Write clean, maintainable, and well-tested code",
        "Collaborate with product and design teams",
        "Participate in code reviews and technical discussions",
        "Contribute to architectural decisions",
      ],
      requirements: [
        "3+ years of full stack development experience",
        "Strong knowledge of React/Next.js and Node.js",
        "Experience with TypeScript and SQL databases",
        "Understanding of REST APIs and cloud services",
        "Git and CI/CD pipeline experience",
        "Problem-solving mindset and good communication",
      ],
      benefits: [
        "Competitive salary and stock options",
        "Learning and development budget",
        "Remote-friendly work environment",
        "Health and wellness benefits",
        "Flexible working hours",
        "Access to latest tools and technologies",
      ],
    },
  }

  const job = jobDetails[jobId as string] || jobDetails["1"]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link href="/careers" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft size={18} />
            Back to Careers
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-muted-foreground">{job.department}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">{job.level}</Badge>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-muted-foreground" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-muted-foreground" />
                <span>Posted {job.posted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-muted-foreground" />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="lg" className="flex-1 md:flex-none">
                Apply Now
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent">
                <Share2 size={18} />
                Share
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About SWACHHCARE</h2>
                <p className="text-muted-foreground leading-relaxed">{job.about}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-4">What We're Looking For</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-6 sticky top-24">
                {/* Apply Card */}
                <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Ready to Apply?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Join us in our mission to reduce unemployment and empower workers.
                    </p>
                    <Button className="w-full">Apply Now</Button>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Job Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Job Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Experience Level</p>
                      <p className="font-medium">{job.level}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Department</p>
                      <p className="font-medium">{job.department}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
