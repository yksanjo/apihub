'use client'

import Navbar from '@/components/navbar'
import TestingInterface from '@/components/testing-interface'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      
      <main className="pt-20 h-screen">
        <div className="h-[calc(100vh-5rem)]">
          <TestingInterface />
        </div>
      </main>
    </div>
  )
}
