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

const SYSTEM_PROMPT = `
Ты — AUREN DRIVE, профессиональный AI-поисковик автомобилей.

Твоя задача:
- изучить требования пользователя;
- исследовать актуальный рынок;
- использовать веб-поиск;
- выбрать 3 наиболее подходящих автомобиля;
- анализировать цены, характеристики, надежность и обслуживание;
- по возможности находить реальные объявления.

КРИТИЧЕСКИ ВАЖНО:

Не придумывай URL.
Не придумывай объявления.
Не придумывай цены.
Не придумывай фото.
Не создавай фиктивные ссылки.

Система сама извлечет реальные URL из поисковых результатов Groq.

Бюджет пользователя является важным ограничением.

Если пользователь указал бюджет до 1 млн ₽,
не предлагай автомобиль за 3 млн ₽ только потому,
что он хороший.

Учитывай:
- бюджет;
- возраст;
- кузов;
- привод;
- динамику;
- расход;
- надежность;
- комфорт;
- обслуживание;
- типичные проблемы;
- ликвидность;
- российский рынок.

Ищи несколько источников.

ОТВЕТ ДОЛЖЕН ИМЕТЬ ЭТОТ ФОРМАТ:

CAR_1
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...

CAR_2
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...

CAR_3
NAME: ...
PRICE: ...
SPECS: ...
WHY: ...
PROS: ...
CONS: ...
PROBLEMS: ...
CHECK: ...

BEST: ...
BEST_REASON: ...

Не добавляй никаких PHOTO_URL или LISTING_URL.
`

function buildPrompt(answers) {
  return `
ПРОФИЛЬ ПОКУПАТЕЛЯ:

${JSON.stringify(
  answers,
  null,
  2,
)}

Проведи актуальное веб-исследование российского рынка автомобилей.

Приоритет:
1. Auto.ru
2. Drom.ru
3. Avito.ru
4. другие надежные автомобильные источники.

Найди подходящие модели.

Если доступны реальные объявления — используй их как источник информации.

Для каждого автомобиля проверь:
- цену;
- год;
- двигатель;
- мощность;
- привод;
- расход;
- надежность;
- типичные неисправности;
- обслуживание;
- ликвидность.

Выбери только те автомобили, которые действительно подходят пользователю.
`
}

