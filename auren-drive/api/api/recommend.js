const CARS = [
  {
    id: 'bmw-m340i',
    brand: 'BMW',
    name: 'BMW M340i xDrive',
    priceMin: 3000000,
    priceMax: 4000000,
    priceLabel: '3.0–4.0 млн ₽',
    power: '374 л.с.',
    drive: 'AWD',
    body: 'Седан',
    scores: {
      performance: 95,
      comfort: 88,
      reliability: 84,
      economy: 65,
      image: 90,
      offroad: 20,
      maintenance: 62,
    },
    tags: ['Динамика', 'Комфорт', 'AWD'],
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
      'Проверить историю обслуживания, двигатель, систему охлаждения, коробку, полный привод и кузов.',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'mercedes-e53',
    brand: 'Mercedes-Benz',
    name: 'Mercedes-AMG E53',
    priceMin: 4000000,
    priceMax: 5500000,
    priceLabel: '4.0–5.5 млн ₽',
    power: '435 л.с.',
    drive: 'AWD',
    body: 'Седан',
    scores: {
      performance: 91,
      comfort: 96,
      reliability: 78,
      economy: 58,
      image: 94,
      offroad: 15,
      maintenance: 52,
    },
    tags: ['Комфорт', 'Динамика', 'Premium'],
    pros: [
      'Очень комфортный',
      'Сильная динамика',
      'Премиальный интерьер',
      'Хорошо подходит для трассы',
    ],
    cons: [
      'Сложная силовая установка',
      'Дорогое обслуживание',
    ],
    buyingFocus:
      'Проверить силовую установку, электронику, подвеску, коробку и историю обслуживания.',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'porsche-panamera',
    brand: 'Porsche',
    name: 'Porsche Panamera 4S',
    priceMin: 5000000,
    priceMax: 7000000,
    priceLabel: '5.0–7.0 млн ₽',
    power: '440 л.с.',
    drive: 'AWD',
    body: 'Лифтбек',
    scores: {
      performance: 96,
      comfort: 94,
      reliability: 80,
      economy: 45,
      image: 98,
      offroad: 10,
      maintenance: 40,
    },
    tags: ['Luxury', 'Динамика', 'AWD'],
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
      'Проверить историю, двигатель, коробку, подвеску, электронику и дорогие ремонты.',
    image:
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'audi-s6',
    brand: 'Audi',
    name: 'Audi S6',
    priceMin: 3000000,
    priceMax: 4500000,
    priceLabel: '3.0–4.5 млн ₽',
    power: '450 л.с.',
    drive: 'AWD',
    body: 'Седан',
    scores: {
      performance: 93,
      comfort: 91,
      reliability: 76,
      economy: 55,
      image: 87,
      offroad: 15,
      maintenance: 55,
    },
    tags: ['Комфорт', 'AWD', 'Performance'],
    pros: [
      'Высокая динамика',
      'Полный привод',
      'Комфортный салон',
      'Хорошо подходит для трассы',
    ],
    cons: [
      'Сложная электроника',
      'Обслуживание не бюджетное',
    ],
    buyingFocus:
      'Проверить двигатель, коробку, электронику, подвеску и полную историю обслуживания.',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'lexus-es',
    brand: 'Lexus',
    name: 'Lexus ES',
    priceMin: 3000000,
    priceMax: 4500000,
    priceLabel: '3.0–4.5 млн ₽',
    power: '249 л.с.',
    drive: 'FWD',
    body: 'Седан',
    scores: {
      performance: 65,
      comfort: 94,
      reliability: 95,
      economy: 78,
      image: 83,
      offroad: 10,
      maintenance: 86,
    },
    tags: ['Комфорт', 'Надёжность', 'Business'],
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
      'Проверить кузов, историю обслуживания, состояние подвески и работу электроники.',
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'land-cruiser',
    brand: 'Toyota',
    name: 'Toyota Land Cruiser',
    priceMin: 6000000,
    priceMax: 10000000,
    priceLabel: '6.0–10.0 млн ₽',
    power: '300+ л.с.',
    drive: 'AWD',
    body: 'SUV',
    scores: {
      performance: 72,
      comfort: 91,
      reliability: 96,
      economy: 40,
      image: 94,
      offroad: 100,
      maintenance: 80,
    },
    tags: ['SUV', 'AWD', 'Надёжность'],
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
    image:
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85',
  },
]

function parseBudget(value) {
  if (!value) {
    return {
      min: 0,
      max: Number.POSITIVE_INFINITY,
    }
  }

  if (value.includes('До 1 млн')) {
    return { min: 0, max: 1000000 }
  }

  if (value.includes('1–2 млн')) {
    return { min: 1000000, max: 2000000 }
  }

  if (value.includes('2–3 млн')) {
    return { min: 2000000, max: 3000000 }
  }

  if (value.includes('3–5 млн')) {
    return { min: 3000000, max: 5000000 }
  }

  if (value.includes('5–10 млн')) {
    return { min: 5000000, max: 10000000 }
  }

  if (value.includes('10+ млн')) {
    return {
      min: 10000000,
      max: Number.POSITIVE_INFINITY,
    }
  }

  return {
    min: 0,
    max: Number.POSITIVE_INFINITY,
  }
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
    return 65
  }

  if (car.priceMin > budget.max) {
    return 5
  }

  return 30
}

