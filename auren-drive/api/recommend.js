import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
]

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, интеллектуальная система выбора автомобиля.

Твоя задача — не просто назвать модели, а провести исследование рынка и определить, какие автомобили максимально подходят конкретному человеку.

ОБЯЗАТЕЛЬНО:
- используй browser search;
- учитывай российский рынок;
- проверяй актуальные цены;
- учитывай бюджет;
- учитывай тип кузова;
- учитывай привод;
- учитывай динамику;
- учитывай надёжность;
- учитывай расход;
- учитывай стоимость обслуживания;
- учитывай ликвидность;
- учитывай типичные проблемы;
- сравнивай найденные варианты.

КРИТИЧЕСКИ ВАЖНО:
- не выдумывай цену;
- не выдумывай пробег;
- не выдумывай год;
- не выдумывай объявление;
- не выдумывай ссылку;
- не выдумывай фото;
- не выдавай предположение за факт.

Если данных нет:
"Данные не подтверждены."

Если конкретных объявлений не найдено:
"Конкретное объявление не найдено."

БЮДЖЕТ:
Если пользователь указал бюджет, считай его одним из главных ограничений.

НЕ надо рекомендовать автомобиль стоимостью 5 млн пользователю с бюджетом 2 млн только потому, что это хороший автомобиль.

РЕЗУЛЬТАТ:
Выбери максимум 3 автомобиля.

Для каждого:
- название;
- актуальный ориентир цены;
- год;
- кузов;
- двигатель;
- мощность;
- привод;
- пробег, если найден;
- почему подходит;
- плюсы;
- минусы;
- типичные проблемы;
- что проверить;
- кому подходит.

Также дай:
- лучший вариант;
- почему он лучший;
- важное замечание по рынку.

НЕ ПИШИ URL.
Система сама извлечёт реальные URL из результатов поиска.

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
`

function buildPrompt(profile) {
  return `
ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:

${JSON.stringify(profile, null, 2)}

Сначала пойми, какого автомобиля хочет пользователь.

После этого проведи веб-исследование.

Ищи:
- актуальные предложения;
- цены;
- характеристики;
- слабые места;
- стоимость содержания;
- реальные варианты на рынке.

Приоритет:
1. Auto.ru
2. Drom.ru
3. Avito.ru
4. официальные сайты;
5. крупные автомобильные источники.

Если конкретное объявление найдено — учитывай его.
Если не найдено — не придумывай.

