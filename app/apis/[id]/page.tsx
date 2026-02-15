'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Zap, Star, Shield, Globe, Key, ExternalLink, 
  Copy, Check, BookOpen, MessageSquare
} from 'lucide-react'
import Navbar from '@/components/navbar'
import CodeSnippet from '@/components/code-snippet'
import Reviews from '@/components/reviews'

// Sample API data (will be replaced with database query)
const sampleApi = {
  id: '1',
  name: 'JSONPlaceholder',
  description: 'Fake Online REST API for testing and prototyping. This is a free online REST API that you can use whenever you need some fake data. It can be used to quickly prototype and test your applications.',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  category: 'Development',
  authType: 'None',
  rateLimit: 'Unlimited',
  https: true,
  cors: 'Unknown',
  documentationUrl: 'https://jsonplaceholder.typicode.com/',
  avgRating: 4.8,
  reviewCount: 256,
  reviews: [
    {
      id: '1',
      rating: 5,
      content: 'Great API for testing! Perfect for prototyping my applications.',
      helpfulCount: 45,
      createdAt: '2026-01-15T10:00:00Z',
      user: { id: '1', name: 'John Developer' }
    },
    {
      id: '2',
      rating: 4,
      content: 'Very useful for quick testing. Would love to see more endpoints.',
      helpfulCount: 23,
      createdAt: '2026-01-10T15:30:00Z',
      user: { id: '2', name: 'Sarah Coder' }
    }
  ]
}

export default function ApiDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'reviews'>('overview')
  const [copied, setCopied] = useState(false)
  
  const api = sampleApi // In production, fetch from database using params.id

  const copyBaseUrl = () => {
    navigator.clipboard.writeText(api.baseUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-accent-primary transition-default">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-accent-primary transition-default">APIs</Link>
            <span>/</span>
            <span className="text-text-secondary">{api.name}</span>
          </div>

          {/* API Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-bg-tertiary border border-default flex items-center justify-center text-accent-primary font-mono font-bold text-2xl">
                {api.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text-primary mb-2">{api.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full">
                    {api.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent-warning text-accent-warning" />
                    <span className="text-text-secondary">{api.avgRating}</span>
                    <span className="text-text-muted">({api.reviewCount} reviews)</span>
                  </div>
                  {api.https && (
                    <span className="flex items-center gap-1 text-accent-success">
                      <Shield className="w-4 h-4" /> HTTPS
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-text-secondary max-w-3xl">{api.description}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href={`/test?api=${api.id}&url=${encodeURIComponent(api.baseUrl)}`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-default"
            >
              <Zap className="w-4 h-4" />
              Test API
            </Link>
            {api.documentationUrl && (
              <a
                href={api.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-default rounded-lg text-sm font-medium text-text-secondary hover:border-accent-primary transition-default"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-default mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'docs', label: 'Documentation', icon: BookOpen },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-default ${
                  activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Base URL */}
                <div className="bg-bg-tertiary border border-default rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Base URL</h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-bg-secondary border border-default rounded-lg px-4 py-3 text-sm font-mono text-text-primary">
                      {api.baseUrl}
                    </code>
                    <button
                      onClick={copyBaseUrl}
                      className="p-3 bg-bg-secondary border border-default rounded-lg text-text-muted hover:text-accent-primary transition-default"
                    >
                      {copied ? <Check className="w-4 h-4 text-accent-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Code Examples */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Code Examples</h3>
                  <CodeSnippet method="GET" url={api.baseUrl} headers={{ 'Content-Type': 'application/json' }} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* API Info */}
                <div className="bg-bg-tertiary border border-default rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">API Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Category</span>
                      <span className="text-text-primary">{api.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Authentication</span>
                      <span className="flex items-center gap-1 text-text-primary">
                        {api.authType === 'None' ? <Globe className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                        {api.authType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Rate Limit</span>
                      <span className="flex items-center gap-1 text-accent-warning">
                        <Zap className="w-4 h-4" />
                        {api.rateLimit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">HTTPS</span>
                      <span className="text-text-primary">{api.https ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">CORS</span>
                      <span className="text-text-primary">{api.cors}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-bg-tertiary border border-default rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    {api.documentationUrl && (
                      <a
                        href={api.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-default"
                      >
                        <BookOpen className="w-4 h-4" />
                        Official Documentation
                      </a>
                    )}
                    <Link
                      href={`/test?api=${api.id}&url=${encodeURIComponent(api.baseUrl)}`}
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-default"
                    >
                      <Zap className="w-4 h-4" />
                      Test Endpoints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="bg-bg-tertiary border border-default rounded-xl p-8">
              <h2 className="text-xl font-bold text-text-primary mb-6">API Documentation</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-text-secondary mb-4">
                  For complete documentation, please visit the official documentation page.
                </p>
                {api.documentationUrl && (
                  <a
                    href={api.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent-primary hover:underline"
                  >
                    View Official Docs <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <Reviews
              apiId={api.id}
              reviews={api.reviews as any}
            />
          )}
        </div>
      </main>
    </div>
  )
}
