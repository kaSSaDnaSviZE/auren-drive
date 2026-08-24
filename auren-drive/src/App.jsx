import { useMemo, useState } from 'react'
import './App.css'

const questions = [
  {
    id: 'budget',
    eyebrow: '01 / 08',
    title: 'Какой у вас бюджет?',
    description: 'Укажите комфортный бюджет на покупку автомобиля.',
    type: 'choice',
    options: [
      'До 1 млн ₽',
      '1–2 млн ₽',
      '2–3 млн ₽',
      '3–5 млн ₽',
      '5–10 млн ₽',
      '10+ млн ₽',
      'Свой бюджет',
    ],
  },
  {
    id: 'condition',
    eyebrow: '02 / 08',
    title: 'Какой автомобиль вы рассматриваете?',
    description: 'Новый, почти новый или автомобиль с пробегом?',
    type: 'choice',
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
    eyebrow: '03 / 08',
    title: 'Какой кузов вам нравится?',
    description: 'Можно выбрать наиболее подходящий формат.',
    type: 'multi',
    options: [
      'Седан',
      'Купе',
      'Универсал',
      'Кроссовер',
      'SUV',
      'Хэтчбек',
      'Не имеет значения',
    ],
  },
  {
    id: 'priority',
    eyebrow: '04 / 08',
    title: 'Что для вас важнее всего?',
    description: 'Можно выбрать несколько приоритетов.',
    type: 'multi',
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
    eyebrow: '05 / 08',
    title: 'Какую динамику вы хотите?',
    description: 'От спокойной городской езды до настоящего performance.',
    type: 'choice',
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
    eyebrow: '06 / 08',
    title: 'Какой привод предпочтительнее?',
    description: 'Можно выбрать несколько вариантов.',
    type: 'multi',
    options: [
      'Передний',
      'Задний',
      'Полный',
      'Не имеет значения',
    ],
  },
  {
    id: 'fuel',
    eyebrow: '07 / 08',
    title: 'Как относитесь к расходу топлива?',
    description: 'Это поможет точнее подобрать двигатель.',
    type: 'choice',
    options: [
      'Очень важен низкий расход',
      'Желателен умеренный расход',
      'Расход не критичен',
      'Главное — динамика',
    ],
  },
  {
    id: 'brand',
    eyebrow: '08 / 08',
    title: 'Есть любимые марки?',
    description: 'Можно выбрать несколько или оставить любой бренд.',
    type: 'multi',
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

const carDatabase = [
  {
    id: 'bmw-m340i',
    name: 'BMW M340i xDrive',
    score: 94,
    price: '3.0–4.0 млн ₽',
    power: '374 л.с.',
    drive: 'AWD',
    type: 'Седан',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
    tags: ['Динамика', 'Комфорт', 'AWD'],
    pros: [
      'Очень быстрый для ежедневной езды',
      'Отличный баланс комфорта и драйва',
      'Двигатель B58',
      'Полный привод',
    ],
    cons: [
      'Обслуживание дороже обычной 3-Series',
      'Хорошие экземпляры стоят дорого',
    ],
    buyingFocus:
      'Проверить историю обслуживания, состояние системы охлаждения, коробки и полный привод.',
  },
  {
    id: 'mercedes-e53',
    name: 'Mercedes-AMG E53',
    score: 91,
    price: '4.0–5.5 млн ₽',
    power: '435 л.с.',
    drive: 'AWD',
    type: 'Седан',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'Динамика', 'Premium'],
    pros: [
      'Очень комфортный автомобиль',
      'Сильная динамика',
      'Отличный салон',
      'Хорошо подходит для трассы',
    ],
    cons: [
      'Сложная силовая установка',
      'Стоимость обслуживания выше средней',
    ],
    buyingFocus:
      'Проверить состояние пневмоподвески, электроники, силовой установки и историю обслуживания.',
  },
  {
    id: 'porsche-panamera-4s',
    name: 'Porsche Panamera 4S',
    score: 89,
    price: '5.0–7.0 млн ₽',
    power: '440 л.с.',
    drive: 'AWD',
    type: 'Лифтбек',
    image:
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85',
    tags: ['Luxury', 'Динамика', 'AWD'],
    pros: [
      'Сочетание спорта и комфорта',
      'Отличная управляемость',
      'Премиальный интерьер',
      'Высокая статусность',
    ],
    cons: [
      'Дорогое обслуживание',
      'Нужна очень тщательная проверка перед покупкой',
    ],
    buyingFocus:
      'Проверить историю автомобиля, состояние двигателя, коробки, подвески и электроники.',
  },
  {
    id: 'audi-s6',
    name: 'Audi S6',
    score: 87,
    price: '3.0–4.5 млн ₽',
    power: '450 л.с.',
    drive: 'AWD',
    type: 'Седан',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'AWD', 'Performance'],
    pros: [
      'Очень быстрый и комфортный',
      'Полный привод quattro',
      'Сдержанный внешний вид',
      'Отличен для трассы',
    ],
    cons: [
      'Сложная электроника',
      'Обслуживание не бюджетное',
    ],
    buyingFocus:
      'Проверить электронику, коробку, двигатель, историю масла и состояние подвески.',
  },
  {
    id: 'lexus-es',
    name: 'Lexus ES',
    score: 84,
    price: '3.0–4.5 млн ₽',
    power: '249 л.с.',
    drive: 'FWD',
    type: 'Седан',
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'Надёжность', 'Business'],
    pros: [
      'Комфортный и спокойный автомобиль',
      'Хорошая репутация по надёжности',
      'Подходит для ежедневной эксплуатации',
      'Предсказуемое обслуживание',
    ],
    cons: [
      'Не самая спортивная динамика',
      'Передний привод',
    ],
    buyingFocus:
      'Проверить кузов, историю обслуживания, состояние подвески и работу всех электронных систем.',
  },
  {
    id: 'toyota-land-cruiser',
    name: 'Toyota Land Cruiser',
    score: 86,
    price: '6.0–10.0 млн ₽',
    power: '300+ л.с.',
    drive: 'AWD',
    type: 'SUV',
    image:
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
    tags: ['SUV', 'AWD', 'Надёжность'],
    pros: [
      'Отличная проходимость',
      'Подходит для плохих дорог',
      'Большой запас практичности',
      'Высокая ликвидность',
    ],
    cons: [
      'Большой расход топлива',
      'Высокая стоимость покупки',
    ],
    buyingFocus:
      'Проверить раму, трансмиссию, подвеску, внедорожную эксплуатацию и историю обслуживания.',
  },
]

