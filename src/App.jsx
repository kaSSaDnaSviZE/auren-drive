import { useState } from 'react'
import './App.css'
import porscheImg from './assets/porsche.jpg'

const WHATSAPP_NUMBER = '994554750060'

const services = [
  {
    number: '01',
    title: 'Детейлинг',
    description:
      'Глубокая очистка салона и кузова с использованием профессиональной химии.',
    price: 'от 150 ₼',
  },
  {
    number: '02',
    title: 'Полировка',
    description:
      'Восстанавливаем блеск кузова и устраняем мелкие царапины и потертости.',
    price: 'от 250 ₼',
  },
  {
    number: '03',
    title: 'Керамика',
    description:
      'Защитное покрытие для кузова с глубоким блеском и гидрофобным эффектом.',
    price: 'от 400 ₼',
  },
]

const works = [
  {
    number: '01',
    title: 'Porsche 911',
    category: 'Полировка кузова',
    image: porscheImg,
    description:
      'Восстановление блеска кузова, удаление мелких царапин и финишная полировка.',
    result: 'Глубокий блеск',
    time: '1 день',
  },
  {
    number: '02',
    title: 'Porsche 911',
    category: 'Premium Detailing',
    image: porscheImg,
    description:
      'Комплексный уход за кузовом и салоном с профессиональной очисткой поверхностей.',
    result: 'Full Detailing',
    time: '6 часов',
  },
  {
    number: '03',
    title: 'Porsche 911',
    category: 'Керамическое покрытие',
    image: porscheImg,
    description:
      'Защитное покрытие кузова с гидрофобным эффектом и дополнительной глубиной цвета.',
    result: 'Защита кузова',
    time: '2 дня',
  },
  {
    number: '04',
    title: 'Porsche 911',
    category: 'Full Refresh',
    image: porscheImg,
    description:
      'Полное визуальное восстановление автомобиля перед продажей или важным событием.',
    result: 'Full Refresh',
    time: '1–2 дня',
  },
]