function cleanUrl(value) {
  if (
    typeof value !== 'string'
  ) {
    return ''
  }

  const url = value.trim()

  if (
    !/^https?:\/\//i.test(url)
  ) {
    return ''
  }

  return url
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

function isMarketDomain(url) {
  const host = getHost(url)

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

function getNameTokens(name = '') {
  return normalize(name)
    .split(/\s+/)
    .filter(
      (token) =>
        token.length >= 2,
    )
}

function resultMatchesCar(
  result,
  carName,
) {
  const text = normalize(
    `${result.title || ''} ${
      result.content || ''
    }`,
  )

  const tokens =
    getNameTokens(carName)

  if (!tokens.length) {
    return false
  }

  const matched =
    tokens.filter((token) =>
      text.includes(token),
    )

  return (
    matched.length >=
    Math.max(
      1,
      Math.ceil(
        tokens.length * 0.5,
      ),
    )
  )
}

/*
  ВАЖНО:
  Groq возвращает:
  
  search_results: {
    results: [...]
  }

  а не:
  
  search_results: [...]
*/
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
    const searchResults =
      tool?.search_results

    let items = []

    if (
      Array.isArray(
        searchResults,
      )
    ) {
      items =
        searchResults
    } else if (
      Array.isArray(
        searchResults?.results,
      )
    ) {
      items =
        searchResults.results
    }

    for (const item of items) {
      const url = cleanUrl(
        item?.url,
      )

      if (!url) {
        continue
      }

      if (
        results.some(
          (existing) =>
            existing.url ===
            url,
        )
      ) {
        continue
      }

      results.push({
        title:
          item?.title || '',
        url,
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

function pickBestSource(
  results,
  carName,
) {
  const matches = results.filter(
    (result) =>
      resultMatchesCar(
        result,
        carName,
      ),
  )

  if (!matches.length) {
    return null
  }

  return [...matches].sort(
    (a, b) => {
      const aMarket =
        isMarketDomain(a.url)
          ? 1
          : 0

      const bMarket =
        isMarketDomain(b.url)
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
        b.score -
        a.score
      )
    },
  )[0]
}

function pickListing(
  results,
  carName,
) {
  const matches =
    results.filter(
      (result) =>
        isMarketDomain(
          result.url,
        ) &&
        resultMatchesCar(
          result,
          carName,
        ),
    )

  if (!matches.length) {
    return null
  }

  return [...matches].sort(
    (a, b) =>
      b.score -
      a.score,
  )[0]
}

async function extractOgImage(
  pageUrl,
) {
  const url =
    cleanUrl(pageUrl)

  if (!url) {
    return ''
  }

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

      /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:url["']/i,

      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ]

    for (const pattern of patterns) {
      const match =
        html.match(pattern)

      if (
        !match?.[1]
      ) {
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

function parseCars(
  text = '',
) {
  const cars = []

  for (
    let number = 1;
    number <= 3;
    number++
  ) {
    const start =
      text.search(
        new RegExp(
          `CAR_${number}\\s*`,
          'i',
        ),
      )

    if (start === -1) {
      continue
    }

    const nextMarker =
      number < 3
        ? text.search(
            new RegExp(
              `CAR_${number + 1}\\s*`,
              'i',
            ),
          )
        : text.search(
            /BEST:/i,
          )

    const end =
      nextMarker !== -1
        ? nextMarker
        : text.length

    const block =
      text.slice(
        start,
        end,
      )

    function field(
      name,
    ) {
      const match =
        block.match(
          new RegExp(
            `^${name}:\\s*(.*)$`,
            'im',
          ),
        )

      return (
        match?.[1]?.trim() ||
        ''
      )
    }

    const name =
      field('NAME')

    if (!name) {
      continue
    }

    cars.push({
      id: `${number}-${name}`,
      position: number,
      name,
      price:
        field('PRICE'),
      specs:
        field('SPECS'),
      why:
        field('WHY'),
      pros:
        field('PROS'),
      cons:
        field('CONS'),
      problems:
        field('PROBLEMS'),
      check:
        field('CHECK'),
    })
  }

  return cars
}

function parseBest(
  text = '',
) {
  const best =
    text.match(
      /^BEST:\s*(.*)$/im,
    )?.[1] || ''

  const reason =
    text.match(
      /^BEST_REASON:\s*([\s\S]*)$/im,
    )?.[1] || ''

  return {
    best: best.trim(),
    reason: reason.trim(),
  }
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
    if (
      !process.env.GROQ_API_KEY
    ) {
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

    const executedTools =
      Array.isArray(
        message?.executed_tools,
      )
        ? message.executed_tools
        : []

    const searchResults =
      extractSearchResults(
        executedTools,
      )

    console.log(
      'AUREN SEARCH RESULTS:',
      searchResults.length,
    )

    const cars =
      parseCars(answer)

    const enrichedCars =
      await Promise.all(
        cars.map(
          async (car) => {
            const source =
              pickBestSource(
                searchResults,
                car.name,
              )

            const listing =
              pickListing(
                searchResults,
                car.name,
              )

            /*
              Для фото сначала
              пробуем реальное
              объявление.
              Если не получилось —
              используем основной
              источник.
            */
            let photoUrl =
              ''

            if (
              listing?.url
            ) {
              photoUrl =
                await extractOgImage(
                  listing.url,
                )
            }

            if (
              !photoUrl &&
              source?.url
            ) {
              photoUrl =
                await extractOgImage(
                  source.url,
                )
            }

            return {
              ...car,

              sourceUrl:
                source?.url ||
                '',

              sourceTitle:
                source?.title ||
                '',

              listingUrl:
                listing?.url ||
                '',

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

    const best =
      parseBest(answer)

    return res.status(200).json({
      cars:
        enrichedCars.slice(
          0,
          3,
        ),

      best:
        best.best,

      bestReason:
        best.reason,

      searched: true,

      searchResultsCount:
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