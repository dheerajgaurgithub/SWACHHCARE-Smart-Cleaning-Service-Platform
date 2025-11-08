import express, { type Router, type Request, type Response } from "express"

const router: Router = express.Router()

// Mock jobs data
const jobs = [
  { id: 1, title: "Operations Manager", department: "Operations", salary: "₹6-8 LPA", location: "Delhi" },
  { id: 2, title: "Full Stack Developer", department: "Engineering", salary: "₹8-12 LPA", location: "Bangalore" },
  { id: 3, title: "Marketing Manager", department: "Marketing", salary: "₹5-7 LPA", location: "Mumbai" },
]

// Get all jobs
router.get("/", async (req: Request, res: Response) => {
  try {
    res.json({ success: true, jobs })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get job by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = jobs.find((j) => j.id === Number.parseInt(req.params.id))
    res.json({ success: true, job })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
