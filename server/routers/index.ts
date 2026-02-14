import { router } from '@/lib/trpc'
import { apiRouter } from './api'
import { reviewRouter } from './review'
import { testRouter } from './test'

export const appRouter = router({
  api: apiRouter,
  review: reviewRouter,
  test: testRouter,
})

export type AppRouter = typeof appRouter
