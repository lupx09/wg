import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { getUserProgress } from "@/lib/api/user"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth")
  }

  const userProgress = await getUserProgress(session.userId)

  return (
    <div className="min-h-screen bg-background">
      <DashboardContent user={session.user} progress={userProgress} />
    </div>
  )
}
