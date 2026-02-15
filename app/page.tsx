'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Zap, Star, ArrowRight, TrendingUp, Sparkles } from 'lucide-react'
import Navbar from '@/components/navbar'
import ApiCard from '@/components/api-card'

// Sample data for demonstration (will be replaced with database data)
const sampleApis = [
  {
    id: '1',
    name: 'Cat Facts',
    description: 'Random cat facts API for your projects',
    category: 'Animals',
    authType: 'None',
    rateLimit: '100/hour',
    https: true,
    avgRating: 4.5,
    reviewCount: 128,
  },
  {
    id: '2',
    name: 'JSONPlaceholder',
    description: 'Fake Online REST API for testing and prototyping',
    category: 'Development',
    authType: 'None',
    rateLimit: 'Unlimited',
    https: true,
    avgRating: 4.8,
    reviewCount: 256,
  },
  {
    id: '3',
    name: 'Rick and Morty',
    description: 'All the Rick and Morty characters, locations and episodes',
    category: 'Entertainment',
    authType: 'None',
    rateLimit: 'Unlimited',
    https: true,
    avgRating: 4.6,
    reviewCount: 89,
  },
  {
    id: '4',
    name: 'PokeAPI',
    description: 'RESTful Pokemon API for all your Pokemon needs',
    category: 'Gaming',
    authType: 'None',
    rateLimit: 'Unlimited',
    https: true,
    avgRating: 4.9,
    reviewCount: 312,
  },
  {
    id: '5',
    name: 'Random User Generator',
    description: 'Generate random user data for testing',
    category: 'Testing',
    authType: 'None',
    rateLimit: '1000/day',
    https: true,
    avgRating: 4.4,
    reviewCount: 67,
  },
  {
    id: '6',
    name: 'Numbers API',
    description: 'Facts about numbers, math, dates, and years',
    category: 'Science',
    authType: 'None',
    rateLimit: '100/hour',
    https: true,
    avgRating: 4.2,
    reviewCount: 45,
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [comparingApis, setComparingApis] = useState<string[]>([])
  
  // Filter APIs based on search and category
  const filteredApis = sampleApis.filter(api => {
    const matchesSearch = !searchQuery || 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || api.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleCompare = (id: string) => {
    setComparingApis(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiMwMDZkYWEiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-primary text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              2000+ Free APIs
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover & Test
              <br />
              <span className="text-gradient">Free APIs</span> Instantly
            </h1>
            
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Your curated marketplace of free APIs with built-in testing, 
              code generation, and community reviews. No more guessing—just build.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for APIs..."
                className="w-full bg-bg-secondary/80 backdrop-blur border border-default rounded-2xl pl-12 pr-4 py-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-text-secondary">
                <Zap className="w-5 h-5 text-accent-primary" />
                <span className="font-semibold text-text-primary">2000+</span> APIs
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp className="w-5 h-5 text-accent-success" />
                <span className="font-semibold text-text-primary">50+</span> Categories
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Star className="w-5 h-5 text-accent-warning" />
                <span className="font-semibold text-text-primary">10K+</span> Reviews
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {selectedCategory || 'All'} APIs
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {filteredApis.length} APIs available
            </p>
          </div>

          {/* Compare Button */}
          {comparingApis.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent-secondary rounded-lg text-sm font-medium text-white hover:opacity-90 transition-default"
            >
              Compare ({comparingApis.length})
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* API Grid */}
        {filteredApis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApis.map((api, index) => (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ApiCard
                  api={api}
                  onCompare={handleCompare}
                  isComparing={comparingApis.includes(api.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No APIs found</h3>
            <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {filteredApis.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 border border-default rounded-lg text-sm font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-default">
              Load More APIs
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="border-t border-default bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Everything you need to work with APIs
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From discovery to integration, we've got you covered with powerful tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-bg-tertiary border border-default rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                One-Click Testing
              </h3>
              <p className="text-sm text-text-secondary">
                Test any API directly in your browser with our Postman-like interface. 
                No setup required.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-bg-tertiary border border-default rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-accent-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <code className="w-6 h-6 text-accent-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Code Generation
              </h3>
              <p className="text-sm text-text-secondary">
                Get instant code snippets in JavaScript, Python, cURL, and more. 
                Copy and paste to integrate.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-bg-tertiary border border-default rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-accent-warning/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent-warning" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Community Reviews
              </h3>
              <p className="text-sm text-text-secondary">
                Read real user reviews, see ratings, and share your experience 
                with the developer community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-default py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-primary" />
              <span className="font-mono font-bold">
                API<span className="text-gradient">Hub</span>
              </span>
            </div>
            <p className="text-sm text-text-muted">
              © 2026 APIHub. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
