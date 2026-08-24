import { useEffect, useMemo, useState } from 'react'
import './App.css'
import porscheImg from './assets/porsche.jpg'

const WHATSAPP_NUMBER = '994554750060'

const translations = {
  ru: {
    nav: ['Главная', 'Услуги', 'Работы', 'О нас', 'Карта', 'Контакты'],
    heroEyebrow: 'PREMIUM AUTO SERVICE · BAKU',
    heroTitle: ['Машина должна', 'выглядеть', 'идеально.'],
    heroText:
      'Профессиональный детейлинг, полировка и уход за автомобилем в Баку. Работаем с вниманием к каждой детали.',
    book: 'Записаться на сервис →',
    works: 'Смотреть работы',
    servicesEyebrow: 'ЧТО МЫ ДЕЛАЕМ',
    servicesTitle: ['Уход за автомобилем', 'на другом уровне.'],
    worksEyebrow: 'НАШИ РАБОТЫ',
    worksTitle: ['Результат,', 'который видно.'],
    trustEyebrow: 'ПОЧЕМУ НАМ ДОВЕРЯЮТ',
    trustTitle: ['Премиальный уход', 'без компромиссов.'],
    aboutEyebrow: 'AUREN AUTO LAB',
    aboutTitle: ['Мы не просто', 'моем машины.'],
    locationEyebrow: 'ГДЕ МЫ',
    locationTitle: ['Найдите нас', 'в Баку.'],
    contactEyebrow: 'КОНТАКТЫ',
    contactTitle: ['Вернём вашему', 'автомобилю блеск.'],
    demo: 'PORTFOLIO DEMO',
    tech: 'Built with',
    calculator: 'Рассчитать стоимость',
    ai: 'AUREN AI',
    admin: 'Demo Admin',
  },

  az: {
    nav: ['Ana səhifə', 'Xidmətlər', 'İşlər', 'Haqqımızda', 'Xəritə', 'Əlaqə'],
    heroEyebrow: 'PREMIUM AUTO SERVICE · BAKU',
    heroTitle: ['Avtomobiliniz', 'ideal', 'görünməlidir.'],
    heroText:
      'Bakıda peşəkar detailing, cilalama və avtomobil baxımı. Hər detala xüsusi diqqət.',
    book: 'Servisə yazıl →',
    works: 'İşlərə bax',
    servicesEyebrow: 'NƏ EDİRİK',
    servicesTitle: ['Avtomobil baxımı', 'yeni səviyyədə.'],
    worksEyebrow: 'İŞLƏRİMİZ',
    worksTitle: ['Nəticə,', 'göz qabağındadır.'],
    trustEyebrow: 'NİYƏ BİZƏ GÜVƏNİRLƏR',
    trustTitle: ['Premium qulluq', 'kompromissiz.'],
    aboutEyebrow: 'AUREN AUTO LAB',
    aboutTitle: ['Biz sadəcə', 'maşın yumuruq.'],
    locationEyebrow: 'BİZ HARADAYIQ',
    locationTitle: ['Bizi tapın', 'Bakıda.'],
    contactEyebrow: 'ƏLAQƏ',
    contactTitle: ['Avtomobilinizə', 'yenidən parlaqlıq verək.'],
    demo: 'PORTFOLIO DEMO',
    tech: 'Hazırlandı',
    calculator: 'Qiyməti hesabla',
    ai: 'AUREN AI',
    admin: 'Demo Admin',
  },

  en: {
    nav: ['Home', 'Services', 'Works', 'About', 'Map', 'Contact'],
    heroEyebrow: 'PREMIUM AUTO SERVICE · BAKU',
    heroTitle: ['Your car.', 'Perfected.', ''],
    heroText:
      'Premium detailing, paint correction and automotive care in Baku. Attention to every detail.',
    book: 'Book a service →',
    works: 'View our work',
    servicesEyebrow: 'WHAT WE DO',
    servicesTitle: ['Automotive care', 'at another level.'],
    worksEyebrow: 'OUR WORK',
    worksTitle: ['Results', 'you can see.'],
    trustEyebrow: 'WHY CLIENTS TRUST US',
    trustTitle: ['Premium care', 'without compromise.'],
    aboutEyebrow: 'AUREN AUTO LAB',
    aboutTitle: ['We do more', 'than wash cars.'],
    locationEyebrow: 'WHERE WE ARE',
    locationTitle: ['Find us', 'in Baku.'],
    contactEyebrow: 'CONTACT',
    contactTitle: ['Bring back', 'your car’s shine.'],
    demo: 'PORTFOLIO DEMO',
    tech: 'Built with',
    calculator: 'Calculate price',
    ai: 'AUREN AI',
    admin: 'Demo Admin',
  },
}

