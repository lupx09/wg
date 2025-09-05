"use client"

import { InspectorDrawer } from "@/components/inspector/inspector-drawer"
import { InspectorPanel } from "@/components/inspector/inspector-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useState } from "react"
import { useArtifact } from "./artifact-context"

export function ChatArtifactContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const { state } = useArtifact()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const [renderPanel, setRenderPanel] = useState(state.isOpen)
  const { open, openMobile, isMobile: isMobileSidebar } = useSidebar()

  useEffect(() => {
    if (state.isOpen) {
      setRenderPanel(true)
    } else {
      setRenderPanel(false)
    }
  }, [state.isOpen])

  return (
    <div className="flex-1 min-h-0 h-screen flex">
      <div
        className={cn(
          "absolute p-4 z-50 transition-all duration-200",
          "md:opacity-100",
          !open || isMobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <SidebarTrigger className="animate-fade-in bg-background/80 backdrop-blur-sm border shadow-sm" />
      </div>

      {!isMobile && (
        <ResizablePanelGroup direction="horizontal" className="flex flex-1 min-w-0 h-full">
          <ResizablePanel className={cn("min-w-0", state.isOpen && "transition-all duration-300 ease-out")}>
            {children}
          </ResizablePanel>

          {renderPanel && (
            <>
              <ResizableHandle className="w-1 bg-border hover:bg-border/80 transition-colors" />
              <ResizablePanel
                className={cn("overflow-hidden bg-background", {
                  "animate-slide-in-right": state.isOpen,
                })}
                maxSize={50}
                minSize={30}
                defaultSize={40}
              >
                <InspectorPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}

      {isMobile && (
        <div className="flex-1 h-full">
          {children}
          <InspectorDrawer />
        </div>
      )}
    </div>
  )
}
