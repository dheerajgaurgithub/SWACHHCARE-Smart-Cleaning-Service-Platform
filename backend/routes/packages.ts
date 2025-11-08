import express, { type Router, type Request, type Response } from "express"
import Package from "../models/Package"

const router: Router = express.Router()

// Get all packages
router.get("/", async (req: Request, res: Response) => {
  try {
    const packages = await Package.find()
    res.json({ success: true, packages })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create package (admin only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const pkg = new Package(req.body)
    await pkg.save()
    res.status(201).json({ success: true, package: pkg })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