function bodyScore(car, bodies) {
  if (!bodies?.length) return 70
  if (bodies.includes('Не имеет значения')) return 80
  if (bodies.includes(car.body)) return 100

  if (
    car.body === 'SUV' &&
    bodies.includes('Кроссовер')
  ) {
    return 90
  }

  return 15
}

function driveScore(car, drives) {
  if (!drives?.length) return 70
  if (drives.includes('Не имеет значения')) return 80

  if (
    drives.includes('Полный') &&
    car.drive === 'AWD'
  ) {
    return 100
  }

  if (
    drives.includes('Передний') &&
    car.drive === 'FWD'
  ) {
    return 100
  }

  if (
    drives.includes('Задний') &&
    car.drive === 'RWD'
  ) {
    return 100
  }

  return 20
}

function brandScore(car, brands) {
  if (!brands?.length) return 75
  if (brands.includes('Любая марка')) return 80

  if (
    brands.includes('Porsche / BMW / Mercedes') &&
    ['Porsche', 'BMW', 'Mercedes-Benz'].includes(
      car.brand,
    )
  ) {
    return 100
  }

  if (brands.includes(car.brand)) {
    return 100
  }

  return 40
}

function priorityScore(car, priorities) {
  if (!priorities?.length) return 70

  const map = {
    Динамика: 'performance',
    Комфорт: 'comfort',
    Надёжность: 'reliability',
    Экономичность: 'economy',
    Имидж: 'image',
    Проходимость: 'offroad',
    'Дешёвое обслуживание': 'maintenance',
  }

  const scores = priorities
    .map((priority) => map[priority])
    .filter(Boolean)
    .map((key) => car.scores[key])

  if (!scores.length) return 70

  return (
    scores.reduce(
      (total, value) => total + value,
      0,
    ) / scores.length
  )
}

function performanceScore(car, answer) {
  if (!answer) return 70

  const targets = {
    Спокойная: 45,
    Бодрая: 65,
    Быстрая: 82,
    'Очень быстрая': 94,
    'Мне нужна максимальная динамика': 100,
  }

  const target =
    targets[answer] ?? 70

  return Math.max(
    0,
    100 -
      Math.abs(
        car.scores.performance -
          target,
      ),
  )
}

function economyScore(car, answer) {
  if (!answer) return 70

  if (
    answer ===
    'Очень важен низкий расход'
  ) {
    return car.scores.economy
  }

  if (
    answer ===
    'Желателен умеренный расход'
  ) {
    return (
      car.scores.economy * 0.8 +
      20
    )
  }

  if (
    answer ===
    'Главное — динамика'
  ) {
    return car.scores.performance
  }

  return 75
}

function calculateScore(car, answers) {
  const budget = parseBudget(
    answers.budget?.[0],
  )

  const score =
    budgetScore(car, budget) * 0.35 +
    priorityScore(car, answers.priority) *
      0.20 +
    bodyScore(car, answers.body) * 0.14 +
    driveScore(car, answers.drive) *
      0.10 +
    brandScore(car, answers.brand) *
      0.08 +
    performanceScore(
      car,
      answers.power?.[0],
    ) * 0.07 +
    economyScore(
      car,
      answers.fuel?.[0],
    ) * 0.06

  return Math.max(
    0,
    Math.min(
      99,
      Math.round(score),
    ),
  )
}

function buildReason(car, answers, score) {
  const reasons = []

  if (answers.budget?.[0]) {
    reasons.push(
      `бюджет ${answers.budget[0]}`,
    )
  }

  if (answers.body?.length) {
    reasons.push(
      `предпочтительный кузов`,
    )
  }

  if (answers.priority?.length) {
    reasons.push(
      `ваши ключевые приоритеты`,
    )
  }

  if (answers.drive?.length) {
    reasons.push(
      `предпочтительный привод`,
    )
  }

  if (score >= 85) {
    return `Высокое соответствие: ${reasons.join(', ')}.`
  }

  if (score >= 70) {
    return `Хорошее соответствие: ${reasons.join(', ')}.`
  }

  return `Частичное соответствие: ${reasons.join(', ')}.`
}

export default async function handler(
  req,
  res,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { answers } = req.body || {}

    if (
      !answers ||
      typeof answers !== 'object'
    ) {
      return res.status(400).json({
        error: 'Answers are required',
      })
    }

    const recommendations = CARS
      .map((car) => {
        const score =
          calculateScore(
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
          buying_focus:
            car.buyingFocus,
        }
      })
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(0, 3)

    return res.status(200).json({
      recommendations,
    })
  } catch (error) {
    console.error(
      'AUREN DRIVE ERROR:',
      error,
    )

    return res.status(500).json({
      error:
        error?.message ||
        'Recommendation request failed',
    })
  }
}