const services = [
  {
    number: '01',
    key: 'detailing',
    title: 'Детейлинг',
    description: 'Глубокая очистка салона и кузова.',
    price: 150,
  },
  {
    number: '02',
    key: 'polishing',
    title: 'Полировка',
    description: 'Восстановление блеска и устранение мелких дефектов.',
    price: 250,
  },
  {
    number: '03',
    key: 'ceramic',
    title: 'Керамика',
    description: 'Защитное покрытие кузова с гидрофобным эффектом.',
    price: 400,
  },
]

const works = [
  {
    number: '01',
    title: 'Porsche 911',
    category: 'Полировка кузова',
    image: porscheImg,
    description: 'Восстановление блеска кузова и финишная полировка.',
  },
  {
    number: '02',
    title: 'Porsche 911',
    category: 'Premium Detailing',
    image: porscheImg,
    description: 'Комплексный уход за кузовом и салоном.',
  },
  {
    number: '03',
    title: 'Porsche 911',
    category: 'Керамика',
    image: porscheImg,
    description: 'Защитное покрытие с глубоким блеском.',
  },
  {
    number: '04',
    title: 'Porsche 911',
    category: 'Full Refresh',
    image: porscheImg,
    description: 'Полное визуальное восстановление.',
  },
]

const quickQuestions = [
  'Что лучше для BMW M5?',
  'Сколько стоит полировка?',
  'Что выбрать для нового Porsche?',
]

function getPage() {
  const hash = window.location.hash.replace('#', '')
  return ['services', 'works', 'about', 'location', 'contact', 'admin'].includes(
    hash,
  )
    ? hash
    : 'home'
}

