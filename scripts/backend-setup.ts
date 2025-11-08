// Backend Setup Script - Run once to initialize backend structure
// This creates necessary folders and configuration

import fs from "fs"
import path from "path"

const backendRoot = "./backend"
const folders = ["config", "controllers", "middleware", "models", "routes", "utils", "services", "uploads"]

folders.forEach((folder) => {
  const folderPath = path.join(backendRoot, folder)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`Created folder: ${folder}`)
  }
})

console.log("Backend structure initialized!")
