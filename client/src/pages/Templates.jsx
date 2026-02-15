import { useState, useEffect } from 'react'

const TEMPLATES = [
  {
    id: '1',
    name: 'Customer Support Agent',
    category: 'customer-service',
    content: 'You are a helpful customer support agent. Respond to the following inquiry with empathy and accuracy.',
    description: 'Standard customer service prompt for handling inquiries'
  },
  {
    id: '2',
    name: 'Code Reviewer',
    category: 'code',
    content: 'Analyze the following code for bugs, performance issues, and best practices. Provide detailed feedback.',
    description: 'Code analysis and review assistant'
  },
  {
    id: '3',
    name: 'Data Analyst',
    category: 'analysis',
    content: 'Analyze the provided data and provide insights. Include statistical summaries and visualizations recommendations.',
    description: 'Data analysis and visualization assistant'
  },
  {
    id: '4',
    name: 'Technical Writer',
    category: 'writing',
    content: 'Write clear, concise technical documentation for the following topic. Use appropriate formatting and examples.',
    description: 'Technical documentation generator'
  },
  {
    id: '5',
    name: 'Summarizer',
    category: 'general',
    content: 'Provide a concise summary of the following text, capturing the key points and main ideas.',
    description: 'Text summarization prompt'
  },
  {
    id: '6',
    name: 'Interview Prep',
    category: 'education',
    content: 'Generate practice interview questions for the following role, with sample answers and tips.',
    description: 'Interview preparation assistant'
  },
  {
    id: '7',
    name: 'Email Writer',
    category: 'writing',
    content: 'Write a professional email for the following situation. Keep it concise and clear.',
    description: 'Professional email generator'
  },
  {
    id: '8',
    name: 'SQL Query Generator',
    category: 'code',
    content: 'Generate SQL queries based on the following requirements. Include explanations.',
    description: 'SQL query builder'
  }
]

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', 'customer-service', 'code', 'analysis', 'writing', 'education', 'general']

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = (template) => {
    // Could navigate to prompts page with template pre-filled
    window.location.href = `/prompts?new=true&template=${encodeURIComponent(template.name)}&content=${encodeURIComponent(template.content)}`
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1>Templates</h1>
          <p className="text-secondary mt-sm">Pre-built prompt templates for common use cases</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-md mb-lg">
        <input
          type="text"
          className="form-input"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {/* Category Tabs */}
      <div className="tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-3">
        {filteredTemplates.map(template => (
          <div key={template.id} className="card">
            <div className="flex items-center justify-between mb-md">
              <h3 style={{ fontSize: '16px' }}>{template.name}</h3>
              <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>
                {template.category}
              </span>
            </div>
            <p className="text-secondary mb-md" style={{ fontSize: '13px' }}>
              {template.description}
            </p>
            <div className="code-block mb-md" style={{ maxHeight: '80px', overflow: 'hidden', fontSize: '12px' }}>
              {template.content}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleUseTemplate(template)}>
              Use Template
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No templates found</div>
          <div className="empty-state-description">Try adjusting your search or category filter</div>
        </div>
      )}
    </div>
  )
}
