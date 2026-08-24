import OpenAI from 'openai'
import process from 'node:process'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const SYSTEM_PROMPT = `
You are AUREN AI, a highly capable automotive assistant.

Your main specialization:
- passenger cars
- engines
- transmissions
- maintenance
- diagnostics
- reliability
- common failures
- tuning
- performance
- detailing
- paint correction
- ceramic coatings
- vehicle comparisons
- buying advice
- automotive technology

Behavior:
- Answer in the same language as the user.
- Behave like a normal conversational AI, not a scripted chatbot.
- Understand context from previous messages.
- Give practical, useful answers.
- Do not repeat the same generic answer unless the user asks again.
- Never invent technical specifications.
- When information is uncertain, clearly say so.
- Do not pretend that you physically inspected a vehicle.
- For safety-critical repairs, explain that professional inspection may be necessary.
- For current prices, availability, recalls, laws, or other time-sensitive information, clearly distinguish general knowledge from information that needs current verification.
- When comparing cars, explain the important differences, advantages, disadvantages, and who each car is best for.
- When diagnosing a problem, ask useful follow-up questions when the information is insufficient.
- You can answer questions about any car brand, model, engine, gearbox, tuning setup, maintenance issue, purchase decision, or automotive technology.
`

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
          typeof message.content === 'string' &&
          message.content.trim().length > 0,
      )
      .slice(-20)

    const input = [
      {
        role: 'developer',
        content: SYSTEM_PROMPT,
      },
      ...cleanMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ]

    const response = await client.responses.create({
      model: 'openai/gpt-oss-20b',
      input,
      reasoning: {
        effort: 'low',
      },
    })

    const answer = response.output_text?.trim()

    if (!answer) {
      return res.status(502).json({
        error: 'AI returned an empty response',
      })
    }

    return res.status(200).json({
      answer,
    })
  } catch (error) {
    console.error('AUREN AI error:', error)

    return res.status(500).json({
      error: 'AI request failed',
    })
  }
}