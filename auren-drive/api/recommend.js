const CARS = [
  {
    id: 'toyota-camry',
    brand: 'Toyota',
    name: 'Toyota Camry',
    priceMin: 700000,
    priceMax: 1600000,
    price: '0.7–1.6 млн ₽',
    power: '181 л.с.',
    drive: 'FWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1400&q=85',
    tags: ['Комфорт', 'Надёжность', 'Business'],
    scores: {
      performance: 60,
      comfort: 90,
      reliability: 95,
      economy: 78,
      image: 82,
      offroad: 10,
      maintenance: 90,
    },
    pros: [
      'Хорошая репутация по надёжности',
      'Комфортна для города и трассы',
      'Предсказуемое обслуживание',
      'Высокая ликвидность',
    ],
    cons: [
      'Не самая спортивная динамика',
      'Передний привод',
    ],
    buyingFocus:
      'Проверить кузов, вариатор или АКПП в зависимости от версии, состояние подвески и историю обслуживания.',
  },

  {
    id: 'lexus-is250',
    brand: 'Lexus',
    name: 'Lexus IS 250',
    priceMin: 900000,
    priceMax: 1800000,
    price: '0.9–1.8 млн ₽',
    power: '208 л.с.',
    drive: 'RWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=85',
    tags: ['Комфорт', 'Надёжность', 'RWD'],
    scores: {
      performance: 72,
      comfort: 89,
      reliability: 91,
      economy: 66,
      image: 88,
      offroad: 10,
      maintenance: 82,
    },
    pros: [
      'Задний привод',
      'Комфортный салон',
      'Хорошая надёжность',
      'Более интересная управляемость',
    ],
    cons: [
      'Возраст большинства экземпляров',
      'Расход выше среднего',
    ],
    buyingFocus:
      'Проверить кузов, автоматическую коробку, двигатель, систему охлаждения и историю обслуживания.',
  },

  {
    id: 'bmw-f30-320i',
    brand: 'BMW',
    name: 'BMW 320i F30',
    priceMin: 1000000,
    priceMax: 1900000,
    price: '1.0–1.9 млн ₽',
    power: '184 л.с.',
    drive: 'RWD',
    body: 'Седан',
    image:
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1400&q=85',
    tags: ['Динамика', 'RWD', 'Premium'],
    scores: {
      performance: 78,
      comfort: 82,
      reliability: 68,
      economy: 68,
      image: 90,
      offroad: 10,
      maintenance: 55,
    },
    pros: [
      'Хорошая управляемость',
      'Задний привод',
      'Приятная динамика',
      'Premium-интерьер',
    ],
    cons: [
      'Состояние конкретного экземпляра очень важно',
      'Обслуживание дороже массовых моделей',
    ],
    buyingFocus:
      'Проверить двигатель, цепь ГРМ на соответствующих моторах, коробку, течи и историю обслуживания.',
  },

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
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85',
    tags: ['Динамика', 'Комфорт', 'AWD'],
    scores: {
      performance: 95,
      comfort: 88,
      reliability: 84,
      economy: 65,
      image: 93,
      offroad: 20,
      maintenance: 62,
    },
    pros: [
      'Очень сильная динамика',
      'Отличный баланс комфорта и драйва',
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
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85',
    tags: ['Комфорт', 'Динамика', 'Premium'],
    scores: {
      performance: 91,
      comfort: 96,
      reliability: 78,
      economy: 58,
      image: 96,
      offroad: 15,
      maintenance: 52,
    },
    pros: [
      'Очень высокий уровень комфорта',
      'Сильная динамика',
      'Премиальный интерьер',
      'Отличен для трассы',
    ],
    cons: [
      'Сложная силовая установка',
      'Дорогое обслуживание',
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
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1400&q=85',
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
      'Проверить историю автомобиля, двигатель, коробку, подвеску и электронику.',
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
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85',
    tags: ['Комфорт', 'AWD', 'Performance'],
    scores: {
      performance: 93,
      comfort: 91,
      reliability: 76,
      economy: 55,
      image: 90,
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
      'Обслуживание не бюджетное',
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
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=85',
    tags: ['Комфорт', 'Надёжность', 'Business'],
    scores: {
      performance: 65,
      comfort: 94,
      reliability: 95,
      economy: 78,
      image: 88,
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
      'Проверить кузов, историю обслуживания, состояние подвески и электронных систем.',
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
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=85',
    tags: ['SUV', 'AWD', 'Надёжность'],
    scores: {
      performance: 72,
      comfort: 91,
      reliability: 96,
      economy: 40,
      image: 95,
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

function getBudgetRange(value) {
  switch (value) {
    case 'До 1 млн ₽':
      return { min: 0, max: 1000000 }

    case '1–2 млн ₽':
      return { min: 1000000, max: 2000000 }

    case '2–3 млн ₽':
      return { min: 2000000, max: 3000000 }

    case '3–5 млн ₽':
      return { min: 3000000, max: 5000000 }

    case '5–10 млн ₽':
      return { min: 5000000, max: 10000000 }

    case '10+ млн ₽':
      return {
        min: 10000000,
        max: Infinity,
      }

    default:
      return {
        min: 0,
        max: Infinity,
      }
  }
}

function matchesBudget(car, budget) {
  return (
    car.priceMin >= budget.min &&
    car.priceMin <= budget.max
  )
}

function scoreCar(car, answers, budget) {
  let score = 0

  const priorities = answers.priority || []
  const bodies = answers.body || []
  const drives = answers.drive || []
  const brands = answers.brand || []

  // Бюджет — обязательный фильтр.
  if (!matchesBudget(car, budget)) {
    return -1
  }

  // Бюджет.
  score += 35

  // Кузов.
  if (
    !bodies.length ||
    bodies.includes('Не имеет значения') ||
    bodies.includes(car.body)
  ) {
    score += 15
  }

  // Привод.
  if (
    !drives.length ||
    drives.includes('Не имеет значения')
  ) {
    score += 7
  } else if (
    (drives.includes('Полный') &&
      car.drive === 'AWD') ||
    (drives.includes('Передний') &&
      car.drive === 'FWD') ||
    (drives.includes('Задний') &&
      car.drive === 'RWD')
  ) {
    score += 10
  } else {
    score -= 8
  }

  // Бренд.
  if (
    !brands.length ||
    brands.includes('Любая марка')
  ) {
    score += 7
  } else if (
    brands.includes(car.brand) ||
    (
      brands.includes(
        'Porsche / BMW / Mercedes',
      ) &&
      ['Porsche', 'BMW', 'Mercedes-Benz'].includes(
        car.brand,
      )
    )
  ) {
    score += 10
  }

  // Приоритеты.
  const priorityMap = {
    Динамика: 'performance',
    Комфорт: 'comfort',
    Надёжность: 'reliability',
    Экономичность: 'economy',
    Имидж: 'image',
    Проходимость: 'offroad',
    'Дешёвое обслуживание': 'maintenance',
    Технологичность: 'technology',
  }

  const values = priorities
    .map((item) => priorityMap[item])
    .filter(Boolean)
    .map((key) => car.scores[key])

  if (values.length) {
    score +=
      values.reduce(
        (sum, value) => sum + value,
        0,
      ) /
      values.length /
      5
  }

  // Динамика.
  const power = answers.power?.[0]

  if (power === 'Спокойная') {
    score += car.scores.performance >= 70 ? 2 : 8
  }

  if (power === 'Бодрая') {
    score += car.scores.performance >= 65 ? 7 : 2
  }

  if (power === 'Быстрая') {
    score += car.scores.performance >= 80 ? 9 : 2
  }

  if (power === 'Очень быстрая') {
    score += car.scores.performance >= 90 ? 10 : 1
  }

  if (
    power ===
    'Мне нужна максимальная динамика'
  ) {
    score += car.scores.performance >= 95 ? 10 : 0
  }

  // Расход.
  const fuel = answers.fuel?.[0]

  if (
    fuel ===
    'Очень важен низкий расход'
  ) {
    score += car.scores.economy / 12
  }

  if (
    fuel ===
    'Желателен умеренный расход'
  ) {
    score += car.scores.economy / 18
  }

  if (
    fuel ===
    'Главное — динамика'
  ) {
    score += car.scores.performance / 18
  }

  return Math.max(
    0,
    Math.min(99, Math.round(score)),
  )
}

function buildReason(car, answers, score) {
  const parts = []

  if (answers.budget?.[0]) {
    parts.push(
      `входит в выбранный бюджет`,
    )
  }

  if (
    answers.body?.includes(car.body) ||
    answers.body?.includes('Не имеет значения')
  ) {
    parts.push(
      `соответствует кузову`,
    )
  }

  if (answers.drive?.length) {
    parts.push(
      `учитывает предпочтение по приводу`,
    )
  }

  if (answers.priority?.length) {
    parts.push(
      `соответствует ключевым приоритетам`,
    )
  }

  if (score >= 85) {
    return `Высокая совместимость: ${parts.join(', ')}.`
  }

  if (score >= 70) {
    return `Хорошая совместимость: ${parts.join(', ')}.`
  }

  return `Умеренная совместимость: ${parts.join(', ')}.`
}

export default function handler(req, res) {
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

    const budget = getBudgetRange(
      answers.budget?.[0],
    )

    // Сначала ЖЁСТКО фильтруем по бюджету.
    const affordableCars = CARS.filter(
      (car) =>
        car.priceMin >= budget.min &&
        car.priceMin <= budget.max,
    )

    if (!affordableCars.length) {
      return res.status(200).json({
        recommendations: [],
        noMatches: true,
        message:
          'В текущей демонстрационной базе нет автомобилей, которые укладываются в выбранный бюджет. Попробуйте увеличить бюджет или изменить параметры.',
      })
    }

    const recommendations = affordableCars
      .map((car) => {
        const score = scoreCar(
          car,
          answers,
          budget,
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
      .filter(
        (car) => car.score >= 0,
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(0, 3)

    return res.status(200).json({
      recommendations,
      noMatches: false,
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