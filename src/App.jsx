import { useEffect, useMemo, useState } from 'react'
import './App.css'
import porscheImg from './assets/porsche.jpg'

const WHATSAPP_NUMBER = '994554750060'

const translations = {
  ru: {
    home: 'Главная',
    services: 'Услуги',
    works: 'Работы',
    about: 'О нас',
    location: 'Карта',
    contacts: 'Контакты',
    book: 'Записаться',
  },

  az: {
    home: 'Ana səhifə',
    services: 'Xidmətlər',
    works: 'İşlər',
    about: 'Haqqımızda',
    location: 'Xəritə',
    contacts: 'Əlaqə',
    book: 'Yazılmaq',
  },

  en: {
    home: 'Home',
    services: 'Services',
    works: 'Works',
    about: 'About',
    location: 'Map',
    contacts: 'Contact',
    book: 'Book now',
  },
}

const services = [
  {
    number: '01',
    title: 'Детейлинг',
    description:
      'Глубокая очистка салона и кузова с использованием профессиональной химии.',
    price: 150,
  },
  {
    number: '02',
    title: 'Полировка',
    description:
      'Восстановление блеска кузова и устранение мелких дефектов.',
    price: 250,
  },
  {
    number: '03',
    title: 'Керамика',
    description:
      'Защитное покрытие кузова с гидрофобным эффектом.',
    price: 400,
  },
]

const works = [
  {
    number: '01',
    title: 'Porsche 911',
    category: 'Полировка кузова',
    image: porscheImg,
    description:
      'Восстановление блеска кузова и финишная полировка.',
  },
  {
    number: '02',
    title: 'Porsche 911',
    category: 'Premium Detailing',
    image: porscheImg,
    description:
      'Комплексный уход за кузовом и салоном.',
  },
  {
    number: '03',
    title: 'Porsche 911',
    category: 'Керамика',
    image: porscheImg,
    description:
      'Защитное покрытие с глубоким блеском.',
  },
  {
    number: '04',
    title: 'Porsche 911',
    category: 'Full Refresh',
    image: porscheImg,
    description:
      'Полное визуальное восстановление автомобиля.',
  },
]

function getPage() {
  const hash = window.location.hash.replace('#', '')

  const pages = [
    'services',
    'works',
    'about',
    'location',
    'contact',
    'admin',
  ]

  return pages.includes(hash) ? hash : 'home'
}

