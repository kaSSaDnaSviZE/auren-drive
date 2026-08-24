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

function safeImage(car) {
  if (
    car?.image &&
    /^https?:\/\//i.test(car.image)
  ) {
    return car.image
  }

  return ''
}

function App() {
  const [screen, setScreen] =
    useState('home')

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

  const [queryHistory, setQueryHistory] =
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
      JSON.stringify(savedCars),
    )
  }, [savedCars])

  useEffect(() => {
    localStorage.setItem(
      'auren_history',
      JSON.stringify(queryHistory),
    )
  }, [queryHistory])

  const savedIds = useMemo(
    () =>
      new Set(
        savedCars.map(
          (car) => car.id,
        ),
      ),
    [savedCars],
  )

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

      if (current.includes(option)) {
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

  function toggleSaved(car) {
    setSavedCars((prev) => {
      const exists = prev.some(
        (item) =>
          item.id === car.id,
      )

      if (exists) {
        return prev.filter(
          (item) =>
            item.id !== car.id,
        )
      }

      return [...prev, car]
    })
  }

  function reset() {
    setScreen('home')
    setStep(0)
    setAnswers({})
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

  function begin() {
    setScreen('quiz')
    setStep(0)
    setError('')
  }

  function back() {
    if (loading) {
      return
    }

    if (step > 0) {
      setStep(
        (value) =>
          value - 1,
      )
      return
    }

    setScreen('home')
  }

  async function runResearch() {
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

    setAnswers(finalAnswers)
    setLoading(true)
    setError('')

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
            : data?.error?.message ||
                `API ${response.status}`,
        )
      }

      setCars(
        Array.isArray(data.cars)
          ? data.cars
          : [],
      )

      setBest(
        data.best || '',
      )

      setBestReason(
        data.bestReason || '',
      )

      setMarketNote(
        data.marketNote || '',
      )

      setImportant(
        data.important || '',
      )

      setSources(
        Array.isArray(
          data.sources,
        )
          ? data.sources
          : [],
      )

      setModelUsed(
        data.model || '',
      )

      setQueryHistory(
        (prev) => [
          {
            id: Date.now(),
            answers:
              finalAnswers,
            count:
              Array.isArray(
                data.cars,
              )
                ? data.cars.length
                : 0,
            createdAt:
              new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 12),
      )

      setScreen('results')

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
      clearTimeout(timeout)
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

  function shareResult() {
    const text =
      `AUREN DRIVE — мой подбор: ${
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

      return
    }

    navigator.clipboard?.writeText(
      `${text}\n${window.location.href}`,
    )
  }

  if (
    screen ===
    'home'
  ) {
    return (
      <div className="app-shell">
        <header className="nav">
          <div className="brand">
            <span>
              AUREN
            </span>{' '}
            DRIVE
          </div>

          <div className="nav-pill">
            AI CAR RESEARCH
          </div>

          <button
            className="nav-link"
            onClick={() =>
              savedCars.length
                ? setScreen(
                    'saved',
                  )
                : begin()
            }
          >
            {savedCars.length >
            0
              ? `Избранное ${savedCars.length}`
              : 'Начать'}
          </button>
        </header>

        <main className="hero">
          <section className="hero-main">
            <div className="eyebrow">
              AUREN DRIVE · LIVE
              MARKET
            </div>

            <h1>
              Машина должна
              <br />
              подходить
              <br />
              <em>
                вам.
              </em>
            </h1>

            <p className="hero-text">
              Не бесконечный список
              объявлений.
              <br />
              AUREN изучает ваши
              предпочтения,
              <br />
              исследует рынок и
              объясняет,
              <br />
              что действительно
              стоит смотреть.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={begin}
              >
                Подобрать автомобиль
                <span>
                  →
                </span>
              </button>

              {savedCars.length >
                0 && (
                <button
                  className="ghost-btn"
                  onClick={() =>
                    setScreen(
                      'saved',
                    )
                  }
                >
                  Избранное
                  <span>
                    {savedCars.length}
                  </span>
                </button>
              )}
            </div>

            <div className="trust-row">
              <span>
                ● LIVE WEB SEARCH
              </span>

              <span>
                ● НЕ СТАТИЧНАЯ БАЗА
              </span>

              <span>
                ● TOP-3 MATCH
              </span>
            </div>
          </section>

          <section className="hero-art">
            <div className="art-grid" />

            <div className="art-ring">
              <div>
                <small>
                  AUREN
                </small>

                <strong>
                  DRIVE
                </strong>
              </div>
            </div>

            <div className="art-card card-top">
              <span>
                MATCH
              </span>

              <strong>
                97%
              </strong>
            </div>

            <div className="art-card card-bottom">
              <span>
                WEB SEARCH
              </span>

              <strong>
                LIVE
              </strong>
            </div>
          </section>
        </main>

        <section className="feature-strip">
          <div>
            <span>
              01
            </span>

            <strong>
              Персональный подбор
            </strong>

            <p>
              Система учитывает не
              только бюджет, но и
              характер будущего
              владельца.
            </p>
          </div>

          <div>
            <span>
              02
            </span>

            <strong>
              Реальный рынок
            </strong>

            <p>
              AUREN использует
              актуальный веб-поиск,
              а не фиксированный
              каталог.
            </p>
          </div>

          <div>
            <span>
              03
            </span>

            <strong>
              Объяснение решения
            </strong>

            <p>
              Ты получаешь не только
              модель, но и аргументы:
              плюсы, минусы и риски.
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (
    screen ===
    'saved'
  ) {
    return (
      <div className="app-shell">
        <header className="nav">
          <button
            className="brand brand-button"
            onClick={reset}
          >
            <span>
              AUREN
            </span>{' '}
            DRIVE
          </button>

          <button
            className="nav-link"
            onClick={begin}
          >
            Новый подбор
          </button>
        </header>

        <main className="saved-page">
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
            <div className="empty-state">
              <strong>
                Здесь пока пусто.
              </strong>

              <p>
                Добавляй автомобили
                в избранное из
                результатов поиска.
              </p>

              <button
                className="primary-btn"
                onClick={begin}
              >
                Начать подбор →
              </button>
            </div>
          ) : (
            <div className="saved-grid">
              {savedCars.map(
                (car) => (
                  <article
                    className="saved-card"
                    key={
                      car.id
                    }
                  >
                    {safeImage(
                      car,
                    ) ? (
                      <img
                        src={
                          car.image
                        }
                        alt={
                          car.name
                        }
                      />
                    ) : (
                      <div className="saved-placeholder">
                        AUREN DRIVE
                      </div>
                    )}

                    <div>
                      <span>
                        TOP MATCH
                      </span>

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
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        toggleSaved(
                          car,
                        )
                      }
                    >
                      Убрать
                    </button>
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
      <div className="app-shell">
        <header className="nav">
          <button
            className="brand brand-button"
            onClick={reset}
          >
            <span>
              AUREN
            </span>{' '}
            DRIVE
          </button>

          <div className="progress-wrap">
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

        <main className="quiz">
          <section>
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

            <p>
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
              <div className="error-card">
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
              <div className="loading-card">
                <div className="loader" />

                <div>
                  <strong>
                    Исследуем рынок
                  </strong>

                  <span>
                    AUREN ищет
                    актуальные данные,
                    сравнивает варианты
                    и проверяет
                    источники…
                  </span>
                </div>
              </div>
            )}

            <div className="quiz-actions">
              <button
                className="ghost-btn"
                onClick={back}
                disabled={
                  loading
                }
              >
                ← Назад
              </button>

              <button
                className="primary-btn"
                onClick={next}
                disabled={
                  loading ||
                  !selected.length
                }
              >
                {loading
                  ? 'Исследуем…'
                  : step === 7
                    ? 'Найти автомобиль'
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
                LIVE SEARCH
              </div>

              <p>
                Чем точнее ответы,
                тем полезнее итоговый
                подбор.
              </p>
            </div>
          </aside>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell results-app">
      <header className="nav">
        <button
          className="brand brand-button"
          onClick={reset}
        >
          <span>
            AUREN
          </span>{' '}
          DRIVE
        </button>

        <div className="result-actions">
          <button
            className="ghost-btn compact"
            onClick={
              shareResult
            }
          >
            Поделиться
          </button>

          <button
            className="nav-link"
            onClick={reset}
          >
            Новый подбор
          </button>
        </div>
      </header>

      <main className="results-page">
        <section className="results-head">
          <div>
            <div className="eyebrow">
              AUREN DRIVE · RESULT
            </div>

            <h1>
              Нашли.
              <br />
              Теперь
              <em>
                {' '}
                сравниваем.
              </em>
            </h1>

            <p>
              Вот три варианта,
              которые AUREN считает
              наиболее подходящими
              под твой запрос.
            </p>
          </div>

          <div className="request-card">
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

            {modelUsed && (
              <small>
                AI: {modelUsed}
              </small>
            )}
          </div>
        </section>

        {best && (
          <section className="best-card">
            <div>
              <span className="eyebrow">
                AUREN CHOICE
              </span>

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

        <section className="car-grid">
          {cars.map(
            (
              car,
              index,
            ) => {
              const saved =
                savedIds.has(
                  car.id,
                )

              const img =
                safeImage(
                  car,
                )

              return (
                <article
                  className="car-card"
                  key={
                    car.id
                  }
                >
                  <div className="car-photo">
                    {img ? (
                      <img
                        src={
                          img
                        }
                        alt={
                          car.name
                        }
                        onError={(
                          e,
                        ) => {
                          e.currentTarget.style.display =
                            'none'
                        }}
                      />
                    ) : (
                      <div className="car-placeholder">
                        <span>
                          AUREN
                        </span>

                        <strong>
                          {
                            car.name
                          }
                        </strong>

                        <small>
                          Фото
                          источника
                          недоступно
                        </small>
                      </div>
                    )}

                    <div className="photo-gradient" />

                    <span className="rank">
                      0
                      {index +
                        1}
                    </span>

                    {car.hasRealListing && (
                      <span className="real-badge">
                        REAL LISTING
                      </span>
                    )}

                    <button
                      className={`save-btn ${
                        saved
                          ? 'saved'
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
                    <div className="card-kicker">
                      TOP{' '}
                      {index +
                        1}
                    </div>

                    <h2>
                      {
                        car.name
                      }
                    </h2>

                    <div className="price">
                      {car.price ||
                        'Цена не подтверждена'}
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
                    </div>

                    <div className="why-box">
                      <span>
                        ПОЧЕМУ ПОДХОДИТ
                      </span>

                      <p>
                        {car.why ||
                          'AUREN не получил достаточно данных для точного объяснения.'}
                      </p>
                    </div>

                    <div className="pros-cons">
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
                      <div className="info-box">
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
                      <div className="info-box">
                        <span>
                          ПЕРЕД ПОКУПКОЙ
                        </span>

                        <p>
                          {car.check}
                        </p>
                      </div>
                    )}

                    {car.bestFor && (
                      <div className="info-box">
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

                    <div className="card-buttons">
                      {car.listingUrl ? (
                        <a
                          href={
                            car.listingUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="primary-btn full"
                        >
                          Открыть объявление
                          <span>
                            ↗
                          </span>
                        </a>
                      ) : (
                        <button
                          className="primary-btn full"
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
                          href={
                            car.sourceUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="ghost-btn full"
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

        {marketNote && (
          <section className="market-card">
            <div>
              <span className="eyebrow">
                MARKET NOTE
              </span>

              <h2>
                Что заметил
                AUREN.
              </h2>
            </div>

            <p>
              {marketNote}
            </p>
          </section>
        )}

        {important && (
          <section className="important-card">
            <span className="eyebrow">
              IMPORTANT
            </span>

            <p>
              {important}
            </p>
          </section>
        )}

        {sources.length >
          0 && (
          <section className="sources-card">
            <div>
              <span className="eyebrow">
                RESEARCH SOURCES
              </span>

              <h2>
                На что опирался
                AUREN.
              </h2>
            </div>

            <div className="source-list">
              {sources
                .slice(
                  0,
                  8,
                )
                .map(
                  (
                    source,
                    index,
                  ) => (
                    <a
                      href={
                        source.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      key={
                        source.url
                      }
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

        <section className="monetization-card">
          <div>
            <span className="eyebrow">
              NEXT STEP
            </span>

            <h2>
              Хочешь,
              чтобы AUREN
              искал ещё лучше?
            </h2>

            <p>
              Следующий уровень продукта —
              конкретные объявления,
              история цен, сравнение
              вариантов и уведомления
              о новых предложениях.
            </p>
          </div>

          <div className="monetization-actions">
            <button
              className="primary-btn"
              onClick={begin}
            >
              Новый подбор
              <span>
                →
              </span>
            </button>

            <a
              className="ghost-btn"
              href="mailto:hello@auren-drive.ru"
            >
              Связаться
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App