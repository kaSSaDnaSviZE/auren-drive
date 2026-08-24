import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, автомобильный AI-поисковик.

Ты должен исследовать актуальный автомобильный рынок через web search.

Задача:
1. Проанализировать требования пользователя.
2. Найти актуальные подходящие автомобили.
3. Выбрать TOP-3.
4. Для каждого автомобиля найти хотя бы один надежный источник.
5. По возможности найти страницу с фотографией автомобиля.
6. По возможности найти конкретное объявление.
7. Не выдумывать URLs.

ЖЕСТКИЕ ПРАВИЛА:
- Не придумывай цены.
- Не придумывай объявления.
- Не придумывай URL.
- Не придумывай фото URL.
- PHOTO_URL можно указывать только если такой URL реально найден в веб-поиске.
- LISTING_URL можно указывать только если найдено конкретное объявление.
- Если не найдено — оставь поле пустым.
- Бюджет пользователя очень важен.
- Не предлагай автомобиль, который явно сильно дороже бюджета.
- Учитывай российский рынок.
- Сравнивай несколько источников.
- Отвечай на русском.

ОБЯЗАТЕЛЬНЫЙ ФОРМАТ:

CAR_1
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
PHOTO_URL: ...
LISTING_URL: ...
SOURCE_URL: ...

CAR_2
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
PHOTO_URL: ...
LISTING_URL: ...
SOURCE_URL: ...

CAR_3
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
PHOTO_URL: ...
LISTING_URL: ...
SOURCE_URL: ...

BEST: ...
BEST_REASON: ...
`

function buildPrompt(answers) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(answers, null, 2)}

Исследуй рынок.

Особенно проверь:
- соответствие бюджету;
- актуальные цены;
- модель и поколение;
- двигатель;
- мощность;
- привод;
- тип кузова;
- надежность;
- типичные неисправности;
- стоимость обслуживания;
- реальные предложения.

Для каждого из TOP-3 постарайся найти:
1. страницу с фото;
2. конкретное объявление;
3. источник с информацией.

URL НЕ придумывай.

Если реального фото URL нет:
PHOTO_URL:

Если конкретного объявления нет:
LISTING_URL:
`
}

function extractBlock(text, number) {
  const regex = new RegExp(
    `CAR_${number}([\\s\\S]*?)(?=CAR_${number + 1}|BEST:|$)`,
    'i',
  )

  const match = text.match(regex)

  return match ? match[1].trim() : ''
}

function field(block, name) {
  const regex = new RegExp(
    `^${name}:\\s*(.*)$`,
    'im',
  )

  const match = block.match(regex)

  return match?.[1]?.trim() || ''
}

function parseResult(text) {
  const cars = [1, 2, 3]
    .map((number, index) => {
      const block = extractBlock(
        text,
        number,
      )

      if (!block) return null

      return {
        position: index + 1,
        name: field(block, 'NAME') ||
          `Автомобиль ${index + 1}`,

        price: field(block, 'PRICE'),

        specs: field(block, 'SPECS'),

        why: field(block, 'WHY'),

        pros: field(block, 'PROS'),

        cons: field(block, 'CONS'),

        problems: field(
          block,
          'PROBLEMS',
        ),

        check: field(
          block,
          'CHECK',
        ),

        photoUrl: field(
          block,
          'PHOTO_URL',
        ),

        listingUrl: field(
          block,
          'LISTING_URL',
        ),

        sourceUrl: field(
          block,
          'SOURCE_URL',
        ),
      }
    })
    .filter(Boolean)

  const bestMatch = text.match(
    /BEST:\s*(.*)/i,
  )

  const bestReasonMatch = text.match(
    /BEST_REASON:\s*([\s\S]*?)$/i,
  )

  return {
    cars,
    best:
      bestMatch?.[1]?.trim() || '',
    bestReason:
      bestReasonMatch?.[1]?.trim() || '',
  }
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
          'GROQ_API_KEY is missing in Vercel',
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

        temperature: 0.15,

        max_completion_tokens: 5000,

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
        error:
          'Groq returned an empty result',
      })
    }

    const parsed =
      parseResult(answer)

    return res.status(200).json({
      answer,
      cars: parsed.cars,
      best: parsed.best,
      bestReason: parsed.bestReason,
      citations:
        message?.citations || [],
      searched: true,
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR:',
      error,
    )

    return res.status(500).json({
      error:
        typeof error?.message === 'string'
          ? error.message
          : JSON.stringify(error),
    })
  }
}