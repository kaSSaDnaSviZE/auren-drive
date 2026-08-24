import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
]

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE.

Ты не просто чат-бот.
Ты — профессиональный AI-консультант и исследователь автомобильного рынка.

ТВОЯ ЗАДАЧА:

Получить профиль пользователя.
Провести актуальное веб-исследование.
Сравнить найденные автомобили.
Сформировать персональный TOP-3.

ОСНОВНЫЕ ПРАВИЛА:

1. Используй browser_search.
2. Исследуй актуальную информацию.
3. Учитывай российский рынок.
4. Проверяй цены.
5. Проверяй актуальные характеристики.
6. Проверяй типичные проблемы.
7. Проверяй стоимость обслуживания.
8. Проверяй ликвидность.
9. Сравнивай несколько источников.
10. Учитывай бюджет как главный фильтр.
11. Не предлагай автомобиль, который явно выше бюджета.
12. Не выдумывай объявления.
13. Не выдумывай URLs.
14. Не выдумывай цены.
15. Не выдавай предположение за факт.
16. Если конкретных актуальных данных нет — скажи об этом.
17. Если найдено реальное объявление — используй его.
18. Отвечай на русском.

ВАЖНЫЙ ПРИНЦИП:

Лучше сказать:
"Не найдено подходящих объявлений"

чем придумать красивый результат.

ИССЛЕДОВАНИЕ ДОЛЖНО УЧИТЫВАТЬ:

- бюджет;
- новый/б/у;
- возраст;
- кузов;
- любимые марки;
- привод;
- динамику;
- расход;
- комфорт;
- надёжность;
- стоимость владения;
- обслуживание;
- типичные проблемы;
- ликвидность;
- российские реалии.

ИЩИ ИНФОРМАЦИЮ ПО ВОЗМОЖНОСТИ В:

- Auto.ru
- Drom.ru
- Avito.ru
- официальных сайтах производителей
- крупных автомобильных изданиях
- сервисах с техническими данными
- независимых источниках

НЕ ПИШИ PHOTO_URL.

НЕ ПИШИ LISTING_URL.

Система сама извлечёт настоящие ссылки из результатов поиска.

ФОРМАТ:

CAR_1
NAME: ...
PRICE: ...
YEAR: ...
BODY: ...
ENGINE: ...
POWER: ...
DRIVE: ...
MILEAGE: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
BEST_FOR: ...

CAR_2
NAME: ...
PRICE: ...
YEAR: ...
BODY: ...
ENGINE: ...
POWER: ...
DRIVE: ...
MILEAGE: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
BEST_FOR: ...

CAR_3
NAME: ...
PRICE: ...
YEAR: ...
BODY: ...
ENGINE: ...
POWER: ...
DRIVE: ...
MILEAGE: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...
BEST_FOR: ...

BEST: ...
BEST_REASON: ...

MARKET_NOTE: ...

IMPORTANT: ...

Не добавляй лишний текст вокруг этой структуры.
`

function buildPrompt(answers) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(answers, null, 2)}

Проведи настоящее исследование рынка.

ТВОЯ ЦЕЛЬ:

Найти не просто известные модели, а автомобили, которые реально соответствуют этому человеку.

ОБЯЗАТЕЛЬНО:

- отфильтруй неподходящие по бюджету;
- учитывай состояние рынка;
- учитывай реальные цены;
- ищи объявления;
- по возможности находи несколько реальных вариантов;
- сравнивай их;
- учитывай расходы после покупки.

Для каждого TOP-3 найди наиболее релевантный источник.

Очень важно:

Не придумывай ссылку.
Не придумывай объявление.
Не придумывай пробег.
Не придумывай цену.

Если точное значение не подтверждено — используй:
"данные не подтверждены".

Постарайся сделать рекомендации максимально практичными для реальной покупки.
`
}

function isRateLimit(error) {
  const status =
    error?.status ||
    error?.statusCode

  const message =
    error?.message || ''

  return (
    status === 429 ||
    /rate limit/i.test(
      message,
    ) ||
    error?.code ===
      'rate_limit_exceeded'
  )
}

function parseField(
  block,
  field,
) {
  const match =
    block.match(
      new RegExp(
        `^${field}:\\s*(.*)$`,
        'im',
      ),
    )

  return (
    match?.[1]?.trim() || ''
  )
}

