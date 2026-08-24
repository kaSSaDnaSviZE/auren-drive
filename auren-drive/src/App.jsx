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

function App() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [answer, setAnswer] = useState('')
  const [executedTools, setExecutedTools] =
    useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const question = questions[step]
  const selected = answers[question.id] || []

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

  const runResearch = async () => {
    if (
      !selected.length ||
      loading
    ) {
      return
    }

    const finalAnswers = {
      ...answers,
      [question.id]: selected,
    }

    setAnswers(finalAnswers)
    setLoading(true)
    setError('')
    setAnswer('')
    setExecutedTools([])

    const controller =
      new AbortController()

    const timeout = setTimeout(
      () => {
        controller.abort()
      },
      60000,
    )

    try {
      const response =
        await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Accept:
              'application/json',
          },
          body: JSON.stringify({
            answers: finalAnswers,
          }),
          signal:
            controller.signal,
        })

      const raw =
        await response.text()

      let data = {}

      try {
        data = raw
          ? JSON.parse(raw)
          : {}
      } catch {
        throw new Error(
          `Сервер вернул некорректный ответ:\n${raw.slice(
            0,
            500,
          )}`,
        )
      }

      if (!response.ok) {
        const apiError =
          typeof data?.error === 'string'
            ? data.error
            : data?.error?.message ||
              JSON.stringify(
                data?.error,
              ) ||
              `API ошибка ${response.status}`

        throw new Error(apiError)
      }

      if (
        typeof data?.answer !==
        'string'
      ) {
        throw new Error(
          'AUREN не вернул текст исследования',
        )
      }

      setAnswer(data.answer)

      setExecutedTools(
        Array.isArray(
          data.executed_tools,
        )
          ? data.executed_tools
          : [],
      )
    } catch (err) {
      console.error(
        'AUREN DRIVE:',
        err,
      )

      if (
        err?.name ===
        'AbortError'
      ) {
        setError(
          'Исследование заняло больше 60 секунд. Попробуйте ещё раз.',
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
    if (loading) {
      return
    }

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
    setAnswer('')
    setExecutedTools([])
    setLoading(false)
    setError('')
  }

  if (answer) {
    return (
      <div className="drive-app">
        <header className="drive-header">
          <button
            className="drive-logo"
            onClick={reset}
          >
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
          <div className="landing-eyebrow">
            AUREN DRIVE · LIVE RESEARCH
          </div>

          <h1>
            Результат
            <br />
            исследования.
          </h1>

          <section className="ai-result">
            <div className="ai-result-label">
              INTERNET RESEARCH
            </div>

            <div className="ai-result-text">
              {answer}
            </div>
          </section>

          {executedTools.length >
            0 && (
            <section className="sources-box">
              <div className="landing-eyebrow">
                WEB ACTIVITY
              </div>

              <h2>
                Что исследовал AUREN
              </h2>

              <div className="sources-list">
                {executedTools.map(
                  (
                    tool,
                    index,
                  ) => (
                    <div
                      key={index}
                      className="source-row"
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <strong>
                        {tool?.type ||
                          'web search'}
                      </strong>

                      <small>
                        {tool
                          ?.arguments ||
                          tool?.output ||
                          ''}
                      </small>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          <button
            className="drive-primary"
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
          <button
            className="drive-logo"
            onClick={reset}
          >
            <span>AUREN</span> DRIVE
          </button>

          <div className="drive-header-label">
            LIVE WEB AI
          </div>
        </header>

        <main className="drive-landing">
          <div className="landing-copy">
            <div className="landing-eyebrow">
              AUREN DRIVE · LIVE
            </div>

            <h1>
              Найдём автомобиль
              <br />
              по реальному
              <br />
              <span>
                рынку.
              </span>
            </h1>

            <p>
              AUREN изучит ваши
              требования, выполнит
              веб-поиск, сравнит
              найденную информацию
              и сформирует
              персональные рекомендации.
            </p>

            <button
              className="drive-primary"
              onClick={() =>
                setStarted(true)
              }
            >
              Начать исследование
              <span>→</span>
            </button>
          </div>

          <div className="landing-visual">
            <div className="visual-grid" />

            <div className="landing-ring">
              <div className="ring-inner">
                <span>LIVE</span>
                <strong>
                  SEARCH
                </strong>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="drive-app">
      <header className="drive-header">
        <button
          className="drive-logo"
          onClick={reset}
        >
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

          <h1>
            {question.title}
          </h1>

          <p>
            {question.description}
          </p>

          <div className="options-grid">
            {question.options.map(
              (
                option,
                index,
              ) => {
                const isSelected =
                  selected.includes(
                    option,
                  )

                return (
                  <button
                    key={option}
                    className={`option-card ${
                      isSelected
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                  >
                    <span className="option-number">
                      {String(
                        index +
                          1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>

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

              <p>
                {error}
              </p>
            </div>
          )}

          {loading && (
            <div className="ai-processing">
              AUREN исследует
              интернет и сравнивает
              автомобили...
            </div>
          )}

          <div className="question-actions">
            <button
              className="back-button"
              disabled={loading}
              onClick={back}
            >
              ← Назад
            </button>

            <button
              className="drive-primary"
              disabled={
                !selected.length ||
                loading
              }
              onClick={next}
            >
              {loading
                ? 'Исследуем...'
                : step ===
                    questions.length -
                      1
                  ? 'Запустить исследование'
                  : 'Продолжить'}

              <span>→</span>
            </button>
          </div>
        </section>

        <aside className="question-side">
          <span className="side-label">
            LIVE WEB RESEARCH
          </span>

          <strong className="side-big-number">
            {question.number}
          </strong>

          <p>
            На последнем шаге
            AUREN самостоятельно
            использует веб-поиск
            для актуального
            исследования.
          </p>

          <div className="side-progress">
            {questions.map(
              (
                item,
                index,
              ) => (
                <span
                  key={item.id}
                  className={
                    index <= step
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