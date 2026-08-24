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
    title: 'Новый или б/у?',
    description:
      'Какой возраст автомобиля рассматриваете?',
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
      'Можно выбрать несколько.',
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
      'Можно выбрать несколько.',
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
      'От спокойной езды до максимальной.',
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
      'Можно выбрать несколько.',
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

const fallbackImages = {
  BMW:
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1800&q=88',
  Mercedes:
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1800&q=88',
  Porsche:
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1800&q=88',
  Audi:
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=88',
  Toyota:
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1800&q=88',
  Lexus:
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=88',
  default:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=88',
}

function imageForCar(car) {
  if (
    car.photoUrl &&
    /^https?:\/\//i.test(
      car.photoUrl,
    )
  ) {
    return car.photoUrl
  }

  const brand =
    Object.keys(fallbackImages).find(
      (item) =>
        item !== 'default' &&
        car.name
          ?.toLowerCase()
          .includes(
            item.toLowerCase(),
          ),
    )

  return (
    fallbackImages[brand] ||
    fallbackImages.default
  )
}

function validUrl(value) {
  return (
    typeof value === 'string' &&
    /^https?:\/\//i.test(value)
  )
}

function App() {
  const [started, setStarted] =
    useState(false)
  const [step, setStep] =
    useState(0)
  const [answers, setAnswers] =
    useState({})
  const [cars, setCars] =
    useState([])
  const [best, setBest] =
    useState('')
  const [bestReason, setBestReason] =
    useState('')
  const [loading, setLoading] =
    useState(false)
  const [error, setError] =
    useState('')

  const question =
    questions[step]

  const selected =
    answers[question.id] || []

  const selectOption = (option) => {
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
        current.includes(
          'Любая марка',
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

  const runResearch = async () => {
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
    setCars([])
    setBest('')
    setBestReason('')

    const controller =
      new AbortController()

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        60000,
      )

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

      if (
        !Array.isArray(
          data.cars,
        )
      ) {
        throw new Error(
          'AUREN не вернул список автомобилей.',
        )
      }

      setCars(data.cars)
      setBest(
        data.best || '',
      )
      setBestReason(
        data.bestReason || '',
      )
    } catch (err) {
      if (
        err?.name ===
        'AbortError'
      ) {
        setError(
          'Поиск занял больше 60 секунд.',
        )
      } else {
        setError(
          err?.message ||
            'Не удалось выполнить поиск.',
        )
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const next = () => {
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
      runResearch()
      return
    }

    setStep(
      (value) =>
        value + 1,
    )
  }

  const back = () => {
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

  const reset = () => {
    setStarted(false)
    setStep(0)
    setAnswers({})
    setCars([])
    setBest('')
    setBestReason('')
    setLoading(false)
    setError('')
  }

  if (cars.length > 0) {
    return (
      <div className="drive-shell results-mode">
        <header className="topbar">
          <button
            className="logo"
            onClick={reset}
          >
            <span>AUREN</span>{' '}
            DRIVE
          </button>

          <div className="live-indicator">
            <i />
            LIVE MARKET RESEARCH
          </div>

          <button
            className="secondary-btn"
            onClick={reset}
          >
            Новый подбор
          </button>
        </header>

        <main className="results-page">
          <section className="results-hero">
            <div>
              <div className="eyebrow">
                AUREN DRIVE · TOP MATCHES
              </div>

              <h1>
                Вот что
                <br />
                подходит
                <span>
                  {' '}
                  вам.
                </span>
              </h1>

              <p>
                AUREN исследовал
                актуальную информацию
                и сформировал
                персональный TOP-3.
              </p>
            </div>

            <div className="profile-box">
              <span>
                YOUR REQUEST
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
                  'Без приоритетов'}
              </small>
            </div>
          </section>

          {best && (
            <section className="best-banner">
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

              <div className="best-score">
                <span>
                  TOP
                </span>
                <strong>
                  01
                </strong>
              </div>
            </section>
          )}

          <section className="car-results-grid">
            {cars
              .slice(0, 3)
              .map((car, index) => (
                <article
                  className="car-result-card"
                  key={
                    car.id ||
                    `${car.name}-${index}`
                  }
                >
                  <div className="car-result-image">
                    <img
                      src={imageForCar(
                        car,
                      )}
                      alt={car.name}
                      onError={(
                        event,
                      ) => {
                        event.currentTarget.src =
                          fallbackImages.default
                      }}
                    />

                    <div className="image-shade" />

                    <span className="card-rank">
                      0
                      {index + 1}
                    </span>

                    <span className="verified-tag">
                      AI MATCH
                    </span>
                  </div>

                  <div className="car-result-content">
                    <div className="result-overline">
                      TOP{' '}
                      {index + 1}
                    </div>

                    <h2>
                      {car.name}
                    </h2>

                    {car.price && (
                      <div className="result-big-price">
                        {car.price}
                      </div>
                    )}

                    {car.specs && (
                      <div className="spec-line">
                        {car.specs}
                      </div>
                    )}

                    {car.why && (
                      <section className="result-block highlight">
                        <span>
                          ПОЧЕМУ ПОДХОДИТ
                        </span>

                        <p>
                          {
                            car.why
                          }
                        </p>
                      </section>
                    )}

                    <div className="two-column-blocks">
                      {car.pros && (
                        <section className="result-block">
                          <span>
                            ПЛЮСЫ
                          </span>

                          <p>
                            {
                              car.pros
                            }
                          </p>
                        </section>
                      )}

                      {car.cons && (
                        <section className="result-block">
                          <span>
                            МИНУСЫ
                          </span>

                          <p>
                            {
                              car.cons
                            }
                          </p>
                        </section>
                      )}
                    </div>

                    {car.problems && (
                      <section className="result-block warning-block">
                        <span>
                          ТИПИЧНЫЕ ПРОБЛЕМЫ
                        </span>

                        <p>
                          {
                            car.problems
                          }
                        </p>
                      </section>
                    )}

                    {car.check && (
                      <section className="result-block">
                        <span>
                          ЧТО ПРОВЕРИТЬ
                        </span>

                        <p>
                          {
                            car.check
                          }
                        </p>
                      </section>
                    )}

                    <div className="card-actions">
                      {validUrl(
                        car.listingUrl,
                      ) && (
                        <a
                          href={
                            car.listingUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="orange-btn card-btn"
                        >
                          Открыть объявление
                          <span>
                            ↗
                          </span>
                        </a>
                      )}

                      {validUrl(
                        car.sourceUrl,
                      ) && (
                        <a
                          href={
                            car.sourceUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="secondary-btn card-source"
                        >
                          Источник
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
          </section>

          <section className="research-note">
            <div>
              <div className="eyebrow">
                AUREN RESEARCH
              </div>

              <h2>
                Живой поиск,
                <br />
                а не статичная база.
              </h2>
            </div>

            <p>
              Фото, цены и ссылки
              отображаются только
              при наличии данных
              в найденных источниках.
              Если конкретное фото
              или объявление не было
              найдено, AUREN не
              выдумывает его.
            </p>
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
            <span>AUREN</span>{' '}
            DRIVE
          </button>

          <div className="live-indicator">
            <i />
            LIVE WEB AI
          </div>
        </header>

        <main className="hero-screen">
          <div className="hero-copy">
            <div className="eyebrow">
              AUREN DRIVE · AI CAR FINDER
            </div>

            <h1>
              Не знаете,
              <br />
              какую машину
              <br />
              <span>
                купить?
              </span>
            </h1>

            <p>
              Расскажите о бюджете,
              предпочтениях и
              стиле езды. AUREN
              исследует рынок
              и подбирает варианты
              специально под вас.
            </p>

            <button
              className="orange-btn large"
              onClick={() =>
                setStarted(true)
              }
            >
              Начать подбор
              <span>
                →
              </span>
            </button>
          </div>

          <div className="hero-orbit">
            <div className="orbit-grid" />

            <div className="orbit-circle">
              <span>
                AUREN
              </span>

              <strong>
                DRIVE
              </strong>
            </div>

            <div className="orbit-card orbit-one">
              <small>
                WEB SEARCH
              </small>

              <strong>
                LIVE
              </strong>
            </div>

            <div className="orbit-card orbit-two">
              <small>
                MATCH
              </small>

              <strong>
                97%
              </strong>
            </div>
          </div>
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
          <span>AUREN</span>{' '}
          DRIVE
        </button>

        <div className="progress-wide">
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
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="quiz-screen">
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

          <div className="full-option-grid">
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
                    className={`big-option ${
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
              интернет...
            </div>
          )}

          <div className="quiz-footer-actions">
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
              onClick={
                next
              }
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

        <aside className="quiz-aside">
          <div className="giant-step">
            {
              question.number
            }
          </div>

          <div>
            <div className="eyebrow">
              LIVE WEB RESEARCH
            </div>

            <p>
              Последний этап
              запустит реальный
              веб-поиск.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App