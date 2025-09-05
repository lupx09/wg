'use client'


import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ChatHistorySection } from "./sidebar/chat-history-section"
import { ChatHistorySkeleton } from "./sidebar/chat-history-skeleton"
import { IconLogo } from "./ui/icons"

export default function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <IconLogo className={cn("size-5")} />
          <span className="font-semibold text-sm">Morphic</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}


// "use client"

// import { Suspense } from "react"
// import Link from "next/link"
// import { Plus } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// function ChatHistorySkeleton() {
//   return (
//     <div className="space-y-2 p-2">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <div key={i} className="h-8 animate-pulse rounded bg-muted" />
//       ))}
//     </div>
//   )
// }

// function ChatHistorySection() {
//   return (
//     <div className="space-y-1 p-2">
//       <div className="text-xs font-medium text-muted-foreground px-2 py-1">Recent Chats</div>
//       {/* Chat history items would go here */}
//       <div className="text-sm text-muted-foreground px-2 py-1">No recent chats</div>
//     </div>
//   )
// }

// export default function AppSidebar() {
//   return (
//     <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
//       <SidebarHeader>
//         <div className="flex items-center gap-2 px-2 py-1">
//           <Link href="/" className="flex items-center gap-2 font-semibold">
//             <div className="h-6 w-6 rounded bg-primary" />
//             <span>AI Chat</span>
//           </Link>
//           <SidebarTrigger className="ml-auto" />
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link href="/" className="flex items-center gap-2">
//                 <Plus className="h-4 w-4" />
//                 <span>New Chat</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//         <div className="flex-1 overflow-y-auto">
//           <Suspense fallback={<ChatHistorySkeleton />}>
//             <ChatHistorySection />
//           </Suspense>
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   )
// }
