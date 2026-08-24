import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  defaultHeaders: {
    'Groq-Model-Version': 'latest',
  },
})

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, профессиональный AI-консультант по автомобилям.

Твоя задача — исследовать актуальную информацию в интернете и подобрать автомобили под конкретного пользователя.

ПРАВИЛА:

1. Анализируй профиль пользователя.
2. Используй web search для актуальной информации.
3. Ищи информацию минимум по нескольким источникам.
4. Для цен, наличия, рынка, отзывов и актуальных характеристик используй свежие данные.
5. Не выдумывай цены.
6. Не выдумывай объявления.
7. Не выдавай старые данные за текущие.
8. Если актуальная информация противоречива, укажи это.
9. Учитывай бюджет как одно из главных ограничений.
10. Не предлагай автомобиль, который сильно выходит за бюджет, просто ради красивого результата.
11. Подбирай ровно 3 лучших варианта, когда это возможно.
12. Если подходящих вариантов недостаточно — честно сообщи об этом.
13. Объясняй плюсы и минусы каждого варианта.
14. Указывай типичные проблемы.
15. Указывай, что проверять перед покупкой.
16. Отвечай на языке пользователя.

ФОРМАТ:

TOP 3

1. Название автомобиля
Почему подходит:
...
Плюсы:
...
Минусы:
...
Типичные проблемы:
...
На что смотреть:
...
Ориентир рынка:
...

2. ...

3. ...

Затем:

ИТОГ:
какой автомобиль ты считаешь лучшим и почему.

ИСТОЧНИКИ:
перечисли основные использованные источники.
`

function buildPrompt(answers) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(answers, null, 2)}

Проведи исследование автомобильного рынка.

Особенно проверь:
- актуальные цены;
- подходящие модели;
- год выпуска;
- двигатели;
- мощность;
- привод;
- надёжность;
- типичные неисправности;
- стоимость обслуживания;
- ликвидность;
- реальные рыночные предложения, если они доступны.

Используй веб-поиск.
`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
      },
    })
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: {
          message:
            'GROQ_API_KEY is missing in Vercel Environment Variables',
        },
      })
    }

    const { answers } = req.body || {}

    if (
      !answers ||
      typeof answers !== 'object'
    ) {
      return res.status(400).json({
        error: {
          message: 'Answers are required',
        },
      })
    }

    const completion =
      await groq.chat.completions.create({
        model: 'groq/compound',

        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: buildPrompt(answers),
          },
        ],

        temperature: 0.3,

        max_completion_tokens: 4000,

        compound_custom: {
          tools: {
            enabled_tools: [
              'web_search',
              'visit_website',
            ],
          },
        },
      })

    const message =
      completion?.choices?.[0]?.message

    const content =
      message?.content?.trim()

    if (!content) {
      return res.status(502).json({
        error: {
          message:
            'Groq returned an empty response',
        },
      })
    }

    const executedTools =
      message?.executed_tools || []

    return res.status(200).json({
      answer: content,
      searched:
        executedTools.length > 0,
      executedTools,
    })
  } catch (error) {
    console.error(
      'AUREN GROQ ERROR:',
      error,
    )

    return res.status(500).json({
      error: {
        message:
          error?.message ||
          'Groq request failed',

        status:
          error?.status ||
          error?.statusCode ||
          null,

        type:
          error?.type ||
          null,

        code:
          error?.code ||
          null,
      },
    })
  }
}