function App() {
  const [language, setLanguage] = useState('ru')
  const [theme, setTheme] = useState('dark')
  const [page, setPage] = useState(getPage())
  const [loading, setLoading] = useState(true)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)

  const [calculatorOpen, setCalculatorOpen] = useState(false)

  const [selectedWork, setSelectedWork] = useState(null)
  const [comparison, setComparison] = useState(50)

  // =========================
  // REAL AI STATE
  // =========================

  const [aiOpen, setAiOpen] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content:
        'Здравствуйте! Я AUREN AI — автомобильный AI-ассистент. Спрашивайте о любых автомобилях, двигателях, коробках, обслуживании, надёжности, тюнинге, покупке машины и сравнении моделей.',
    },
  ])

  // =========================
  // BOOKING STATE
  // =========================

  const [form, setForm] = useState({
    name: '',
    phone: '',
    car: '',
    service: 'Детейлинг',
    size: 'Средний',
    date: '',
  })

  const t = translations[language]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    const handleHashChange = () => {
      setPage(getPage())
      setMobileMenuOpen(false)
    }

    window.addEventListener(
      'hashchange',
      handleHashChange,
    )

    return () => {
      clearTimeout(timer)

      window.removeEventListener(
        'hashchange',
        handleHashChange,
      )
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const price = useMemo(() => {
    const service = services.find(
      (item) => item.title === form.service,
    )

    const multiplier = {
      Маленький: 0.85,
      Средний: 1,
      Большой: 1.25,
    }[form.size]

    return Math.round(
      (service?.price || 150) * multiplier,
    )
  }, [form.service, form.size])

  // =========================
  // NAVIGATION
  // =========================

  const navigate = (target) => {
    window.location.hash =
      target === 'home' ? '' : target

    setPage(target)
    setMobileMenuOpen(false)
  }

  // =========================
  // BOOKING
  // =========================

  const openBooking = () => {
    setBookingStep(1)
    setBookingOpen(true)
    setMobileMenuOpen(false)
  }

  const closeBooking = () => {
    setBookingOpen(false)
    setBookingStep(1)
  }

  const nextStep = () => {
    if (bookingStep < 4) {
      setBookingStep((value) => value + 1)
    }
  }

  const previousStep = () => {
    if (bookingStep > 1) {
      setBookingStep((value) => value - 1)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const sendBooking = () => {
    const message = [
      'Здравствуйте! Хочу записаться в AUREN AUTO LAB.',
      '',
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      `Автомобиль: ${form.car}`,
      `Услуга: ${form.service}`,
      `Размер: ${form.size}`,
      `Дата: ${form.date}`,
      `Ориентировочная стоимость: ${price} ₼`,
    ].join('\n')

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`

    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )

    closeBooking()
  }

  // =========================
  // REAL AI
  // =========================

  const askAI = async (customQuestion = '') => {
    const question = (
      customQuestion || aiQuestion
    ).trim()

    if (!question || aiLoading) {
      return
    }

    const userMessage = {
      role: 'user',
      content: question,
    }

    const nextMessages = [
      ...aiMessages,
      userMessage,
    ]

    // Immediately show user message
    setAiMessages(nextMessages)
    setAiQuestion('')
    setAiLoading(true)

    try {
      const response = await fetch(
        '/api/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            messages: nextMessages,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'AI request failed',
        )
      }

      const answer =
        data?.answer?.trim()

      if (!answer) {
        throw new Error(
          'Empty AI response',
        )
      }

      setAiMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: answer,
        },
      ])
    } catch (error) {
      console.error(
        'AUREN AI:',
        error,
      )

      setAiMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content:
            'Не удалось получить ответ от AUREN AI. Попробуйте ещё раз.',
        },
      ])
    } finally {
      setAiLoading(false)
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-logo">
          <span>AUREN</span> AUTO LAB
        </div>

        <div className="loader-line">
          <div></div>
        </div>

        <p>
          LOADING EXPERIENCE...
        </p>
      </div>
    )
  }

  return (
    <div className="site">

      {/* ================= HEADER ================= */}

      <header className="header">

        <button
          className="brand"
          onClick={() =>
            navigate('home')
          }
        >
          <span>AUREN</span> AUTO LAB
        </button>

        <nav className="desktop-nav">

          <button
            onClick={() =>
              navigate('home')
            }
          >
            {t.home}
          </button>

          <button
            onClick={() =>
              navigate('services')
            }
          >
            {t.services}
          </button>

          <button
            onClick={() =>
              navigate('works')
            }
          >
            {t.works}
          </button>

          <button
            onClick={() =>
              navigate('about')
            }
          >
            {t.about}
          </button>

          <button
            onClick={() =>
              navigate('location')
            }
          >
            {t.location}
          </button>

          <button
            onClick={() =>
              navigate('contact')
            }
          >
            {t.contacts}
          </button>

        </nav>

        <div className="header-actions">

          <div className="language-switcher">

            {['ru', 'az', 'en'].map(
              (item) => (
                <button
                  key={item}
                  className={
                    language === item
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setLanguage(item)
                  }
                >
                  {item.toUpperCase()}
                </button>
              ),
            )}

          </div>

          <button
            className="theme-button"
            onClick={() =>
              setTheme(
                theme === 'dark'
                  ? 'light'
                  : 'dark',
              )
            }
          >
            {theme === 'dark'
              ? '☼'
              : '☾'}
          </button>

          <button
            className="primary-button"
            onClick={openBooking}
          >
            {t.book}
          </button>

        </div>

        <button
          className="menu-button"
          onClick={() =>
            setMobileMenuOpen(
              (value) => !value,
            )
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </header>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenuOpen && (
        <div className="mobile-menu">

          <button
            onClick={() =>
              navigate('home')
            }
          >
            {t.home}
          </button>

          <button
            onClick={() =>
              navigate('services')
            }
          >
            {t.services}
          </button>

          <button
            onClick={() =>
              navigate('works')
            }
          >
            {t.works}
          </button>

          <button
            onClick={() =>
              navigate('about')
            }
          >
            {t.about}
          </button>

          <button
            onClick={() =>
              navigate('location')
            }
          >
            {t.location}
          </button>

          <button
            onClick={() =>
              navigate('contact')
            }
          >
            {t.contacts}
          </button>

          <button
            className="primary-button"
            onClick={openBooking}
          >
            {t.book}
          </button>

        </div>
      )}

      <main>

        {/* ================= HOME ================= */}

        {page === 'home' && (
          <>

            <section className="hero">

              <div className="hero-content">

                <p className="eyebrow">
                  PREMIUM AUTO SERVICE · BAKU
                </p>

                <h1>
                  Машина должна
                  <br />
                  выглядеть
                  <br />
                  <span>идеально.</span>
                </h1>

                <p className="hero-description">
                  Профессиональный детейлинг,
                  полировка и уход за автомобилем
                  в Баку. Работаем с вниманием
                  к каждой детали.
                </p>

                <div className="hero-buttons">

                  <button
                    className="primary-button"
                    onClick={openBooking}
                  >
                    {t.book} →
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      navigate('works')
                    }
                  >
                    Смотреть работы
                  </button>

                </div>

              </div>

              <div className="hero-visual">

                <div className="glow"></div>

                <div className="car-image-wrapper">
                  <img
                    src={porscheImg}
                    alt="Porsche 911"
                  />
                </div>

                <div className="visual-label">
                  <span>
                    AUREN AUTO LAB
                  </span>
                  <strong>01</strong>
                </div>

              </div>

            </section>

            <section className="showcase-strip">

              <div>
                <span>PREMIUM</span>
                <small>
                  Automotive care
                </small>
              </div>

              <div>
                <span>BAKU</span>
                <small>
                  Azərbaycan
                </small>
              </div>

              <div>
                <span>24/7</span>
                <small>
                  Online bookings
                </small>
              </div>

            </section>

            <section className="preview-section">

              <div className="section-heading">

                <p className="eyebrow">
                  ЧТО МЫ ДЕЛАЕМ
                </p>

                <h2>
                  Уход за автомобилем
                  <br />
                  на другом уровне.
                </h2>

              </div>

              <div className="service-grid">

                {services.map(
                  (service) => (
                    <article
                      className="service-card"
                      key={service.number}
                    >

                      <span className="service-number">
                        {service.number}
                      </span>

                      <h3>
                        {service.title}
                      </h3>

                      <p>
                        {service.description}
                      </p>

                      <strong>
                        от {service.price} ₼
                      </strong>

                      <button
                        className="card-button"
                        onClick={() => {
                          setForm(
                            (previous) => ({
                              ...previous,
                              service:
                                service.title,
                            }),
                          )

                          setCalculatorOpen(
                            true,
                          )
                        }}
                      >
                        Рассчитать стоимость →
                      </button>

                    </article>
                  ),
                )}

              </div>

            </section>

            {/* REAL AI BANNER */}

            <section className="ai-banner">

              <div>

                <span>
                  AUREN AI
                </span>

                <h2>
                  Ваш персональный
                  <br />
                  автоконсультант.
                </h2>

              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setAiOpen(true)
                }
              >
                Открыть AI →
              </button>

            </section>

          </>
        )}

        {/* ================= SERVICES ================= */}

        {page === 'services' && (
          <section className="page-section">

            <p className="eyebrow">
              SERVICES
            </p>

            <h1 className="page-title">
              Услуги и стоимость
            </h1>

            <div className="service-grid">

              {services.map(
                (service) => (
                  <article
                    className="service-card"
                    key={service.number}
                  >

                    <span className="service-number">
                      {service.number}
                    </span>

                    <h3>
                      {service.title}
                    </h3>

                    <p>
                      {service.description}
                    </p>

                    <strong>
                      от {service.price} ₼
                    </strong>

                    <button
                      className="card-button"
                      onClick={() => {
                        setForm(
                          (previous) => ({
                            ...previous,
                            service:
                              service.title,
                          }),
                        )

                        setCalculatorOpen(
                          true,
                        )
                      }}
                    >
                      Рассчитать стоимость →
                    </button>

                  </article>
                ),
              )}

            </div>

          </section>
        )}

        {/* ================= WORKS ================= */}

        {page === 'works' && (
          <section className="page-section">

            <p className="eyebrow">
              НАШИ РАБОТЫ
            </p>

            <h1 className="page-title">
              Результат,
              <br />
              который видно.
            </h1>

            <div className="works-grid">

              {works.map(
                (work) => (
                  <button
                    className="work-card"
                    key={work.number}
                    onClick={() => {
                      setSelectedWork(
                        work,
                      )
                      setComparison(50)
                    }}
                  >

                    <img
                      src={work.image}
                      alt={work.title}
                    />

                    <div className="work-overlay">

                      <span>
                        {work.number}
                      </span>

                      <div>
                        <h3>
                          {work.title}
                        </h3>

                        <p>
                          {work.category}
                        </p>
                      </div>

                      <span>
                        ↗
                      </span>

                    </div>

                  </button>
                ),
              )}

            </div>

          </section>
        )}

        {/* ================= ABOUT ================= */}

        {page === 'about' && (
          <section className="page-section">

            <p className="eyebrow">
              AUREN AUTO LAB
            </p>

            <h1 className="page-title">
              Мы не просто
              <br />
              моем машины.
            </h1>

            <div className="about-grid">

              <div>

                <p>
                  AUREN AUTO LAB —
                  демонстрационный
                  premium automotive
                  project.
                </p>

                <p>
                  Этот проект создан как
                  showcase современного
                  web-development:
                  React, responsive UI,
                  multilingual interface,
                  booking system,
                  price calculator,
                  AI assistant,
                  dashboard и Vercel.
                </p>

              </div>

              <div className="tech-card">

                <span>
                  BUILT WITH
                </span>

                <div className="tech-list">

                  <strong>
                    React
                  </strong>

                  <strong>
                    Vite
                  </strong>

                  <strong>
                    JavaScript
                  </strong>

                  <strong>
                    CSS
                  </strong>

                  <strong>
                    Vercel
                  </strong>

                  <strong>
                    GitHub
                  </strong>

                  <strong>
                    Groq AI
                  </strong>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ================= LOCATION ================= */}

        {page === 'location' && (
          <section className="page-section">

            <p className="eyebrow">
              ГДЕ МЫ
            </p>

            <h1 className="page-title">
              Найдите нас
              <br />
              в <span>Баку.</span>
            </h1>

            <div className="location-layout">

              <div className="location-info">

                <span>
                  DEMO LOCATION
                </span>

                <strong>
                  Babək prospekti · Bakı
                </strong>

                <p>
                  Демонстрационная
                  точка для portfolio
                  project.
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Babek+prospekti+Baku"
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button"
                >
                  Построить маршрут →
                </a>

              </div>

              <div className="map-wrapper">

                <iframe
                  title="AUREN AUTO LAB"
                  src="https://www.google.com/maps?q=Babek+prospekti,+Baku&output=embed"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

              </div>

            </div>

          </section>
        )}

        {/* ================= CONTACT ================= */}

        {page === 'contact' && (
          <section className="page-section">

            <p className="eyebrow">
              КОНТАКТЫ
            </p>

            <h1 className="page-title">
              Вернём вашему
              <br />
              <span>
                автомобилю блеск.
              </span>
            </h1>

            <div className="contact-grid">

              <a
                href={
                  `https://wa.me/` +
                  WHATSAPP_NUMBER
                }
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  WhatsApp
                </span>

                <strong>
                  +994 55 475 00 60
                </strong>
              </a>

              <a
                href="https://instagram.com/KASSADnaSviZE"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  Instagram
                </span>

                <strong>
                  @KASSADnaSviZE
                </strong>
              </a>

              <div>
                <span>
                  Локация
                </span>

                <strong>
                  Babək prospekti · Bakı
                </strong>
              </div>

              <div>
                <span>
                  График
                </span>

                <strong>
                  Пн–Сб · 09:00–21:00
                </strong>
              </div>

            </div>

            <button
              className="primary-button"
              onClick={openBooking}
            >
              {t.book} →
            </button>

          </section>
        )}

        {/* ================= ADMIN ================= */}

        {page === 'admin' && (
          <section className="admin-page">

            <div className="admin-header">

              <div>

                <p className="eyebrow">
                  DEMO ADMIN
                </p>

                <h1>
                  AUREN Dashboard
                </h1>

              </div>

              <span className="admin-status">
                ● LIVE DEMO
              </span>

            </div>

            <div className="dashboard-cards">

              <div>
                <span>
                  Bookings
                </span>

                <strong>
                  24
                </strong>
              </div>

              <div>
                <span>
                  Today
                </span>

                <strong>
                  6
                </strong>
              </div>

              <div>
                <span>
                  Revenue
                </span>

                <strong>
                  4 820 ₼
                </strong>
              </div>

              <div>
                <span>
                  Conversion
                </span>

                <strong>
                  7.4%
                </strong>
              </div>

            </div>

            <div className="dashboard-table">

              <div className="table-title">
                Upcoming appointments
              </div>

              <div className="table-row">
                <strong>
                  BMW M5
                </strong>

                <span>
                  Полировка
                </span>

                <span>
                  10:30
                </span>

                <b>
                  Confirmed
                </b>
              </div>

              <div className="table-row">
                <strong>
                  Porsche 911
                </strong>

                <span>
                  Керамика
                </span>

                <span>
                  14:00
                </span>

                <b>
                  Confirmed
                </b>
              </div>

              <div className="table-row">
                <strong>
                  Mercedes-AMG
                </strong>

                <span>
                  Детейлинг
                </span>

                <span>
                  17:30
                </span>

                <b>
                  Pending
                </b>
              </div>

            </div>

          </section>
        )}

      </main>

      {/* ================= FOOTER ================= */}

      <footer>

        <div>

          <div className="brand">
            <span>
              AUREN
            </span>{' '}
            AUTO LAB
          </div>

          <p>
            Premium automotive care ·
            Baku, Azerbaijan ·
            Portfolio Demo
          </p>

        </div>

        <button
          onClick={() =>
            navigate('admin')
          }
        >
          Demo Admin
        </button>

      </footer>

      {/* ================= BOOKING WIZARD ================= */}

      {bookingOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={closeBooking}
        >

          <div
            className="booking-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeBooking}
            >
              ×
            </button>

            <p className="eyebrow">
              BOOKING · STEP{' '}
              {bookingStep}/4
            </p>

            <div className="progress">

              <div
                style={{
                  width:
                    `${bookingStep * 25}%`,
                }}
              ></div>

            </div>

            {bookingStep === 1 && (
              <>
                <h2>
                  Ваш автомобиль
                </h2>

                <label>
                  Марка и модель

                  <input
                    name="car"
                    value={form.car}
                    onChange={handleChange}
                    placeholder="BMW M5 / Porsche 911"
                  />
                </label>
              </>
            )}

            {bookingStep === 2 && (
              <>
                <h2>
                  Выберите услугу
                </h2>

                <div className="wizard-options">

                  {services.map(
                    (service) => (
                      <button
                        key={
                          service.title
                        }
                        className={
                          form.service ===
                          service.title
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          setForm(
                            (previous) => ({
                              ...previous,
                              service:
                                service.title,
                            }),
                          )
                        }
                      >
                        <span>
                          {service.title}
                        </span>

                        <b>
                          от{' '}
                          {service.price}{' '}
                          ₼
                        </b>
                      </button>
                    ),
                  )}

                </div>
              </>
            )}

            {bookingStep === 3 && (
              <>
                <h2>
                  Размер автомобиля
                </h2>

                <div className="wizard-options">

                  {[
                    'Маленький',
                    'Средний',
                    'Большой',
                  ].map(
                    (size) => (
                      <button
                        key={size}
                        className={
                          form.size ===
                          size
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          setForm(
                            (previous) => ({
                              ...previous,
                              size,
                            }),
                          )
                        }
                      >
                        {size}
                      </button>
                    ),
                  )}

                </div>

                <div className="estimate">

                  <span>
                    Estimated price
                  </span>

                  <strong>
                    {price} ₼
                  </strong>

                </div>
              </>
            )}

            {bookingStep === 4 && (
              <>
                <h2>
                  Ваши контакты
                </h2>

                <label>
                  Имя

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ваше имя"
                  />
                </label>

                <label>
                  Телефон

                  <input
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+994 ..."
                  />
                </label>

                <label>
                  Дата

                  <input
                    type="date"
                    name="date"
                    value={
                      form.date
                    }
                    onChange={
                      handleChange
                    }
                  />
                </label>

                <div className="estimate">

                  <span>
                    Ориентировочная
                    стоимость
                  </span>

                  <strong>
                    {price} ₼
                  </strong>

                </div>

              </>
            )}

            <div className="wizard-actions">

              {bookingStep > 1 && (
                <button
                  className="secondary-button"
                  onClick={
                    previousStep
                  }
                >
                  ← Назад
                </button>
              )}

              {bookingStep < 4 ? (
                <button
                  className="primary-button"
                  onClick={
                    nextStep
                  }
                >
                  Продолжить →
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={
                    sendBooking
                  }
                >
                  WhatsApp →
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ================= CALCULATOR ================= */}

      {calculatorOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() =>
            setCalculatorOpen(
              false,
            )
          }
        >

          <div
            className="calculator-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setCalculatorOpen(
                  false,
                )
              }
            >
              ×
            </button>

            <p className="eyebrow">
              PRICE CALCULATOR
            </p>

            <h2>
              Расчёт стоимости
            </h2>

            <label>
              Услуга

              <select
                name="service"
                value={
                  form.service
                }
                onChange={
                  handleChange
                }
              >
                {services.map(
                  (service) => (
                    <option
                      key={
                        service.title
                      }
                    >
                      {
                        service.title
                      }
                    </option>
                  ),
                )}
              </select>

            </label>

            <div className="wizard-options">

              {[
                'Маленький',
                'Средний',
                'Большой',
              ].map(
                (size) => (
                  <button
                    key={size}
                    className={
                      form.size ===
                      size
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          size,
                        }),
                      )
                    }
                  >
                    {size}
                  </button>
                ),
              )}

            </div>

            <div className="estimate large">

              <span>
                Estimated price
              </span>

              <strong>
                {price} ₼
              </strong>

            </div>

            <button
              className="primary-button"
              onClick={() => {
                setCalculatorOpen(
                  false,
                )

                openBooking()
              }}
            >
              Записаться →
            </button>

          </div>

        </div>
      )}

      {/* ================= REAL AI ================= */}

      {aiOpen && (
        <div className="ai-panel">

          <div className="ai-header">

            <div>

              <span>
                AUREN AI
              </span>

              <strong>
                Automotive Assistant
              </strong>

            </div>

            <button
              onClick={() =>
                setAiOpen(false)
              }
            >
              ×
            </button>

          </div>

          <div className="ai-content">

            {aiMessages.map(
              (message, index) => (
                <div
                  key={
                    `${message.role}-${index}`
                  }
                  className={
                    `ai-message ${
                      message.role ===
                      'user'
                        ? 'user'
                        : 'answer'
                    }`
                  }
                >
                  {message.content}
                </div>
              ),
            )}

            {aiLoading && (
              <div className="ai-message answer">
                <span className="typing">
                  AUREN AI печатает...
                </span>
              </div>
            )}

            {!aiLoading && (
              <div className="quick-questions">

                <button
                  onClick={() =>
                    askAI(
                      'Расскажи подробно про BMW M5 F90 Competition: двигатель, коробка, разгон, расход, слабые места и обслуживание.',
                    )
                  }
                >
                  BMW M5 F90 Competition
                </button>

                <button
                  onClick={() =>
                    askAI(
                      'Сравни BMW M5 F90 Competition, Mercedes-AMG E63 S W213 и Porsche Panamera Turbo S. Что выбрать и почему?',
                    )
                  }
                >
                  M5 vs E63 vs Panamera
                </button>

                <button
                  onClick={() =>
                    askAI(
                      'Помоги мне выбрать быстрый автомобиль для ежедневной езды. Сначала задай необходимые вопросы.',
                    )
                  }
                >
                  Подобрать автомобиль
                </button>

              </div>
            )}

          </div>

          <div className="ai-input">

            <input
              value={
                aiQuestion
              }
              onChange={(event) =>
                setAiQuestion(
                  event.target
                    .value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  'Enter'
                ) {
                  askAI()
                }
              }}
              placeholder="Спросите что-нибудь об автомобилях..."
              disabled={
                aiLoading
              }
            />

            <button
              onClick={() =>
                askAI()
              }
              disabled={
                aiLoading ||
                !aiQuestion.trim()
              }
            >
              {aiLoading
                ? '…'
                : '→'}
            </button>

          </div>

        </div>
      )}

      {/* ================= CASE MODAL ================= */}

      {selectedWork && (
        <div
          className="case-backdrop"
          onMouseDown={() =>
            setSelectedWork(
              null,
            )
          }
        >

          <div
            className="case-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedWork(
                  null,
                )
              }
            >
              ×
            </button>

            <p className="eyebrow">
              CASE STUDY{' '}
              {selectedWork.number}
            </p>

            <h2>
              {selectedWork.title}
            </h2>

            <p className="case-category">
              {selectedWork.category}
            </p>

            <div className="comparison-image">

              <img
                src={
                  selectedWork.image
                }
                alt={
                  selectedWork.title
                }
              />

              <div
                className="comparison-before"
                style={{
                  width:
                    `${comparison}%`,
                }}
              >
                <img
                  src={
                    selectedWork.image
                  }
                  alt="Before"
                />
              </div>

              <div className="comparison-label before">
                BEFORE
              </div>

              <div className="comparison-label after">
                AFTER
              </div>

              <div
                className="comparison-line"
                style={{
                  left:
                    `${comparison}%`,
                }}
              >
                <span>
                  ↔
                </span>
              </div>

            </div>

            <input
              className="comparison-slider"
              type="range"
              min="0"
              max="100"
              value={
                comparison
              }
              onChange={(event) =>
                setComparison(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
            />

            <p className="case-description">
              {
                selectedWork.description
              }
            </p>

          </div>

        </div>
      )}

    </div>
  )
}

export default App