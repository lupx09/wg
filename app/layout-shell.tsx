"use client"

import { Header } from "@/components/header"
import ArtifactRoot from "@/components/artifact/artifact-root"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex flex-1 min-h-0">
        <ArtifactRoot>{children}</ArtifactRoot>
      </main>
    </div>
  )
}