function parseCars(text) {
  const cars = []

  for (
    let i = 1;
    i <= 3;
    i++
  ) {
    const startMatch =
      text.match(
        new RegExp(
          `CAR_${i}\\s*`,
          'i',
        ),
      )

    if (!startMatch) {
      continue
    }

    const start =
      startMatch.index ?? 0

    const rest =
      text.slice(start + 1)

    const nextMatch =
      rest.match(
        new RegExp(
          `CAR_${i + 1}\\s*`,
          'i',
        ),
      )

    const bestIndex =
      rest.search(
        /BEST:/i,
      )

    let end =
      text.length

    if (nextMatch) {
      end =
        start +
        1 +
        nextMatch.index
    } else if (
      bestIndex !== -1
    ) {
      end =
        start +
        1 +
        bestIndex
    }

    const block =
      text.slice(
        start,
        end,
      )

    const name =
      parseField(
        block,
        'NAME',
      )

    if (!name) {
      continue
    }

    cars.push({
      id: `${i}-${name}`,
      rank: i,
      name,
      price: parseField(
        block,
        'PRICE',
      ),
      year: parseField(
        block,
        'YEAR',
      ),
      body: parseField(
        block,
        'BODY',
      ),
      engine: parseField(
        block,
        'ENGINE',
      ),
      power: parseField(
        block,
        'POWER',
      ),
      drive: parseField(
        block,
        'DRIVE',
      ),
      mileage: parseField(
        block,
        'MILEAGE',
      ),
      why: parseField(
        block,
        'WHY',
      ),
      pros: parseField(
        block,
        'PROS',
      ),
      cons: parseField(
        block,
        'CONS',
      ),
      problems:
        parseField(
          block,
          'PROBLEMS',
        ),
      check:
        parseField(
          block,
          'CHECK',
        ),
      bestFor:
        parseField(
          block,
          'BEST_FOR',
        ),
    })
  }

  return cars
}

function parseMeta(
  text,
) {
  return {
    best:
      text.match(
        /^BEST:\s*(.*)$/im,
      )?.[1]?.trim() ||
      '',

    bestReason:
      text.match(
        /^BEST_REASON:\s*([\s\S]*?)(?=^MARKET_NOTE:|^IMPORTANT:|$)/im,
      )?.[1]?.trim() ||
      '',

    marketNote:
      text.match(
        /^MARKET_NOTE:\s*([\s\S]*?)(?=^IMPORTANT:|$)/im,
      )?.[1]?.trim() ||
      '',

    important:
      text.match(
        /^IMPORTANT:\s*([\s\S]*)$/im,
      )?.[1]?.trim() ||
      '',
  }
}

function extractSearchResults(
  executedTools,
) {
  const results = []

  if (
    !Array.isArray(
      executedTools,
    )
  ) {
    return results
  }

  for (const tool of executedTools) {
    const search =
      tool?.search_results

    let items = []

    if (
      Array.isArray(search)
    ) {
      items = search
    }

    if (
      Array.isArray(
        search?.results,
      )
    ) {
      items =
        search.results
    }

    for (const item of items) {
      const url =
        typeof item?.url ===
        'string'
          ? item.url.trim()
          : ''

      if (
        !/^https?:\/\//i.test(
          url,
        )
      ) {
        continue
      }

      if (
        results.some(
          (r) =>
            r.url === url,
        )
      ) {
        continue
      }

      results.push({
        url,
        title:
          item?.title || '',
        content:
          item?.content || '',
        score:
          Number(
            item?.score,
          ) || 0,
      })
    }
  }

  return results
}

function hostname(url) {
  try {
    return new URL(
      url,
    ).hostname
      .replace(
        /^www\./,
        '',
      )
      .toLowerCase()
  } catch {
    return ''
  }
}

function isMarketplace(
  url,
) {
  const host =
    hostname(url)

  return [
    'auto.ru',
    'drom.ru',
    'avito.ru',
    'avto.ru',
    'youla.ru',
  ].some(
    (domain) =>
      host === domain ||
      host.endsWith(
        `.${domain}`,
      ),
  )
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(
      /[^a-zа-яё0-9]+/gi,
      ' ',
    )
}

function matchingScore(
  result,
  carName,
) {
  const source =
    normalize(
      `${result.title} ${result.content}`,
    )

  const tokens =
    normalize(carName)
      .split(/\s+/)
      .filter(
        (token) =>
          token.length >= 2,
      )

  if (!tokens.length) {
    return -1
  }

  let score =
    result.score || 0

  for (const token of tokens) {
    if (
      source.includes(token)
    ) {
      score += 1
    }
  }

  if (
    isMarketplace(
      result.url,
    )
  ) {
    score += 5
  }

  return score
}

function pickSource(
  results,
  carName,
) {
  const ranked =
    results
      .map(
        (result) => ({
          ...result,
          match:
            matchingScore(
              result,
              carName,
            ),
        }),
      )
      .filter(
        (result) =>
          result.match >= 0,
      )
      .sort(
        (a, b) =>
          b.match -
          a.match,
      )

  return ranked[0] || null
}

