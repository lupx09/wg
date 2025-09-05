"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface DashboardContentProps {
  user: any
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button onClick={() => signOut()} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">LLM API</h3>
            <p className="text-sm text-gray-600">Chat endpoint ready</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">TTS API</h3>
            <p className="text-sm text-gray-600">Text to Speech ready</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">STT API</h3>
            <p className="text-sm text-gray-600">Speech to Text ready</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">STS API</h3>
            <p className="text-sm text-gray-600">Speech to Speech ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}
