import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, профессиональный автомобильный AI-консультант.

Твоя задача — провести актуальное веб-исследование и помочь пользователю выбрать автомобиль.

ОБЯЗАТЕЛЬНО:
- Используй browser search.
- Ищи актуальную информацию в интернете.
- Учитывай российский рынок.
- Проверяй актуальные цены, если они доступны.
- Сравнивай несколько источников.
- Не придумывай автомобили, цены, комплектации, пробеги или наличие.
- Бюджет пользователя является жёстким ограничением.
- Если точных данных нет, честно скажи об этом.
- Не выдавай свои предположения за факты.
- Отвечай на языке пользователя.

АНАЛИЗИРУЙ:
- бюджет;
- год;
- кузов;
- привод;
- двигатель;
- мощность;
- динамику;
- расход;
- надёжность;
- типичные проблемы;
- обслуживание;
- ликвидность;
- комфорт;
- безопасность;
- реальные предложения на рынке, если они доступны.

РЕЗУЛЬТАТ:

TOP 3

1. Автомобиль
Почему подходит:
...

Цена на рынке:
...

Характеристики:
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

Что проверить перед покупкой:
- ...
- ...
- ...

2. Автомобиль
...

3. Автомобиль
...

ЛУЧШИЙ ВАРИАНТ:
...

ПОЧЕМУ:
...

ИСТОЧНИКИ:
Укажи основные сайты и страницы, которые использовал.

Очень важно:
если пользователь указал бюджет до 2 млн ₽, не предлагай машину за 5 млн ₽ просто потому, что она хорошая.
`

function buildPrompt(answers) {
  return `
Профиль пользователя:

${JSON.stringify(answers, null, 2)}

Проведи настоящее исследование.

Сначала изучи профиль.
Затем используй browser search для поиска актуальной информации.
Проверь несколько источников.
После этого выбери 3 лучших автомобиля.

Особенно внимательно проверь:
- соответствие бюджету;
- актуальные цены;
- российский рынок;
- надёжность;
- типичные проблемы;
- стоимость обслуживания;
- характеристики;
- плюсы и минусы.

Не отвечай только из памяти.
`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error:
          'GROQ_API_KEY is missing in Vercel Environment Variables',
      })
    }

    const { answers } = req.body || {}

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Answers are required',
      })
    }

    const completion =
      await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',

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

        temperature: 0.2,

        max_completion_tokens: 3000,

        reasoning_effort: 'low',

        tool_choice: 'required',

        tools: [
          {
            type: 'browser_search',
          },
        ],
      })

    const message =
      completion?.choices?.[0]?.message

    const answer =
      typeof message?.content === 'string'
        ? message.content.trim()
        : ''

    if (!answer) {
      return res.status(502).json({
        error: 'Groq returned an empty answer',
      })
    }

    return res.status(200).json({
      answer,
      searched: true,
      citations:
        message?.citations || [],
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR:',
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
      code: error?.code || null,
      type: error?.type || null,
    })
  }
}