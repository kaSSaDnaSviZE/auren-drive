import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  defaultHeaders: {
    'Groq-Model-Version': 'latest',
  },
})

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, интеллектуальный консультант по автомобилям.

Твоя задача — не просто ответить из памяти, а провести актуальное веб-исследование и подобрать автомобили под конкретного пользователя.

ОБЯЗАТЕЛЬНО:

1. Используй веб-поиск для актуальной информации.
2. При необходимости посещай найденные страницы.
3. Учитывай российский рынок.
4. Проверяй актуальные цены и наличие, когда это возможно.
5. Сравнивай несколько источников.
6. Не придумывай цены, объявления, комплектации, пробеги или характеристики.
7. Если конкретные данные не подтверждены — прямо скажи об этом.
8. Бюджет пользователя является одним из главных ограничений.
9. Не рекомендуй автомобиль, который сильно выходит за бюджет, только потому что он хороший.
10. Анализируй надёжность, типичные неисправности и стоимость владения.
11. Учитывай кузов, привод, динамику, расход, бренд и приоритеты пользователя.
12. Для каждого автомобиля объясняй, почему он подходит именно этому пользователю.
13. Если подходящих автомобилей мало — не выдумывай дополнительные варианты.
14. Отвечай на русском, если пользователь пишет на русском.

ФОРМАТ ОТВЕТА:

AUREN DRIVE — РЕЗУЛЬТАТ ИССЛЕДОВАНИЯ

TOP 3

### 1. Название автомобиля

Почему подходит:
...

Актуальный ориентир рынка:
...

Основные характеристики:
...

Плюсы:
- ...
- ...
- ...

Минусы:
- ...
- ...
- ...

Типичные проблемы:
- ...
- ...
- ...

На что смотреть перед покупкой:
- ...
- ...
- ...

### 2. ...

### 3. ...

ЛУЧШИЙ ВАРИАНТ:
...

ПОЧЕМУ:
...

ВАЖНО:
...

ИСТОЧНИКИ:
Укажи использованные источники и ссылки, если они доступны.

Всегда отделяй подтверждённые факты от собственных выводов.
`

function buildUserPrompt(answers) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(answers, null, 2)}

Проведи полноценное исследование.

В первую очередь проверь:

- бюджет;
- подходящие модели;
- реальные актуальные цены;
- доступность на российском рынке;
- тип кузова;
- привод;
- двигатель;
- мощность;
- расход;
- надёжность;
- типичные проблемы;
- стоимость обслуживания;
- ликвидность;
- плюсы и минусы.

Ищи информацию минимум по нескольким источникам.

Не ограничивайся знаниями модели.
Используй web search.

Если подходящих вариантов по бюджету недостаточно, честно сообщи об этом.

После исследования выбери три наиболее подходящих варианта.
`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error:
          'GROQ_API_KEY is not configured in Vercel',
      })
    }

    const { answers } = req.body || {}

    if (
      !answers ||
      typeof answers !== 'object'
    ) {
      return res.status(400).json({
        error: 'Answers are required',
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
            content: buildUserPrompt(answers),
          },
        ],

        temperature: 0.2,

        max_completion_tokens: 5000,

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
      typeof message?.content === 'string'
        ? message.content.trim()
        : ''

    if (!content) {
      return res.status(502).json({
        error:
          'Groq returned an empty response',
      })
    }

    const executedTools =
      message?.executed_tools || []

    return res.status(200).json({
      answer: content,
      searched: executedTools.length > 0,
      executed_tools: executedTools,
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE GROQ ERROR:',
      error,
    )

    const message =
      typeof error?.message === 'string'
        ? error.message
        : JSON.stringify(error)

    return res.status(500).json({
      error: message,
      status:
        error?.status ||
        error?.statusCode ||
        null,
      type: error?.type || null,
      code: error?.code || null,
    })
  }
}