function pickListing(
  results,
  carName,
) {
  const ranked =
    results
      .filter(
        (result) =>
          isMarketplace(
            result.url,
          ),
      )
      .map(
        (result) => ({
          ...result,
          match:
            matchingScore(
              result,
              carName,
            ),
        }),
      )
      .filter(
        (result) =>
          result.match >= 3,
      )
      .sort(
        (a, b) =>
          b.match -
          a.match,
      )

  return ranked[0] || null
}

async function getOgImage(
  pageUrl,
) {
  if (!pageUrl) {
    return ''
  }

  try {
    const response =
      await fetch(
        pageUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 AUREN DRIVE',
            Accept:
              'text/html,application/xhtml+xml',
          },
          redirect: 'follow',
        },
      )

    if (
      !response.ok
    ) {
      return ''
    }

    const html =
      await response.text()

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]

    for (
      const pattern of patterns
    ) {
      const match =
        html.match(
          pattern,
        )

      if (
        !match?.[1]
      ) {
        continue
      }

      try {
        return new URL(
          match[1],
          pageUrl,
        ).href
      } catch {
        return match[1]
      }
    }

    return ''
  } catch {
    return ''
  }
}

async function runModel(
  model,
  answers,
) {
  return groq.chat.completions.create(
    {
      model,

      messages: [
        {
          role: 'system',
          content:
            SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content:
            buildPrompt(
              answers,
            ),
        },
      ],

      temperature: 0.1,

      max_completion_tokens: 2200,

      reasoning_effort:
        'low',

      tool_choice: 'required',

      tools: [
        {
          type:
            'browser_search',
        },
      ],
    },
  )
}

export default async function handler(
  req,
  res,
) {
  if (
    req.method !==
    'POST'
  ) {
    return res.status(405).json({
      error:
        'Method not allowed',
    })
  }

  try {
    const key =
      process.env.GROQ_API_KEY

    if (!key) {
      return res.status(500).json({
        error:
          'GROQ_API_KEY is missing',
      })
    }

    const {
      answers,
    } = req.body || {}

    if (
      !answers ||
      typeof answers !==
        'object'
    ) {
      return res.status(400).json({
        error:
          'Answers are required',
      })
    }

    let completion = null
    let modelUsed = ''

    for (
      const model of MODELS
    ) {
      try {
        completion =
          await runModel(
            model,
            answers,
          )

        modelUsed =
          model

        break
      } catch (error) {
        console.error(
          `${model} failed`,
          error,
        )

        if (
          !isRateLimit(
            error,
          )
        ) {
          throw error
        }
      }
    }

    if (!completion) {
      return res.status(429).json({
        error:
          'Лимит Groq исчерпан на доступных моделях. Попробуйте позже.',
        code:
          'GROQ_RATE_LIMIT',
      })
    }

    const message =
      completion
        ?.choices?.[0]
        ?.message

    const answer =
      typeof message?.content ===
      'string'
        ? message.content.trim()
        : ''

    if (!answer) {
      return res.status(502).json({
        error:
          'Groq returned an empty result',
      })
    }

    const cars =
      parseCars(answer)

    const meta =
      parseMeta(answer)

    const searchResults =
      extractSearchResults(
        message?.executed_tools,
      )

    const enriched =
      await Promise.all(
        cars
          .slice(0, 3)
          .map(
            async (car) => {
              const source =
                pickSource(
                  searchResults,
                  car.name,
                )

              const listing =
                pickListing(
                  searchResults,
                  car.name,
                )

              let image =
                ''

              if (
                listing?.url
              ) {
                image =
                  await getOgImage(
                    listing.url,
                  )
              }

              if (
                !image &&
                source?.url
              ) {
                image =
                  await getOgImage(
                    source.url,
                  )
              }

              return {
                ...car,

                listingUrl:
                  listing?.url ||
                  '',

                listingTitle:
                  listing?.title ||
                  '',

                sourceUrl:
                  source?.url ||
                  '',

                sourceTitle:
                  source?.title ||
                  '',

                image,

                hasRealListing:
                  Boolean(
                    listing?.url,
                  ),

                hasRealImage:
                  Boolean(
                    image,
                  ),
              }
            },
          ),
      )

    return res.status(200).json({
      cars:
        enriched,

      best:
        meta.best,

      bestReason:
        meta.bestReason,

      marketNote:
        meta.marketNote,

      important:
        meta.important,

      model:
        modelUsed,

      sources:
        searchResults
          .slice(0, 12)
          .map(
            (item) => ({
              title:
                item.title,
              url:
                item.url,
            }),
          ),

      searched: true,
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR',
      error,
    )

    return res.status(500).json({
      error:
        error?.message ||
        'Research failed',
    })
  }
}