import OpenAI from 'openai'
import process from 'node:process'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { messages } = req.body || {}

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'messages must be an array',
      })
    }

    const cleanMessages = messages
      .filter(
        (message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string',
      )
      .slice(-20)

    const input = [
      {
        role: 'developer',
        content: `
You are AUREN AI, an expert automotive assistant.

Your areas of expertise:
- cars
- engines
- transmissions
- maintenance
- diagnostics
- reliability
- tuning
- performance
- detailing
- paint correction
- ceramic coatings
- vehicle comparisons
- buying advice
- automotive technology

Answer naturally like a professional AI assistant.

Rules:
- Answer in the same language as the user.
- Never invent technical specifications.
- Be honest when information is uncertain.
- Do not claim to physically inspect a vehicle.
- For repairs, tuning and safety, distinguish general information from professional inspection.
- For current prices, availability, recalls, laws, or other time-sensitive information, say that current information should be verified.
- Remember the conversation context.
- Give concise answers by default, but provide detailed explanations when useful.
- When comparing cars, explain the important differences instead of simply naming a winner.
- When diagnosing a problem, ask for useful details when necessary.
        `,
      },
      ...cleanMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ]

    const response = await client.responses.create({
      model: 'gpt-5.6',
      input,
    })

    return res.status(200).json({
      answer: response.output_text,
    })
  } catch (error) {
    console.error('AUREN AI error:', error)

    return res.status(500).json({
      error: 'AI request failed',
    })
  }
}