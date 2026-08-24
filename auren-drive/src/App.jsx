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

  function choose(option) {
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

  async function research() {
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
            : data?.error
                ?.message ||
                `API ${response.status}`,
        )
      }

      if (
        !Array.isArray(
          data.cars,
        )
      ) {
        throw new Error(
          'AUREN не вернул автомобили.',
        )
      }

      setCars(
        data.cars.slice(
          0,
          3,
        ),
      )

      setBest(
        data.best || '',
      )

      setBestReason(
        data.bestReason || '',
      )
    } catch (err) {
      setError(
        err?.message ||
          'Ошибка поиска.',
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
      research()
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
      return
    }

    setStarted(false)
  }

  function reset() {
    setStarted(false)
    setStep(0)
    setAnswers({})
    setCars([])
    setBest('')
    setBestReason('')
    setError('')
    setLoading(false)
  }

  if (cars.length > 0) {
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
                AUREN DRIVE · TOP
                MATCHES
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
                актуальные данные
                и подобрал наиболее
                подходящие варианты.
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

              <strong className="best-number">
                01
              </strong>
            </section>
          )}

          <section className="car-results-grid">
            {cars.map(
              (
                car,
                index,
              ) => (
                <article
                  className="car-result-card"
                  key={
                    car.id
                  }
                >
                  <div className="car-result-image">
                    {car.photoUrl ? (
                      <img
                        src={
                          car.photoUrl
                        }
                        alt={
                          car.name
                        }
                        onError={(
                          event,
                        ) => {
                          event.currentTarget.style.display =
                            'none'
                          event.currentTarget.parentElement.classList.add(
                            'no-photo',
                          )
                        }}
                      />
                    ) : (
                      <div className="no-photo-content">
                        <span>
                          AUREN
                          DRIVE
                        </span>

                        <strong>
                          {
                            car.name
                          }
                        </strong>

                        <small>
                          Фото из
                          источника
                          не найдено
                        </small>
                      </div>
                    )}

                    <span className="rank-badge">
                      0
                      {index +
                        1}
                    </span>

                    {car.hasRealPhoto && (
                      <span className="photo-badge">
                        SOURCE PHOTO
                      </span>
                    )}
                  </div>

                  <div className="car-content">
                    <div className="card-topline">
                      TOP{' '}
                      {index +
                        1}

                      {car.hasRealListing && (
                        <span>
                          REAL
                          LISTING
                        </span>
                      )}
                    </div>

                    <h2>
                      {
                        car.name
                      }
                    </h2>

                    <div className="car-price">
                      {
                        car.price ||
                        'Цена не определена'
                      }
                    </div>

                    {car.specs && (
                      <div className="car-specs">
                        {
                          car.specs
                        }
                      </div>
                    )}

                    {car.why && (
                      <section className="info-block accent">
                        <span>
                          ПОЧЕМУ
                          ПОДХОДИТ
                        </span>

                        <p>
                          {
                            car.why
                          }
                        </p>
                      </section>
                    )}

                    <div className="two-blocks">
                      {car.pros && (
                        <section className="info-block">
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
                        <section className="info-block">
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
                      <section className="info-block">
                        <span>
                          ПРОБЛЕМЫ
                        </span>

                        <p>
                          {
                            car.problems
                          }
                        </p>
                      </section>
                    )}

                    {car.check && (
                      <section className="info-block">
                        <span>
                          ЧТО
                          ПРОВЕРИТЬ
                        </span>

                        <p>
                          {
                            car.check
                          }
                        </p>
                      </section>
                    )}

                    <div className="card-actions">
                      {car.listingUrl && (
                        <a
                          className="orange-btn"
                          href={
                            car.listingUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Реальное
                          объявление
                          <span>
                            ↗
                          </span>
                        </a>
                      )}

                      {car.sourceUrl &&
                        car.sourceUrl !==
                          car.listingUrl && (
                          <a
                            className="secondary-btn"
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

                    {!car.listingUrl && (
                      <div className="source-warning">
                        Конкретное
                        объявление не
                        найдено. AUREN
                        не создаёт
                        фиктивную ссылку.
                      </div>
                    )}
                  </div>
                </article>
              ),
            )}
          </section>

          <section className="research-note">
            <div>
              <div className="eyebrow">
                DATA POLICY
              </div>

              <h2>
                Только реальные
                <br />
                источники.
              </h2>
            </div>

            <p>
              AUREN больше не
              генерирует ссылки на
              объявления самостоятельно.
              Ссылка появляется только
              тогда, когда она пришла
              из реального результата
              веб-поиска. Фото также
              берётся со страницы
              источника, когда это
              технически возможно.
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
          <section className="hero-copy">
            <div className="eyebrow">
              AUREN DRIVE · AI CAR
              FINDER
            </div>

            <h1>
              Найдём машину
              <br />
              которая подходит
              <br />
              <span>
                именно вам.
              </span>
            </h1>

            <p>
              Бюджет, стиль езды,
              надёжность, комфорт.
              AUREN исследует рынок
              и сравнивает актуальные
              данные.
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
            <div className="hero-orbit" />

            <div className="hero-circle">
              <span>
                LIVE
              </span>

              <strong>
                DRIVE
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
          <span>AUREN</span>{' '}
          DRIVE
        </button>

        <div className="progress-wide">
          <span>
            {question.number}{' '}
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
            {question.number}{' '}
            / 08
          </div>

          <h1>
            {
              question.title
            }
          </h1>

          <p>
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
                      choose(
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
              AUREN ищет реальные
              источники и
              фотографии...
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
              onClick={
                next
              }
              disabled={
                loading ||
                !selected.length
              }
            >
              {loading
                ? 'Ищем...'
                : step === 7
                  ? 'Найти автомобили'
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
              AUREN будет
              использовать
              реальные результаты
              поиска, а не
              выдумывать
              объявления.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App