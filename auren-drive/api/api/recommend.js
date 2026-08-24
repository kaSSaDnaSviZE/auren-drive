import OpenAI from 'openai'
import process from 'node:process'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const CARS = [
  {
    id: 'bmw-m340i',
    name: 'BMW M340i xDrive',
    price: '3.0–4.0 млн ₽',
    power: '374 л.с.',
    drive: 'AWD',
    body: 'Седан',
  },
  {
    id: 'mercedes-e53',
    name: 'Mercedes-AMG E53',
    price: '4.0–5.5 млн ₽',
    power: '435 л.с.',
    drive: 'AWD',
    body: 'Седан',
  },
  {
    id: 'porsche-panamera-4s',
    name: 'Porsche Panamera 4S',
    price: '5.0–7.0 млн ₽',
    power: '440 л.с.',
    drive: 'AWD',
    body: 'Лифтбек',
  },
  {
    id: 'audi-s6',
    name: 'Audi S6',
    price: '3.0–4.5 млн ₽',
    power: '450 л.с.',
    drive: 'AWD',
    body: 'Седан',
  },
  {
    id: 'lexus-es',
    name: 'Lexus ES',
    price: '3.0–4.5 млн ₽',
    power: '249 л.с.',
    drive: 'FWD',
    body: 'Седан',
  },
  {
    id: 'toyota-land-cruiser',
    name: 'Toyota Land Cruiser',
    price: '6.0–10.0 млн ₽',
    power: '300+ л.с.',
    drive: 'AWD',
    body: 'SUV',
  },
]

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, AI-консультант по подбору автомобиля.

Ты анализируешь ответы пользователя и выбираешь РОВНО 3 лучших автомобиля ИЗ ПРЕДОСТАВЛЕННОГО СПИСКА.

Критерии:
- бюджет;
- новый/б/у;
- тип кузова;
- приоритеты;
- требуемая динамика;
- привод;
- отношение к расходу;
- любимые бренды.

Правила:
- нельзя придумывать автомобили, которых нет в списке;
- нельзя менять технические характеристики автомобилей;
- нельзя придумывать реальные объявления;
- нельзя говорить, что объявления были проверены;
- нельзя выдавать неподтверждённую информацию за факт;
- оценивай соответствие каждого автомобиля от 0 до 100;
- объясняй, почему машина подходит;
- указывай плюсы;
- указывай минусы;
- давай практический совет, что проверить перед покупкой;
- ответ должен быть только JSON.
`

function getBody(req) {
  return req.body && typeof req.body === 'object'
    ? req.body
    : {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { answers } = getBody(req)

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Invalid answers',
      })
    }

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b',

      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: JSON.stringify(
            {
              user_answers: answers,
              available_cars: CARS,
            },
            null,
            2,
          ),
        },
      ],

      temperature: 0.2,

      max_tokens: 3000,

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'auren_drive_recommendations',
          strict: true,

          schema: {
            type: 'object',
            additionalProperties: false,

            properties: {
              recommendations: {
                type: 'array',
                minItems: 3,
                maxItems: 3,

                items: {
                  type: 'object',
                  additionalProperties: false,

                  properties: {
                    id: {
                      type: 'string',
                      enum: CARS.map((car) => car.id),
                    },

                    match_score: {
                      type: 'number',
                    },

                    why: {
                      type: 'string',
                    },

                    pros: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },

                    cons: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },

                    buying_focus: {
                      type: 'string',
                    },
                  },

                  required: [
                    'id',
                    'match_score',
                    'why',
                    'pros',
                    'cons',
                    'buying_focus',
                  ],
                },
              },
            },

            required: ['recommendations'],
          },
        },
      },
    })

    const raw =
      completion.choices?.[0]?.message?.content

    if (!raw) {
      throw new Error('Empty AI response')
    }

    const parsed = JSON.parse(raw)

    if (
      !Array.isArray(parsed.recommendations) ||
      parsed.recommendations.length !== 3
    ) {
      throw new Error(
        'AI returned invalid recommendations',
      )
    }

    const validatedRecommendations =
      parsed.recommendations.map((item) => {
        const car = CARS.find(
          (candidate) => candidate.id === item.id,
        )

        if (!car) {
          throw new Error(
            `Unknown car returned: ${item.id}`,
          )
        }

        return {
          id: car.id,
          name: car.name,
          price: car.price,
          power: car.power,
          drive: car.drive,
          body: car.body,
          match_score: Math.max(
            0,
            Math.min(100, Number(item.match_score) || 0),
          ),
          why: item.why,
          pros: Array.isArray(item.pros)
            ? item.pros.slice(0, 5)
            : [],
          cons: Array.isArray(item.cons)
            ? item.cons.slice(0, 5)
            : [],
          buying_focus: item.buying_focus,
        }
      })

    return res.status(200).json({
      recommendations: validatedRecommendations,
    })
  } catch (error) {
    console.error('AUREN DRIVE ERROR:', error)

    return res.status(500).json({
      error:
        error?.message ||
        'Recommendation request failed',
    })
  }
}