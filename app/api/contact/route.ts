export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Save to database or send email
    console.log("Contact form submission:", { name, email, subject, message })

    // TODO: Implement database save or email notification

    return Response.json({ success: true, message: "Message received" })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
