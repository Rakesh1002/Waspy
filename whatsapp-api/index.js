import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import express from 'express'
import qrcode from 'qrcode-terminal'
import bodyParser from 'body-parser'

// Set up express
const app = express()
app.use(bodyParser.json())

// Health-check route
app.get("/", (_, res) => {
  res.send("WhatsApp API is running!")
})

// Forward messages to the user
app.post("/send-message", async (req, res) => {
  const chatId = req.body.chatId
  const message = req.body.message
  const result = await client.sendMessage(chatId, message)
  res.status(200).json(result)
})

// Start the server
const startServer = () => {
  const port = 3000
  app.listen(port, () => {
    console.log(`✔ Server is running on port ${port}`)
  })
}

// Initialize the WhatsApp web client
const client = new Client({
  puppeteer: {
    // Run chromium in headless mode
    headless: true,
    args: ["--no-sandbox"],
  },
  // Save session to disk so you don't need to authenticate each time you start the server.
  authStrategy: new LocalAuth(),
})

// Print QR code in terminal
client.on("qr", (qr) => {
  console.log("👇 Scan the QR code below to authenticate")
  qrcode.generate(qr, { small: true })
})

// Listen for client authentication
client.on("authenticated", () => {
  console.log("✔ Client is authenticated!")
})

// Listen for when client is ready to start receiving/sending messages
client.on("ready", () => {
  console.log("✔ Client is ready!")
  startServer()
})

// Listen for incoming messages
client.on("message", (message) => {
  console.log("💬 New message received:", JSON.stringify(message.body))
})

// Start WhatsApp client
console.log("◌ Starting WhatsApp client...")
client.initialize()