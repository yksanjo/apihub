import { z } from 'zod'
import { router, publicProcedure } from '@/lib/trpc'

export const apiRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        authType: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { category, authType, search, limit, cursor } = input

      const where: Record<string, unknown> = {}

      if (category) {
        where.category = category
      }

      if (authType) {
        where.authType = authType
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

      const items = await ctx.prisma.api.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }

      // Calculate average rating for each API
      const itemsWithRating = items.map((item) => {
        const avgRating =
          item.reviews.length > 0
            ? item.reviews.reduce((acc, r) => acc + r.rating, 0) /
              item.reviews.length
            : 0
        return {
          ...item,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: item.reviews.length,
        }
      })

      return {
        items: itemsWithRating,
        nextCursor,
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const api = await ctx.prisma.api.findUnique({
        where: { id: input.id },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!api) {
        throw new Error('API not found')
      }

      const avgRating =
        api.reviews.length > 0
          ? api.reviews.reduce((acc, r) => acc + r.rating, 0) /
            api.reviews.length
          : 0

      return {
        ...api,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: api.reviews.length,
      }
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.api.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    })

    return categories
      .filter((c) => c.category)
      .map((c) => ({
        name: c.category,
        count: c._count.category,
      }))
  }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const apis = await ctx.prisma.api.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    return apis.map((api) => {
      const avgRating =
        api.reviews.length > 0
          ? api.reviews.reduce((acc, r) => acc + r.rating, 0) /
            api.reviews.length
          : 0
      return {
        ...api,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: api.reviews.length,
      }
    })
  }),
})
