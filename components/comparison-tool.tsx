'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, Check, XCircle, GitCompare, Star, ExternalLink } from 'lucide-react'

interface Api {
  id: string
  name: string
  description?: string
  category?: string
  authType?: string
  rateLimit?: string
  https?: boolean
  avgRating?: number
  reviewCount?: number
}

interface ComparisonToolProps {
  apis: Api[]
  onRemove?: (id: string) => void
}

export default function ComparisonTool({ apis, onRemove }: ComparisonToolProps) {
  if (apis.length === 0) {
    return (
      <div className="text-center py-16">
        <GitCompare className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Compare APIs</h3>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          Select up to 4 APIs to compare their features, rate limits, authentication methods, and ratings side by side.
        </p>
      </div>
    )
  }

  const features = [
    { label: 'Category', key: 'category' },
    { label: 'HTTPS Support', key: 'https', type: 'boolean' },
    { label: 'Authentication', key: 'authType' },
    { label: 'Rate Limit', key: 'rateLimit' },
    { label: 'User Rating', key: 'avgRating', type: 'rating' },
    { label: 'Reviews', key: 'reviewCount', type: 'number' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-accent-primary" />
          API Comparison
        </h2>
        <span className="text-sm text-text-muted">
          Comparing {apis.length} {apis.length === 1 ? 'API' : 'APIs'}
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-4 bg-bg-tertiary border-b border-default min-w-[150px]">
                <span className="text-xs text-text-muted uppercase tracking-wider">Feature</span>
              </th>
              {apis.map((api) => (
                <th key={api.id} className="p-4 bg-bg-tertiary border-b border-default min-w-[200px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">{api.name}</h3>
                      <p className="text-xs text-text-muted line-clamp-1">{api.category}</p>
                    </div>
                    <button
                      onClick={() => onRemove?.(api.id)}
                      className="p-1 text-text-muted hover:text-accent-error transition-default"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
              {/* Empty columns for alignment if less than 4 */}
              {Array.from({ length: Math.max(0, 4 - apis.length) }).map((_, i) => (
                <td key={`empty-${i}`} className="p-4 bg-bg-tertiary border-b border-default min-w-[200px]">
                  <div className="h-14" />
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <motion.tr
                key={feature.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="p-4 border-b border-default">
                  <span className="text-sm text-text-secondary">{feature.label}</span>
                </td>
                {apis.map((api) => {
                  const value = api[feature.key as keyof Api]
                  
                  return (
                    <td key={api.id} className="p-4 border-b border-default">
                      {feature.type === 'boolean' ? (
                        value ? (
                          <span className="flex items-center gap-1 text-accent-success text-sm">
                            <Check className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-accent-error text-sm">
                            <XCircle className="w-4 h-4" /> No
                          </span>
                        )
                      ) : feature.type === 'rating' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round((value as number) || 0)
                                    ? 'fill-accent-warning text-accent-warning'
                                    : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-text-secondary">
                            {value ? (value as number).toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      ) : feature.type === 'number' ? (
                        <span className="text-sm text-text-secondary">
                          {value || 0}
                        </span>
                      ) : (
                        <span className="text-sm text-text-secondary">
                          {value || 'N/A'}
                        </span>
                      )}
                    </td>
                  )
                })}
                {Array.from({ length: Math.max(0, 4 - apis.length) }).map((_, i) => (
                  <td key={`empty-cell-${i}`} className="p-4 border-b border-default" />
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apis.map((api) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-tertiary border border-default rounded-xl p-4"
          >
            <h4 className="font-semibold text-text-primary mb-2">{api.name}</h4>
            <p className="text-xs text-text-muted line-clamp-3">
              {api.description || 'No description available'}
            </p>
            <Link
              href={`/apis/${api.id}`}
              className="flex items-center gap-1 mt-3 text-xs text-accent-primary hover:underline"
            >
              View Details <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-default rounded-lg text-sm text-text-secondary hover:border-accent-primary transition-default"
        >
          Export
        </button>
      </div>
    </div>
  )
}
