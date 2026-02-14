'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface Review {
  id: string
  rating: number
  content?: string
  helpfulCount: number
  createdAt: string
  user: {
    id: string
    name?: string
    avatarUrl?: string
  }
}

interface ReviewsProps {
  apiId: string
  reviews: Review[]
  onVote?: (reviewId: string, direction: 'up' | 'down') => void
  onSubmit?: (rating: number, content: string) => void
}

export default function Reviews({ reviews, onVote, onSubmit }: ReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(rating, content)
    setShowForm(false)
    setContent('')
    setRating(5)
  }

  const renderStars = (currentRating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && onChange?.(i + 1)}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
      >
        <Star
          className={`w-5 h-5 ${
            i < currentRating
              ? 'fill-accent-warning text-accent-warning'
              : 'text-text-muted'
          }`}
        />
      </button>
    ))
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Reviews ({reviews.length})
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-bg-tertiary border border-default rounded-lg px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-accent-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>

          {/* Write Review Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-default"
          >
            <MessageSquare className="w-4 h-4" />
            Write Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-tertiary border border-default rounded-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {renderStars(rating, true, setRating)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Your Review (optional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with this API..."
                className="w-full h-32 bg-bg-secondary border border-default rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent-primary rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-default"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-default rounded-lg text-sm font-medium text-text-secondary hover:border-accent-primary transition-default"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No reviews yet</p>
          <p className="text-sm text-text-muted">Be the first to review this API!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-tertiary border border-default rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                    {review.user.avatarUrl ? (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.name || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-text-muted" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-text-primary text-sm">
                      {review.user.name || 'Anonymous User'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Content */}
              {review.content && (
                <p className="text-sm text-text-secondary mb-4">
                  {review.content}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onVote?.(review.id, 'up')}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-success transition-default"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpfulCount})
                </button>
                <button
                  onClick={() => onVote?.(review.id, 'down')}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-error transition-default"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
