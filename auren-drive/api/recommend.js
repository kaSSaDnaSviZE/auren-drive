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

    if (
      !answers ||
      typeof answers !== 'object'
    ) {
      return res.status(400).json({
        error: 'Answers are required',
      })
    }

    const prompt = `
Пользователь хочет подобрать автомобиль.

Его ответы:
${JSON.stringify(answers)}

Проведи актуальное исследование автомобильного рынка.

Используй веб-поиск.

Учитывай:
- бюджет;
- кузов;
- привод;
- любимые марки;
- динамику;
- расход;
- надёжность;
- комфорт;
- стоимость обслуживания;
- типичные проблемы;
- актуальные цены.

Не придумывай цены и наличие.

Не предлагай автомобили, которые сильно выходят за указанный бюджет.

Выбери TOP-3 самых подходящих вариантов.

Для каждого дай:
Название
Почему подходит
Ориентир цены
Характеристики
Плюсы
Минусы
Типичные проблемы
Что проверить перед покупкой

В конце укажи лучший вариант и почему.

Укажи источники, которые использовал.
`

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'groq/compound',

          messages: [
            {
              role: 'system',
              content:
                'Ты AUREN DRIVE — автомобильный AI-консультант, который использует веб-поиск для актуальной информации.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],

          temperature: 0.2,

          max_completion_tokens: 2500,
        }),
      },
    )

    const raw = await response.text()

    let data = {}

    try {
      data = raw
        ? JSON.parse(raw)
        : {}
    } catch {
      return res.status(502).json({
        error:
          `Groq returned invalid JSON: ${raw.slice(
            0,
            500,
          )}`,
      })
    }

    if (!response.ok) {
      console.error(
        'GROQ ERROR:',
        data,
      )

      return res.status(502).json({
        error:
          data?.error?.message ||
          data?.error ||
          `Groq API error ${response.status}`,
      })
    }

    const message =
      data?.choices?.[0]?.message

    const answer =
      typeof message?.content === 'string'
        ? message.content.trim()
        : ''

    if (!answer) {
      return res.status(502).json({
        error:
          'Groq returned an empty response',
      })
    }

    return res.status(200).json({
      answer,
      searched:
        Array.isArray(
          message?.executed_tools,
        )
          ? message.executed_tools.length > 0
          : false,
      executed_tools:
        message?.executed_tools || [],
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR:',
      error,
    )

    return res.status(500).json({
      error:
        error?.message ||
        'Unknown server error',
    })
  }
}