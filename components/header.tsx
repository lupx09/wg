// "use client"

// import { Button } from "@/components/ui/button"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { useSession, signIn, signOut } from "next-auth/react"
// import { User, LogOut } from "lucide-react"

// export function Header() {
//   const { data: session, status } = useSession()

//   return (
//     <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
//       <SidebarTrigger className="-ml-1" />
//       <div className="flex-1" />
//       <div className="flex items-center gap-2">
//         {status === "loading" ? (
//           <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
//         ) : session ? (
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">{session.user?.name || session.user?.email}</span>
//             <Button variant="ghost" size="sm" onClick={() => signOut()} className="h-8 w-8 p-0">
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         ) : (
//           <Button variant="ghost" size="sm" onClick={() => signIn("google")} className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             Sign In
//           </Button>
//         )}
//       </div>
//     </header>
//   )
// }


// "use client"

// import { Button } from "@/components/ui/button"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { useSession, signIn, signOut } from "next-auth/react"
// import { User, LogOut } from "lucide-react"

// export function Header() {
//   const { data: session, status } = useSession()

//   return (
//     <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
//       <SidebarTrigger className="-ml-1" />
//       <div className="flex-1" />
//       <div className="flex items-center gap-2">
//         {status === "loading" ? (
//           <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
//         ) : session ? (
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">{session.user?.name || session.user?.email}</span>
//             <Button variant="ghost" size="sm" onClick={() => signOut()} className="h-8 w-8 p-0">
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         ) : (
//           <Button variant="ghost" size="sm" onClick={() => signIn("google")} className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             Sign In
//           </Button>
//         )}
//       </div>
//     </header>
//   )
// }


// 'use client'


// import { useSidebar } from '@/components/ui/sidebar'
// import { cn } from '@/lib/utils'
// import { useSession } from 'next-auth/react'
// import React from 'react'
// import GuestMenu from './guest-menu'
// import UserMenu from './user-menu'

// export const Header: React.FC = () => {
//   const { open } = useSidebar()
//   const { data: session, status } = useSession()

//   return (
//     <header
//       className={cn(
//         'absolute top-0 right-0 p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
//         open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
//         'w-full'
//       )}
//     >
//       {/* This div can be used for a logo or title on the left if needed */}
//       <div></div>
      
//       <div className="flex items-center gap-2">
//         {status === 'loading' ? (
//           // Optional: Add loading state
//           <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
//         ) : session?.user ? (
//           <UserMenu user={session.user} />
//         ) : (
//           <GuestMenu />
//         )}
//       </div>
//     </header>
//   )
// }

// export default Header


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
        "absolute top-0 right-0 p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear",
        open ? "md:w-[calc(100%-var(--sidebar-width))]" : "md:w-full",
        "w-full",
      )}
    >
      {/* This div can be used for a logo or title on the left if needed */}
      <div></div>

      <div className="flex items-center gap-2">
        {status === "loading" ? (
          // Optional: Add loading state
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
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
