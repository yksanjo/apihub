'use client'

import { useState, useCallback } from 'react'
import { 
  Send, Copy, Clock, Database, ChevronDown, 
  Plus, Trash2, Play, Key, Lock, Globe
} from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

interface Header {
  key: string
  value: string
  enabled: boolean
}

interface Param {
  key: string
  value: string
  enabled: boolean
}

interface Response {
  success: boolean
  status?: number
  statusText?: string
  headers?: Record<string, string>
  data?: string
  responseTime?: number
  size?: number
  error?: string
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-accent-success bg-accent-success/10 border-accent-success/30',
  POST: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30',
  PUT: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  DELETE: 'text-accent-error bg-accent-error/10 border-accent-error/30',
  PATCH: 'text-accent-secondary bg-accent-secondary/10 border-accent-secondary/30',
  HEAD: 'text-text-secondary bg-bg-hover border-default',
  OPTIONS: 'text-text-secondary bg-bg-hover border-default',
}

export default function TestingInterface() {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [params, setParams] = useState<Param[]>([])
  const [body, setBody] = useState('')
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'apikey'>('none')
  const [authValue, setAuthValue] = useState('')
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params')
  const [response, setResponse] = useState<Response | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body')

  const testMutation = trpc.test.request.useMutation()

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  const addParam = () => {
    setParams([...params, { key: '', value: '', enabled: true }])
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index))
  }

  const updateParam = (index: number, field: keyof Param, value: string | boolean) => {
    const newParams = [...params]
    newParams[index] = { ...newParams[index], [field]: value }
    setParams(newParams)
  }

  const buildUrl = useCallback(() => {
    if (!url) return ''
    
    try {
      const urlObj = new URL(url)
      params.filter(p => p.enabled && p.key).forEach(p => {
        urlObj.searchParams.append(p.key, p.value)
      })
      return urlObj.toString()
    } catch {
      // If URL is invalid, return as-is
      return url
    }
  }, [url, params])

  const handleSend = async () => {
    if (!url) return

    setIsLoading(true)
    setResponse(null)

    try {
      // Build headers object
      const headersObj: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => {
        headersObj[h.key] = h.value
      })

      // Add auth header
      if (authType === 'bearer' && authValue) {
        headersObj['Authorization'] = `Bearer ${authValue}`
      } else if (authType === 'basic' && authValue) {
        headersObj['Authorization'] = `Basic ${btoa(authValue)}`
      } else if (authType === 'apikey' && authValue) {
        headersObj['X-API-Key'] = authValue
      }

      const result = await testMutation.mutateAsync({
        method,
        url: buildUrl(),
        headers: headersObj,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
      })

      setResponse(result as Response)
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
        responseTime: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(response.data)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'status-success'
    if (status >= 300 && status < 400) return 'status-info'
    if (status >= 400 && status < 500) return 'status-warning'
    return 'status-error'
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Request Panel */}
      <div className="bg-bg-secondary border-b border-default">
        {/* URL Bar */}
        <div className="p-4 border-b border-default">
          <div className="flex gap-2">
            {/* Method Selector */}
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`appearance-none px-4 py-2.5 pr-10 rounded-lg border font-mono text-sm font-medium cursor-pointer ${methodColors[method]}`}
              >
                {Object.keys(methodColors).map((m) => (
                  <option key={m} value={m} className="bg-bg-secondary text-text-primary">
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL..."
              className="flex-1 bg-bg-tertiary border border-default rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-default font-mono"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isLoading || !url}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-default"
            >
              {isLoading ? (
                <Play className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-default">
          {(['params', 'headers', 'body', 'auth'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-default capitalize ${
                activeTab === tab
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
              {tab === 'headers' && headers.filter(h => h.enabled && h.key).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent-primary/20 text-accent-primary rounded">
                  {headers.filter(h => h.enabled && h.key).length}
                </span>
              )}
              {tab === 'params' && params.filter(p => p.enabled && p.key).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent-primary/20 text-accent-primary rounded">
                  {params.filter(p => p.enabled && p.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-48 overflow-y-auto">
          {/* Params Tab */}
          {activeTab === 'params' && (
            <div className="space-y-2">
              {params.map((param, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-default bg-bg-tertiary text-accent-primary focus:ring-accent-primary"
                  />
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => updateParam(index, 'key', e.target.value)}
                    placeholder="Key"
                    className="flex-1 bg-bg-tertiary border border-default rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateParam(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 bg-bg-tertiary border border-default rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    onClick={() => removeParam(index)}
                    className="p-1.5 text-text-muted hover:text-accent-error transition-default"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addParam}
                className="flex items-center gap-1 text-sm text-accent-primary hover:text-accent-primary/80 transition-default"
              >
                <Plus className="w-4 h-4" /> Add Parameter
              </button>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === 'headers' && (
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-default bg-bg-tertiary text-accent-primary focus:ring-accent-primary"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="flex-1 bg-bg-tertiary border border-default rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 bg-bg-tertiary border border-default rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-1.5 text-text-muted hover:text-accent-error transition-default"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className="flex items-center gap-1 text-sm text-accent-primary hover:text-accent-primary/80 transition-default"
              >
                <Plus className="w-4 h-4" /> Add Header
              </button>
            </div>
          )}

          {/* Body Tab */}
          {activeTab === 'body' && (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-32 bg-bg-tertiary border border-default rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary font-mono resize-none"
            />
          )}

          {/* Auth Tab */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {[
                  { value: 'none', label: 'None', icon: Globe },
                  { value: 'bearer', label: 'Bearer Token', icon: Key },
                  { value: 'basic', label: 'Basic Auth', icon: Lock },
                  { value: 'apikey', label: 'API Key', icon: Key },
                ].map((auth) => (
                  <button
                    key={auth.value}
                    onClick={() => setAuthType(auth.value as typeof authType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-default ${
                      authType === auth.value
                        ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                        : 'border-default text-text-secondary hover:border-accent-primary'
                    }`}
                  >
                    <auth.icon className="w-4 h-4" />
                    {auth.label}
                  </button>
                ))}
              </div>
              {authType !== 'none' && (
                <input
                  type="text"
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                  placeholder={
                    authType === 'bearer' ? 'Enter token...' :
                    authType === 'basic' ? 'username:password' :
                    'Enter API key...'
                  }
                  className="w-full bg-bg-tertiary border border-default rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary font-mono"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Response Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Response Header */}
        <div className="bg-bg-secondary border-b border-default px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-secondary">Response</span>
            {response && response.success && (
              <>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(response.status || 0)}`}>
                  {response.status} {response.statusText}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  {response.responseTime}ms
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Database className="w-3 h-3" />
                  {response.size ? formatSize(response.size) : '-'}
                </span>
              </>
            )}
          </div>
          {response && response.success && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyResponse}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-default"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Response Tabs */}
        {response && response.success && (
          <div className="flex border-b border-default">
            <button
              onClick={() => setResponseTab('body')}
              className={`px-4 py-2 text-sm font-medium transition-default ${
                responseTab === 'body'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Body
            </button>
            <button
              onClick={() => setResponseTab('headers')}
              className={`px-4 py-2 text-sm font-medium transition-default ${
                responseTab === 'headers'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Headers
            </button>
          </div>
        )}

        {/* Response Content */}
        <div className="flex-1 overflow-auto p-4 bg-bg-primary">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-text-muted">Sending request...</span>
              </div>
            </div>
          )}

          {!isLoading && !response && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <Send className="w-12 h-12 text-text-muted" />
                <p className="text-sm text-text-muted">Enter a URL and click Send to test</p>
              </div>
            </div>
          )}

          {!isLoading && response && !response.success && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-center max-w-md">
                <div className="w-12 h-12 rounded-full bg-accent-error/10 flex items-center justify-center">
                  <span className="text-accent-error text-xl">✕</span>
                </div>
                <p className="text-sm text-accent-error">{response.error}</p>
              </div>
            </div>
          )}

          {!isLoading && response?.success && responseTab === 'body' && (
            <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap break-all">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(response.data || '{}'), null, 2)
                } catch {
                  return response.data
                }
              })()}
            </pre>
          )}

          {!isLoading && response?.success && responseTab === 'headers' && (
            <div className="space-y-2">
              {response.headers && Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex gap-4">
                  <span className="text-sm font-mono text-accent-primary">{key}:</span>
                  <span className="text-sm text-text-secondary">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
