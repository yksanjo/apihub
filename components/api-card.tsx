'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Zap, Key, Lock, Globe, Shield, ExternalLink } from 'lucide-react'

interface ApiCardProps {
  api: {
    id: string
    name: string
    description?: string
    category?: string
    authType?: string
    rateLimit?: string
    https?: boolean
    imageUrl?: string
    avgRating?: number
    reviewCount?: number
  }
  onCompare?: (id: string) => void
  isComparing?: boolean
}

const authIcons: Record<string, React.ReactNode> = {
  'Api Key': <Key className="w-3 h-3" />,
  'OAuth': <Shield className="w-3 h-3" />,
  'None': <Globe className="w-3 h-3" />,
  'Unknown': <Lock className="w-3 h-3" />,
}

export default function ApiCard({ api, onCompare, isComparing }: ApiCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating)
            ? 'fill-accent-warning text-accent-warning'
            : 'text-text-muted'
        }`}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-bg-tertiary border rounded-xl overflow-hidden card-shadow transition-default ${
        isHovered ? 'border-accent-primary glow' : 'border-default'
      }`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-card opacity-50" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* API Icon */}
            <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center text-accent-primary font-mono font-bold text-sm">
              {api.imageUrl ? (
                <img
                  src={api.imageUrl}
                  alt={api.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                api.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h3 className="font-semibold text-text-primary text-sm line-clamp-1">
                {api.name}
              </h3>
              <p className="text-xs text-text-muted line-clamp-1">
                {api.category || 'Uncategorized'}
              </p>
            </div>
          </div>

          {/* Compare Checkbox */}
          {onCompare && (
            <button
              onClick={() => onCompare(api.id)}
              className={`p-1.5 rounded-lg border transition-default ${
                isComparing
                  ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                  : 'border-default text-text-muted hover:border-accent-primary'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={isComparing ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 mb-4 min-h-[2.5rem]">
          {api.description || 'No description available'}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Auth Type */}
          {api.authType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-bg-hover rounded-md text-xs text-text-secondary">
              {authIcons[api.authType] || authIcons['Unknown']}
              {api.authType}
            </span>
          )}

          {/* Rate Limit */}
          {api.rateLimit && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-warning/10 rounded-md text-xs text-accent-warning">
              <Zap className="w-3 h-3" />
              {api.rateLimit}
            </span>
          )}

          {/* HTTPS */}
          {api.https && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-success/10 rounded-md text-xs text-accent-success">
              <Shield className="w-3 h-3" />
              HTTPS
            </span>
          )}
        </div>

        {/* Rating */}
        {api.avgRating !== undefined && api.avgRating > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">{renderStars(api.avgRating)}</div>
            <span className="text-xs text-text-muted">
              {api.avgRating.toFixed(1)} ({api.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/apis/${api.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-hover border border-default rounded-lg text-xs font-medium text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-default"
          >
            <ExternalLink className="w-3 h-3" />
            View Details
          </Link>
          <Link
            href={`/test?api=${api.id}&url=${encodeURIComponent(api.name)}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-xs font-medium text-bg-primary hover:opacity-90 transition-default"
          >
            <Zap className="w-3 h-3" />
            Test
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