const trustItems = [
  {
    value: 'PREMIUM',
    label: 'уровень сервиса',
  },
  {
    value: 'BAKU',
    label: 'локация',
  },
  {
    value: '24/7',
    label: 'приём заявок онлайн',
  },
  {
    value: 'INDIVIDUAL',
    label: 'подход к каждому авто',
  },
]

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [comparison, setComparison] = useState(50)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    car: '',
    service: 'Детейлинг',
    date: '',
  })

  const openBooking = () => {
    setMobileMenuOpen(false)
    setIsBookingOpen(true)
  }

  const closeBooking = () => {
    setIsBookingOpen(false)
  }

  const openWork = (work) => {
    setSelectedWork(work)
    setComparison(50)
  }

  const closeWork = () => {
    setSelectedWork(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((previous) => !previous)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = [
      'Здравствуйте! Хочу записаться в AUREN AUTO LAB.',
      '',
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      `Автомобиль: ${form.car}`,
      `Услуга: ${form.service}`,
      `Желаемая дата: ${form.date}`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="site">
      <header className="header">
        <a href="#top" className="logo" onClick={closeMobileMenu}>
          <span>AUREN</span> AUTO LAB
        </a>

        <nav className="desktop-nav">
          <a href="#services">Услуги</a>
          <a href="#works">Работы</a>
          <a href="#about">О нас</a>
          <a href="#location">Карта</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <button
          className="header-button desktop-booking"
          onClick={openBooking}
        >
          Записаться
        </button>

        <button
          className={`menu-button ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#services" onClick={closeMobileMenu}>
            Услуги
          </a>

          <a href="#works" onClick={closeMobileMenu}>
            Работы
          </a>

          <a href="#about" onClick={closeMobileMenu}>
            О нас
          </a>

          <a href="#location" onClick={closeMobileMenu}>
            Карта
          </a>

          <a href="#contacts" onClick={closeMobileMenu}>
            Контакты
          </a>

          <button className="primary-button" onClick={openBooking}>
            Записаться →
          </button>
        </div>
      )}

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content reveal">
            <p className="eyebrow">PREMIUM AUTO SERVICE · BAKU</p>

            <h1>
              Машина должна
              <br />
              выглядеть
              <br />
              <span>идеально.</span>
            </h1>

            <p className="hero-description">
              Профессиональный детейлинг, полировка и уход за автомобилем
              в Баку. Работаем с вниманием к каждой детали.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={openBooking}>
                Записаться на сервис →
              </button>

              <a className="secondary-button" href="#works">
                Смотреть работы
              </a>
            </div>

            <div className="stats">
              <div>
                <strong>PREMIUM</strong>
                <span>уровень сервиса</span>
              </div>

              <div>
                <strong>BAKU</strong>
                <span>локация</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>приём заявок</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay">
            <div className="glow"></div>

            <div className="car-image-wrapper">
              <img
                src={porscheImg}
                alt="Porsche 911"
                className="car-image"
              />
            </div>

            <div className="visual-label">
              <span>AUREN AUTO LAB</span>
              <strong>01</strong>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services">
          <div className="section-heading">
            <p className="eyebrow">ЧТО МЫ ДЕЛАЕМ</p>

            <h2>
              Уход за автомобилем
              <br />
              на другом уровне.
            </h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article
                className={`service-card ${
                  service.number === '02' ? 'featured' : ''
                }`}
                key={service.number}
              >
                <span className="service-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <span className="service-price">{service.price}</span>

                <button
                  className="card-button"
                  onClick={() => {
                    setForm((previous) => ({
                      ...previous,
                      service: service.title,
                    }))
                    openBooking()
                  }}
                >
                  Выбрать услугу →
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* WORKS */}
        <section className="works" id="works">
          <div className="works-heading">
            <div>
              <p className="eyebrow">НАШИ РАБОТЫ</p>

              <h2>
                Результат,
                <br />
                который видно.
              </h2>
            </div>

            <p className="works-description">
              Каждый автомобиль проходит индивидуальный процесс ухода.
              Мы работаем не на скорость, а на результат.
            </p>
          </div>

          <div className="works-grid">
            {works.map((work) => (
              <button
                className="work-card"
                key={work.number}
                onClick={() => openWork(work)}
              >
                <img src={work.image} alt={work.title} />

                <div className="work-overlay">
                  <span>{work.number}</span>

                  <div>
                    <h3>{work.title}</h3>
                    <p>{work.category}</p>
                  </div>

                  <span className="work-arrow">↗</span>
                </div>
              </button>
            ))}
          </div>

          <div className="demo-note">
            <span>PORTFOLIO DEMO</span>
            <p>
              Демонстрационный проект AUREN AUTO LAB. Фотографии и
              коммерческие данные будут заменены на реальные материалы
              клиента перед публикацией.
            </p>
          </div>
        </section>

        {/* TRUST */}
        <section className="trust">
          <div className="trust-heading">
            <p className="eyebrow">ПОЧЕМУ НАМ ДОВЕРЯЮТ</p>

            <h2>
              Премиальный уход
              <br />
              без компромиссов.
            </h2>
          </div>

          <div className="trust-grid">
            {trustItems.map((item) => (
              <div className="trust-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div>
            <p className="eyebrow">AUREN AUTO LAB</p>

            <h2>
              Мы не просто
              <br />
              моем машины.
            </h2>
          </div>

          <p>
            Мы создаём состояние автомобиля, которым хочется любоваться
            каждый раз, когда открываешь дверь. Профессиональное оборудование,
            качественные материалы и внимание к деталям.
          </p>
        </section>

        {/* LOCATION */}
        <section className="location" id="location">
          <div className="location-heading">
            <div>
              <p className="eyebrow">ГДЕ МЫ</p>

              <h2>
                Найдите нас
                <br />
                <span>в Баку.</span>
              </h2>
            </div>

            <div className="location-info">
              <span>DEMO LOCATION</span>

              <strong>Babək prospekti · Bakı</strong>

              <p>
                Демонстрационная точка для портфолио.
                Перед публикацией заменяется на настоящий адрес клиента.
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Babek+prospekti+Baku"
                target="_blank"
                rel="noreferrer"
                className="map-button"
              >
                Построить маршрут →
              </a>
            </div>
          </div>

          <div className="map-wrapper">
            <iframe
              title="AUREN AUTO LAB — Demo Location"
              src="https://www.google.com/maps?q=Babek+prospekti,+Baku&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* CONTACTS */}
        <section className="contact" id="contacts">
          <p className="eyebrow">КОНТАКТЫ</p>

          <h2>
            Вернём вашему
            <br />
            <span>автомобилю блеск.</span>
          </h2>

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

          <p className="demo-address">
            Demo Location · Bakı, Azərbaycan
          </p>

          <button className="primary-button" onClick={openBooking}>
            Записаться на сервис →
          </button>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span>AUREN</span> AUTO LAB
        </div>

        <p>
          Premium automotive care · Baku, Azerbaijan · Portfolio Demo
        </p>
      </footer>

      <button className="mobile-booking" onClick={openBooking}>
        Записаться
      </button>

      {/* BOOKING MODAL */}
      {isBookingOpen && (
        <div className="modal-backdrop" onMouseDown={closeBooking}>
          <div
            className="booking-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeBooking}
              aria-label="Закрыть"
            >
              ×
            </button>

            <p className="eyebrow">BOOKING</p>

            <h2>Запись на сервис</h2>

            <p className="modal-description">
              Оставьте данные — заявка откроется в WhatsApp.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                Имя
                <input
                  type="text"
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
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+994 ..."
                  required
                />
              </label>

              <label>
                Автомобиль
                <input
                  type="text"
                  name="car"
                  value={form.car}
                  onChange={handleChange}
                  placeholder="BMW M5, Porsche 911..."
                  required
                />
              </label>

              <label>
                Услуга
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                >
                  {services.map((service) => (
                    <option key={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Желаемая дата
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              <button className="primary-button form-submit" type="submit">
                Продолжить в WhatsApp →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CASE STUDY */}
      {selectedWork && (
        <div className="case-backdrop" onMouseDown={closeWork}>
          <div
            className="case-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={closeWork}
              aria-label="Закрыть"
            >
              ×
            </button>

            <div className="case-header">
              <div>
                <p className="eyebrow">
                  CASE STUDY {selectedWork.number}
                </p>

                <h2>{selectedWork.title}</h2>

                <p>{selectedWork.category}</p>
              </div>

              <button className="primary-button" onClick={openBooking}>
                Записаться →
              </button>
            </div>

            <div className="comparison">
              <div className="comparison-image">
                <img
                  src={selectedWork.image}
                  alt={selectedWork.title}
                />

                <div
                  className="comparison-before"
                  style={{ width: `${comparison}%` }}
                >
                  <img src={selectedWork.image} alt="Before" />
                </div>

                <div className="comparison-label before">
                  BEFORE
                </div>

                <div className="comparison-label after">
                  AFTER
                </div>

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
            </div>

            <div className="case-bottom">
              <p>{selectedWork.description}</p>

              <div className="case-stats">
                <div>
                  <span>Результат</span>
                  <strong>{selectedWork.result}</strong>
                </div>

                <div>
                  <span>Время работы</span>
                  <strong>{selectedWork.time}</strong>
                </div>

                <div>
                  <span>Категория</span>
                  <strong>{selectedWork.category}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App