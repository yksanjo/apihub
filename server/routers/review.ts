import { z } from 'zod'
import { router, publicProcedure } from '@/lib/trpc'

export const reviewRouter = router({
  create: publicProcedure
    .input(
      z.object({
        apiId: z.string(),
        userId: z.string(),
        rating: z.number().min(1).max(5),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.create({
        data: {
          apiId: input.apiId,
          userId: input.userId,
          rating: input.rating,
          content: input.content,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      })

      return review
    }),

  list: publicProcedure
    .input(
      z.object({
        apiId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
        sortBy: z.enum(['recent', 'highest', 'lowest']).default('recent'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { apiId, limit, cursor, sortBy } = input

      const orderBy: Record<string, string> = {}
      switch (sortBy) {
        case 'highest':
          orderBy.rating = 'desc'
          break
        case 'lowest':
          orderBy.rating = 'asc'
          break
        default:
          orderBy.createdAt = 'desc'
      }

      const reviews = await ctx.prisma.review.findMany({
        where: { apiId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (reviews.length > limit) {
        const nextItem = reviews.pop()
        nextCursor = nextItem?.id
      }

      return {
        items: reviews,
        nextCursor,
      }
    }),

  vote: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
        direction: z.enum(['up', 'down']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { reviewId, direction } = input

      const updateData =
        direction === 'up'
          ? { helpfulCount: { increment: 1 } }
          : { helpfulCount: { decrement: 1 } }

      const review = await ctx.prisma.review.update({
        where: { id: reviewId },
        data: updateData,
      })

      return review
    }),
})
