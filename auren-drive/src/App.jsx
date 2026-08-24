import { useState } from 'react'
import './App.css'

const questions = [
  {
    id: 'budget',
    number: '01',
    title: 'Какой у вас бюджет?',
    description: 'Укажите максимальный комфортный бюджет на покупку.',
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
    description: 'Новый или автомобиль с пробегом?',
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
    description: 'Можно выбрать несколько вариантов.',
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
    description: 'Выберите один или несколько приоритетов.',
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
    description: 'От спокойной езды до настоящего performance.',
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
    description: 'Можно выбрать несколько вариантов.',
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
    description: 'Это поможет точнее определить характер автомобиля.',
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
    description: 'Выберите несколько или любую марку.',
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
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [noMatches, setNoMatches] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const question = questions[step]
  const selected = answers[question.id] || []

  const choose = (option) => {
    setError('')

    if (!question.multi) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: [option],
      }))
      return
    }

    setAnswers((prev) => {
      const current = prev[question.id] || []

      if (question.id === 'brand') {
        if (option === 'Любая марка') {
          return {
            ...prev,
            [question.id]: current.includes(option)
              ? []
              : ['Любая марка'],
          }
        }

        if (current.includes('Любая марка')) {
          return {
            ...prev,
            [question.id]: [option],
          }
        }
      }

      if (current.includes(option)) {
        return {
          ...prev,
          [question.id]: current.filter(
            (item) => item !== option,
          ),
        }
      }

      return {
        ...prev,
        [question.id]: [...current, option],
      }
    })
  }

  const submit = async () => {
    if (!selected.length || loading) {
      return
    }

    const finalAnswers = {
      ...answers,
      [question.id]: selected,
    }

    setAnswers(finalAnswers)
    setLoading(true)
    setError('')
    setResults([])
    setNoMatches(false)
    setMessage('')

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 15000)

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          answers: finalAnswers,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()

      let data = {}

      try {
        data = rawText ? JSON.parse(rawText) : {}
      } catch {
        throw new Error(
          `Сервер вернул некорректный ответ: ${rawText.slice(
            0,
            300,
          )}`,
        )
      }

      if (!response.ok) {
        throw new Error(
          data?.error || `API ошибка ${response.status}`,
        )
      }

      if (!Array.isArray(data.recommendations)) {
        throw new Error(
          'API не вернул массив рекомендаций',
        )
      }

      setResults(data.recommendations)
      setNoMatches(Boolean(data.noMatches))
      setMessage(data.message || '')
    } catch (err) {
      console.error('AUREN DRIVE ERROR:', err)

      if (err?.name === 'AbortError') {
        setError(
          'Сервер не ответил за 15 секунд. Проверьте Vercel → Logs.',
        )
      } else {
        setError(
          err?.message ||
            'Не удалось получить рекомендации.',
        )
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const next = () => {
    if (!selected.length || loading) {
      return
    }

    if (step === questions.length - 1) {
      submit()
      return
    }

    setStep((value) => value + 1)
  }

  const back = () => {
    if (loading) return

    if (step > 0) {
      setStep((value) => value - 1)
      return
    }

    setStarted(false)
  }

  const reset = () => {
    setStarted(false)
    setStep(0)
    setAnswers({})
    setResults([])
    setNoMatches(false)
    setMessage('')
    setLoading(false)
    setError('')
  }

  if (results.length > 0 || noMatches) {
    return (
      <div className="drive-app">
        <header className="drive-header">
          <button className="drive-logo" onClick={reset}>
            <span>AUREN</span> DRIVE
          </button>

          <button
            className="restart-button"
            onClick={reset}
          >
            Новый подбор
          </button>
        </header>

        <main className="results-page">
          <div className="results-heading">
            <div>
              <div className="landing-eyebrow">
                AUREN AI · RESULT
              </div>

              <h1>
                Ваши лучшие
                <br />
                варианты.
              </h1>

              <p>
                Подбор сформирован на основе
                ваших требований.
              </p>
            </div>

            <div className="profile-panel">
              <div>
                <span>БЮДЖЕТ</span>
                <strong>
                  {answers.budget?.[0] || '—'}
                </strong>
              </div>

              <div>
                <span>КУЗОВ</span>
                <strong>
                  {answers.body?.join(', ') || 'Любой'}
                </strong>
              </div>

              <div>
                <span>ПРИОРИТЕТЫ</span>
                <strong>
                  {answers.priority?.join(', ') || '—'}
                </strong>
              </div>
            </div>
          </div>

          {noMatches && (
            <section className="no-results">
              <div className="no-results-number">
                00
              </div>

              <div>
                <div className="landing-eyebrow">
                  NO MATCH
                </div>

                <h2>
                  Подходящих вариантов
                  <br />
                  сейчас нет.
                </h2>

                <p>
                  {message ||
                    'В текущей демонстрационной базе нет подходящих автомобилей. Попробуйте изменить параметры.'}
                </p>
              </div>

              <button
                className="drive-primary"
                onClick={reset}
              >
                Изменить параметры →
              </button>
            </section>
          )}

          {results.length > 0 && (
            <div className="results-grid">
              {results.map((car, index) => (
                <article
                  className="result-card"
                  key={car.id || `${car.name}-${index}`}
                >
                  <div className="result-card-top">
                    <span className="result-index">
                      0{index + 1}
                    </span>

                    <span className="match-badge">
                      {car.match_score ?? 0}% MATCH
                    </span>
                  </div>

                  <div className="result-image">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                      />
                    ) : (
                      <div className="image-placeholder">
                        AUREN DRIVE
                      </div>
                    )}
                  </div>

                  <div className="result-content">
                    <div className="result-meta">
                      <span>{car.body}</span>
                      <span>{car.drive}</span>
                      <span>{car.power}</span>
                    </div>

                    <h2>{car.name}</h2>

                    <div className="result-price">
                      {car.price}
                    </div>

                    <p className="result-why">
                      {car.why}
                    </p>

                    <div className="result-columns">
                      <div>
                        <h4>Плюсы</h4>

                        <ul>
                          {(car.pros || []).map((item) => (
                            <li key={item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4>Минусы</h4>

                        <ul>
                          {(car.cons || []).map((item) => (
                            <li key={item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="buying-focus">
                      <span>НА ЧТО СМОТРЕТЬ</span>

                      <p>
                        {car.buying_focus ||
                          'Проверьте историю обслуживания и техническое состояние автомобиля.'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="results-disclaimer">
            <span>DEMO DATABASE</span>

            <p>
              Текущая версия использует демонстрационную
              базу моделей. Цены не являются актуальными
              ценами реальных объявлений.
            </p>
          </div>

          <button
            className="drive-primary results-reset"
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
      <div className="drive-app">
        <header className="drive-header">
          <button className="drive-logo" onClick={reset}>
            <span>AUREN</span> DRIVE
          </button>

          <div className="drive-header-label">
            AI CAR FINDER
          </div>
        </header>

        <main className="drive-landing">
          <div className="landing-copy">
            <div className="landing-eyebrow">
              AUREN DRIVE · AI CAR FINDER
            </div>

            <h1>
              Найдём автомобиль,
              <br />
              который подходит
              <span> именно вам.</span>
            </h1>

            <p>
              Расскажите о бюджете, предпочтениях
              и стиле езды. AUREN проанализирует
              требования и подберёт подходящие
              варианты.
            </p>

            <button
              className="drive-primary"
              onClick={() => setStarted(true)}
            >
              Начать подбор
              <span>→</span>
            </button>
          </div>

          <div className="landing-visual">
            <div className="visual-grid" />

            <div className="landing-ring">
              <div className="ring-inner">
                <span>AI</span>
                <strong>DRIVE</strong>
              </div>
            </div>

            <div className="floating-card card-one">
              <small>AUREN SCORE</small>
              <strong>94</strong>
            </div>

            <div className="floating-card card-two">
              <small>AI MATCH</small>
              <strong>97%</strong>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="drive-app">
      <header className="drive-header">
        <button className="drive-logo" onClick={reset}>
          <span>AUREN</span> DRIVE
        </button>

        <div className="progress-wrap">
          <span>
            {question.number} / 08
          </span>

          <div className="progress-bar">
            <div
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

      <main className="question-page">
        <section className="question-content">
          <div className="landing-eyebrow">
            {question.number} / 08
          </div>

          <h1>{question.title}</h1>

          <p>{question.description}</p>

          <div className="options-grid">
            {question.options.map((option, index) => {
              const selectedOption =
                selected.includes(option)

              return (
                <button
                  key={option}
                  className={`option-card ${
                    selectedOption ? 'selected' : ''
                  }`}
                  onClick={() => choose(option)}
                >
                  <span className="option-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <strong>{option}</strong>

                  <span>
                    {selectedOption ? '✓' : '→'}
                  </span>
                </button>
              )
            })}
          </div>

          {error && (
            <div className="ai-error">
              <strong>AUREN DRIVE ERROR</strong>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="ai-processing">
              AUREN анализирует параметры автомобиля...
            </div>
          )}

          <div className="question-actions">
            <button
              className="back-button"
              disabled={step === 0 || loading}
              onClick={back}
            >
              ← Назад
            </button>

            <button
              className="drive-primary"
              disabled={!selected.length || loading}
              onClick={next}
            >
              {loading
                ? 'Анализируем...'
                : step === questions.length - 1
                  ? 'Получить рекомендации'
                  : 'Продолжить'}

              <span>→</span>
            </button>
          </div>
        </section>

        <aside className="question-side">
          <span className="side-label">
            AUREN DRIVE
          </span>

          <strong className="side-big-number">
            {question.number}
          </strong>

          <p>
            Чем точнее ответы,
            тем точнее итоговый подбор.
          </p>

          <div className="side-progress">
            {questions.map((item, index) => (
              <span
                key={item.id}
                className={
                  index <= step ? 'active' : ''
                }
              />
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App