function App() {
  const [language, setLanguage] = useState('ru')
  const [theme, setTheme] = useState('dark')
  const [page, setPage] = useState(getPage())
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedWork, setSelectedWork] = useState(null)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [comparison, setComparison] = useState(50)

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
    }, 900)

    const handleHash = () => {
      setPage(getPage())
      setMobileMenuOpen(false)
    }

    window.addEventListener('hashchange', handleHash)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const price = useMemo(() => {
    const service = services.find((item) => item.title === form.service)

    const multipliers = {
      Маленький: 0.85,
      Средний: 1,
      Большой: 1.25,
    }

    return Math.round((service?.price || 150) * multipliers[form.size])
  }, [form.service, form.size])

  const navigate = (target) => {
    window.location.hash = target === 'home' ? '' : target
    setPage(target)
    setMobileMenuOpen(false)
  }

  const openBooking = () => {
    setBookingStep(1)
    setIsBookingOpen(true)
    setMobileMenuOpen(false)
  }

  const closeBooking = () => {
    setIsBookingOpen(false)
    setBookingStep(1)
  }

  const nextBookingStep = () => {
    if (bookingStep < 4) {
      setBookingStep((value) => value + 1)
    }
  }

  const previousBookingStep = () => {
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

  const submitBooking = (event) => {
    event.preventDefault()

    const message = [
      'Здравствуйте! Хочу записаться в AUREN AUTO LAB.',
      '',
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      `Автомобиль: ${form.car}`,
      `Услуга: ${form.service}`,
      `Размер: ${form.size}`,
      `Желаемая дата: ${form.date}`,
      `Ориентировочная стоимость: ${price} ₼`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`

    window.open(url, '_blank', 'noopener,noreferrer')
    closeBooking()
  }

  const askAI = () => {
    const question = aiQuestion.toLowerCase()

    if (question.includes('полиров')) {
      setAiAnswer(
        'Для восстановления блеска и удаления лёгких дефектов я бы рекомендовал полировку. Для среднего автомобиля ориентировочная стоимость — от 250 ₼.',
      )
      return
    }

    if (question.includes('bmw') || question.includes('m5')) {
      setAiAnswer(
        'Для BMW M5 я бы начал с профессионального детейлинга и диагностики состояния ЛКП. После осмотра можно определить, нужна ли полировка или керамическая защита.',
      )
      return
    }

    if (question.includes('porsche')) {
      setAiAnswer(
        'Для нового Porsche я бы рекомендовал защитное покрытие и бережный детейлинг. Основная задача — сохранить состояние лакокрасочного покрытия.',
      )
      return
    }

    setAiAnswer(
      'Для точной рекомендации нужен автомобиль, его состояние и задача. Напишите марку, модель и что хотите улучшить.',
    )
  }

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-logo">
          <span>AUREN</span> AUTO LAB
        </div>

        <div className="loader-line">
          <div></div>
        </div>

        <p>LOADING EXPERIENCE...</p>
      </div>
    )
  }

  return (
    <div className="site">
      <header className="header">
        <button className="brand" onClick={() => navigate('home')}>
          <span>AUREN</span> AUTO LAB
        </button>

        <nav className="desktop-nav">
          <button onClick={() => navigate('home')}>{t.nav[0]}</button>
          <button onClick={() => navigate('services')}>{t.nav[1]}</button>
          <button onClick={() => navigate('works')}>{t.nav[2]}</button>
          <button onClick={() => navigate('about')}>{t.nav[3]}</button>
          <button onClick={() => navigate('location')}>{t.nav[4]}</button>
          <button onClick={() => navigate('contact')}>{t.nav[5]}</button>
        </nav>

        <div className="header-actions">
          <div className="language-switcher">
            {['ru', 'az', 'en'].map((item) => (
              <button
                key={item}
                className={language === item ? 'active' : ''}
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="theme-button"
            onClick={() =>
              setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
            }
          >
            {theme === 'dark' ? '☼' : '☾'}
          </button>

          <button className="primary-button header-booking" onClick={openBooking}>
            {t.book}
          </button>
        </div>

        <button
          className={`menu-button ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => navigate('home')}>{t.nav[0]}</button>
          <button onClick={() => navigate('services')}>{t.nav[1]}</button>
          <button onClick={() => navigate('works')}>{t.nav[2]}</button>
          <button onClick={() => navigate('about')}>{t.nav[3]}</button>
          <button onClick={() => navigate('location')}>{t.nav[4]}</button>
          <button onClick={() => navigate('contact')}>{t.nav[5]}</button>

          <div className="mobile-actions">
            <div className="language-switcher">
              {['ru', 'az', 'en'].map((item) => (
                <button
                  key={item}
                  className={language === item ? 'active' : ''}
                  onClick={() => setLanguage(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="theme-button"
              onClick={() =>
                setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
              }
            >
              {theme === 'dark' ? '☼ Светлая' : '☾ Тёмная'}
            </button>

            <button className="primary-button" onClick={openBooking}>
              {t.book}
            </button>
          </div>
        </div>
      )}

      <main>
        {page === 'home' && (
          <>
            <section className="hero">
              <div className="hero-content reveal">
                <p className="eyebrow">{t.heroEyebrow}</p>

                <h1>
                  {t.heroTitle[0]}
                  <br />
                  {t.heroTitle[1]}
                  <br />
                  <span>{t.heroTitle[2]}</span>
                </h1>

                <p className="hero-description">{t.heroText}</p>

                <div className="hero-buttons">
                  <button className="primary-button" onClick={openBooking}>
                    {t.book}
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => navigate('works')}
                  >
                    {t.works}
                  </button>
                </div>
              </div>

              <div className="hero-visual reveal reveal-delay">
                <div className="glow"></div>

                <div className="car-image-wrapper">
                  <img src={porscheImg} alt="Porsche 911" />
                </div>

                <div className="visual-label">
                  <span>AUREN AUTO LAB</span>
                  <strong>01</strong>
                </div>
              </div>
            </section>

            <section className="showcase-strip">
              <div>
                <span>PREMIUM</span>
                <small>Automotive care</small>
              </div>

              <div>
                <span>BAKU</span>
                <small>Azərbaycan</small>
              </div>

              <div>
                <span>24/7</span>
                <small>Online bookings</small>
              </div>
            </section>

            <section className="preview-section">
              <div className="section-heading">
                <p className="eyebrow">{t.servicesEyebrow}</p>
                <h2>
                  {t.servicesTitle[0]}
                  <br />
                  {t.servicesTitle[1]}
                </h2>
              </div>

              <div className="service-grid">
                {services.map((service) => (
                  <article className="service-card" key={service.number}>
                    <span className="service-number">{service.number}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <strong>от {service.price} ₼</strong>

                    <button
                      className="card-button"
                      onClick={() => {
                        setForm((previous) => ({
                          ...previous,
                          service: service.title,
                        }))
                        setCalculatorOpen(true)
                      }}
                    >
                      {t.calculator} →
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="ai-banner">
              <div>
                <span>AUREN AI</span>
                <h2>Ваш персональный<br />автоконсультант.</h2>
              </div>

              <button className="primary-button" onClick={() => setAiOpen(true)}>
                Открыть AI →
              </button>
            </section>
          </>
        )}

        {page === 'services' && (
          <section className="page-section">
            <p className="eyebrow">SERVICES</p>
            <h1 className="page-title">Услуги и стоимость</h1>

            <div className="service-grid large">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <span className="service-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <strong>от {service.price} ₼</strong>

                  <button
                    className="card-button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        service: service.title,
                      }))
                      setCalculatorOpen(true)
                    }}
                  >
                    {t.calculator} →
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'works' && (
          <section className="page-section">
            <p className="eyebrow">{t.worksEyebrow}</p>
            <h1 className="page-title">{t.worksTitle[0]} {t.worksTitle[1]}</h1>

            <div className="works-grid">
              {works.map((work) => (
                <button
                  className="work-card"
                  key={work.number}
                  onClick={() => {
                    setSelectedWork(work)
                    setComparison(50)
                  }}
                >
                  <img src={work.image} alt={work.title} />

                  <div className="work-overlay">
                    <span>{work.number}</span>

                    <div>
                      <h3>{work.title}</h3>
                      <p>{work.category}</p>
                    </div>

                    <span>↗</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {page === 'about' && (
          <section className="page-section about-page">
            <p className="eyebrow">{t.aboutEyebrow}</p>
            <h1 className="page-title">
              {t.aboutTitle[0]}
              <br />
              {t.aboutTitle[1]}
            </h1>

            <div className="about-grid">
              <div>
                <p>
                  AUREN AUTO LAB — демонстрационный premium automotive
                  бренд, созданный как showcase современного web-development.
                </p>

                <p>
                  Проект демонстрирует responsive UI, локализацию,
                  интерактивные формы, price calculator, AI assistant,
                  dashboard и deployment на Vercel.
                </p>
              </div>

              <div className="tech-card">
                <span>{t.tech}</span>

                <div className="tech-list">
                  <strong>React</strong>
                  <strong>Vite</strong>
                  <strong>JavaScript</strong>
                  <strong>CSS</strong>
                  <strong>Vercel</strong>
                  <strong>GitHub</strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {page === 'location' && (
          <section className="page-section">
            <p className="eyebrow">{t.locationEyebrow}</p>

            <h1 className="page-title">
              {t.locationTitle[0]}
              <br />
              {t.locationTitle[1]}
            </h1>

            <div className="location-layout">
              <div className="location-info">
                <span>DEMO LOCATION</span>
                <strong>Babək prospekti · Bakı</strong>
                <p>
                  Демонстрационная точка для portfolio project.
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

        {page === 'contact' && (
          <section className="page-section">
            <p className="eyebrow">{t.contactEyebrow}</p>

            <h1 className="page-title">
              {t.contactTitle[0]}
              <br />
              <span>{t.contactTitle[1]}</span>
            </h1>

            <div className="contact-grid">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>WhatsApp</span>
                <strong>+994 55 475 00 60</strong>
              </a>

              <a
                href="https://instagram.com/KASSADnaSviZE"
                target="_blank"
                rel="noreferrer"
              >
                <span>Instagram</span>
                <strong>@KASSADnaSviZE</strong>
              </a>

              <div>
                <span>Локация</span>
                <strong>Babək prospekti · Bakı</strong>
              </div>

              <div>
                <span>График</span>
                <strong>Пн–Сб · 09:00–21:00</strong>
              </div>
            </div>

            <button className="primary-button" onClick={openBooking}>
              {t.book}
            </button>
          </section>
        )}

        {page === 'admin' && (
          <section className="admin-page">
            <div className="admin-header">
              <div>
                <p className="eyebrow">DEMO ADMIN</p>
                <h1>AUREN Dashboard</h1>
              </div>

              <span className="admin-status">● LIVE DEMO</span>
            </div>

            <div className="dashboard-cards">
              <div>
                <span>Bookings</span>
                <strong>24</strong>
              </div>

              <div>
                <span>Today</span>
                <strong>6</strong>
              </div>

              <div>
                <span>Revenue</span>
                <strong>4 820 ₼</strong>
              </div>

              <div>
                <span>Conversion</span>
                <strong>7.4%</strong>
              </div>
            </div>

            <div className="dashboard-table">
              <div className="table-title">Upcoming appointments</div>

              <div className="table-row">
                <strong>BMW M5</strong>
                <span>Полировка</span>
                <span>10:30</span>
                <b>Confirmed</b>
              </div>

              <div className="table-row">
                <strong>Porsche 911</strong>
                <span>Керамика</span>
                <span>14:00</span>
                <b>Confirmed</b>
              </div>

              <div className="table-row">
                <strong>Mercedes-AMG</strong>
                <span>Детейлинг</span>
                <span>17:30</span>
                <b>Pending</b>
              </div>
            </div>
          </section>
        )}

        {!['home', 'services', 'works', 'about', 'location', 'contact', 'admin'].includes(
          page,
        ) && (
          <section className="not-found">
            <span>404</span>
            <h1>This road doesn't exist.</h1>
            <button
              className="primary-button"
              onClick={() => navigate('home')}
            >
              Back to Garage →
            </button>
          </section>
        )}
      </main>

      <footer>
        <div>
          <div className="brand">
            <span>AUREN</span> AUTO LAB
          </div>

          <p>Premium automotive care · Baku, Azerbaijan · Portfolio Demo</p>
        </div>

        <button onClick={() => navigate('admin')}>
          {t.admin}
        </button>
      </footer>

      <button className="mobile-booking" onClick={openBooking}>
        {t.book}
      </button>

      {/* BOOKING WIZARD */}
      {isBookingOpen && (
        <div className="modal-backdrop" onMouseDown={closeBooking}>
          <div
            className="booking-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeBooking}>
              ×
            </button>

            <p className="eyebrow">BOOKING · STEP {bookingStep}/4</p>

            <div className="progress">
              <div style={{ width: `${bookingStep * 25}%` }}></div>
            </div>

            {bookingStep === 1 && (
              <>
                <h2>Ваш автомобиль</h2>

                <label>
                  Марка и модель
                  <input
                    name="car"
                    value={form.car}
                    onChange={handleChange}
                    placeholder="BMW M5 / Porsche 911"
                    required
                  />
                </label>
              </>
            )}

            {bookingStep === 2 && (
              <>
                <h2>Выберите услугу</h2>

                <div className="wizard-options">
                  {services.map((service) => (
                    <button
                      className={
                        form.service === service.title ? 'selected' : ''
                      }
                      key={service.title}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          service: service.title,
                        }))
                      }
                    >
                      <span>{service.title}</span>
                      <b>от {service.price} ₼</b>
                    </button>
                  ))}
                </div>
              </>
            )}

            {bookingStep === 3 && (
              <>
                <h2>Размер автомобиля</h2>

                <div className="wizard-options">
                  {['Маленький', 'Средний', 'Большой'].map((size) => (
                    <button
                      className={form.size === size ? 'selected' : ''}
                      key={size}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          size,
                        }))
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="estimate">
                  <span>Estimated price</span>
                  <strong>{price} ₼</strong>
                </div>
              </>
            )}

            {bookingStep === 4 && (
              <>
                <h2>Ваши контакты</h2>

                <label>
                  Имя
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ваше имя"
                    required
                  />
                </label>

                <label>
                  Телефон
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+994 ..."
                    required
                  />
                </label>

                <label>
                  Дата
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <div className="estimate">
                  <span>Ориентировочная стоимость</span>
                  <strong>{price} ₼</strong>
                </div>
              </>
            )}

            <div className="wizard-actions">
              {bookingStep > 1 && (
                <button
                  className="secondary-button"
                  onClick={previousBookingStep}
                >
                  ← Назад
                </button>
              )}

              {bookingStep < 4 ? (
                <button className="primary-button" onClick={nextBookingStep}>
                  Продолжить →
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={submitBooking}
                >
                  Отправить в WhatsApp →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR */}
      {calculatorOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setCalculatorOpen(false)}
        >
          <div
            className="calculator-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setCalculatorOpen(false)}
            >
              ×
            </button>

            <p className="eyebrow">PRICE CALCULATOR</p>

            <h2>{t.calculator}</h2>

            <label>
              Услуга
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                {services.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
            </label>

            <div className="wizard-options">
              {['Маленький', 'Средний', 'Большой'].map((size) => (
                <button
                  className={form.size === size ? 'selected' : ''}
                  key={size}
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      size,
                    }))
                  }
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="estimate large">
              <span>Estimated price</span>
              <strong>{price} ₼</strong>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setCalculatorOpen(false)
                openBooking()
              }}
            >
              Записаться →
            </button>
          </div>
        </div>
      )}

      {/* AI */}
      {aiOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <div>
              <span>AUREN AI</span>
              <strong>Auto Consultant</strong>
            </div>

            <button onClick={() => setAiOpen(false)}>×</button>
          </div>

          <div className="ai-content">
            <div className="ai-message">
              Здравствуйте! Расскажите, какой у вас автомобиль и что хотите
              улучшить.
            </div>

            {aiAnswer && <div className="ai-message answer">{aiAnswer}</div>}

            <div className="quick-questions">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    setAiQuestion(question)
                    setTimeout(askAI, 0)
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-input">
            <input
              value={aiQuestion}
              onChange={(event) => setAiQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  askAI()
                }
              }}
              placeholder="Напишите вопрос..."
            />

            <button onClick={askAI}>→</button>
          </div>
        </div>
      )}

      {/* CASE STUDY */}
      {selectedWork && (
        <div className="case-backdrop" onMouseDown={() => setSelectedWork(null)}>
          <div
            className="case-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedWork(null)}
            >
              ×
            </button>

            <p className="eyebrow">
              CASE STUDY {selectedWork.number}
            </p>

            <h2>{selectedWork.title}</h2>
            <p className="case-category">{selectedWork.category}</p>

            <div className="comparison-image">
              <img src={selectedWork.image} alt={selectedWork.title} />

              <div
                className="comparison-before"
                style={{ width: `${comparison}%` }}
              >
                <img src={selectedWork.image} alt="Before" />
              </div>

              <div className="comparison-label before">BEFORE</div>
              <div className="comparison-label after">AFTER</div>

              <div
                className="comparison-line"
                style={{ left: `${comparison}%` }}
              >
                <span>↔</span>
              </div>
            </div>

            <input
              className="comparison-slider"
              type="range"
              min="0"
              max="100"
              value={comparison}
              onChange={(event) =>
                setComparison(Number(event.target.value))
              }
            />

            <p className="case-description">
              {selectedWork.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App