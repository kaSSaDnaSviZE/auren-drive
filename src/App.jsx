import { useState } from 'react'
import './App.css'
import porscheImg from './assets/porsche.jpg'

const WHATSAPP_NUMBER = '994XXXXXXXXX'

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
      'Комплексный детейлинг кузова и салона с профессиональной очисткой всех поверхностей.',
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
      'Полное визуальное восстановление автомобиля перед продажей, мероприятием или поездкой.',
    result: 'Full Refresh',
    time: '1–2 дня',
  },
]

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

const trustItems = [
  {
    value: '7+',
    label: 'лет опыта',
  },
  {
    value: '1 200+',
    label: 'автомобилей',
  },
  {
    value: '4.9/5',
    label: 'оценка клиентов',
  },
  {
    value: '12 мес.',
    label: 'защита покрытия',
  },
]

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [comparison, setComparison] = useState(50)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    car: '',
    service: 'Детейлинг',
    date: '',
  })

  const openBooking = () => {
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
      'Здравствуйте! Хочу записаться в BAKU AUTO LAB.',
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
        <a href="#top" className="logo">
          <span>BAKU</span> AUTO LAB
        </a>

        <nav>
          <a href="#services">Услуги</a>
          <a href="#works">Работы</a>
          <a href="#about">О нас</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <button className="header-button" onClick={openBooking}>
          Записаться
        </button>
      </header>

      <main id="top">
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
                <strong>7+</strong>
                <span>лет опыта</span>
              </div>

              <div>
                <strong>1 200+</strong>
                <span>автомобилей</span>
              </div>

              <div>
                <strong>4.9</strong>
                <span>рейтинг клиентов</span>
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
              <span>BAKU AUTO LAB</span>
              <strong>01</strong>
            </div>
          </div>
        </section>

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
            <span>DEMO PROJECT</span>
            <p>
              Сейчас используются демонстрационные изображения. Перед
              публикацией для реального клиента заменим их на настоящие
              фотографии его автомобилей.
            </p>
          </div>
        </section>

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

        <section className="about" id="about">
          <div>
            <p className="eyebrow">BAKU AUTO LAB</p>

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

        <section className="contact" id="contacts">
          <p className="eyebrow">ГОТОВЫ НАЧАТЬ?</p>

          <h2>
            Вернём вашему
            <br />
            <span>автомобилю блеск.</span>
          </h2>

          <button className="primary-button" onClick={openBooking}>
            Записаться на сервис →
          </button>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span>BAKU</span> AUTO LAB
        </div>

        <p>Premium automotive care · Baku, Azerbaijan</p>
      </footer>

      <button className="mobile-booking" onClick={openBooking}>
        Записаться
      </button>

      {isBookingOpen && (
        <div className="modal-backdrop" onMouseDown={closeBooking}>
          <div
            className="booking-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeBooking}>
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

      {selectedWork && (
        <div className="case-backdrop" onMouseDown={closeWork}>
          <div
            className="case-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeWork}>
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