'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Command, Menu, X, Zap, Github } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  { name: 'All APIs', value: '' },
  { name: 'Animals', value: 'Animals' },
  { name: 'Anime', value: 'Anime' },
  { name: 'Anti-Malware', value: 'Anti-Malware' },
  { name: 'Art & Design', value: 'Art & Design' },
  { name: 'Authentication', value: 'Authentication' },
  { name: 'Blockchain', value: 'Blockchain' },
  { name: 'Books', value: 'Books' },
  { name: 'Business', value: 'Business' },
  { name: 'Calendar', value: 'Calendar' },
  { name: 'Cloud Storage', value: 'Cloud Storage' },
  { name: 'Currency Exchange', value: 'Currency Exchange' },
  { name: 'Data Validation', value: 'Data Validation' },
  { name: 'Development', value: 'Development' },
  { name: 'Dictionaries', value: 'Dictionaries' },
  { name: 'Documents', value: 'Documents' },
  { name: 'Economics', value: 'Economics' },
  { name: 'Education', value: 'Education' },
  { name: 'Email', value: 'Email' },
  { name: 'Entertainment', value: 'Entertainment' },
  { name: 'Events', value: 'Events' },
  { name: 'Finance', value: 'Finance' },
  { name: 'Food & Drink', value: 'Food & Drink' },
  { name: 'Games & Comics', value: 'Games & Comics' },
  { name: 'Geocoding', value: 'Geocoding' },
  { name: 'Government', value: 'Government' },
  { name: 'Health', value: 'Health' },
  { name: 'History', value: 'History' },
  { name: 'Holidays', value: 'Holidays' },
  { name: 'Jobs', value: 'Jobs' },
  { name: 'Machine Learning', value: 'Machine Learning' },
  { name: 'Music', value: 'Music' },
  { name: 'News', value: 'News' },
  { name: 'Open Data', value: 'Open Data' },
  { name: 'Patent', value: 'Patent' },
  { name: 'Personality', value: 'Personality' },
  { name: 'Philosophy', value: 'Philosophy' },
  { name: 'Phone', value: 'Phone' },
  { name: 'Photography', value: 'Photography' },
  { name: 'Programming', value: 'Programming' },
  { name: 'Science', value: 'Science' },
  { name: 'Security', value: 'Security' },
  { name: 'Shopping', value: 'Shopping' },
  { name: 'Social', value: 'Social' },
  { name: 'Sports', value: 'Sports' },
  { name: 'Statistics', value: 'Statistics' },
  { name: 'Test Data', value: 'Test Data' },
  { name: 'Text Analysis', value: 'Text Analysis' },
  { name: 'Tracking', value: 'Tracking' },
  { name: 'Transportation', value: 'Transportation' },
  { name: 'Travel', value: 'Travel' },
  { name: 'Utilities', value: 'Utilities' },
  { name: 'Vehicle', value: 'Vehicle' },
  { name: 'Weather', value: 'Weather' },
]

interface NavbarProps {
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string) => void
}

export default function Navbar({ onSearch, onCategoryChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All APIs')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleCategorySelect = (category: { name: string; value: string }) => {
    setSelectedCategory(category.name)
    onCategoryChange?.(category.value)
    setIsCategoryOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Zap className="w-8 h-8 text-accent-primary transition-default group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-default" />
            </div>
            <span className="text-xl font-bold font-mono tracking-tight">
              API<span className="text-gradient">Hub</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-tertiary border border-default rounded-lg pl-10 pr-20 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-default"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-muted text-xs bg-bg-secondary px-2 py-1 rounded">
                  <Command className="w-3 h-3" />K
                </div>
              </div>
            </form>
          </div>

          {/* Category Dropdown - Desktop */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-default rounded-lg text-sm hover:border-accent-primary transition-default"
            >
              <span>{selectedCategory}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 w-64 max-h-96 overflow-y-auto bg-bg-secondary border border-default rounded-lg shadow-xl z-50"
                >
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-hover transition-default ${
                        selectedCategory === category.name
                          ? 'text-accent-primary bg-accent-primary/10'
                          : 'text-text-secondary'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/test"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-default"
            >
              <Zap className="w-4 h-4" />
              Test API
            </Link>

            <Link
              href="https://github.com"
              target="_blank"
              className="p-2 text-text-muted hover:text-text-primary transition-default"
            >
              <Github className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text-primary"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-default bg-bg-secondary"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-tertiary border border-default rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                />
              </form>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted uppercase tracking-wider">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 10).map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1 text-xs rounded-full border transition-default ${
                        selectedCategory === category.name
                          ? 'bg-accent-primary/20 text-accent-primary border-accent-primary'
                          : 'border-default text-text-secondary hover:border-accent-primary'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/test"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-sm font-medium text-bg-primary"
              >
                <Zap className="w-4 h-4" />
                Test API
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
