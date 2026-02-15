import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { router, publicProcedure } from '@/lib/trpc'

export const testRouter = router({
  request: publicProcedure
    .input(
      z.object({
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
        url: z.string().url(),
        headers: z.record(z.string()).optional(),
        body: z.string().optional(),
        timeout: z.number().min(1000).max(60000).default(30000),
      })
    )
    .mutation(async ({ input }) => {
      const { method, url, headers, body, timeout } = input

      const startTime = Date.now()

      try {
        const response = await axios({
          method: method.toLowerCase(),
          url,
          headers: headers || {},
          data: body ? JSON.parse(body) : undefined,
          timeout,
          validateStatus: () => true, // Accept all status codes
          transformResponse: [(data) => data], // Keep raw response
        })

        const responseTime = Date.now() - startTime
        const responseSize = JSON.stringify(response.data).length

        return {
          success: true,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          responseTime,
          size: responseSize,
        }
      } catch (error) {
        const responseTime = Date.now() - startTime

        if (error instanceof AxiosError) {
          if (error.code === 'ECONNABORTED') {
            return {
              success: false,
              error: 'Request timed out',
              responseTime,
              status: 0,
            }
          }

          if (error.code === 'ERR_NETWORK') {
            return {
              success: false,
              error: 'Network error - check if the API is accessible',
              responseTime,
              status: 0,
            }
          }

          return {
            success: false,
            error: error.message,
            responseTime,
            status: error.response?.status || 0,
          }
        }

        return {
          success: false,
          error: 'Unknown error occurred',
          responseTime,
          status: 0,
        }
      }
    }),

  saveHistory: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        apiId: z.string().optional(),
        method: z.string(),
        url: z.string(),
        headers: z.record(z.string()).optional(),
        body: z.string().optional(),
        responseStatus: z.number().optional(),
        responseBody: z.string().optional(),
        responseTime: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const history = await ctx.prisma.requestHistory.create({
        data: {
          userId: input.userId,
          apiId: input.apiId,
          method: input.method,
          url: input.url,
          headers: input.headers as Record<string, string> | undefined,
          body: input.body,
          responseStatus: input.responseStatus,
          responseBody: input.responseBody,
          responseTime: input.responseTime,
        },
      })

      return history
    }),

  getHistory: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, limit, cursor } = input

      const history = await ctx.prisma.requestHistory.findMany({
        where: { userId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          api: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (history.length > limit) {
        const nextItem = history.pop()
        nextCursor = nextItem?.id
      }

      return {
        items: history,
        nextCursor,
      }
    }),
})
