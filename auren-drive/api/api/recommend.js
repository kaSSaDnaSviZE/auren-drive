import OpenAI from 'openai'
import process from 'node:process'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

/*
  ВАЖНО:
  Это демонстрационная база автомобилей.
  Цены здесь не являются реальными текущими объявлениями.
  В будущем заменим эту базу реальными данными из источников.
*/

const CARS = [
  {
    id: 'bmw-m340i',
    brand: 'BMW',
    name: 'BMW M340i xDrive',
    priceMin: 3000000,
    priceMax: 4000000,
    priceLabel: '3.0–4.0 млн ₽',
    power: 374,
    powerLabel: '374 л.с.',
    drive: 'AWD',
    body: 'Седан',
    fuel: 'Бензин',

    scores: {
      performance: 95,
      comfort: 88,
      reliability: 84,
      economy: 65,
      image: 90,
      offroad: 20,
      maintenance: 62,
      technology: 90,
    },

    tags: ['Динамика', 'Комфорт', 'AWD'],

    pros: [
      'Сильная динамика',
      'Хороший баланс комфорта и управляемости',
      'Полный привод',
      'Подходит для ежедневной эксплуатации',
    ],

    cons: [
      'Обслуживание дороже обычной 3-Series',
      'Хорошие экземпляры стоят недёшево',
    ],

    buyingFocus:
      'Проверить историю обслуживания, двигатель, систему охлаждения, автоматическую коробку, полный привод и состояние кузова.',

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
    power: 435,
    powerLabel: '435 л.с.',
    drive: 'AWD',
    body: 'Седан',
    fuel: 'Бензин',

    scores: {
      performance: 91,
      comfort: 96,
      reliability: 78,
      economy: 58,
      image: 94,
      offroad: 15,
      maintenance: 52,
      technology: 95,
    },

    tags: ['Комфорт', 'Динамика', 'Premium'],

    pros: [
      'Очень высокий уровень комфорта',
      'Сильная динамика',
      'Премиальный салон',
      'Хорошо подходит для дальних поездок',
    ],

    cons: [
      'Сложная силовая установка',
      'Стоимость содержания выше средней',
    ],

    buyingFocus:
      'Проверить силовую установку, электронику, подвеску, историю обслуживания и состояние коробки.',

    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'porsche-panamera-4s',
    brand: 'Porsche',
    name: 'Porsche Panamera 4S',
    priceMin: 5000000,
    priceMax: 7000000,
    priceLabel: '5.0–7.0 млн ₽',
    power: 440,
    powerLabel: '440 л.с.',
    drive: 'AWD',
    body: 'Лифтбек',
    fuel: 'Бензин',

    scores: {
      performance: 96,
      comfort: 94,
      reliability: 80,
      economy: 45,
      image: 98,
      offroad: 10,
      maintenance: 40,
      technology: 96,
    },

    tags: ['Luxury', 'Динамика', 'AWD'],

    pros: [
      'Отличная управляемость',
      'Сочетание спорта и комфорта',
      'Премиальный интерьер',
      'Высокий статус',
    ],

    cons: [
      'Высокая стоимость обслуживания',
      'Очень важно тщательно проверять автомобиль перед покупкой',
    ],

    buyingFocus:
      'Проверить историю автомобиля, двигатель, коробку, подвеску, электронику и наличие дорогих ремонтов.',

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
    power: 450,
    powerLabel: '450 л.с.',
    drive: 'AWD',
    body: 'Седан',
    fuel: 'Бензин',

    scores: {
      performance: 93,
      comfort: 91,
      reliability: 76,
      economy: 55,
      image: 87,
      offroad: 15,
      maintenance: 55,
      technology: 94,
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
      'Не самое дешёвое обслуживание',
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
    power: 249,
    powerLabel: '249 л.с.',
    drive: 'FWD',
    body: 'Седан',
    fuel: 'Бензин',

    scores: {
      performance: 65,
      comfort: 94,
      reliability: 95,
      economy: 78,
      image: 83,
      offroad: 10,
      maintenance: 86,
      technology: 81,
    },

    tags: ['Комфорт', 'Надёжность', 'Business'],

    pros: [
      'Высокий уровень комфорта',
      'Хорошая репутация по надёжности',
      'Подходит для ежедневной эксплуатации',
      'Предсказуемое содержание',
    ],

    cons: [
      'Не рассчитан на максимальную динамику',
      'Передний привод',
    ],

    buyingFocus:
      'Проверить кузов, историю обслуживания, состояние подвески и работу электронных систем.',

    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
  },

  {
    id: 'toyota-land-cruiser',
    brand: 'Toyota',
    name: 'Toyota Land Cruiser',
    priceMin: 6000000,
    priceMax: 10000000,
    priceLabel: '6.0–10.0 млн ₽',
    power: 300,
    powerLabel: '300+ л.с.',
    drive: 'AWD',
    body: 'SUV',
    fuel: 'Бензин',

    scores: {
      performance: 72,
      comfort: 91,
      reliability: 96,
      economy: 40,
      image: 94,
      offroad: 100,
      maintenance: 80,
      technology: 83,
    },

    tags: ['SUV', 'AWD', 'Надёжность'],

    pros: [
      'Отличная проходимость',
      'Подходит для плохих дорог',
      'Высокая практичность',
      'Хорошая ликвидность',
    ],

    cons: [
      'Высокий расход',
      'Высокая цена покупки',
    ],

    buyingFocus:
      'Проверить раму, трансмиссию, подвеску, историю эксплуатации вне дорог и обслуживание.',

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

  const normalized = String(value)

  if (normalized.includes('До 1 млн')) {
    return { min: 0, max: 1000000 }
  }

  if (normalized.includes('1–2 млн')) {
    return { min: 1000000, max: 2000000 }
  }

  if (normalized.includes('2–3 млн')) {
    return { min: 2000000, max: 3000000 }
  }

  if (normalized.includes('3–5 млн')) {
    return { min: 3000000, max: 5000000 }
  }

  if (normalized.includes('5–10 млн')) {
    return { min: 5000000, max: 10000000 }
  }

  if (normalized.includes('10+ млн')) {
    return { min: 10000000, max: Number.POSITIVE_INFINITY }
  }

  return {
    min: 0,
    max: Number.POSITIVE_INFINITY,
  }
}

function getPriorityScore(car, priorities) {
  if (!Array.isArray(priorities) || !priorities.length) {
    return 70
  }

  const mapping = {
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
    .map((priority) => mapping[priority])
    .filter(Boolean)
    .map((key) => car.scores[key])

  if (!values.length) {
    return 70
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  )
}

function getPowerScore(car, desiredPower) {
  if (!desiredPower) return 70

  const powerMap = {
    Спокойная: 45,
    Бодрая: 65,
    Быстрая: 80,
    'Очень быстрая': 92,
    'Мне нужна максимальная динамика': 100,
  }

  const target = powerMap[desiredPower] || 70

  const carScore =
    car.scores.performance

  const difference = Math.abs(
    carScore - target,
  )

  return Math.max(
    0,
    100 - difference,
  )
}

function getBudgetScore(car, budget) {
  const middle =
    (budget.min +
      (Number.isFinite(budget.max)
        ? budget.max
        : budget.min + 5000000)) /
    2

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
    return 78
  }

  const distance =
    car.priceMin > budget.max
      ? car.priceMin - budget.max
      : budget.min - car.priceMax

  const penalty =
    Math.min(distance / Math.max(middle, 1), 1) * 100

  return Math.max(
    0,
    45 - penalty * 0.45,
  )
}

function getBodyScore(car, bodies) {
  if (!Array.isArray(bodies) || !bodies.length) {
    return 75
  }

  if (
    bodies.includes('Не имеет значения')
  ) {
    return 80
  }

  if (bodies.includes(car.body)) {
    return 100
  }

  if (
    car.body === 'SUV' &&
    bodies.includes('Кроссовер')
  ) {
    return 92
  }

  return 35
}

function getDriveScore(car, drives) {
  if (!Array.isArray(drives) || !drives.length) {
    return 75
  }

  if (
    drives.includes('Не имеет значения')
  ) {
    return 80
  }

  if (drives.includes('Полный')) {
    return car.drive === 'AWD' ? 100 : 35
  }

  if (drives.includes('Задний')) {
    return car.drive === 'RWD' ? 100 : 55
  }

  if (drives.includes('Передний')) {
    return car.drive === 'FWD' ? 100 : 55
  }

  return 60
}

function getBrandScore(car, brands) {
  if (!Array.isArray(brands) || !brands.length) {
    return 75
  }

  if (brands.includes('Любая марка')) {
    return 85
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

  return 52
}

function getFuelScore(car, fuelPreference) {
  if (!fuelPreference) return 70

  if (
    fuelPreference ===
    'Очень важен низкий расход'
  ) {
    return car.scores.economy
  }

  if (
    fuelPreference ===
    'Желателен умеренный расход'
  ) {
    return Math.max(
      car.scores.economy,
      65,
    )
  }

  if (
    fuelPreference ===
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

  const priorityScore =
    getPriorityScore(
      car,
      answers.priority,
    )

  const budgetScore =
    getBudgetScore(
      car,
      budget,
    )

  const bodyScore =
    getBodyScore(
      car,
      answers.body,
    )

  const driveScore =
    getDriveScore(
      car,
      answers.drive,
    )

  const brandScore =
    getBrandScore(
      car,
      answers.brand,
    )

  const powerScore =
    getPowerScore(
      car,
      answers.power?.[0],
    )

  const fuelScore =
    getFuelScore(
      car,
      answers.fuel?.[0],
    )

  /*
    Вес параметров.
    Бюджет имеет самый большой вес,
    затем приоритеты и тип автомобиля.
  */

  const score =
    budgetScore * 0.28 +
    priorityScore * 0.22 +
    bodyScore * 0.14 +
    driveScore * 0.12 +
    brandScore * 0.10 +
    powerScore * 0.08 +
    fuelScore * 0.06

  return Math.round(
    Math.max(
      0,
      Math.min(99, score),
    ),
  )
}

function buildReason(car, answers, score) {
  const reasons = []

  if (
    answers.brand?.includes(car.brand) ||
    answers.brand?.includes('Любая марка')
  ) {
    reasons.push(
      `подходит по предпочтению бренда`,
    )
  }

  if (
    answers.body?.includes(car.body) ||
    answers.body?.includes('Не имеет значения')
  ) {
    reasons.push(
      `соответствует желаемому типу кузова`,
    )
  }

  if (
    answers.drive?.includes('Не имеет значения') ||
    answers.drive?.includes(
      car.drive === 'AWD'
        ? 'Полный'
        : car.drive === 'RWD'
          ? 'Задний'
          : 'Передний',
    )
  ) {
    reasons.push(
      `соответствует предпочтению по приводу`,
    )
  }

  if (
    answers.priority?.length
  ) {
    reasons.push(
      `хорошо закрывает ваши ключевые приоритеты`,
    )
  }

  if (score >= 85) {
    reasons.push(
      `имеет высокий общий уровень совместимости`,
    )
  }

  return (
    reasons.join(', ') ||
    'подходит по совокупности ваших требований'
  )
}

async function generateExplanation(
  car,
  answers,
  score,
) {
  try {
    const completion =
      await client.chat.completions.create({
        model: 'openai/gpt-oss-20b',

        messages: [
          {
            role: 'system',
            content: `
Ты — редактор AUREN DRIVE.

Тебе НЕ нужно выбирать автомобиль.
Автомобиль уже выбран алгоритмом.

Твоя задача — только объяснить результат,
используя ТОЛЬКО предоставленные данные.

Нельзя:
- добавлять новые технические характеристики;
- придумывать цены;
- придумывать реальное наличие;
- менять мощность;
- менять привод;
- менять кузов;
- придумывать характеристики.

Верни только JSON:
{
  "why": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "..."],
  "buying_focus": "..."
}
            `,
          },
          {
            role: 'user',
            content: JSON.stringify(
              {
                user_answers: answers,
                car: {
                  brand: car.brand,
                  name: car.name,
                  price: car.priceLabel,
                  power: car.powerLabel,
                  drive: car.drive,
                  body: car.body,
                  fuel: car.fuel,
                  score,
                  predefinedPros: car.pros,
                  predefinedCons: car.cons,
                  predefinedBuyingFocus:
                    car.buyingFocus,
                },
              },
              null,
              2,
            ),
          },
        ],

        temperature: 0.1,
        max_tokens: 700,

        response_format: {
          type: 'json_object',
        },
      })

    const raw =
      completion.choices?.[0]?.message?.content

    if (!raw) {
      throw new Error(
        'Empty explanation',
      )
    }

    const parsed = JSON.parse(raw)

    return {
      why:
        typeof parsed.why === 'string'
          ? parsed.why
          : buildReason(
              car,
              answers,
              score,
            ),

      pros:
        Array.isArray(parsed.pros) &&
        parsed.pros.length
          ? parsed.pros.slice(0, 4)
          : car.pros,

      cons:
        Array.isArray(parsed.cons) &&
        parsed.cons.length
          ? parsed.cons.slice(0, 4)
          : car.cons,

      buying_focus:
        typeof parsed.buying_focus ===
        'string'
          ? parsed.buying_focus
          : car.buyingFocus,
    }
  } catch (error) {
    console.error(
      'AUREN explanation error:',
      error,
    )

    return {
      why: buildReason(
        car,
        answers,
        score,
      ),
      pros: car.pros,
      cons: car.cons,
      buying_focus:
        car.buyingFocus,
    }
  }
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
    const { answers } =
      req.body || {}

    if (
      !answers ||
      typeof answers !== 'object'
    ) {
      return res.status(400).json({
        error: 'Invalid answers',
      })
    }

    /*
      1. Сначала математически считаем
         совместимость всех машин.
    */

    const rankedCars = CARS.map(
      (car) => ({
        car,
        score: calculateScore(
          car,
          answers,
        ),
      }),
    )
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(0, 3)

    /*
      2. Затем AI только объясняет
         уже выбранные алгоритмом машины.
    */

    const recommendations =
      await Promise.all(
        rankedCars.map(
          async ({ car, score }) => {
            const explanation =
              await generateExplanation(
                car,
                answers,
                score,
              )

            return {
              id: car.id,
              name: car.name,
              score,
              match_score: score,

              price: car.priceLabel,
              power: car.powerLabel,
              drive: car.drive,
              body: car.body,
              type: car.body,

              tags: car.tags,

              why: explanation.why,
              pros: explanation.pros,
              cons: explanation.cons,

              buying_focus:
                explanation.buying_focus,

              image: car.image,
            }
          },
        ),
      )

    return res.status(200).json({
      recommendations,
      source: 'AUREN deterministic matching engine',
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