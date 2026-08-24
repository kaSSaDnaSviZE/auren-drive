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
    description: 'Выберите подходящий формат.',
    type: 'multi',
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
    description: 'От спокойной езды до performance.',
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
    description: 'Можно выбрать несколько.',
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
    description: 'Это поможет точнее подобрать автомобиль.',
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
    description: 'Можно выбрать несколько.',
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

const cars = [
  {
    id: 'bmw-m340i',
    brand: 'BMW',
    name: 'BMW M340i xDrive',
    priceMin: 3000000,
    priceMax: 4000000,
    price: '3.0–4.0 млн ₽',
    power: '374 л.с.',
    drive: 'AWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
    tags: ['Динамика', 'Комфорт', 'AWD'],
    scores: {
      performance: 95,
      comfort: 88,
      reliability: 84,
      economy: 65,
      image: 90,
      offroad: 20,
      maintenance: 62,
    },
    pros: [
      'Сильная динамика',
      'Хороший баланс комфорта и управляемости',
      'Полный привод',
      'Подходит для ежедневной эксплуатации',
    ],
    cons: [
      'Обслуживание выше среднего',
      'Хорошие экземпляры стоят дорого',
    ],
    buyingFocus:
      'Проверить историю обслуживания, двигатель, охлаждение, коробку, полный привод и кузов.',
  },

  {
    id: 'mercedes-e53',
    brand: 'Mercedes-Benz',
    name: 'Mercedes-AMG E53',
    priceMin: 4000000,
    priceMax: 5500000,
    price: '4.0–5.5 млн ₽',
    power: '435 л.с.',
    drive: 'AWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'Динамика', 'Premium'],
    scores: {
      performance: 91,
      comfort: 96,
      reliability: 78,
      economy: 58,
      image: 94,
      offroad: 15,
      maintenance: 52,
    },
    pros: [
      'Очень высокий уровень комфорта',
      'Сильная динамика',
      'Премиальный салон',
      'Отличен для трассы',
    ],
    cons: [
      'Сложная силовая установка',
      'Стоимость содержания выше средней',
    ],
    buyingFocus:
      'Проверить силовую установку, электронику, подвеску, коробку и историю обслуживания.',
  },

  {
    id: 'porsche-panamera',
    brand: 'Porsche',
    name: 'Porsche Panamera 4S',
    priceMin: 5000000,
    priceMax: 7000000,
    price: '5.0–7.0 млн ₽',
    power: '440 л.с.',
    drive: 'AWD',
    body: 'Лифтбек',
    image:
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85',
    tags: ['Luxury', 'Динамика', 'AWD'],
    scores: {
      performance: 96,
      comfort: 94,
      reliability: 80,
      economy: 45,
      image: 98,
      offroad: 10,
      maintenance: 40,
    },
    pros: [
      'Сочетание спорта и комфорта',
      'Отличная управляемость',
      'Премиальный интерьер',
      'Высокий статус',
    ],
    cons: [
      'Дорогое обслуживание',
      'Требует очень тщательной проверки',
    ],
    buyingFocus:
      'Проверить историю, двигатель, коробку, подвеску и электронику.',
  },

  {
    id: 'audi-s6',
    brand: 'Audi',
    name: 'Audi S6',
    priceMin: 3000000,
    priceMax: 4500000,
    price: '3.0–4.5 млн ₽',
    power: '450 л.с.',
    drive: 'AWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'AWD', 'Performance'],
    scores: {
      performance: 93,
      comfort: 91,
      reliability: 76,
      economy: 55,
      image: 87,
      offroad: 15,
      maintenance: 55,
    },
    pros: [
      'Высокая динамика',
      'Полный привод',
      'Комфортный салон',
      'Подходит для трассы',
    ],
    cons: [
      'Сложная электроника',
      'Не самое дешёвое обслуживание',
    ],
    buyingFocus:
      'Проверить двигатель, коробку, электронику, подвеску и историю обслуживания.',
  },

  {
    id: 'lexus-es',
    brand: 'Lexus',
    name: 'Lexus ES',
    priceMin: 3000000,
    priceMax: 4500000,
    price: '3.0–4.5 млн ₽',
    power: '249 л.с.',
    drive: 'FWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
    tags: ['Комфорт', 'Надёжность', 'Business'],
    scores: {
      performance: 65,
      comfort: 94,
      reliability: 95,
      economy: 78,
      image: 83,
      offroad: 10,
      maintenance: 86,
    },
    pros: [
      'Высокий комфорт',
      'Хорошая репутация по надёжности',
      'Подходит для ежедневной эксплуатации',
      'Предсказуемое содержание',
    ],
    cons: [
      'Не спортивный характер',
      'Передний привод',
    ],
    buyingFocus:
      'Проверить кузов, историю обслуживания, подвеску и электронику.',
  },

  {
    id: 'land-cruiser',
    brand: 'Toyota',
    name: 'Toyota Land Cruiser',
    priceMin: 6000000,
    priceMax: 10000000,
    price: '6.0–10.0 млн ₽',
    power: '300+ л.с.',
    drive: 'AWD',
    body: 'SUV',
    image:
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
    tags: ['SUV', 'AWD', 'Надёжность'],
    scores: {
      performance: 72,
      comfort: 91,
      reliability: 96,
      economy: 40,
      image: 94,
      offroad: 100,
      maintenance: 80,
    },
    pros: [
      'Отличная проходимость',
      'Высокая практичность',
      'Хорошая ликвидность',
      'Подходит для плохих дорог',
    ],
    cons: [
      'Высокий расход',
      'Высокая стоимость покупки',
    ],
    buyingFocus:
      'Проверить раму, трансмиссию, подвеску и историю эксплуатации.',
  },
]

