import { useState } from 'react'
import './App.css'

const questions = [
  {
    id: 'budget',
    title: 'Какой у вас бюджет?',
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
    title: 'Какой автомобиль вы рассматриваете?',
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
    title: 'Какой кузов вам нравится?',
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
    title: 'Что для вас важнее всего?',
    multi: true,
    options: [
      'Динамика',
      'Комфорт',
      'Надёжность',
      'Экономичность',
      'Имидж',
      'Проходимость',
      'Дешёвое обслуживание',
    ],
  },
  {
    id: 'power',
    title: 'Какую динамику вы хотите?',
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
    title: 'Какой привод предпочитаете?',
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
    title: 'Как относитесь к расходу?',
    options: [
      'Очень важен низкий расход',
      'Желателен умеренный расход',
      'Расход не критичен',
      'Главное — динамика',
    ],
  },
  {
    id: 'brand',
    title: 'Есть любимые марки?',
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
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
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

  const next = async () => {
    if (!selected.length || loading) {
      return
    }

    const newAnswers = {
      ...answers,
      [question.id]: selected,
    }

    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      setStep((value) => value + 1)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: newAnswers,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(
          `API ${response.status}: ${text}`,
        )
      }

      const data = await response.json()

      if (
        !Array.isArray(data.recommendations) ||
        data.recommendations.length === 0
      ) {
        throw new Error(
          'API не вернул рекомендации',
        )
      }

      setResults(data.recommendations)
    } catch (err) {
      console.error('AUREN DRIVE:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    if (loading) return

    if (step > 0) {
      setStep((value) => value - 1)
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setResults(null)
    setError('')
  }

  if (results) {
    return (
      <div className="drive-app">
        <header className="drive-header">
          <div className="drive-logo">
            <span>AUREN</span> DRIVE
          </div>

          <button
            className="restart-button"
            onClick={restart}
          >
            Новый подбор
          </button>
        </header>

        <main className="results-page">
          <div className="landing-eyebrow">
            AUREN AI · RESULT
          </div>

          <h1>
            Ваши лучшие
            <br />
            варианты.
          </h1>

          <div className="results-list">
            {results.map((car, index) => (
              <article
                className="result-card"
                key={car.id || car.name}
              >
                <div className="result-image">
                  {car.image && (
                    <img
                      src={car.image}
                      alt={car.name}
                    />
                  )}

                  <div className="match-badge">
                    {car.match_score ?? car.score ?? 0}
                    % MATCH
                  </div>
                </div>

                <div className="result-content">
                  <div className="result-meta">
                    <span>
                      0{index + 1}
                    </span>

                    <span>
                      {car.body}
                    </span>

                    <span>
                      {car.drive}
                    </span>

                    <span>
                      {car.power}
                    </span>
                  </div>

                  <h2>{car.name}</h2>

                  <p className="result-price">
                    {car.price}
                  </p>

                  <p className="result-why">
                    {car.why}
                  </p>

                  <div className="result-columns">
                    <div>
                      <h4>Плюсы</h4>

                      <ul>
                        {(car.pros || []).map(
                          (item) => (
                            <li key={item}>
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4>Минусы</h4>

                      <ul>
                        {(car.cons || []).map(
                          (item) => (
                            <li key={item}>
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="buying-focus">
                    <span>
                      НА ЧТО СМОТРЕТЬ
                    </span>

                    <p>
                      {car.buying_focus}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            className="drive-primary"
            onClick={restart}
          >
            Новый подбор →
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="drive-app">
      <header className="drive-header">
        <div className="drive-logo">
          <span>AUREN</span> DRIVE
        </div>

        <div className="progress-wrap">
          <span>
            {String(step + 1).padStart(2, '0')} / 08
          </span>

          <div className="progress-bar">
            <div
              style={{
                width: `${((step + 1) / 8) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="question-page">
        <section className="question-content">
          <div className="landing-eyebrow">
            AUREN DRIVE
          </div>

          <h1>{question.title}</h1>

          <div className="options-grid">
            {question.options.map(
              (option) => {
                const isSelected =
                  selected.includes(option)

                return (
                  <button
                    key={option}
                    className={`option-card ${
                      isSelected
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      choose(option)
                    }
                  >
                    <strong>
                      {option}
                    </strong>

                    <span>
                      {isSelected
                        ? '✓'
                        : '→'}
                    </span>
                  </button>
                )
              },
            )}
          </div>

          {error && (
            <div className="ai-error">
              <strong>
                AUREN DRIVE ERROR
              </strong>

              <p>{error}</p>

              <small>
                Проверьте Vercel → Logs.
              </small>
            </div>
          )}

          {loading && (
            <div className="ai-processing">
              AUREN анализирует ваши
              предпочтения...
            </div>
          )}

          <div className="question-actions">
            <button
              className="back-button"
              onClick={back}
              disabled={
                step === 0 || loading
              }
            >
              ← Назад
            </button>

            <button
              className="drive-primary"
              onClick={next}
              disabled={
                !selected.length ||
                loading
              }
            >
              {loading
                ? 'Анализируем...'
                : step ===
                    questions.length - 1
                  ? 'Получить рекомендации'
                  : 'Продолжить'}

              <span>→</span>
            </button>
          </div>
        </section>

        <aside className="question-side">
          <div className="side-label">
            AI VEHICLE MATCHING
          </div>

          <div className="side-big-number">
            {String(step + 1).padStart(2, '0')}
          </div>

          <p>
            Ответьте на несколько вопросов,
            и AUREN подберёт подходящие
            автомобили.
          </p>
        </aside>
      </main>
    </div>
  )
}

export default App