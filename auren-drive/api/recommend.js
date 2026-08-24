import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const MARKET_DOMAINS = [
  'auto.ru',
  'drom.ru',
  'avito.ru',
  'avto.ru',
  'youla.ru',
]

const IMAGE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
}

function cleanUrl(value) {
  if (
    typeof value !== 'string' ||
    !/^https?:\/\//i.test(value)
  ) {
    return ''
  }

  return value.trim()
}

function hostOf(url) {
  try {
    return new URL(url).hostname
      .replace(/^www\./, '')
      .toLowerCase()
  } catch {
    return ''
  }
}

function isMarketListing(url) {
  const host = hostOf(url)

  return MARKET_DOMAINS.some(
    (domain) =>
      host === domain ||
      host.endsWith(`.${domain}`),
  )
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

function modelTokens(name = '') {
  return normalize(name)
    .split(/\s+/)
    .filter(
      (token) =>
        token.length >= 2 &&
        ![
          'toyota',
          'bmw',
          'mercedes',
          'benz',
          'audi',
          'porsche',
          'haval',
          'chery',
          'lada',
          'hyundai',
          'kia',
          'lexus',
        ].includes(token),
    )
}

function resultMatchesCar(result, carName) {
  const haystack = normalize(
    `${result?.title || ''} ${result?.content || ''}`,
  )

  const tokens =
    modelTokens(carName)

  if (!tokens.length) {
    return false
  }

  const matches =
    tokens.filter((token) =>
      haystack.includes(token),
    )

  return (
    matches.length >=
    Math.max(
      1,
      Math.ceil(tokens.length * 0.5),
    )
  )
}

function chooseBestSource(
  results,
  carName,
) {
  const matches = results.filter(
    (result) =>
      resultMatchesCar(
        result,
        carName,
      ) &&
      cleanUrl(result?.url),
  )

  if (!matches.length) {
    return null
  }

  const sorted = [...matches].sort(
    (a, b) => {
      const aMarket =
        isMarketListing(a.url)
          ? 1
          : 0

      const bMarket =
        isMarketListing(b.url)
          ? 1
          : 0

      if (
        aMarket !==
        bMarket
      ) {
        return (
          bMarket -
          aMarket
        )
      }

      return (
        (b.score || 0) -
        (a.score || 0)
      )
    },
  )

  return sorted[0]
}

function extractSearchResults(
  executedTools,
) {
  const all = []

  for (const tool of executedTools || []) {
    for (const result of
      tool?.search_results || []) {
      const url = cleanUrl(
        result?.url,
      )

      if (!url) continue

      if (
        all.some(
          (item) =>
            item.url === url,
        )
      ) {
        continue
      }

      all.push({
        title:
          result?.title || '',
        url,
        content:
          result?.content || '',
        score:
          Number(result?.score) ||
          0,
      })
    }
  }

  return all
}

async function extractOgImage(
  pageUrl,
) {
  const url = cleanUrl(pageUrl)

  if (!url) return ''

  try {
    const response =
      await fetch(url, {
        headers:
          IMAGE_HEADERS,
        redirect:
          'follow',
      })

    if (!response.ok) {
      return ''
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) || ''

    if (
      !contentType.includes(
        'text/html',
      )
    ) {
      return ''
    }

    const html =
      await response.text()

    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
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

function parseCars(text = '') {
  const blocks = text.split(
    /CAR_(?:1|2|3)\s*/i,
  )

  const result = []

  for (
    let index = 1;
    index < blocks.length &&
    index <= 3;
    index++
  ) {
    const block =
      blocks[index]

    const getField = (
      name,
    ) => {
      const regex =
        new RegExp(
          `^${name}:\\s*(.*)$`,
          'im',
        )

      return (
        block.match(regex)?.[1]?.trim() ||
        ''
      )
    }

    const name =
      getField('NAME')

    if (!name) {
      continue
    }

    result.push({
      id: `${index}-${name}`,
      position: index,
      name,
      price:
        getField('PRICE'),
      specs:
        getField('SPECS'),
      why:
        getField('WHY'),
      pros:
        getField('PROS'),
      cons:
        getField('CONS'),
      problems:
        getField('PROBLEMS'),
      check:
        getField('CHECK'),
    })
  }

  return result
}

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, профессиональный AI-поисковик автомобилей.

Проведи актуальное исследование российского автомобильного рынка.

Используй browser_search.

НАЙДИ:
- подходящие модели;
- реальные актуальные цены;
- конкретные объявления, если доступны;
- несколько источников;
- типичные проблемы;
- характеристики;
- плюсы и минусы.

ОЧЕНЬ ВАЖНО:

НЕ ПРИДУМЫВАЙ URL.

НЕ ПИШИ PHOTO_URL.

НЕ ПИШИ LISTING_URL.

Система сама получит реальные URL из результатов поиска.

Если конкретных объявлений недостаточно — просто выбери подходящие модели, но не выдумывай ссылки.

ФОРМАТ:

CAR_1
NAME: название
PRICE: цена или диапазон
SPECS: характеристики
WHY: почему подходит
PROS: плюсы
CONS: минусы
PROBLEMS: типичные проблемы
CHECK: что проверить перед покупкой

CAR_2
...

CAR_3
...

BEST: лучший вариант
BEST_REASON: почему

Не придумывай данные.
Бюджет пользователя является важным ограничением.
`

function buildPrompt(
  answers,
) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(
  answers,
  null,
  2,
)}

Найди TOP-3.

Особенно ищи российские источники и реальные предложения.

Приоритет источников:
1. Auto.ru
2. Drom.ru
3. Avito.ru
4. другие актуальные автомобильные источники.

Для каждой машины найди наиболее релевантный источник.

Не выдумывай ссылки.
`
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
          'GROQ_API_KEY is missing in Vercel',
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

    const completion =
      await groq.chat.completions.create(
        {
          model:
            'openai/gpt-oss-20b',

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

          temperature: 0.15,

          max_completion_tokens:
            3500,

          reasoning_effort:
            'low',

          tool_choice:
            'required',

          tools: [
            {
              type: 'browser_search',
            },
          ],
        },
      )

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
          'Groq returned an empty answer',
      })
    }

    const cars =
      parseCars(answer)

    const executedTools =
      message
        ?.executed_tools ||
      []

    const searchResults =
      extractSearchResults(
        executedTools,
      )

    const enrichedCars =
      await Promise.all(
        cars.map(
          async (car) => {
            const source =
              chooseBestSource(
                searchResults,
                car.name,
              )

            const listingCandidates =
              searchResults
                .filter(
                  (item) =>
                    resultMatchesCar(
                      item,
                      car.name,
                    ) &&
                    isMarketListing(
                      item.url,
                    ),
                )
                .sort(
                  (a, b) =>
                    (b.score || 0) -
                    (a.score || 0),
                )

            const listing =
              listingCandidates[0] ||
              null

            const sourceForImage =
              listing ||
              source

            const photoUrl =
              await extractOgImage(
                sourceForImage?.url,
              )

            return {
              ...car,

              sourceUrl:
                cleanUrl(
                  source?.url,
                ),

              sourceTitle:
                source?.title ||
                '',

              listingUrl:
                cleanUrl(
                  listing?.url,
                ),

              listingTitle:
                listing?.title ||
                '',

              photoUrl,

              hasRealPhoto:
                Boolean(
                  photoUrl,
                ),

              hasRealListing:
                Boolean(
                  listing?.url,
                ),
            }
          },
        ),
      )

    const bestMatch =
      answer.match(
        /BEST:\s*(.*)/i,
      )

    const bestReasonMatch =
      answer.match(
        /BEST_REASON:\s*([\s\S]*?)$/i,
      )

    return res.status(200).json({
      cars:
        enrichedCars.slice(
          0,
          3,
        ),

      best:
        bestMatch?.[1]?.trim() ||
        '',

      bestReason:
        bestReasonMatch?.[1]?.trim() ||
        '',

      searched: true,

      sourceCount:
        searchResults.length,
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR:',
      error,
    )

    return res.status(500).json({
      error:
        error?.message ||
        'Research failed',
    })
  }
}