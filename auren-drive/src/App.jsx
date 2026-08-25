import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import './App.css'

const questions = [
  {
    id: 'budget',
    number: '01',
    title: 'Какой у вас бюджет?',
    description:
      'Укажите максимально комфортную сумму.',
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
    title: 'Новый или с пробегом?',
    description:
      'Возраст автомобиля тоже влияет на подбор.',
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
    title: 'Какой кузов нравится?',
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
    title: 'Что важнее всего?',
    description:
      'Можно выбрать несколько приоритетов.',
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
    title: 'Какую динамику хотите?',
    description:
      'Не всем нужен спортивный автомобиль.',
    options: [
      'Спокойная',
      'Бодрая',
      'Быстрая',
      'Очень быстрая',
      'Максимальная динамика',
    ],
  },

  {
    id: 'drive',
    number: '06',
    title: 'Какой привод предпочитаете?',
    description:
      'Можно выбрать несколько.',
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
    title: 'Насколько важен расход?',
    description:
      'Это сильно меняет итоговый подбор.',
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
      'Можно выбрать несколько или любую.',
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

function App() {
  const [screen, setScreen] =
    useState('home')

  const [step, setStep] =
    useState(0)

  const [answers, setAnswers] =
    useState({})

  const [freeText, setFreeText] =
    useState('')

  const [cars, setCars] =
    useState([])

  const [best, setBest] =
    useState('')

  const [bestReason, setBestReason] =
    useState('')

  const [marketNote, setMarketNote] =
    useState('')

  const [important, setImportant] =
    useState('')

  const [sources, setSources] =
    useState([])

  const [modelUsed, setModelUsed] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [savedCars, setSavedCars] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            'auren_saved_cars',
          ) || '[]',
        )
      } catch {
        return []
      }
    })

  const [history, setHistory] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            'auren_history',
          ) || '[]',
        )
      } catch {
        return []
      }
    })

  const question =
    questions[step]

  const selected =
    answers[question?.id] || []

  useEffect(() => {
    localStorage.setItem(
      'auren_saved_cars',
      JSON.stringify(
        savedCars,
      ),
    )
  }, [savedCars])

  useEffect(() => {
    localStorage.setItem(
      'auren_history',
      JSON.stringify(
        history,
      ),
    )
  }, [history])

  const savedIds = useMemo(
    () =>
      new Set(
        savedCars.map(
          (car) => car.id,
        ),
      ),
    [savedCars],
  )

  function begin() {
    setScreen('quiz')
    setStep(0)
    setError('')
  }

  function reset() {
    setScreen('home')
    setStep(0)
    setAnswers({})
    setFreeText('')
    setCars([])
    setBest('')
    setBestReason('')
    setMarketNote('')
    setImportant('')
    setSources([])
    setModelUsed('')
    setLoading(false)
    setError('')
  }

  function toggleOption(option) {
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
        question.id === 'brand' &&
        option === 'Любая марка'
      ) {
        return {
          ...prev,
          [question.id]:
            current.includes(option)
              ? []
              : ['Любая марка'],
        }
      }

      if (
        question.id === 'brand' &&
        current.includes('Любая марка')
      ) {
        return {
          ...prev,
          [question.id]: [option],
        }
      }

      if (
        question.id === 'body' &&
        option === 'Не имеет значения'
      ) {
        return {
          ...prev,
          [question.id]:
            current.includes(option)
              ? []
              : ['Не имеет значения'],
        }
      }

      if (
        question.id === 'body' &&
        current.includes(
          'Не имеет значения',
        )
      ) {
        return {
          ...prev,
          [question.id]: [option],
        }
      }

      if (
        current.includes(option)
      ) {
        return {
          ...prev,
          [question.id]:
            current.filter(
              (item) =>
                item !== option,
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

  function back() {
    if (loading) return

    if (step > 0) {
      setStep(
        (value) =>
          value - 1,
      )
    } else {
      setScreen('home')
    }
  }

  function toggleSaved(car) {
    setSavedCars((prev) => {
      const exists =
        prev.some(
          (item) =>
            item.id === car.id,
        )

      if (exists) {
        return prev.filter(
          (item) =>
            item.id !== car.id,
        )
      }

      return [
        ...prev,
        car,
      ]
    })
  }

  async function runResearch(
    extraProfile = {},
  ) {
    if (loading) return

    setLoading(true)
    setError('')
    setCars([])

    try {
      const profile = {
        ...answers,
        freeText:
          freeText.trim(),
        ...extraProfile,
      }

      const controller =
        new AbortController()

      const timeout =
        setTimeout(
          () =>
            controller.abort(),
          60000,
        )

      const response =
        await fetch(
          '/api/recommend',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              profile,
            }),
            signal:
              controller.signal,
          },
        )

      clearTimeout(timeout)

      const raw =
        await response.text()

      let data = {}

      try {
        data = raw
          ? JSON.parse(raw)
          : {}
      } catch {
        throw new Error(
          'Сервер вернул некорректный ответ.',
        )
      }

      if (!response.ok) {
        throw new Error(
          typeof data?.error ===
            'string'
            ? data.error
            : data?.error?.message ||
                `API ${response.status}`,
        )
      }

      const resultCars =
        Array.isArray(
          data.cars,
        )
          ? data.cars
          : []

      setCars(
        resultCars,
      )

      setBest(
        data.best || '',
      )

      setBestReason(
        data.bestReason ||
          '',
      )

      setMarketNote(
        data.marketNote ||
          '',
      )

      setImportant(
        data.important ||
          '',
      )

      setSources(
        Array.isArray(
          data.sources,
        )
          ? data.sources
          : [],
      )

      setModelUsed(
        data.model ||
          '',
      )

      setHistory(
        (prev) => [
          {
            id:
              Date.now(),
            profile,
            resultCount:
              resultCars.length,
          },
          ...prev,
        ].slice(0, 15),
      )

      setScreen(
        'results',
      )

      window.scrollTo(
        0,
        0,
      )
    } catch (err) {
      if (
        err?.name ===
        'AbortError'
      ) {
        setError(
          'Исследование заняло больше минуты. Попробуйте ещё раз.',
        )
      } else {
        setError(
          err?.message ||
            'Не удалось выполнить исследование.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  function next() {
    if (
      loading ||
      !selected.length
    ) {
      return
    }

    if (
      step ===
      questions.length - 1
    ) {
      runResearch()
      return
    }

    setStep(
      (value) =>
        value + 1,
    )

    window.scrollTo(
      0,
      0,
    )
  }

  function share() {
    const text =
      `AUREN DRIVE: ${
        cars
          .map(
            (car) =>
              car.name,
          )
          .join(', ')
      }`

    if (
      navigator.share
    ) {
      navigator.share({
        title:
          'AUREN DRIVE',
        text,
        url:
          window.location.href,
      })
    } else {
      navigator.clipboard?.writeText(
        `${text}\n${window.location.href}`,
      )
    }
  }

  if (
    screen ===
    'home'
  ) {
    return (
      <div className="app">
        <header className="nav">
          <button
            className="brand"
            onClick={reset}
          >
            <span>AUREN</span>{' '}
            DRIVE
          </button>

          <div className="nav-center">
            LIVE AI CAR RESEARCH
          </div>

          <button
            className="nav-button"
            onClick={() =>
              savedCars.length
                ? setScreen(
                    'garage',
                  )
                : begin()
            }
          >
            {savedCars.length
              ? `Garage · ${savedCars.length}`
              : 'Начать'}
          </button>
        </header>

        <main className="home">
          <section className="home-copy">
            <div className="eyebrow">
              AUREN DRIVE · LIVE
              MARKET
            </div>

            <h1>
              Найдём
              <br />
              машину
              <br />
              <em>
                именно
                <br />
                под тебя.
              </em>
            </h1>

            <p>
              AUREN анализирует
              твои требования,
              ищет актуальную
              информацию в
              интернете и
              объясняет,
              что действительно
              стоит покупать.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={begin}
              >
                Подобрать автомобиль
                <span>→</span>
              </button>

              {savedCars.length >
                0 && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    setScreen(
                      'garage',
                    )
                  }
                >
                  Garage
                </button>
              )}
            </div>

            <div className="trust">
              <span>
                ● LIVE WEB SEARCH
              </span>

              <span>
                ● REAL SOURCES
              </span>

              <span>
                ● PERSONAL MATCH
              </span>
            </div>
          </section>

          <section className="home-visual">
            <div className="grid-bg" />

            <div className="core">
              <small>
                AUREN
              </small>

              <strong>
                DRIVE
              </strong>

              <span>
                AI CAR FINDER
              </span>
            </div>

            <div className="float-card top-card">
              <span>
                MATCH
              </span>

              <strong>
                97
              </strong>
            </div>

            <div className="float-card bottom-card">
              <span>
                LIVE SEARCH
              </span>

              <strong>
                ON
              </strong>
            </div>
          </section>
        </main>

        <section className="feature-row">
          <div>
            <span>01</span>
            <strong>
              Найти
            </strong>
            <p>
              Персональный подбор
              вместо бесконечной
              ленты объявлений.
            </p>
          </div>

          <div>
            <span>02</span>
            <strong>
              Проверить
            </strong>
            <p>
              Плюсы, минусы,
              проблемы и риски
              каждой модели.
            </p>
          </div>

          <div>
            <span>03</span>
            <strong>
              Решить
            </strong>
            <p>
              AUREN объясняет,
              почему один вариант
              лучше другого.
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (
    screen ===
    'garage'
  ) {
    return (
      <div className="app">
        <header className="nav">
          <button
            className="brand"
            onClick={reset}
          >
            <span>AUREN</span>{' '}
            DRIVE
          </button>

          <button
            className="nav-button"
            onClick={begin}
          >
            Новый подбор
          </button>
        </header>

        <main className="garage">
          <div className="eyebrow">
            YOUR GARAGE
          </div>

          <h1>
            Избранные
            <br />
            автомобили.
          </h1>

          {savedCars.length ===
          0 ? (
            <div className="empty">
              <strong>
                Garage пуст.
              </strong>

              <p>
                Сохраняй понравившиеся
                автомобили из
                результатов поиска.
              </p>

              <button
                className="primary-button"
                onClick={begin}
              >
                Начать подбор →
              </button>
            </div>
          ) : (
            <div className="garage-grid">
              {savedCars.map(
                (car) => (
                  <article
                    className="garage-card"
                    key={
                      car.id
                    }
                  >
                    <div className="garage-photo">
                      {car.image ? (
                        <img
                          src={
                            car.image
                          }
                          alt={
                            car.name
                          }
                        />
                      ) : (
                        <span>
                          AUREN
                          DRIVE
                        </span>
                      )}
                    </div>

                    <div className="garage-content">
                      <small>
                        SAVED
                      </small>

                      <h2>
                        {
                          car.name
                        }
                      </h2>

                      <strong>
                        {
                          car.price ||
                          'Цена не указана'
                        }
                      </strong>

                      <button
                        className="remove-button"
                        onClick={() =>
                          toggleSaved(
                            car,
                          )
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </main>
      </div>
    )
  }

  if (
    screen ===
    'quiz'
  ) {
    return (
      <div className="app">
        <header className="nav">
          <button
            className="brand"
            onClick={reset}
          >
            <span>AUREN</span>{' '}
            DRIVE
          </button>

          <div className="progress">
            <span>
              {question.number}
              {' '}
              / 08
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

        <main className="quiz">
          <section className="quiz-main">
            <div className="eyebrow">
              {question.number}
              {' '}
              / 08
            </div>

            <h1>
              {
                question.title
              }
            </h1>

            <p className="quiz-description">
              {
                question.description
              }
            </p>

            <div className="options">
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
                      className={`option ${
                        active
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        toggleOption(
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
              <div className="error">
                <strong>
                  AUREN ERROR
                </strong>

                <p>
                  {
                    error
                  }
                </p>
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spinner" />

                <div>
                  <strong>
                    Исследуем рынок
                  </strong>

                  <span>
                    Ищем автомобили,
                    проверяем данные
                    и сравниваем
                    варианты…
                  </span>
                </div>
              </div>
            )}

            <div className="quiz-actions">
              <button
                className="secondary-button"
                onClick={back}
                disabled={
                  loading
                }
              >
                ← Назад
              </button>

              <button
                className="primary-button"
                onClick={next}
                disabled={
                  loading ||
                  !selected.length
                }
              >
                {loading
                  ? 'Исследуем…'
                  : step ===
                      7
                    ? 'Найти автомобиль'
                    : 'Продолжить'}

                <span>
                  →
                </span>
              </button>
            </div>
          </section>

          <aside className="quiz-aside">
            <strong>
              {
                question.number
              }
            </strong>

            <div>
              <div className="eyebrow">
                LIVE SEARCH
              </div>

              <p>
                Ответы помогут
                AUREN точнее
                понять твой сценарий
                покупки.
              </p>
            </div>
          </aside>
        </main>
      </div>
    )
  }

  return (
    <div className="app results-app">
      <header className="nav">
        <button
          className="brand"
          onClick={reset}
        >
          <span>AUREN</span>{' '}
          DRIVE
        </button>

        <div className="results-nav">
          <button
            className="secondary-button"
            onClick={share}
          >
            Поделиться
          </button>

          <button
            className="nav-button"
            onClick={reset}
          >
            Новый подбор
          </button>
        </div>
      </header>

      <main className="results">
        <section className="results-head">
          <div>
            <div className="eyebrow">
              AUREN DRIVE · TOP
              MATCHES
            </div>

            <h1>
              Вот что
              <br />
              стоит
              <br />
              <em>
                посмотреть.
              </em>
            </h1>

            <p>
              AUREN изучил твой
              профиль и актуальную
              информацию рынка.
            </p>
          </div>

          <div className="brief">
            <span>
              YOUR BRIEF
            </span>

            <strong>
              {answers.budget?.[0] ||
                '—'}
            </strong>

            <small>
              {answers.body?.join(
                ' · ',
              ) ||
                'Любой кузов'}
            </small>

            <small>
              {answers.priority?.join(
                ' · ',
              ) ||
                'Любые приоритеты'}
            </small>

            {freeText && (
              <small>
                «
                {
                  freeText
                }
                »
              </small>
            )}
          </div>
        </section>

        {best && (
          <section className="best">
            <div>
              <div className="eyebrow">
                AUREN CHOICE
              </div>

              <h2>
                {best}
              </h2>

              <p>
                {bestReason}
              </p>
            </div>

            <strong>
              01
            </strong>
          </section>
        )}

        {cars.length === 0 ? (
          <section className="no-results">
            <strong>
              Не удалось получить
              полноценный TOP-3.
            </strong>

            <p>
              Попробуй повторить
              исследование с
              немного более широкими
              параметрами.
            </p>

            <button
              className="primary-button"
              onClick={reset}
            >
              Попробовать снова →
            </button>
          </section>
        ) : (
          <section className="cars">
            {cars
              .slice(0, 3)
              .map(
                (
                  car,
                  index,
                ) => {
                  const saved =
                    savedIds.has(
                      car.id,
                    )

                  return (
                    <article
                      className="car"
                      key={
                        car.id
                      }
                    >
                      <div className="car-image">
                        {car.image ? (
                          <img
                            src={
                              car.image
                            }
                            alt={
                              car.name
                            }
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                'none'
                            }}
                          />
                        ) : (
                          <div className="no-image">
                            <span>
                              AUREN
                            </span>

                            <strong>
                              {
                                car.name
                              }
                            </strong>

                            <small>
                              Реальное фото
                              источника
                              недоступно
                            </small>
                          </div>
                        )}

                        <div className="image-gradient" />

                        <span className="rank">
                          0
                          {index +
                            1}
                        </span>

                        {car.hasRealListing && (
                          <span className="real">
                            REAL LISTING
                          </span>
                        )}

                        <button
                          className={`save ${
                            saved
                              ? 'active'
                              : ''
                          }`}
                          onClick={() =>
                            toggleSaved(
                              car,
                            )
                          }
                        >
                          {saved
                            ? '♥'
                            : '♡'}
                        </button>
                      </div>

                      <div className="car-content">
                        <small className="top-label">
                          TOP{' '}
                          {index +
                            1}
                        </small>

                        <h2>
                          {
                            car.name
                          }
                        </h2>

                        <div className="car-price">
                          {
                            car.price ||
                            'Цена не подтверждена'
                          }
                        </div>

                        <div className="chips">
                          {car.year && (
                            <span>
                              {
                                car.year
                              }
                            </span>
                          )}

                          {car.body && (
                            <span>
                              {
                                car.body
                              }
                            </span>
                          )}

                          {car.power && (
                            <span>
                              {
                                car.power
                              }
                            </span>
                          )}

                          {car.drive && (
                            <span>
                              {
                                car.drive
                              }
                            </span>
                          )}

                          {car.mileage && (
                            <span>
                              {
                                car.mileage
                              }
                            </span>
                          )}
                        </div>

                        <div className="why">
                          <span>
                            ПОЧЕМУ ПОДХОДИТ
                          </span>

                          <p>
                            {
                              car.why
                            }
                          </p>
                        </div>

                        <div className="two-column">
                          <div>
                            <span>
                              ПЛЮСЫ
                            </span>

                            <p>
                              {
                                car.pros
                              }
                            </p>
                          </div>

                          <div>
                            <span>
                              МИНУСЫ
                            </span>

                            <p>
                              {
                                car.cons
                              }
                            </p>
                          </div>
                        </div>

                        {car.problems && (
                          <div className="info">
                            <span>
                              ТИПИЧНЫЕ ПРОБЛЕМЫ
                            </span>

                            <p>
                              {
                                car.problems
                              }
                            </p>
                          </div>
                        )}

                        {car.check && (
                          <div className="info">
                            <span>
                              ЧТО ПРОВЕРИТЬ
                            </span>

                            <p>
                              {
                                car.check
                              }
                            </p>
                          </div>
                        )}

                        {car.bestFor && (
                          <div className="info">
                            <span>
                              КОМУ ПОДХОДИТ
                            </span>

                            <p>
                              {
                                car.bestFor
                              }
                            </p>
                          </div>
                        )}

                        <div className="car-buttons">
                          {car.listingUrl ? (
                            <a
                              className="primary-button full"
                              href={
                                car.listingUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Открыть объявление
                              <span>
                                ↗
                              </span>
                            </a>
                          ) : (
                            <button
                              className="primary-button full"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/search?q=${encodeURIComponent(
                                    `${car.name} купить Россия`,
                                  )}`,
                                  '_blank',
                                )
                              }
                            >
                              Найти объявления
                              <span>
                                ↗
                              </span>
                            </button>
                          )}

                          {car.sourceUrl && (
                            <a
                              className="secondary-button full"
                              href={
                                car.sourceUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Источник
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                },
              )}
          </section>
        )}

        {marketNote && (
          <section className="market-note">
            <div>
              <div className="eyebrow">
                MARKET NOTE
              </div>

              <h2>
                Что заметил AUREN.
              </h2>
            </div>

            <p>
              {marketNote}
            </p>
          </section>
        )}

        {important && (
          <section className="important">
            <div className="eyebrow">
              IMPORTANT
            </div>

            <p>
              {important}
            </p>
          </section>
        )}

        {sources.length >
          0 && (
          <section className="sources">
            <div>
              <div className="eyebrow">
                RESEARCH SOURCES
              </div>

              <h2>
                Источники
                исследования.
              </h2>
            </div>

            <div className="source-list">
              {sources
                .slice(0, 8)
                .map(
                  (
                    source,
                    index,
                  ) => (
                    <a
                      key={
                        source.url
                      }
                      href={
                        source.url
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        0
                        {index +
                          1}
                      </span>

                      <strong>
                        {
                          source.title ||
                          source.url
                        }
                      </strong>

                      <b>
                        ↗
                      </b>
                    </a>
                  ),
                )}
            </div>
          </section>
        )}

        <section className="next-level">
          <div>
            <div className="eyebrow">
              AUREN NEXT
            </div>

            <h2>
              Следующий шаг —
              <br />
              проверить конкретное
              <br />
              объявление.
            </h2>

            <p>
              В следующей итерации сюда
              подключим полноценную проверку
              объявления, сравнение машин,
              историю цены и мониторинг.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={reset}
          >
            Новый подбор
            <span>
              →
            </span>
          </button>
        </section>
      </main>
    </div>
  )
}

export default App