Выбери наиболее подходящие варианты именно для этого человека.
`
}

function isRateLimit(error) {
  return (
    error?.status === 429 ||
    error?.statusCode === 429 ||
    error?.code === 'rate_limit_exceeded' ||
    /rate limit/i.test(
      error?.message || '',
    )
  )
}

function getField(block, field) {
  const match = block.match(
    new RegExp(
      `^${field}:\\s*(.*)$`,
      'im',
    ),
  )

  return match?.[1]?.trim() || ''
}

function parseCars(text) {
  const cars = []

  for (let index = 1; index <= 3; index++) {
    const marker = `CAR_${index}`

    const start = text.search(
      new RegExp(
        `^${marker}\\s*$`,
        'im',
      ),
    )

    if (start === -1) {
      continue
    }

    let end = text.length

    for (
      let next = index + 1;
      next <= 3;
      next++
    ) {
      const nextIndex = text.search(
        new RegExp(
          `^CAR_${next}\\s*$`,
          'im',
        ),
      )

      if (
        nextIndex !== -1 &&
        nextIndex > start
      ) {
        end = nextIndex
        break
      }
    }

    const bestIndex = text.search(
      /^BEST:/im,
    )

    if (
      bestIndex !== -1 &&
      bestIndex > start &&
      bestIndex < end
    ) {
      end = bestIndex
    }

    const block = text.slice(
      start,
      end,
    )

    const name = getField(
      block,
      'NAME',
    )

    if (!name) {
      continue
    }

    cars.push({
      id: `${index}-${name}`,
      rank: index,
      name,
      price: getField(block, 'PRICE'),
      year: getField(block, 'YEAR'),
      body: getField(block, 'BODY'),
      engine: getField(block, 'ENGINE'),
      power: getField(block, 'POWER'),
      drive: getField(block, 'DRIVE'),
      mileage: getField(block, 'MILEAGE'),
      why: getField(block, 'WHY'),
      pros: getField(block, 'PROS'),
      cons: getField(block, 'CONS'),
      problems: getField(
        block,
        'PROBLEMS',
      ),
      check: getField(
        block,
        'CHECK',
      ),
      bestFor: getField(
        block,
        'BEST_FOR',
      ),
    })
  }

  return cars
}

function parseMeta(text) {
  return {
    best:
      text.match(
        /^BEST:\s*(.*)$/im,
      )?.[1]?.trim() || '',

    bestReason:
      text.match(
        /^BEST_REASON:\s*([\s\S]*?)(?=^MARKET_NOTE:|^IMPORTANT:|$)/im,
      )?.[1]?.trim() || '',

    marketNote:
      text.match(
        /^MARKET_NOTE:\s*([\s\S]*?)(?=^IMPORTANT:|$)/im,
      )?.[1]?.trim() || '',

    important:
      text.match(
        /^IMPORTANT:\s*([\s\S]*)$/im,
      )?.[1]?.trim() || '',
  }
}

function normalize(text = '') {
  return text
    .toLowerCase()
    .replace(
      /[^a-zа-яё0-9]+/gi,
      ' ',
    )
    .trim()
}

function getHost(url) {
  try {
    return new URL(url)
      .hostname
      .replace(/^www\./, '')
      .toLowerCase()
  } catch {
    return ''
  }
}

function isMarketplace(url) {
  const host = getHost(url)

  return [
    'auto.ru',
    'drom.ru',
    'avito.ru',
    'avto.ru',
    'youla.ru',
  ].some(
    (domain) =>
      host === domain ||
      host.endsWith(`.${domain}`),
  )
}

function resultMatch(result, carName) {
  const haystack = normalize(
    `${result.title || ''} ${result.content || ''}`,
  )

  const tokens = normalize(
    carName,
  )
    .split(/\s+/)
    .filter(
      (token) =>
        token.length >= 2,
    )

  if (!tokens.length) {
    return -1
  }

  let score =
    Number(result.score) || 0

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += 1
    }
  }

  if (isMarketplace(result.url)) {
    score += 5
  }

  return score
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
    const search = tool?.search_results

    let items = []

    if (
      Array.isArray(search)
    ) {
      items = search
    } else if (
      Array.isArray(
        search?.results,
      )
    ) {
      items = search.results
    }

    for (const item of items) {
      if (
        !item?.url ||
        !/^https?:\/\//i.test(
          item.url,
        )
      ) {
        continue
      }

      if (
        results.some(
          (existing) =>
            existing.url ===
            item.url,
        )
      ) {
        continue
      }

      results.push({
        url: item.url,
        title:
          item.title || '',
        content:
          item.content || '',
        score:
          Number(item.score) || 0,
      })
    }
  }

  return results
}

function pickSource(
  results,
  carName,
) {
  return (
    results
      .map((result) => ({
        ...result,
        match: resultMatch(
          result,
          carName,
        ),
      }))
      .filter(
        (result) =>
          result.match >= 0,
      )
      .sort(
        (a, b) =>
          b.match - a.match,
      )[0] || null
  )
}

function pickListing(
  results,
  carName,
) {
  return (
    results
      .filter((result) =>
        isMarketplace(
          result.url,
        ),
      )
      .map((result) => ({
        ...result,
        match: resultMatch(
          result,
          carName,
        ),
      }))
      .filter(
        (result) =>
          result.match >= 3,
      )
      .sort(
        (a, b) =>
          b.match - a.match,
      )[0] || null
  )
}

async function getOgImage(url) {
  if (!url) {
    return ''
  }

  try {
    const response =
      await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 AUREN DRIVE',
          Accept:
            'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      })

    if (!response.ok) {
      return ''
    }

    const html =
      await response.text()

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]

    for (const pattern of patterns) {
      const match =
        html.match(pattern)

      if (!match?.[1]) {
        continue
      }

      try {
        return new URL(
          match[1],
          url,
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
  profile,
) {
  return groq.chat.completions.create({
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
          buildPrompt(profile),
      },
    ],

    temperature: 0.1,
    max_completion_tokens: 2200,
    reasoning_effort: 'low',

    tool_choice: 'required',

    tools: [
      {
        type: 'browser_search',
      },
    ],
  })
}

export default async function handler(
  req,
  res,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error:
        'Method not allowed',
    })
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error:
          'GROQ_API_KEY is missing',
      })
    }

    const { profile } =
      req.body || {}

    if (
      !profile ||
      typeof profile !== 'object'
    ) {
      return res.status(400).json({
        error:
          'Profile is required',
      })
    }

    let completion = null
    let modelUsed = ''

    for (const model of MODELS) {
      try {
        completion =
          await runModel(
            model,
            profile,
          )

        modelUsed = model
        break
      } catch (error) {
        console.error(
          `${model} failed`,
          error,
        )

        if (
          !isRateLimit(error)
        ) {
          throw error
        }
      }
    }

    if (!completion) {
      return res.status(429).json({
        error:
          'Groq rate limit reached. Try again later.',
        code:
          'GROQ_RATE_LIMIT',
      })
    }

    const message =
      completion?.choices?.[0]?.message

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

    const enrichedCars =
      await Promise.all(
        cars.map(
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

            let image = ''

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
                listing?.url || '',

              listingTitle:
                listing?.title || '',

              sourceUrl:
                source?.url || '',

              sourceTitle:
                source?.title || '',

              image,

              hasRealListing:
                Boolean(
                  listing?.url,
                ),

              hasRealImage:
                Boolean(image),
            }
          },
        ),
      )

    return res.status(200).json({
      cars:
        enrichedCars.slice(0, 3),

      best: meta.best,
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
          .slice(0, 10)
          .map((item) => ({
            title: item.title,
            url: item.url,
          })),

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