function parseBudget(value) {
  if (value === 'До 1 млн ₽') {
    return { min: 0, max: 1000000 }
  }

  if (value === '1–2 млн ₽') {
    return { min: 1000000, max: 2000000 }
  }

  if (value === '2–3 млн ₽') {
    return { min: 2000000, max: 3000000 }
  }

  if (value === '3–5 млн ₽') {
    return { min: 3000000, max: 5000000 }
  }

  if (value === '5–10 млн ₽') {
    return { min: 5000000, max: 10000000 }
  }

  if (value === '10+ млн ₽') {
    return { min: 10000000, max: Infinity }
  }

  return { min: 0, max: Infinity }
}

function budgetScore(car, budget) {
  if (
    car.priceMin >= budget.min &&
    car.priceMax <= budget.max
  ) {
    return 100
  }

  if (
    car.priceMin <= budget.max &&
    car.priceMax >= budget.min
  ) {
    return 60
  }

  if (car.priceMin > budget.max) {
    return 0
  }

  return 20
}

function bodyScore(car, answers) {
  const body = answers.body || []

  if (!body.length || body.includes('Не имеет значения')) {
    return 75
  }

  if (body.includes(car.body)) {
    return 100
  }

  return 0
}

function driveScore(car, answers) {
  const drive = answers.drive || []

  if (!drive.length || drive.includes('Не имеет значения')) {
    return 75
  }

  if (drive.includes('Полный') && car.drive === 'AWD') {
    return 100
  }

  if (drive.includes('Передний') && car.drive === 'FWD') {
    return 100
  }

  if (drive.includes('Задний') && car.drive === 'RWD') {
    return 100
  }

  return 0
}

function brandScore(car, answers) {
  const brands = answers.brand || []

  if (!brands.length || brands.includes('Любая марка')) {
    return 75
  }

  if (
    brands.includes('Porsche / BMW / Mercedes') &&
    ['Porsche', 'BMW', 'Mercedes-Benz'].includes(car.brand)
  ) {
    return 100
  }

  if (brands.includes(car.brand)) {
    return 100
  }

  return 0
}

function priorityScore(car, answers) {
  const priorities = answers.priority || []

  if (!priorities.length) {
    return 70
  }

  const map = {
    Динамика: 'performance',
    Комфорт: 'comfort',
    Надёжность: 'reliability',
    Экономичность: 'economy',
    Имидж: 'image',
    Проходимость: 'offroad',
    'Дешёвое обслуживание': 'maintenance',
  }

  const values = priorities
    .map((item) => map[item])
    .filter(Boolean)
    .map((key) => car.scores[key])

  if (!values.length) {
    return 70
  }

  return values.reduce(
    (sum, value) => sum + value,
    0,
  ) / values.length
}

function powerScore(car, answer) {
  if (!answer) {
    return 70
  }

  const target = {
    Спокойная: 45,
    Бодрая: 65,
    Быстрая: 82,
    'Очень быстрая': 94,
    'Мне нужна максимальная динамика': 100,
  }[answer]

  if (!target) {
    return 70
  }

  return Math.max(
    0,
    100 -
      Math.abs(
        car.scores.performance - target,
      ),
  )
}

function economyScore(car, answer) {
  if (!answer) {
    return 70
  }

  if (answer === 'Очень важен низкий расход') {
    return car.scores.economy
  }

  if (answer === 'Желателен умеренный расход') {
    return car.scores.economy * 0.8 + 20
  }

  if (answer === 'Главное — динамика') {
    return car.scores.performance
  }

  return 75
}

function calculateScore(car, answers) {
  const budget = parseBudget(
    answers.budget?.[0],
  )

  const score =
    budgetScore(car, budget) * 0.38 +
    priorityScore(car, answers) * 0.20 +
    bodyScore(car, answers) * 0.12 +
    driveScore(car, answers) * 0.10 +
    brandScore(car, answers) * 0.08 +
    powerScore(car, answers.power?.[0]) * 0.06 +
    economyScore(car, answers.fuel?.[0]) * 0.06

  return Math.round(
    Math.max(0, Math.min(99, score)),
  )
}

function buildReason(car, answers, score) {
  const reasons = []

  if (answers.budget?.[0]) {
    reasons.push(`бюджет ${answers.budget[0]}`)
  }

  if (answers.body?.length) {
    reasons.push('тип кузова')
  }

  if (answers.priority?.length) {
    reasons.push('ключевые приоритеты')
  }

  if (answers.drive?.length) {
    reasons.push('привод')
  }

  if (answers.brand?.length) {
    reasons.push('предпочтения по бренду')
  }

  if (score >= 85) {
    return `Очень высокая совместимость: учтены ${reasons.join(', ')}.`
  }

  if (score >= 70) {
    return `Хорошая совместимость: учтены ${reasons.join(', ')}.`
  }

  return `Ограниченная совместимость: учтены ${reasons.join(', ')}.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { answers } = req.body || {}

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Answers are required',
      })
    }

    const recommendations = cars
      .map((car) => {
        const score = calculateScore(
          car,
          answers,
        )

        return {
          ...car,
          type: car.body,
          score,
          match_score: score,
          why: buildReason(
            car,
            answers,
            score,
          ),
          buying_focus: car.buyingFocus,
        }
      })
      .sort(
        (a, b) => b.score - a.score,
      )
      .slice(0, 3)

    return res.status(200).json({
      recommendations,
    })
  } catch (error) {
    console.error('AUREN DRIVE ERROR:', error)

    return res.status(500).json({
      error:
        error?.message ||
        'Recommendation request failed',
    })
  }
}