import OpenAI from 'openai'
import process from 'node:process'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  defaultHeaders: {
    'Groq-Model-Version': 'latest',
  },
})

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, интеллектуальный консультант по покупке автомобилей.

Твоя задача — НЕ просто назвать несколько машин.
Ты должен провести настоящее исследование автомобиля с помощью веб-поиска.

ПРОЦЕСС:

1. Проанализируй профиль покупателя.
2. Определи 5–10 потенциально подходящих моделей.
3. Используй веб-поиск для проверки актуальной информации.
4. Сравни найденные автомобили.
5. Отбрось явно неподходящие варианты.
6. Выбери ровно 3 лучших автомобиля.
7. Для каждого объясни:
   - почему он подходит;
   - преимущества;
   - недостатки;
   - типичные проблемы;
   - ориентир по текущему рынку;
   - на что смотреть при покупке;
   - насколько хорошо подходит именно этому человеку.

ВАЖНЫЕ ПРАВИЛА:

- Не придумывай актуальные цены.
- Не утверждай наличие автомобиля, если оно не найдено.
- Не утверждай, что видел конкретное объявление, если ты его действительно не нашёл.
- Если данные между источниками отличаются — скажи об этом.
- Отделяй факты от своего вывода.
- Для актуальных цен, рынка и наличия обязательно используй веб-поиск.
- Не ограничивайся одним сайтом.
- По возможности сравни несколько независимых источников.
- Если данных недостаточно, честно скажи об этом.
- Не давай опасных советов по ремонту.
- Не выдавай демонстрационные данные за реальные.

ОСОБЕННО ВАЖНО:

Пользователь может указать бюджет.
Бюджет является одним из главных ограничений.

Например:
если пользователь указал до 2 млн ₽,
не рекомендуй автомобиль, который сейчас обычно стоит 5–7 млн ₽,
если только не объясняешь конкретный найденный вариант значительно дешевле рынка.

Ищи свежую информацию и конкретные актуальные источники.

В конце дай:
TOP 3
1. ...
2. ...
3. ...

Затем объяснение и источники.

Отвечай на языке пользователя.
`

function buildUserPrompt(answers) {
  return `
Профиль потенциального покупателя автомобиля:

${JSON.stringify(answers, null, 2)}

Проведи полноценное исследование автомобильного рынка.

Нужно подобрать автомобили именно под этот профиль.

Ищи:
- актуальные цены;
- варианты на рынке;
- тип кузова;
- двигатели;
- мощность;
- привод;
- надёжность;
- типичные проблемы;
- стоимость обслуживания;
- ликвидность;
- плюсы и минусы.

При анализе используй несколько источников и учитывай актуальность данных.

Не ограничивайся знаниями модели — используй интернет-поиск.
`
}

function extractSources(message) {
  const sources = []

  const executedTools =
    message?.executed_tools || []

  for (const tool of executedTools) {
    const results =
      tool?.search_results || []

    for (const result of results) {
      if (!result) continue

      const url =
        result.url ||
        result.link ||
        result.source

      const title =
        result.title ||
        result.name ||
        url

      if (!url) continue

      const exists = sources.some(
        (item) => item.url === url,
      )

      if (!exists) {
        sources.push({
          title,
          url,
        })
      }
    }
  }

  return sources.slice(0, 10)
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
      await client.chat.completions.create({
        model: 'groq/compound',

        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: buildUserPrompt(
              answers,
            ),
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

    const answer =
      message?.content?.trim()

    if (!answer) {
      throw new Error(
        'Groq returned an empty response',
      )
    }

    const sources =
      extractSources(message)

    return res.status(200).json({
      answer,
      sources,
      searched: true,
      model: 'groq/compound',
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE WEB RESEARCH ERROR:',
      error,
    )

    return res.status(500).json({
      error:
        error?.message ||
        'Web research failed',
    })
  }
}