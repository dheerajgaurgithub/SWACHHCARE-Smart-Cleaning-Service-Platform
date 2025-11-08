"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, User, Phone, Camera, CheckCircle } from "lucide-react"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [jobStatus, setJobStatus] = useState<"pending" | "accepted" | "checkedin" | "started" | "completed">("pending")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [afterImage, setAfterImage] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [acceptanceTime, setAcceptanceTime] = useState(0) // seconds remaining to accept

  const jobId = params.id

  // Mock job data
  const job = {
    id: jobId,
    customer: "Rahul Sharma",
    phone: "+91-9876543210",
    service: "Home Cleaning",
    location: "Green Street, Mumbai",
    date: "Today",
    time: "10:00 AM - 12:00 PM",
    amount: "₹999",
    description: "Full apartment cleaning including bedroom, kitchen, and bathroom",
    image: "🏠",
    priority: "High",
  }

  const handleAcceptJob = () => {
    if (acceptanceTime <= 0) {
      alert("Acceptance window has expired!")
      return
    }
    setJobStatus("accepted")
    alert("Job accepted! Please proceed to check-in at the service location.")
  }

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toString())
        setLongitude(position.coords.longitude.toString())
        alert("Location captured!")
      })
    }
  }

  const handleCheckIn = () => {
    if (!latitude || !longitude) {
      alert("Please capture your location first")
      return
    }
    setJobStatus("checkedin")
    alert("Check-in successful! Job started.")
  }

  const handleStartJob = () => {
    setJobStatus("started")
    alert("Job started! Capture before images and proceed with work.")
  }

  const handleCompleteJob = () => {
    if (!afterImage || !beforeImage) {
      alert("Please upload both before and after images")
      return
    }
    setJobStatus("completed")
    alert("Job completed! Submitting for payment settlement.")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Job Details</h1>
        <p className="text-muted-foreground">
          {jobStatus === "pending" && "Review and accept this job within 5-10 minutes"}
          {jobStatus === "accepted" && "Proceed to the location for check-in"}
          {jobStatus === "checkedin" && "You are checked in. Start the job whenever ready."}
          {jobStatus === "started" && "Document your work with before/after images"}
          {jobStatus === "completed" && "Job submitted successfully!"}
        </p>
      </div>

      {/* Job Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{job.image}</div>
              <div>
                <CardTitle>{job.service}</CardTitle>
                <CardDescription>{job.customer}</CardDescription>
              </div>
            </div>
            <Badge variant={job.priority === "High" ? "destructive" : "default"}>{job.priority} Priority</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Service Location</p>
              <p className="text-muted-foreground">{job.location}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Scheduled Time</p>
              <p className="text-muted-foreground">{job.time}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold">Customer Contact</p>
              <p className="text-muted-foreground flex items-center gap-2">
                {job.phone}
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Estimated Payment</p>
            <p className="text-2xl font-bold text-primary">{job.amount}</p>
          </div>

          {/* Description */}
          <div>
            <p className="font-semibold mb-2">Job Description</p>
            <p className="text-muted-foreground">{job.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Job Status Workflow */}
      {jobStatus === "pending" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">Accept Job</CardTitle>
            <CardDescription>You have 5-10 minutes to accept this job</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button size="lg" className="flex-1" onClick={handleAcceptJob}>
              Accept Job
            </Button>
            <Button size="lg" variant="outline" className="flex-1 bg-transparent">
              Decline
            </Button>
          </CardContent>
        </Card>
      )}

      {(jobStatus === "accepted" ||
        jobStatus === "checkedin" ||
        jobStatus === "started" ||
        jobStatus === "completed") && (
        <Card>
          <CardHeader>
            <CardTitle>Check-In & Work Progress</CardTitle>
            <CardDescription>Document your work with location and images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Verification */}
            {jobStatus === "accepted" && (
              <Alert>
                <AlertDescription>Proceed to the job location and check-in with your GPS location</AlertDescription>
              </Alert>
            )}

            {/* Check-in Section */}
            {(jobStatus === "accepted" || jobStatus === "checkedin" || jobStatus === "started") && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold mb-3">Location Verification</p>
                  <div className="flex gap-2">
                    <Input placeholder="Latitude" value={latitude} readOnly className="flex-1" />
                    <Input placeholder="Longitude" value={longitude} readOnly className="flex-1" />
                    <Button onClick={handleGetLocation}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Location
                    </Button>
                  </div>
                  {latitude && longitude && (
                    <p className="text-sm text-green-600 mt-2">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Location captured
                    </p>
                  )}
                </div>

                {jobStatus === "accepted" && latitude && longitude && (
                  <Button size="lg" className="w-full" onClick={handleCheckIn}>
                    Check-In at Location
                  </Button>
                )}

                {jobStatus === "checkedin" && (
                  <Button size="lg" className="w-full" onClick={handleStartJob}>
                    Start Job
                  </Button>
                )}
              </div>
            )}

            {/* Before/After Images */}
            {(jobStatus === "started" || jobStatus === "completed") && (
              <div className="space-y-4">
                <p className="font-semibold">Document Your Work</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before Image */}
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-semibold mb-2">Before Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                    {beforeImage && (
                      <p className="text-sm text-green-600 mt-2">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {beforeImage.name}
                      </p>
                    )}
                  </div>

                  {/* After Image */}
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-semibold mb-2">After Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                    {afterImage && (
                      <p className="text-sm text-green-600 mt-2">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {afterImage.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-semibold mb-2">Work Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe the work completed, any issues, or items used..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Complete Button */}
            {jobStatus === "started" && beforeImage && afterImage && (
              <Button size="lg" className="w-full" onClick={handleCompleteJob}>
                Complete & Submit Job
              </Button>
            )}

            {jobStatus === "completed" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Job completed successfully! Payment will be settled after admin review.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
