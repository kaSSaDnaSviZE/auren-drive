import OpenAI from 'openai'

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
    const { messages } = req.body ?? {}

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
You are AUREN AI, a highly knowledgeable automotive assistant.

Your specialization:
- cars and automotive technology
- engines and transmissions
- maintenance
- diagnostics
- reliability
- performance
- tuning
- detailing
- paint correction
- ceramic coatings
- buying and comparing vehicles
- automotive terminology

Answer naturally like a high-quality AI assistant, not like a scripted chatbot.

Important rules:
1. Be honest when information is uncertain.
2. Never invent technical specifications.
3. When discussing repairs, tuning, safety, or mechanical work, clearly distinguish general information from professional inspection.
4. For current prices, availability, laws, recalls, or other time-sensitive information, say that current data should be verified when you do not have a live source.
5. Explain technical concepts in simple language unless the user asks for advanced detail.
6. Compare cars using concrete criteria when possible.
7. Never claim to have physically inspected a vehicle.
8. Stay focused on the user's automotive question.

The current product is a portfolio demo called AUREN AUTO LAB.
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