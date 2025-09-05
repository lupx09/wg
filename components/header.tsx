"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import type React from "react"
import GuestMenu from "./guest-menu"
import UserMenu from "./user-menu"

export const Header: React.FC = () => {
  const { open } = useSidebar()
  const { data: session, status } = useSession()

  return (
    <header
      className={cn(
        "fixed top-0 right-0 p-2 flex justify-between items-center z-10",
        "backdrop-blur-sm bg-background/80 border-b border-border/50",
        "header-responsive",
        // Simplified width calculation
        open ? "w-[calc(100%-var(--sidebar-width))]" : "w-full",
        // Better mobile handling
        "md:relative md:backdrop-blur-none md:bg-transparent md:border-b-0",
      )}
    >
      <div></div>

      <div className="flex items-center gap-2">
        {status === "loading" ? (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        ) : session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <GuestMenu />
        )}
      </div>
    </header>
  )
}

export default Header
