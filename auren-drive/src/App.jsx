import { useState } from 'react'
import './App.css'

const questions = [
  {
    id: 'budget',
    number: '01',
    title: 'Какой у вас бюджет?',
    description:
      'Укажите максимальный комфортный бюджет.',
    options: [
      'До 1 млн ₽',
      '1–2 млн ₽',
      '2–3 млн ₽',
      '3–5 млн ₽',
      '5–10 млн ₽',
      '10+ млн ₽',
    ],
  },
  {
    id: 'condition',
    number: '02',
    title: 'Какой автомобиль вы рассматриваете?',
    description:
      'Новый или автомобиль с пробегом?',
    options: [
      'Новый',
      'Б/у до 3 лет',
      'Б/у 3–5 лет',
      'Б/у 5–10 лет',
      'Возраст не важен',
    ],
  },
  {
    id: 'body',
    number: '03',
    title: 'Какой кузов вам нравится?',
    description:
      'Можно выбрать несколько вариантов.',
    multi: true,
    options: [
      'Седан',
      'Лифтбек',
      'Кроссовер',
      'SUV',
      'Купе',
      'Хэтчбек',
      'Не имеет значения',
    ],
  },
  {
    id: 'priority',
    number: '04',
    title: 'Что для вас важнее всего?',
    description:
      'Выберите несколько приоритетов.',
    multi: true,
    options: [
      'Динамика',
      'Комфорт',
      'Надёжность',
      'Экономичность',
      'Имидж',
      'Проходимость',
      'Дешёвое обслуживание',
      'Технологичность',
    ],
  },
  {
    id: 'power',
    number: '05',
    title: 'Какую динамику вы хотите?',
    description:
      'От спокойной езды до максимальной динамики.',
    options: [
      'Спокойная',
      'Бодрая',
      'Быстрая',
      'Очень быстрая',
      'Мне нужна максимальная динамика',
    ],
  },
  {
    id: 'drive',
    number: '06',
    title: 'Какой привод предпочитаете?',
    description:
      'Можно выбрать несколько вариантов.',
    multi: true,
    options: [
      'Передний',
      'Задний',
      'Полный',
      'Не имеет значения',
    ],
  },
  {
    id: 'fuel',
    number: '07',
    title: 'Как относитесь к расходу?',
    description:
      'Насколько важна экономичность?',
    options: [
      'Очень важен низкий расход',
      'Желателен умеренный расход',
      'Расход не критичен',
      'Главное — динамика',
    ],
  },
  {
    id: 'brand',
    number: '08',
    title: 'Есть любимые марки?',
    description:
      'Выберите несколько или любую марку.',
    multi: true,
    options: [
      'BMW',
      'Mercedes-Benz',
      'Porsche',
      'Audi',
      'Toyota',
      'Lexus',
      'Porsche / BMW / Mercedes',
      'Любая марка',
    ],
  },
]

const modelImages = {
  'Lada Vesta':
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=85',

  'Hyundai Solaris':
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=85',

  'Toyota Camry':
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1600&q=85',

  'BMW':
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85',

  'Mercedes':
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85',

  'Porsche':
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1600&q=85',

  'Audi':
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=85',

  'Lexus':
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=85',
}

function findImage(name) {
  const key = Object.keys(modelImages).find(
    (item) =>
      name
        .toLowerCase()
        .includes(item.toLowerCase()),
  )

  return key
    ? modelImages[key]
    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85'
}

function cleanText(text = '') {
  return text
    .replace(/\*\*/g, '')
    .replace(/^[-•]\s*/gm, '')
    .trim()
}

function extractSection(text, title) {
  const regex = new RegExp(
    `${title}:([\\s\\S]*?)(?=\\n\\n|$)`,
    'i',
  )

  const match = text.match(regex)

  return match
    ? cleanText(match[1])
    : ''
}

