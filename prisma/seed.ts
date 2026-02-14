import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleApis = [
  {
    name: 'JSONPlaceholder',
    description: 'Fake Online REST API for testing and prototyping. This is a free online REST API that you can use whenever you need some fake data.',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    category: 'Development',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Unknown',
    https: true,
    featured: true,
  },
  {
    name: 'Cat Facts',
    description: 'Random cat facts API for your projects. Get random cat facts to display on your website or app.',
    baseUrl: 'https://catfact.ninja',
    category: 'Animals',
    authType: 'Api Key',
    rateLimit: '500/day',
    cors: 'Unknown',
    https: true,
    featured: true,
  },
  {
    name: 'PokeAPI',
    description: 'RESTful Pokemon API for all your Pokemon needs. All the Pokemon data you\'ll ever need in one place.',
    baseUrl: 'https://pokeapi.co/api/v2',
    category: 'Gaming',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Yes',
    https: true,
    featured: true,
  },
  {
    name: 'Rick and Morty',
    description: 'All the Rick and Morty characters, locations and episodes. A simple API to retrieve data about the show.',
    baseUrl: 'https://rickandmortyapi.com/api',
    category: 'Entertainment',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Yes',
    https: true,
    featured: true,
  },
  {
    name: 'Random User Generator',
    description: 'Generate random user data for testing. Get random users with names, photos, and addresses.',
    baseUrl: 'https://randomuser.me/api',
    category: 'Testing',
    authType: 'None',
    rateLimit: '1000/day',
    cors: 'Unknown',
    https: true,
    featured: true,
  },
  {
    name: 'Numbers API',
    description: 'Facts about numbers, math, dates, and years. Get interesting facts about numbers.',
    baseUrl: 'http://numbersapi.com',
    category: 'Science',
    authType: 'None',
    rateLimit: '100/hour',
    cors: 'Unknown',
    https: false,
    featured: false,
  },
  {
    name: 'Dog CEO',
    description: 'Random dog images and breeds API. Get random dog images from the Dog CEO database.',
    baseUrl: 'https://dog.ceo/api',
    category: 'Animals',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Yes',
    https: true,
    featured: false,
  },
  {
    name: 'Brewery DB',
    description: 'Beer breweries, styles, and ingredients. Complete beer database with brewery information.',
    baseUrl: 'https://api.openbrewerydb.org',
    category: 'Food & Drink',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Yes',
    https: true,
    featured: false,
  },
  {
    name: 'CoinGecko',
    description: 'Cryptocurrency data API. Get current and historical cryptocurrency data.',
    baseUrl: 'https://api.coingecko.com/api/v3',
    category: 'Finance',
    authType: 'None',
    rateLimit: '10-50/minute',
    cors: 'Yes',
    https: true,
    featured: true,
  },
  {
    name: 'Open Trivia Database',
    description: 'Trivia questions and answers API. Get random trivia questions from various categories.',
    baseUrl: 'https://opentdb.com/api.php',
    category: 'Education',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Unknown',
    https: true,
    featured: false,
  },
  {
    name: 'SpaceX',
    description: 'SpaceX REST API. Get data about SpaceX launches, rockets, and more.',
    baseUrl: 'https://api.spacexdata.com/v4',
    category: 'Science',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Yes',
    https: true,
    featured: true,
  },
  {
    name: 'Zippopotam.us',
    description: 'Get location information from zip codes. Convert zip codes to location data.',
    baseUrl: 'https://api.zippopotam.us',
    category: 'Geocoding',
    authType: 'None',
    rateLimit: 'Unlimited',
    cors: 'Unknown',
    https: true,
    featured: false,
  },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.requestHistory.deleteMany()
  await prisma.api.deleteMany()
  await prisma.user.deleteMany()

  // Create sample user
  const user = await prisma.user.create({
    data: {
      email: 'demo@apihub.dev',
      name: 'Demo User',
    },
  })

  // Create APIs
  for (const apiData of sampleApis) {
    const api = await prisma.api.create({
      data: apiData,
    })

    // Add some sample reviews
    if (Math.random() > 0.5) {
      await prisma.review.create({
        data: {
          apiId: api.id,
          userId: user.id,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          content: 'Great API for testing! Works perfectly for my projects.',
          helpfulCount: Math.floor(Math.random() * 50),
        },
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
