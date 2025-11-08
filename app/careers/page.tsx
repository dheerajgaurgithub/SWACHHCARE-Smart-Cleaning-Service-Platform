"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Briefcase, DollarSign, Clock, Search, ArrowRight } from "lucide-react"

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const jobs = [
    {
      id: 1,
      title: "Senior Service Manager",
      department: "Operations",
      location: "Mumbai, Maharashtra",
      level: "Mid-Senior",
      salary: "₹8L - 12L",
      type: "Full-time",
      description: "Lead and manage our service delivery teams across multiple regions.",
      posted: "2 days ago",
      applicants: 24,
    },
    {
      id: 2,
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Remote",
      level: "Entry-Level",
      salary: "₹3.5L - 5L",
      type: "Full-time",
      description: "Help our customers succeed with SWACHHCARE services.",
      posted: "1 week ago",
      applicants: 18,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Bangalore, Karnataka",
      level: "Mid-Level",
      salary: "₹6L - 10L",
      type: "Full-time",
      description: "Build scalable features for our platform serving 50,000+ users.",
      posted: "3 days ago",
      applicants: 42,
    },
    {
      id: 4,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Delhi, NCR",
      level: "Mid-Level",
      salary: "₹5L - 8L",
      type: "Full-time",
      description: "Drive growth and brand awareness across digital and traditional channels.",
      posted: "5 days ago",
      applicants: 31,
    },
    {
      id: 5,
      title: "HR & Recruitment Lead",
      department: "Human Resources",
      location: "Mumbai, Maharashtra",
      level: "Mid-Level",
      salary: "₹5.5L - 8.5L",
      type: "Full-time",
      description: "Build and scale our team with culture-fit hiring processes.",
      posted: "1 week ago",
      applicants: 12,
    },
    {
      id: 6,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      level: "Entry-Level",
      salary: "₹4L - 6L",
      type: "Full-time",
      description: "Extract insights from our growing dataset to drive business decisions.",
      posted: "4 days ago",
      applicants: 28,
    },
    {
      id: 7,
      title: "Worker Coordinator",
      department: "Operations",
      location: "Pune, Maharashtra",
      level: "Entry-Level",
      salary: "₹2.5L - 4L",
      type: "Full-time",
      description: "Coordinate with service workers and ensure quality service delivery.",
      posted: "2 days ago",
      applicants: 15,
    },
    {
      id: 8,
      title: "UX/UI Designer",
      department: "Design",
      location: "Bangalore, Karnataka",
      level: "Mid-Level",
      salary: "₹5L - 8L",
      type: "Full-time",
      description: "Design intuitive interfaces for millions of users.",
      posted: "1 week ago",
      applicants: 35,
    },
  ]

  const departments = [
    "all",
    "Operations",
    "Customer Support",
    "Engineering",
    "Marketing",
    "Human Resources",
    "Analytics",
    "Design",
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = selectedDepartment === "all" || job.department === selectedDepartment
    return matchesSearch && matchesDept
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry-Level":
        return "bg-green-100 text-green-800"
      case "Mid-Level":
        return "bg-blue-100 text-blue-800"
      case "Mid-Senior":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-balance">Join Our Team</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Be part of a mission to reduce unemployment and empower thousands of workers across India.
            </p>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg max-w-2xl">
              <div className="flex gap-2">
                <Search className="text-muted-foreground mt-2" size={20} />
                <Input
                  placeholder="Search jobs, departments, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent text-lg focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:w-64 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Filter by Department</h3>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedDepartment === dept
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted bg-muted/50"
                      }`}
                    >
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div>
                <h3 className="text-lg font-bold mb-4">View</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Jobs Stats */}
              <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Open Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Jobs</span>
                      <span className="font-bold text-primary">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Filtered</span>
                      <span className="font-bold text-primary">{filteredJobs.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jobs Display */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{filteredJobs.length}</span> jobs
                </p>
              </div>

              {filteredJobs.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No jobs found matching your filters.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedDepartment("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <Link key={job.id} href={`/careers/jobs/${job.id}`}>
                      <Card className="h-full hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>{job.department}</CardDescription>
                            </div>
                            <Badge className={getLevelColor(job.level)}>{job.level}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={16} className="text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign size={16} className="text-muted-foreground" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={16} className="text-muted-foreground" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-xs text-muted-foreground">{job.applicants} applicants</span>
                            <ArrowRight size={16} className="text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map((job) => (
                    <Link key={job.id} href={`/careers/jobs/${job.id}`}>
                      <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold">{job.title}</h3>
                                <Badge className={getLevelColor(job.level)}>{job.level}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{job.department}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} className="text-muted-foreground" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign size={14} className="text-muted-foreground" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} className="text-muted-foreground" />
                                  {job.posted}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-3">{job.applicants} applicants</p>
                              <Button size="sm">Apply Now</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Don't see your role?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We're always looking for talented people. Send us your resume and we'll get back to you.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
