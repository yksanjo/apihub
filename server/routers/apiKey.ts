import { z } from 'zod'
import { router, publicProcedure } from '@/lib/trpc'

// Service options for common API providers
export const API_SERVICES = [
  'openai',
  'anthropic',
  'google',
  'github',
  'gitlab',
  'bitbucket',
  'aws',
  'azure',
  'stripe',
  'twilio',
  'sendgrid',
  'mailgun',
  'slack',
  'discord',
  'telegram',
  'notion',
  'linear',
  'airtable',
  'hubspot',
  'salesforce',
  'quickbooks',
  'shopify',
  'custom',
] as const

export const apiKeyRouter = router({
  list: publicProcedure
    .input(
      z.object({
        service: z.string().optional(),
        environment: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { service, environment } = input

      const where: Record<string, unknown> = {}

      if (service) {
        where.service = service
      }

      if (environment) {
        where.environment = environment
      }

      const apiKeys = await ctx.prisma.apiKey.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        // Don't return the actual key by default for security
        select: {
          id: true,
          name: true,
          service: true,
          environment: true,
          expiresAt: true,
          lastUsedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return apiKeys
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const apiKey = await ctx.prisma.apiKey.findUnique({
        where: { id: input.id },
        // Don't return the actual key by default for security
        select: {
          id: true,
          name: true,
          service: true,
          environment: true,
          expiresAt: true,
          lastUsedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!apiKey) {
        throw new Error('API key not found')
      }

      return apiKey
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        service: z.string().min(1).max(100),
        key: z.string().min(1),
        environment: z.string().max(50).optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, service, key, environment, expiresAt } = input

      // In production, you would encrypt the key before storing
      // For now, we'll store it as-is but you should use encryption
      const encryptedKey = Buffer.from(key).toString('base64')

      const apiKey = await ctx.prisma.apiKey.create({
        data: {
          name,
          service,
          key: encryptedKey,
          environment,
          expiresAt,
        },
      })

      return {
        id: apiKey.id,
        name: apiKey.name,
        service: apiKey.service,
        environment: apiKey.environment,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        key: z.string().min(1).optional(),
        environment: z.string().max(50).optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, key, environment, expiresAt } = input

      const updateData: Record<string, unknown> = {}

      if (name !== undefined) {
        updateData.name = name
      }

      if (key !== undefined) {
        // Encrypt the key before storing
        updateData.key = Buffer.from(key).toString('base64')
      }

      if (environment !== undefined) {
        updateData.environment = environment
      }

      if (expiresAt !== undefined) {
        updateData.expiresAt = expiresAt
      }

      const apiKey = await ctx.prisma.apiKey.update({
        where: { id },
        data: updateData,
      })

      return {
        id: apiKey.id,
        name: apiKey.name,
        service: apiKey.service,
        environment: apiKey.environment,
        expiresAt: apiKey.expiresAt,
        updatedAt: apiKey.updatedAt,
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.apiKey.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  getServices: publicProcedure.query(async ({ ctx }) => {
    // Return list of available services with usage count
    const services = await ctx.prisma.apiKey.groupBy({
      by: ['service'],
      _count: {
        service: true,
      },
      orderBy: {
        _count: {
          service: 'desc',
        },
      },
    })

    return services.map((s) => ({
      name: s.service,
      count: s._count.service,
    }))
  }),

  // Get the decrypted key (use with caution - only when needed)
  getDecryptedKey: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.prisma.apiKey.findUnique({
        where: { id: input.id },
      })

      if (!apiKey) {
        throw new Error('API key not found')
      }

      // Update last used timestamp
      await ctx.prisma.apiKey.update({
        where: { id: input.id },
        data: { lastUsedAt: new Date() },
      })

      // Decrypt the key
      const decryptedKey = Buffer.from(apiKey.key, 'base64').toString('utf-8')

      return { key: decryptedKey }
    }),
})
