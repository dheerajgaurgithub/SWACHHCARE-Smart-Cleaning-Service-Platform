const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")

const ContactMessage = require("../models/ContactMessage")

// Submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Save to database
    const contact = new ContactMessage({
      name,
      email,
      subject,
      message,
      date: new Date(),
    })

    await contact.save()

    // Send auto-reply email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_SERVICE_USER,
      to: email,
      subject: "We received your message - SwachhCare",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br>SwachhCare Team</p>
      `,
    })

    // Send notification to admin
    await transporter.sendMail({
      from: process.env.EMAIL_SERVICE_USER,
      to: "dheerajgaur.0fficial@gmail.com",
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    res.status(201).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error sending message" })
  }
})

// Get all contact messages (admin only)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" })
  }
})

module.exports = router