function parseCars(text = '') {
  const blocks = text.split(
    /###\s*[123]\.\s+/i,
  )

  return blocks
    .slice(1, 4)
    .map((block, index) => {
      const lines =
        block.split('\n')

      const name =
        lines[0]
          ?.replace(/\*\*/g, '')
          .trim() ||
        `Автомобиль ${index + 1}`

      return {
        id: `${index}-${name}`,
        position: index + 1,
        name,
        image: findImage(name),
        why: extractSection(
          block,
          'Почему подходит',
        ),
        price:
          extractSection(
            block,
            'Ориентир актуальной цены',
          ) ||
          extractSection(
            block,
            'Цена на рынке',
          ),
        characteristics:
          extractSection(
            block,
            'Основные характеристики',
          ) ||
          extractSection(
            block,
            'Характеристики',
          ),
        pros:
          extractSection(
            block,
            'Плюсы',
          ),
        cons:
          extractSection(
            block,
            'Минусы',
          ),
        problems:
          extractSection(
            block,
            'Типичные проблемы',
          ),
        inspection:
          extractSection(
            block,
            'На что смотреть перед покупкой',
          ),
      }
    })
}

function App() {
  const [started, setStarted] =
    useState(false)

  const [step, setStep] =
    useState(0)

  const [answers, setAnswers] =
    useState({})

  const [research, setResearch] =
    useState('')

  const [tools, setTools] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const question =
    questions[step]

  const selected =
    answers[question.id] || []

  const cars = parseCars(
    research,
  )

  const selectOption = (
    option,
  ) => {
    setError('')

    if (!question.multi) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: [option],
      }))

      return
    }

    setAnswers((prev) => {
      const current =
        prev[question.id] || []

      if (
        question.id ===
          'brand' &&
        option ===
          'Любая марка'
      ) {
        return {
          ...prev,
          [question.id]:
            current.includes(
              option,
            )
              ? []
              : ['Любая марка'],
        }
      }

      if (
        question.id ===
          'brand' &&
        current.includes(
          'Любая марка',
        )
      ) {
        return {
          ...prev,
          [question.id]: [
            option,
          ],
        }
      }

      if (
        current.includes(
          option,
        )
      ) {
        return {
          ...prev,
          [question.id]:
            current.filter(
              (item) =>
                item !==
                option,
            ),
        }
      }

      return {
        ...prev,
        [question.id]: [
          ...current,
          option,
        ],
      }
    })
  }

  async function startResearch() {
    if (
      !selected.length ||
      loading
    ) {
      return
    }

    const finalAnswers = {
      ...answers,
      [question.id]:
        selected,
    }

    setAnswers(
      finalAnswers,
    )

    setLoading(true)
    setError('')
    setResearch('')
    setTools([])

    const controller =
      new AbortController()

    const timeout =
      setTimeout(() => {
        controller.abort()
      }, 60000)

    try {
      const response =
        await fetch(
          '/api/recommend',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Accept:
                'application/json',
            },
            body: JSON.stringify({
              answers:
                finalAnswers,
            }),
            signal:
              controller.signal,
          },
        )

      const raw =
        await response.text()

      let data = {}

      try {
        data = raw
          ? JSON.parse(raw)
          : {}
      } catch {
        throw new Error(
          `Некорректный ответ сервера: ${raw.slice(
            0,
            400,
          )}`,
        )
      }

      if (!response.ok) {
        const message =
          typeof data?.error ===
          'string'
            ? data.error
            : data?.error
                ?.message ||
              `API ${response.status}`

        throw new Error(
          message,
        )
      }

      if (
        !data?.answer
      ) {
        throw new Error(
          'AUREN не вернул результат исследования.',
        )
      }

      setResearch(
        data.answer,
      )

      setTools(
        Array.isArray(
          data.executed_tools,
        )
          ? data.executed_tools
          : [],
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          'Ошибка исследования.',
      )
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  function next() {
    if (
      !selected.length ||
      loading
    ) {
      return
    }

    if (
      step ===
      questions.length - 1
    ) {
      startResearch()
      return
    }

    setStep(
      (value) =>
        value + 1,
    )
  }

  function back() {
    if (loading) return

    if (step > 0) {
      setStep(
        (value) =>
          value - 1,
      )
    } else {
      setStarted(false)
    }
  }

  function reset() {
    setStarted(false)
    setStep(0)
    setAnswers({})
    setResearch('')
    setTools([])
    setError('')
    setLoading(false)
  }

  if (research) {
    return (
      <div className="drive-shell result-shell">
        <header className="topbar">
          <button
            className="logo"
            onClick={reset}
          >
            <span>
              AUREN
            </span>{' '}
            DRIVE
          </button>

          <div className="topbar-center">
            LIVE WEB RESEARCH
          </div>

          <button
            className="secondary-btn"
            onClick={reset}
          >
            Новый подбор
          </button>
        </header>

        <main className="full-results">
          <section className="results-intro">
            <div>
              <div className="eyebrow">
                AUREN DRIVE · RESULT
              </div>

              <h1>
                Машины,
                <br />
                которые реально
                <span>
                  подходят.
                </span>
              </h1>

              <p>
                Исследование выполнено
                на основе ваших
                предпочтений и актуальной
                веб-информации.
              </p>
            </div>

            <div className="request-summary">
              <span>
                ВАШ ЗАПРОС
              </span>

              <strong>
                {answers.budget?.[0] ||
                  '—'}
              </strong>

              <small>
                {answers.body?.join(
                  ' · ',
                ) ||
                  'любой кузов'}
              </small>

              <small>
                {answers.priority?.join(
                  ' · ',
                ) ||
                  'без приоритетов'}
              </small>
            </div>
          </section>

          {cars.length >
            0 && (
            <section className="cars-grid">
              {cars.map(
                (car) => (
                  <article
                    className="car-card"
                    key={
                      car.id
                    }
                  >
                    <div className="car-image">
                      <img
                        src={
                          car.image
                        }
                        alt={
                          car.name
                        }
                      />

                      <div className="rank">
                        0
                        {
                          car.position
                        }
                      </div>
                    </div>

                    <div className="car-body">
                      <div className="car-label">
                        TOP{' '}
                        {
                          car.position
                        }
                      </div>

                      <h2>
                        {
                          car.name
                        }
                      </h2>

                      {car.price && (
                        <div className="car-price">
                          {
                            car.price
                          }
                        </div>
                      )}

                      {car.why && (
                        <div className="info-section highlight">
                          <span>
                            ПОЧЕМУ
                            ПОДХОДИТ
                          </span>

                          <p>
                            {
                              car.why
                            }
                          </p>
                        </div>
                      )}

                      {car.characteristics && (
                        <div className="info-section">
                          <span>
                            ХАРАКТЕРИСТИКИ
                          </span>

                          <p>
                            {
                              car.characteristics
                            }
                          </p>
                        </div>
                      )}

                      <div className="split-info">
                        {car.pros && (
                          <div className="info-section">
                            <span>
                              ПЛЮСЫ
                            </span>

                            <p>
                              {
                                car.pros
                              }
                            </p>
                          </div>
                        )}

                        {car.cons && (
                          <div className="info-section">
                            <span>
                              МИНУСЫ
                            </span>

                            <p>
                              {
                                car.cons
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {car.problems && (
                        <div className="info-section warning">
                          <span>
                            ТИПИЧНЫЕ
                            ПРОБЛЕМЫ
                          </span>

                          <p>
                            {
                              car.problems
                            }
                          </p>
                        </div>
                      )}

                      {car.inspection && (
                        <div className="info-section">
                          <span>
                            ЧТО ПРОВЕРИТЬ
                          </span>

                          <p>
                            {
                              car.inspection
                            }
                          </p>
                        </div>
                      )}

                      <button
                        className="orange-btn"
                        onClick={() =>
                          window.open(
                            'https://www.google.com/search?q=' +
                              encodeURIComponent(
                                `${car.name} купить Россия`,
                              ),
                            '_blank',
                          )
                        }
                      >
                        Найти объявления
                        <span>
                          →
                        </span>
                      </button>
                    </div>
                  </article>
                ),
              )}
            </section>
          )}

          {cars.length ===
            0 && (
            <section className="raw-research">
              <div className="eyebrow">
                AI RESEARCH
              </div>

              <pre>
                {
                  research
                }
              </pre>
            </section>
          )}

          <section className="research-footer">
            <div>
              <div className="eyebrow">
                RESEARCH DETAILS
              </div>

              <h2>
                Что исследовал
                AUREN
              </h2>

              <p>
                AUREN использовал
                веб-поиск для
                актуального исследования
                рынка.
              </p>
            </div>

            <div className="tool-log">
              {tools.length >
              0 ? (
                tools.map(
                  (
                    tool,
                    index,
                  ) => (
                    <div
                      key={
                        index
                      }
                    >
                      <span>
                        0
                        {index +
                          1}
                      </span>

                      <strong>
                        {tool?.type ||
                          'WEB SEARCH'}
                      </strong>
                    </div>
                  ),
                )
              ) : (
                <div>
                  <span>
                    01
                  </span>

                  <strong>
                    WEB RESEARCH
                  </strong>
                </div>
              )}
            </div>
          </section>

          <button
            className="orange-btn large"
            onClick={reset}
          >
            Новый подбор →
          </button>
        </main>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="drive-shell">
        <header className="topbar">
          <button
            className="logo"
            onClick={reset}
          >
            <span>
              AUREN
            </span>{' '}
            DRIVE
          </button>

          <div className="topbar-center">
            AI CAR FINDER
          </div>
        </header>

        <main className="hero-full">
          <section className="hero-content">
            <div className="eyebrow">
              AUREN DRIVE · LIVE
            </div>

            <h1>
              Найдём автомобиль
              <br />
              под вас,
              <br />
              а не
              <span>
                наоборот.
              </span>
            </h1>

            <p>
              Расскажите о бюджете,
              стиле езды и своих
              приоритетах. AUREN
              исследует автомобильный
              рынок и сформирует
              персональную подборку.
            </p>

            <button
              className="orange-btn large"
              onClick={() =>
                setStarted(
                  true,
                )
              }
            >
              Начать подбор
              <span>
                →
              </span>
            </button>
          </section>

          <section className="hero-visual">
            <div className="hero-grid" />

            <div className="hero-circle">
              <span>
                LIVE
              </span>

              <strong>
                DRIVE
              </strong>
            </div>

            <div className="floating-stat stat-a">
              <small>
                WEB SEARCH
              </small>
              <strong>
                LIVE
              </strong>
            </div>

            <div className="floating-stat stat-b">
              <small>
                AUREN
              </small>
              <strong>
                AI
              </strong>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="drive-shell">
      <header className="topbar">
        <button
          className="logo"
          onClick={reset}
        >
          <span>
            AUREN
          </span>{' '}
          DRIVE
        </button>

        <div className="question-progress">
          <span>
            {
              question.number
            } / 08
          </span>

          <div>
            <i
              style={{
                width: `${
                  ((step + 1) /
                    8) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="quiz-full">
        <section className="quiz-main">
          <div className="eyebrow">
            {
              question.number
            } / 08
          </div>

          <h1>
            {
              question.title
            }
          </h1>

          <p className="question-description">
            {
              question.description
            }
          </p>

          <div className="option-grid-full">
            {question.options.map(
              (
                option,
                index,
              ) => {
                const active =
                  selected.includes(
                    option,
                  )

                return (
                  <button
                    key={
                      option
                    }
                    className={`full-option ${
                      active
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                  >
                    <span>
                      {String(
                        index +
                          1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>

                    <strong>
                      {
                        option
                      }
                    </strong>

                    <b>
                      {active
                        ? '✓'
                        : '→'}
                    </b>
                  </button>
                )
              },
            )}
          </div>

          {error && (
            <div className="error-box">
              <strong>
                AUREN DRIVE ERROR
              </strong>

              <p>
                {
                  error
                }
              </p>
            </div>
          )}

          {loading && (
            <div className="loading-box">
              AUREN исследует
              интернет и
              сравнивает
              автомобили...
            </div>
          )}

          <div className="quiz-actions">
            <button
              className="back-btn"
              onClick={back}
              disabled={
                loading
              }
            >
              ← Назад
            </button>

            <button
              className="orange-btn"
              onClick={next}
              disabled={
                loading ||
                !selected.length
              }
            >
              {loading
                ? 'Исследуем...'
                : step === 7
                  ? 'Запустить исследование'
                  : 'Продолжить'}

              <span>
                →
              </span>
            </button>
          </div>
        </section>

        <aside className="quiz-side">
          <div className="huge-number">
            {
              question.number
            }
          </div>

          <div>
            <div className="eyebrow">
              LIVE WEB RESEARCH
            </div>

            <p>
              На последнем
              этапе AUREN
              самостоятельно
              исследует
              актуальную
              информацию
              в интернете.
            </p>
          </div>

          <div className="mini-progress">
            {questions.map(
              (
                item,
                index,
              ) => (
                <i
                  key={
                    item.id
                  }
                  className={
                    index <=
                    step
                      ? 'active'
                      : ''
                  }
                />
              ),
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App