function getFallbackRecommendations() {
  return carDatabase
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [started, setStarted] = useState(false)
  const [results, setResults] = useState(false)

  const [selectedCar, setSelectedCar] = useState(null)

  const [aiLoading, setAiLoading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState([])

  const currentQuestion = questions[step]
  const selectedValues = answers[currentQuestion?.id] || []

  const progress = useMemo(() => {
    if (results) return 100
    if (!started) return 0
    return Math.round((step / questions.length) * 100)
  }, [step, started, results])

  const toggleOption = (option) => {
    if (!currentQuestion) return

    if (currentQuestion.type === 'choice') {
      setAnswers((previous) => ({
        ...previous,
        [currentQuestion.id]: [option],
      }))
      return
    }

    setAnswers((previous) => {
      const current = previous[currentQuestion.id] || []

      if (current.includes(option)) {
        return {
          ...previous,
          [currentQuestion.id]: current.filter(
            (item) => item !== option,
          ),
        }
      }

      return {
        ...previous,
        [currentQuestion.id]: [...current, option],
      }
    })
  }

  const nextStep = async () => {
    if (!selectedValues.length || aiLoading) return

    if (step === questions.length - 1) {
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: selectedValues,
      }

      try {
        setAiLoading(true)

        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: finalAnswers,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.error || 'Recommendation request failed',
          )
        }

        if (!Array.isArray(data.recommendations)) {
          throw new Error('Invalid AI recommendations')
        }

        const enrichedRecommendations = data.recommendations
          .map((recommendation) => {
            const localCar = carDatabase.find(
              (car) => car.id === recommendation.id,
            )

            if (!localCar) return null

            return {
              ...localCar,
              ...recommendation,
              score:
                Number(recommendation.match_score) ||
                localCar.score,
            }
          })
          .filter(Boolean)
          .slice(0, 3)

        if (enrichedRecommendations.length !== 3) {
          throw new Error('AI did not return three valid cars')
        }

        setAnswers(finalAnswers)
        setAiRecommendations(enrichedRecommendations)
        setResults(true)
      } catch (error) {
        console.error('AUREN DRIVE ERROR:', error)

        setAnswers(finalAnswers)
        setAiRecommendations(getFallbackRecommendations())
        setResults(true)
      } finally {
        setAiLoading(false)
      }

      return
    }

    setStep((value) => value + 1)
  }

  const previousStep = () => {
    if (aiLoading) return

    if (step === 0) {
      setStarted(false)
      return
    }

    setStep((value) => value - 1)
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setStarted(false)
    setResults(false)
    setSelectedCar(null)
    setAiRecommendations([])
    setAiLoading(false)
  }

  if (!started) {
    return (
      <div className="drive-app">
        <header className="drive-header">
          <button className="drive-logo" onClick={restart}>
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
              Не знаете, какую машину купить?
              Расскажите о своих желаниях, бюджете
              и образе жизни. AUREN проанализирует
              требования и подберёт наиболее подходящие
              автомобили.
            </p>

            <div className="landing-actions">
              <button
                className="drive-primary"
                onClick={() => setStarted(true)}
              >
                Начать подбор
                <span>→</span>
              </button>

              <div className="landing-note">
                <span>01</span>
                AI-анализ
              </div>

              <div className="landing-note">
                <span>02</span>
                Сравнение
              </div>

              <div className="landing-note">
                <span>03</span>
                Лучшие варианты
              </div>
            </div>
          </div>

          <div className="landing-visual">
            <div className="visual-grid"></div>

            <div className="floating-card card-one">
              <small>AUREN SCORE</small>
              <strong>94</strong>
              <span>/ 100</span>
            </div>

            <div className="floating-card card-two">
              <small>AI MATCH</small>
              <strong>97%</strong>
            </div>

            <div className="landing-ring">
              <div className="ring-inner">
                <span>AI</span>
                <strong>DRIVE</strong>
              </div>
            </div>
          </div>
        </main>

        <footer className="drive-footer">
          <span>AUREN DRIVE</span>
          <span>AI-powered vehicle selection</span>
        </footer>
      </div>
    )
  }

  if (results) {
    const recommendations =
      aiRecommendations.length > 0
        ? aiRecommendations
        : getFallbackRecommendations()

    return (
      <div className="drive-app">
        <header className="drive-header">
          <button className="drive-logo" onClick={restart}>
            <span>AUREN</span> DRIVE
          </button>

          <button className="restart-button" onClick={restart}>
            Новый подбор
          </button>
        </header>

        <main className="results-page">
          <div className="results-top">
            <div>
              <div className="landing-eyebrow">
                YOUR AUREN PROFILE
              </div>

              <h1>
                Мы нашли варианты,
                <br />
                которые вам подходят.
              </h1>

              <p>
                AUREN проанализировал ваши требования
                и сформировал предварительный TOP-3.
              </p>
            </div>

            <div className="profile-mini">
              <div>
                <span>Бюджет</span>
                <strong>
                  {answers.budget?.[0] || '—'}
                </strong>
              </div>

              <div>
                <span>Кузов</span>
                <strong>
                  {answers.body?.join(', ') || 'Любой'}
                </strong>
              </div>

              <div>
                <span>Приоритет</span>
                <strong>
                  {answers.priority?.join(', ') || '—'}
                </strong>
              </div>

              <div>
                <span>Марки</span>
                <strong>
                  {answers.brand?.join(', ') || 'Любые'}
                </strong>
              </div>
            </div>
          </div>

          <div className="results-list">
            {recommendations.map((car, index) => (
              <article className="result-card" key={car.id || car.name}>
                <div className="result-number">
                  0{index + 1}
                </div>

                <div className="result-image">
                  <img src={car.image} alt={car.name} />

                  <div className="match-badge">
                    {car.score}% MATCH
                  </div>
                </div>

                <div className="result-content">
                  <div className="result-meta">
                    <span>{car.type}</span>
                    <span>{car.drive}</span>
                    <span>{car.power}</span>
                  </div>

                  <h2>{car.name}</h2>

                  <p className="result-price">
                    {car.price}
                  </p>

                  <div className="result-tags">
                    {car.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <p className="result-why">
                    {car.why ||
                      'Подходит по совокупности ваших требований.'}
                  </p>

                  <div className="result-columns">
                    <div>
                      <h4>Плюсы</h4>

                      <ul>
                        {car.pros.slice(0, 4).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4>Минусы</h4>

                      <ul>
                        {car.cons.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="buying-focus">
                    <span>НА ЧТО СМОТРЕТЬ</span>
                    <p>
                      {car.buying_focus ||
                        car.buyingFocus}
                    </p>
                  </div>

                  <button
                    className="drive-primary result-button"
                    onClick={() => setSelectedCar(car)}
                  >
                    Подробнее
                    <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <section className="future-search">
            <div>
              <div className="landing-eyebrow">
                NEXT STEP
              </div>

              <h2>
                Понравился вариант?
                <br />
                Найдём реальные объявления.
              </h2>

              <p>
                Следующий этап AUREN DRIVE —
                поиск подходящих автомобилей
                на нескольких площадках одновременно
                и выбор трёх лучших предложений.
              </p>
            </div>

            <button className="drive-secondary">
              Поиск объявлений скоро →
            </button>
          </section>
        </main>

        {selectedCar && (
          <div
            className="drive-modal-backdrop"
            onMouseDown={() => setSelectedCar(null)}
          >
            <div
              className="car-detail-modal"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                className="modal-x"
                onClick={() => setSelectedCar(null)}
              >
                ×
              </button>

              <div className="landing-eyebrow">
                AUREN ANALYSIS
              </div>

              <h2>{selectedCar.name}</h2>

              <p className="modal-score">
                {selectedCar.score}
                <span>/100 AUREN SCORE</span>
              </p>

              <div className="modal-image">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                />
              </div>

              <div className="result-columns modal-columns">
                <div>
                  <h4>Плюсы</h4>

                  <ul>
                    {selectedCar.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Минусы</h4>

                  <ul>
                    {selectedCar.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="buying-focus">
                <span>НА ЧТО СМОТРЕТЬ</span>

                <p>
                  {selectedCar.buying_focus ||
                    selectedCar.buyingFocus}
                </p>
              </div>

              <button
                className="drive-primary"
                onClick={() => setSelectedCar(null)}
              >
                Вернуться к результатам →
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="drive-app">
      <header className="drive-header">
        <button
          className="drive-logo"
          onClick={() => {
            setStarted(false)
            setStep(0)
          }}
        >
          <span>AUREN</span> DRIVE
        </button>

        <div className="progress-wrap">
          <span>{currentQuestion.eyebrow}</span>

          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}></div>
          </div>

          <span>{progress}%</span>
        </div>
      </header>

      <main className="question-page">
        <section className="question-content">
          <div className="landing-eyebrow">
            {currentQuestion.eyebrow}
          </div>

          <h1>{currentQuestion.title}</h1>

          <p>{currentQuestion.description}</p>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => {
              const selected = selectedValues.includes(option)

              return (
                <button
                  key={option}
                  className={`option-card ${
                    selected ? 'selected' : ''
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  <span className="option-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <strong>{option}</strong>

                  <span className="option-arrow">
                    {selected ? '✓' : '→'}
                  </span>
                </button>
              )
            })}
          </div>

          {aiLoading && (
            <div className="ai-processing">
              <span></span>
              AUREN анализирует ваши предпочтения...
            </div>
          )}

          <div className="question-actions">
            <button
              className="back-button"
              onClick={previousStep}
              disabled={aiLoading}
            >
              ← Назад
            </button>

            <button
              className={`drive-primary ${
                !selectedValues.length || aiLoading
                  ? 'disabled'
                  : ''
              }`}
              onClick={nextStep}
              disabled={!selectedValues.length || aiLoading}
            >
              {aiLoading
                ? 'Анализируем...'
                : step === questions.length - 1
                  ? 'Получить рекомендации'
                  : 'Продолжить'}
              <span>→</span>
            </button>
          </div>
        </section>

        <aside className="question-side">
          <div className="side-label">
            AUREN DRIVE
          </div>

          <div className="side-big-number">
            {String(step + 1).padStart(2, '0')}
          </div>

          <div className="side-copy">
            <span>AI VEHICLE MATCHING</span>

            <p>
              Чем точнее ваши ответы,
              тем точнее итоговый подбор.
            </p>
          </div>

          <div className="side-progress">
            {questions.map((item, index) => (
              <span
                key={item.id}
                className={index <= step ? 'active' : ''}
              ></span>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App